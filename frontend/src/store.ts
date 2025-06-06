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

export interface DocumentUserAccess {
  email: string;
  access: string;
}

export const useEditContracts = create<EditContract>(() => ({
  isOpen: false
}))

interface ContractSelected {
  name: string;
  version: string;
  status: string;
  created: Date;
  is_template: boolean;
  shared_with: DocumentUserAccess[];
  business_id: string;
}

export const useContractSelected = create<ContractSelected>(() => ({
  name: '',
  version: '',
  status: '',
  created: new Date(),
  is_template: false,
  shared_with: [],
  business_id: '',
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
  replaceTemplateText: (oldText: string, newText: string) => void;
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
  replaceTemplateText: (oldText: string, newText: string) => {
    const content = useContent.getState().content;
    const regex = new RegExp(`(<span data-mce-id="template-feature"[^>]*>)${oldText}(<\/span>)`, 'g');
    const updatedContent = content.replace(regex, `${newText}`);
    useContent.setState({ content: updatedContent });
  },
  resetVariables: () => {
    Object.entries(get().variables).forEach(([key, value]) => {
      get().replaceTemplateText(value, `<span style="background-color: #ffffe0;" data-mce-id="template-feature">\${${key}}</span>`);
    });
  }
}));

// store/useTemplateVariables.ts
type VairableStore = {
  variable: Record<string, string>;
  setVariable: (key: string, value: string) => void;
  setAll: (vars: Record<string, string>) => void;
  reset: () => void;
};

export const useTemplateVariables = create<VairableStore>((set) => ({
  variable: {},
  setVariable: (key, value) =>
    set((state) => ({
      variable: { ...state.variable, [key]: value },
    })),
  setAll: (vars) => set({ variable: vars }),
  reset: () =>
    set((state) => {
      const resetVars = Object.keys(state.variable).reduce((acc, key) => {
        acc[key] = `template-${key}`;
        return acc;
      }, {} as Record<string, string>);
      return { variable: resetVars };
    }),  
}));

interface autoSave {
  isSave: boolean;
  setIsSave: (isSave: boolean) => void;
}

export const useAutoSave = create<autoSave> ((set) => ({
  isSave: false,
  setIsSave: (isSave) => set({ isSave })
}))
