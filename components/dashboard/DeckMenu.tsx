"use client"
import Link from "next/link";
import { ChevronLeft, Plus } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createCardAction, getDeckItems } from '@/app/actions/queries';
import { DeckMenuItem } from "./DeckMenuItem";
import Button from "./ui/Button";

type DeckMenuProps = {
  deckId: string;
  onCardSelect: (id: string) => void;
  onNewCard: (id: string) => void;
}

export default function DeckMenu({ deckId, onCardSelect, onNewCard }: DeckMenuProps) {
  const queryClient = useQueryClient();

  const { data: cards = [] } = useQuery({
    queryKey: ['deck-items', deckId],
    queryFn: () => getDeckItems(deckId),
  });

  const createMutation = useMutation({
    mutationFn: () => createCardAction(deckId),
    onSuccess: (result) => {
      if (result.success && result.data) {
        queryClient.invalidateQueries({ queryKey: ['deck-items', deckId] });
        onNewCard(result.data.id);
      }
    }
  });

  return (
    <aside className="w-full h-full bg-white lg:bg-[#F2F2F2] border-r border-gray-100 lg:border-gray-200 flex flex-col overflow-hidden">
      {/* HEADER */}
      <div className="p-2 flex items-center justify-between shrink-0 bg-white lg:bg-[#F2F2F2] z-10">
        <Link
          href="/dashboard" 
          className="text-gray-600 p-1 hover:bg-gray-200 rounded-lg"
        >
          <ChevronLeft size={22}  color="#2B7FFF"/> 
        </Link>

        <p className="text-[#2B2B2B] font-bold">Cards</p>

        <button
          className="text-gray-600 p-1 hover:bg-gray-200 rounded-lg"
          onClick={() => createMutation.mutate()}
          disabled={createMutation.isPending}
        >
          {!createMutation.isPending && <Plus size={20} color="#2B7FFF"/>}
        </button>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-2 lg:p-3 flex flex-col gap-[0.5px]">
        { cards.map((card: any) => (
          <div key={card.id} onClick={() => onCardSelect(card.id)} className="shrink-0">
            <DeckMenuItem card={card}/>
          </div>
        ))} 

        {cards.length === 0 && !createMutation.isPending && ( 
          <div className="text-center py-10 text-sm text-gray-400 font-medium">No cards in this deck.</div>
        )}
      </div>
    </aside>
  )
}