import { create } from 'zustand';

type DocumentType = 'resume_only' | 'resume_cover_activity' | 'cover_letter_only';

interface DocumentState {
  documentType: DocumentType | null;
  setDocumentType: (type: DocumentType) => void;
  clearDocumentType: () => void;
}

export const useDocumentStore = create<DocumentState>((set) => ({
  documentType: null,
  setDocumentType: (type: DocumentType) => set({ documentType: type }),
  clearDocumentType: () => set({ documentType: null }),
}));
