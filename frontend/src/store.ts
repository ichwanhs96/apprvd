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

type currentDoc = {
  id: string;
  is_updated: boolean;
}

export const useCurrentDocId = create<currentDoc>(() => ({
  id: '',
  is_updated: false
}))

type ContentToShow = {
  content: string;
}

export const useContentToShow = create<ContentToShow>(() => ({
  content: 'contracts'
}))

interface EditorState {
  content: any;
  setContent: (content: any) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  content: [], // Default empty content
  setContent: (content) => set({ content }),
}));

interface EditContract {
  isOpen: boolean;
}

export const useEditContracts = create<EditContract>(() => ({
  isOpen: false
}))

interface ContractSelected {
  name: string;
  version: string;
  status: string;
  created: Date;
}

export const useContractSelected = create<ContractSelected>(() => ({
  name: '',
  version: '',
  status: '',
  created: new Date()
}))

interface Suggestion {
  target_text: string;
  suggestion: string;
}

export const useSuggestions = create<Suggestion[]>(() => [])