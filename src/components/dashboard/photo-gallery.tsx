"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Child, Photo } from "@/lib/types";
import { ImageIcon, Plus, Upload, X, Tag, Calendar } from "lucide-react";

interface PhotoGalleryProps {
  child: Child;
  photos: Photo[];
}

const suggestedTags = [
  "first steps",
  "birthday",
  "playing",
  "family",
  "outdoors",
  "school",
  "friends",
  "milestone",
  "silly face",
  "sleeping",
  "eating",
  "holidays",
];

export function PhotoGallery({ child, photos }: PhotoGalleryProps) {
  const [showUpload, setShowUpload] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [takenAt, setTakenAt] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(f);
    }
  }

  function toggleTag(tag: string) {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;
    setLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const fileExt = file.name.split(".").pop();
      const filePath = `${user.id}/${child.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("child-photos")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("child-photos").getPublicUrl(filePath);

      await supabase.from("photos").insert({
        child_id: child.id,
        url: publicUrl,
        caption: caption || null,
        tags,
        taken_at: takenAt,
      });

      setShowUpload(false);
      setFile(null);
      setPreview(null);
      setCaption("");
      setTags([]);
      router.refresh();
    } catch (err: any) {
      console.error("Upload failed:", err);
    }
    setLoading(false);
  }

  return (
    <div className="py-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-warm-900">
            Photos
          </h1>
          <p className="text-warm-500 text-sm">
            {child.name}&apos;s precious moments
          </p>
        </div>
        <Button onClick={() => setShowUpload(true)}>
          <Plus className="w-4 h-4" />
          Add Photo
        </Button>
      </div>

      {/* Photo grid */}
      {photos.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer border border-warm-100 shadow-soft hover:shadow-glow transition-all"
              onClick={() => setSelectedPhoto(photo)}
            >
              <img
                src={photo.url}
                alt={photo.caption || "Photo"}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-3 left-3 right-3">
                  {photo.caption && (
                    <p className="text-white text-sm font-medium truncate">
                      {photo.caption}
                    </p>
                  )}
                  <p className="text-white/70 text-xs">
                    {new Date(photo.taken_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
              {/* Tags */}
              {photo.tags.length > 0 && (
                <div className="absolute top-2 right-2">
                  <div className="bg-white/80 backdrop-blur-sm rounded-full px-2 py-0.5 text-xs text-warm-700 flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    {photo.tags.length}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="w-16 h-16 bg-warm-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ImageIcon className="w-7 h-7 text-warm-400" />
            </div>
            <h3 className="font-display font-semibold text-warm-700 mb-2">
              No photos yet
            </h3>
            <p className="text-sm text-warm-500 mb-4">
              Capture {child.name}&apos;s precious moments and build a beautiful
              visual timeline.
            </p>
            <Button onClick={() => setShowUpload(true)}>
              <Upload className="w-4 h-4" />
              Upload First Photo
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Upload modal */}
      {showUpload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
          <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Add Photo</CardTitle>
                <button
                  onClick={() => setShowUpload(false)}
                  className="p-1 hover:bg-warm-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-warm-500" />
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpload} className="space-y-4">
                {/* Photo picker */}
                <label className="cursor-pointer block">
                  <div className="w-full aspect-video rounded-2xl bg-warm-50 border-2 border-dashed border-warm-300 flex items-center justify-center overflow-hidden hover:border-brand-400 transition-colors">
                    {preview ? (
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center p-6">
                        <Upload className="w-8 h-8 text-warm-400 mx-auto mb-2" />
                        <p className="text-sm text-warm-500">
                          Tap to choose a photo
                        </p>
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    required
                  />
                </label>

                {/* Caption */}
                <div>
                  <label className="text-sm font-medium text-warm-700 mb-1.5 block">
                    Caption (optional)
                  </label>
                  <Input
                    type="text"
                    placeholder="What's happening in this photo?"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                  />
                </div>

                {/* Date */}
                <div>
                  <label className="text-sm font-medium text-warm-700 mb-1.5 block">
                    When was this taken?
                  </label>
                  <Input
                    type="date"
                    value={takenAt}
                    onChange={(e) => setTakenAt(e.target.value)}
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="text-sm font-medium text-warm-700 mb-1.5 block">
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {suggestedTags.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTag(tag)}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                          tags.includes(tag)
                            ? "bg-brand-500 text-white"
                            : "bg-warm-100 text-warm-600 hover:bg-warm-200"
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={!file || loading}
                >
                  {loading ? "Uploading..." : "Save Photo"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Photo viewer modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="max-w-3xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 p-2 bg-white/20 rounded-full text-white hover:bg-white/30 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={selectedPhoto.url}
              alt={selectedPhoto.caption || "Photo"}
              className="w-full rounded-2xl object-contain max-h-[70vh]"
            />
            <div className="mt-4 text-white">
              {selectedPhoto.caption && (
                <p className="font-display font-semibold text-lg mb-1">
                  {selectedPhoto.caption}
                </p>
              )}
              <div className="flex items-center gap-3 text-white/70 text-sm">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(selectedPhoto.taken_at).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
                {selectedPhoto.tags.length > 0 && (
                  <div className="flex items-center gap-1 flex-wrap">
                    <Tag className="w-4 h-4" />
                    {selectedPhoto.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-white/20 px-2 py-0.5 rounded-full text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
