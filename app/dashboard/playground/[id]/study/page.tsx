
import { StudyClient }  from "@/components/dashboard/playground/StudyClient";
import { db } from "@/server/db";
import { playgroundFlashcards, playgrounds } from "@/server/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

interface StudyPageProps {
  params: Promise<{ id: string }>;
}

export default async function StudyPage({ params }: StudyPageProps) {
  const resolvedParams = await params;
  const playgroundId = resolvedParams.id;

  const playground = await db.query.playgrounds.findFirst({
    where: eq(playgrounds.id, playgroundId),
  });

  if (!playground) notFound();

  const cards = await db
    .select()
    .from(playgroundFlashcards)
    .where(eq(playgroundFlashcards.playgroundId, playgroundId));

  return <StudyClient playground={playground} flashcards={cards} />;
}