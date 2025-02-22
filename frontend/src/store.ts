import { create } from 'zustand'

type ContractsStore = {
    name: string;
    language: string;
    version: string;
    created: string;
    updated: string;
    status: string;
}

export const useContracts = create<ContractsStore>(() => ({
    name: '',
    language: '',
    version: '',
    created: '',
    updated: '',
    status: ''
}))

interface EditorState {
  content: any;
  setContent: (content: any) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  content: [], // Default empty content
  setContent: (content) => set({ content }),
}));
