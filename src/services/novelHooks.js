import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import supabase from "./supabaseClient";

// Novel API functions
async function createNovel({
  title,
  description,
  cover_image_url,
  genre,
  status,
}) {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user)
    throw new Error("You must be logged in to create a novel");

  const newNovel = {
    title,
    author_id: userData.user.id,
    description,
    cover_image_url,
    genre: genre || null,
    status: status || "ongoing",
  };

  const { data, error } = await supabase
    .from("novels")
    .insert([newNovel])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

async function getNovel(id) {
  const { data, error } = await supabase
    .from("novels")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

async function getUserNovels() {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return [];

  const { data, error } = await supabase
    .from("novels")
    .select("*")
    .eq("author_id", userData.user.id)
    .order("updated_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

async function updateNovel({ id, ...novelData }) {
  const { data, error } = await supabase
    .from("novels")
    .update({ ...novelData, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

async function deleteNovel(id) {
  // First delete associated chapters
  const { error: chaptersError } = await supabase
    .from("chapters")
    .delete()
    .eq("novel_id", id);

  if (chaptersError) throw new Error(chaptersError.message);

  // Then delete the novel
  const { error } = await supabase.from("novels").delete().eq("id", id);

  if (error) throw new Error(error.message);
  return { id };
}

// React Query hooks for novels
export function useCreateNovel() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: createNovelMutation, isLoading } = useMutation({
    mutationFn: createNovel,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["novels"] });
      toast.success("Novel created successfully!");
      navigate(`/novel/${data.id}/chapters`);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create novel");
    },
  });

  return { createNovel: createNovelMutation, isLoading };
}

export function useUserNovels() {
  return useQuery({
    queryKey: ["novels", "user"],
    queryFn: getUserNovels,
  });
}

export function useNovel(id) {
  return useQuery({
    queryKey: ["novel", id],
    queryFn: () => getNovel(id),
    enabled: !!id,
  });
}

export function useUpdateNovel() {
  const queryClient = useQueryClient();

  const { mutate: updateNovelMutation, isLoading } = useMutation({
    mutationFn: updateNovel,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["novels"] });
      queryClient.invalidateQueries({ queryKey: ["novel", data.id] });
      toast.success("Novel updated successfully!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update novel");
    },
  });

  return { updateNovel: updateNovelMutation, isLoading };
}

export function useDeleteNovel() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: deleteNovelMutation, isLoading } = useMutation({
    mutationFn: deleteNovel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["novels"] });
      toast.success("Novel deleted successfully!");
      navigate("/dashboard");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete novel");
    },
  });

  return { deleteNovel: deleteNovelMutation, isLoading };
}
