"use client";
import { useModal } from '@/store/modal-store';
import { Save, Plus, Loader2, Trash } from 'lucide-react';
import { useStoryboardQueries } from '@/lib/hooks/useStoryboardQueries';
import { useStoryboardStore } from '@/store/use-storyboard-store';

export const StoryboardEditorPanelToolbar = ({ storyboardId, onBack }: { storyboardId: string, onBack: () => void }) => {
  const { onOpen } = useModal();
  const { setActivePartId, activeStoryboardItem } = useStoryboardStore();
  const { updateItem, addStoryboardItem } = useStoryboardQueries(storyboardId);

  const handleSave = () => {
      if (!activeStoryboardItem?.id) return;
      updateItem.mutate({storyboardItem: activeStoryboardItem },
        { onSuccess: () => { 
          // TODO: SUCCESS TOAST
          if (window.innerWidth < 1024) onBack(); } 
        },
        // onError: () => toast.error("Failed to save changes.")
      );
    };
  
    // DELETE MODAL HANDLING
    const handleDelete = () => {
      if (!activeStoryboardItem?.id) return;
      
      onOpen("deleteItemConfirm", { 
        itemId: activeStoryboardItem.id,
        deckId: storyboardId,
        itemType: "storyboard",
        onSuccess: () => {
          setActivePartId(null);
          onBack();
        }
      });
    };
    
    // CREAETE MODAL HANDLING
    const handleCreate = () => {
      addStoryboardItem.mutate(undefined, {
        onSuccess: (result) => {
          if (result?.success && result.id) {
            setActivePartId(result.id);
          }else{
            // TO DO: TOAST ERROR
          }
        },
        // onError: () => toast.error("Connection error.")
      });
    };
    
  return (
    <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-2 shrink-0 bg-main-light/80  backdrop-blur-xs border-b border-gray-200/60">
      <span className="text-main-dark font-bold text-sm">Edit Card</span>
      <div className="flex items-center gap-1 sm:gap-2">
        {/* DELETE */}
        <button
          onClick={handleDelete}
          className="p-1 text-error-secondary hover:bg-button-background rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
          title="Delete card"
        >
          <Trash size={20} />
        </button>
        
        {/* ADD */}
        <button
          onClick={handleCreate}
          disabled={addStoryboardItem.isPending}
          className="p-1 text-button-blue hover:bg-button-background rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
          title="Create new card"
        >
          {addStoryboardItem.isPending ? <Loader2 size={20} className="animate-spin" /> : <Plus size={20} />}
        </button>
        
        {/* SAVE */}
        <button
            onClick={handleSave}
            disabled={updateItem.isPending}
            className="flex items-center gap-1 px-2.5 py-1 ml-1 bg-main-gradient hover:bg-linear-to-l text-white text-sm font-semibold rounded-xl hover:bg-blue-600 active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
          >
            {updateItem.isPending ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            <span className="hidden sm:inline">{updateItem.isPending ? "Saving..." : "Save"}</span>
          </button>
        </div>
      </div>
  );
}