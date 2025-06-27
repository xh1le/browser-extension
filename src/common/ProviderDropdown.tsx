import { Select } from '@chakra-ui/react';
import React from 'react';
import { useAppState } from '../state/store';

const ProviderDropdown = () => {
  const provider = useAppState((state) => state.settings.provider);
  const updateSettings = useAppState((state) => state.settings.actions.update);
  return (
    <Select
      value={provider}
      onChange={(e) => updateSettings({ provider: e.target.value as any })}
    >
      <option value="openai">OpenAI</option>
      <option value="gemini">Google Gemini</option>
      <option value="nim">NVIDIA NIM</option>
      <option value="ollama">Ollama</option>
    </Select>
  );
};

export default ProviderDropdown;
