import { Button, Input, VStack, Text, Link, HStack } from '@chakra-ui/react';
import React from 'react';
import { useAppState } from '../state/store';

const ModelDropdown = () => {
  const { updateSettings } = useAppState((state) => ({
    updateSettings: state.settings.actions.update,
  }));

  const [openAIKey, setOpenAIKey] = React.useState('');
  const [geminiKey, setGeminiKey] = React.useState('');
  const [nimKey, setNimKey] = React.useState('');
  const [ollamaUrl, setOllamaUrl] = React.useState('http://localhost:11434');
  const [openPipeKey, setOpenPipeKey] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <VStack spacing={4}>
      <Text fontSize="sm">
        Enter the API keys or service URL for the providers you wish to use.
        Keys are stored locally in your browser and never sent anywhere else.
      </Text>
      <HStack w="full">
        <Input
          placeholder="OpenAI API Key"
          value={openAIKey}
          onChange={(event) => setOpenAIKey(event.target.value)}
          type={showPassword ? 'text' : 'password'}
        />
        <Button
          onClick={() => setShowPassword(!showPassword)}
          variant="outline"
        >
          {showPassword ? 'Hide' : 'Show'}
        </Button>
      </HStack>
      <HStack w="full">
        <Input
          placeholder="Gemini API Key"
          value={geminiKey}
          onChange={(event) => setGeminiKey(event.target.value)}
          type={showPassword ? 'text' : 'password'}
        />
        <Button
          onClick={() => setShowPassword(!showPassword)}
          variant="outline"
        >
          {showPassword ? 'Hide' : 'Show'}
        </Button>
      </HStack>
      <HStack w="full">
        <Input
          placeholder="NIM API Key"
          value={nimKey}
          onChange={(event) => setNimKey(event.target.value)}
          type={showPassword ? 'text' : 'password'}
        />
        <Button
          onClick={() => setShowPassword(!showPassword)}
          variant="outline"
        >
          {showPassword ? 'Hide' : 'Show'}
        </Button>
      </HStack>
      <HStack w="full">
        <Input
          placeholder="Ollama URL"
          value={ollamaUrl}
          onChange={(event) => setOllamaUrl(event.target.value)}
          type="text"
        />
      </HStack>
      <HStack w="full">
        <Input
          placeholder="OpenPipe API Key (optional)"
          value={openPipeKey}
          onChange={(event) => setOpenPipeKey(event.target.value)}
          type={showPassword ? 'text' : 'password'}
        />
        <Button
          onClick={() => setShowPassword(!showPassword)}
          variant="outline"
        >
          {showPassword ? 'Hide' : 'Show'}
        </Button>
      </HStack>
      <Button
        onClick={() =>
          updateSettings({
            openAIKey,
            geminiKey,
            nimKey,
            ollamaUrl,
            openPipeKey,
          })
        }
        w="full"
        colorScheme="blue"
      >
        Save Keys
      </Button>
    </VStack>
  );
};

export default ModelDropdown;
