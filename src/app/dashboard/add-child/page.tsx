"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Baby, ArrowLeft, Upload, Sparkles } from "lucide-react";
import Link from "next/link";

const themeColors = [
  { name: "Coral", value: "brand", bg: "bg-brand-400" },
  { name: "Sage", value: "sage", bg: "bg-sage-400" },
  { name: "Lavender", value: "lavender", bg: "bg-lavender-400" },
  { name: "Sky", value: "sky", bg: "bg-sky-400" },
  { name: "Warm", value: "warm", bg: "bg-warm-500" },
];

export default function AddChildPage() {
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState<"boy" | "girl">("boy");
  const [themeColor, setThemeColor] = useState("brand");
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createClient();

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      let photoUrl: string | undefined;

      // Upload photo if provided
      if (photo) {
        const fileExt = photo.name.split(".").pop();
        const filePath = `${user.id}/${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from("child-photos")
          .upload(filePath, photo);

        if (!uploadError) {
          const {
            data: { publicUrl },
          } = supabase.storage.from("child-photos").getPublicUrl(filePath);
          photoUrl = publicUrl;
        }
      }

      // Create child record
      const { error: insertError } = await supabase.from("children").insert({
        user_id: user.id,
        name,
        birth_date: birthDate,
        gender,
        photo_url: photoUrl,
        theme_color: themeColor,
      });

      if (insertError) throw insertError;

      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <div className="max-w-lg mx-auto py-8">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-warm-500 hover:text-warm-700 text-sm mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to dashboard
      </Link>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-100 rounded-xl flex items-center justify-center">
              <Baby className="w-5 h-5 text-brand-600" />
            </div>
            <div>
              <CardTitle>Add your cub</CardTitle>
              <p className="text-sm text-warm-500 mt-0.5">
                Tell us about your little one
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Photo upload */}
            <div className="flex justify-center">
              <label className="cursor-pointer group">
                <div className="w-24 h-24 rounded-full bg-warm-100 border-2 border-dashed border-warm-300 flex items-center justify-center overflow-hidden group-hover:border-brand-400 transition-colors">
                  {photoPreview ? (
                    <img
                      src={photoPreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center">
                      <Upload className="w-6 h-6 text-warm-400 mx-auto mb-1" />
                      <span className="text-xs text-warm-500">Photo</span>
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* Name */}
            <div>
              <label className="text-sm font-medium text-warm-700 mb-1.5 block">
                Child&apos;s name
              </label>
              <Input
                type="text"
                placeholder="e.g., Emma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* Birth date */}
            <div>
              <label className="text-sm font-medium text-warm-700 mb-1.5 block">
                Birthday
              </label>
              <Input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                required
              />
            </div>

            {/* Gender */}
            <div>
              <label className="text-sm font-medium text-warm-700 mb-1.5 block">
                Gender
              </label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setGender("boy")}
                  className={`flex-1 py-3 rounded-2xl border-2 text-sm font-medium transition-all ${
                    gender === "boy"
                      ? "border-sky-400 bg-sky-50 text-sky-700"
                      : "border-warm-200 text-warm-500 hover:border-warm-300"
                  }`}
                >
                  Boy
                </button>
                <button
                  type="button"
                  onClick={() => setGender("girl")}
                  className={`flex-1 py-3 rounded-2xl border-2 text-sm font-medium transition-all ${
                    gender === "girl"
                      ? "border-brand-400 bg-brand-50 text-brand-700"
                      : "border-warm-200 text-warm-500 hover:border-warm-300"
                  }`}
                >
                  Girl
                </button>
              </div>
            </div>

            {/* Theme color */}
            <div>
              <label className="text-sm font-medium text-warm-700 mb-1.5 block">
                Color theme
              </label>
              <div className="flex gap-3">
                {themeColors.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => setThemeColor(color.value)}
                    className={`w-10 h-10 rounded-full ${color.bg} transition-all ${
                      themeColor === color.value
                        ? "ring-2 ring-offset-2 ring-warm-400 scale-110"
                        : "opacity-70 hover:opacity-100"
                    }`}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-500 bg-red-50 p-3 rounded-xl">
                {error}
              </p>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                "Adding your cub..."
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Add cub
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
