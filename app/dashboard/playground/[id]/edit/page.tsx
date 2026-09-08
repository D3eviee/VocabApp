import { PlaygroundEditor } from "@/components/dashboard/playground/PlaygroundEditor";
import { getPlaygroundById, getPlaygroundFlashcards } from "@/lib/data/playground";
import { notFound } from "next/navigation";

interface EditPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPlaygroundPage({ params }: EditPageProps) {
  const { id: playgroundId } = await params;

  const [playground, playgroundCards] = await Promise.all([
    getPlaygroundById(playgroundId),
    getPlaygroundFlashcards(playgroundId),
  ]);

  if (!playground) notFound(); 

  return ( <PlaygroundEditor playground={playground} playgroundCards={playgroundCards} /> );
}