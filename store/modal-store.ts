import { create } from 'zustand';

export type ModalType = 
  | "createDeck" 
  | "createRoadmap" 
  | "createPlayground"
  | "deleteDeckConfirm" 
  | "resetDeckConfirm" 
  | "deleteItemConfirm"
  | "editProfile" 
  | "editSecurity" 
  | "deleteAccountConfirm"
  | "subscription"
  | "aiDeckGenerator"

export interface ModalData {
  deckId?: string;
  itemId?: string;
  itemType?: "flashcard" | "storyboardEvent"; 
  onSuccess?: () => void; 
  user?: { firstName: string; email: string };
  subscription?: {isPro: boolean, periodEnd: Date | null, cancelAtPeriodEnd: boolean}
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