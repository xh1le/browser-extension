import {
  Box,
  ChakraProvider,
  Heading,
  HStack,
  ColorModeScript,
} from '@chakra-ui/react';
import React from 'react';
import { useAppState } from '../state/store';
import ModelDropdown from './ModelDropdown';
import ProviderDropdown from './ProviderDropdown';
import SetAPIKey from './SetAPIKey';
import TaskUI from './TaskUI';
import OptionsDropdown from './OptionsDropdown';
import ThemeToggle from './ThemeToggle';
import theme from '../theme';
import logo from '../assets/img/icon-128.png';

const App = () => {
  const settings = useAppState((state) => state.settings);

  const hasKey =
    (settings.provider === 'openai' && settings.openAIKey) ||
    (settings.provider === 'gemini' && settings.geminiKey) ||
    (settings.provider === 'nim' && settings.nimKey) ||
    (settings.provider === 'ollama' && settings.ollamaUrl);

  return (
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <Box p="8" fontSize="lg" w="full">
        <HStack mb={4} alignItems="center">
          <img
            src={logo}
            width={32}
            height={32}
            className="App-logo"
            alt="logo"
          />

          <Heading as="h1" size="lg" flex={1}>
            Taxy AI
          </Heading>
          <HStack spacing={2}>
            <ProviderDropdown />
            <ModelDropdown />
            <ThemeToggle />
            <OptionsDropdown />
          </HStack>
        </HStack>
        {hasKey ? <TaskUI /> : <SetAPIKey />}
      </Box>
    </ChakraProvider>
  );
};

export default App;
