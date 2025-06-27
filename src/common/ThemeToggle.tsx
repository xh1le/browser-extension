import { IconButton, useColorMode, useColorModeValue } from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import React from 'react';

const ThemeToggle = () => {
  const { toggleColorMode } = useColorMode();
  const SwitchIcon = useColorModeValue(MoonIcon, SunIcon);
  return (
    <IconButton
      aria-label="Toggle theme"
      icon={<SwitchIcon />}
      onClick={toggleColorMode}
      variant="outline"
    />
  );
};

export default ThemeToggle;
