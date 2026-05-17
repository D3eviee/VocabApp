import { create } from 'zustand';

export type ModalType = 
  | "createDeck" 
  | "createRoadmap" 
  | "deleteDeckConfirm" 
  | "resetDeckConfirm" 
  | "deleteItemConfirm";

export interface ModalData {
  deckId?: string;
  itemId?: string;
  itemType?: "flashcard" | "storyboardEvent"; 
  onSuccess?: () => void; 
}

interface ModalStore {
  type: ModalType | null;
  isOpen: boolean;
  data: ModalData;
  onOpen: (type: ModalType, data?: ModalData) => void;
  onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
  type: null,
  isOpen: false,
  data: {},
  onOpen: (type, data = {}) => set({ isOpen: true, type, data }),
  onClose: () => set({ isOpen: false, type: null, data: {} }),
}));