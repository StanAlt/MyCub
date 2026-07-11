import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PhotoGallery } from "@/components/dashboard/photo-gallery";

export default async function PhotosPage({
  searchParams,
}: {
  searchParams: Promise<{ child?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: children } = await supabase
    .from("children")
    .select("*")
    .order("created_at", { ascending: true });

  if (!children || children.length === 0) redirect("/dashboard/add-child");

  const params = await searchParams;
  const selectedChildId = params.child || children[0].id;
  const selectedChild =
    children.find((child) => child.id === selectedChildId) || children[0];

  const { data: photos } = await supabase
    .from("photos")
    .select("*")
    .eq("child_id", selectedChild.id)
    .order("taken_at", { ascending: false });

  const signedPhotos = await Promise.all(
    (photos || []).map(async (photo) => {
      const storagePath =
        photo.storage_path || photo.url.split("/child-photos/").pop() || photo.url;
      const { data } = await supabase.storage
        .from("child-photos")
        .createSignedUrl(storagePath, 60 * 60);

      return { ...photo, url: data?.signedUrl || "" };
    })
  );

  return <PhotoGallery child={selectedChild} photos={signedPhotos} />;
}
