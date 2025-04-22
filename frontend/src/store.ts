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

interface EditorComments {
  editor_comments: string;
}

export const useEditorComments = create<EditorComments>(() => ({
  editor_comments: '',
}))

interface EditorContent {
  editor_content: string;
}

export const useEditorContent = create<EditorContent>(() => ({
  editor_content: '',
}))

interface ContentPage {
  contentPage: string
}

export const useContentPage = create<ContentPage>(() => ({
  contentPage: 'contracts'
}))

interface Content {
  content: string
}

export const useContent = create<Content>(() => ({
  content: ''
}))

// stores/useTemplateStore.ts

type Vars = Record<string, string>;

interface TemplateState {
  rawTemplate: string;
  variables: Vars;
  setVariables: (vars: Vars) => void;
  updateVariable: (key: string, value: string) => void;
  resetVariables: () => void;
}

export const useTemplateStore = create<TemplateState>((set, get) => ({
  rawTemplate: '',
  variables: {},
  setVariables: (vars) => set({ variables: vars }),
  updateVariable: (key, value) =>
    set((state) => ({
      variables: {
        ...state.variables,
        [key]: value,
      },
    })),
    resetVariables: () => {
    const raw = get().rawTemplate;
    
    // Step 1: Create default variable placeholders
    const matches = [...raw.matchAll(/\$\{(\w+)\}/g)];
    const resetVars: Vars = {};
    matches.forEach((match) => {
      resetVars[match[1]] = `\${${match[1]}}`;
    });
    
    // Step 2: Highlight all ${key} placeholders by wrapping in <span>
    const highlightedContent = raw.replace(/\$\{(\w+)\}/g, (match) => {
      return `<span style="background-color: #ffffe0;">${match}</span>`;
    });
  
    // Step 3: Update state with reset variables and highlighted content
    set({
      variables: resetVars,
      // rawTemplate: highlightedContent,
    });
    useContent.setState({ content: highlightedContent });
    console.log('reset',resetVars, highlightedContent)
  }
  
}));
