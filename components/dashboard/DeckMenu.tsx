"use client"
import Link from "next/link";
import { ChevronLeft, Plus } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createCardAction, getDeckItems } from '@/app/actions/queries';
import { DeckMenuItem } from "./DeckMenuItem";
import { useEditorStore } from "@/store/use-editor-store"; // Potrzebujemy dostępu do stanu
import Button from "./ui/Button";

export default function DeckMenu({ deckId }: { deckId: string }) {
  const { setActiveCardId } = useEditorStore();
  const queryClient = useQueryClient()

  const { data: cards = [] } = useQuery({
    queryKey: ['deck-items', deckId],
    queryFn: () => getDeckItems(deckId),
  });

  const createMutation = useMutation({
    mutationFn: () => createCardAction(deckId),
    onSuccess: (result) => {
      if (result.success && result.data) {
        queryClient.invalidateQueries({ queryKey: ['deck-items', deckId] });
        setActiveCardId(result.data.id);
      }
    }
  });

  return (
    <aside className="w-80 max-w-80 flex-1 border-r min-h-full h-full bg-[#F2F2F2] shrink-0 flex-col gap-[0.5px] p-3 pb-16">
      <div className="flex flex-row items-center justify-between mb-4">
        <Link
          href="/dashboard" 
          className="flex items-center gap-1 text-blue-500 hover:text-blue-600 text-[13px] font-medium transition-colors"
        >
          <ChevronLeft size={16} /> Back to Decks
        </Link>

        <Button 
          variant="secondary" 
          className="w-fit text-gray-600 px-2 py-1 hover:cursor-pointer"
          onClick={() => createMutation.mutate()}
          isLoading={createMutation.isPending}
        >
          {!createMutation.isPending && <Plus size={16} />}
        </Button>
      </div>

      <div className="h-full flex flex-col gap-2 overflow-y-auto">
        { cards.map((card: any) => <DeckMenuItem key={card.id} card={card}/> ) } 
      </div>

      {cards.length === 0 && !createMutation.isPending && ( <div className="text-center py-10 text-sm text-gray-400 font-medium">Add cards to deck.</div>)}
    </aside>
  )
}