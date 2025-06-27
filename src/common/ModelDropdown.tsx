import { Select } from '@chakra-ui/react';
import React from 'react';
import { useAppState } from '../state/store';

const ModelDropdown = () => {
  const { selectedModel, provider } = useAppState((state) => state.settings);
  const updateSettings = useAppState((state) => state.settings.actions.update);

  const openAIMenu = (
    <>
      <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
      <option value="gpt-3.5-turbo-16k">GPT-3.5 Turbo (16k)</option>
      <option value="gpt-4">GPT-4</option>
      <option value="gpt-4-1106-preview">GPT-4 Turbo</option>
      <option value="gpt-4o">GPT-4o</option>
      <option value="gpt-4o-mini">GPT-4o mini</option>
      <option value="o1">o1</option>
    </>
  );

  const geminiMenu = <option value="gemini-pro">Gemini Pro</option>;

  const nimMenu = <option value="llama3-70b">NIM Llama3</option>;

  const ollamaMenu = <option value="llama3">Llama3</option>;

  let options = openAIMenu;
  if (provider === 'gemini') options = geminiMenu;
  else if (provider === 'nim') options = nimMenu;
  else if (provider === 'ollama') options = ollamaMenu;

  return (
    <Select
      value={selectedModel || ''}
      onChange={(e) => updateSettings({ selectedModel: e.target.value })}
    >
      {options}
    </Select>
  );
};

export default ModelDropdown;
