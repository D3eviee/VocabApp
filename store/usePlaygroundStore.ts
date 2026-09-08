import { create } from 'zustand';

export type ViewMode = "default" | "exploded" | "isolated";

interface PlaygroundState {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;

  selectedMeshName: string | null;
  newFlashcardPosition: [number, number, number] | null;
  hoveredFlashcardId: string | null;
  editingFlashcardId: string | null; // DODANE
  
  setSelectedElement: (name: string | null, position: [number, number, number] | null) => void;
  clearSelection: () => void;
  setHoveredFlashcardId: (id: string | null) => void;
  setEditingFlashcardId: (id: string | null) => void; // DODANE
}

export const usePlaygroundStore = create<PlaygroundState>((set) => ({
  viewMode: "default",
  setViewMode: (mode) => set({ viewMode: mode }),

  selectedMeshName: null,
  newFlashcardPosition: null,
  hoveredFlashcardId: null,
  editingFlashcardId: null, // DODANE
  
  setSelectedElement: (name, position) => set({ 
    selectedMeshName: name, 
    newFlashcardPosition: position,
    editingFlashcardId: null // Kiedy klikamy nowy punkt, wychodzimy z trybu edycji
  }),
  
  clearSelection: () => set({ 
    selectedMeshName: null, 
    newFlashcardPosition: null,
    editingFlashcardId: null // Resetujemy wszystko
  }),

  setHoveredFlashcardId: (id) => set({ hoveredFlashcardId: id }),
  
  setEditingFlashcardId: (id) => set({ 
    editingFlashcardId: id,
    newFlashcardPosition: null, // Ukrywamy nową (czerwoną) pinezkę
    selectedMeshName: null 
  }),
}));
