import { MyStateCreator } from './store';

export type SettingsSlice = {
  openAIKey: string | null;
  openPipeKey: string | null;
  geminiKey: string | null;
  nimKey: string | null;
  ollamaUrl: string | null;
  provider: 'openai' | 'gemini' | 'nim' | 'ollama';
  selectedModel: string;
  actions: {
    update: (values: Partial<SettingsSlice>) => void;
  };
};
export const createSettingsSlice: MyStateCreator<SettingsSlice> = (set) => ({
  openAIKey: null,
  openPipeKey: null,
  geminiKey: null,
  nimKey: null,
  ollamaUrl: 'http://localhost:11434',
  provider: 'openai',
  selectedModel: 'gpt-3.5-turbo',
  actions: {
    update: (values) => {
      set((state) => {
        state.settings = { ...state.settings, ...values };
      });
    },
  },
});
