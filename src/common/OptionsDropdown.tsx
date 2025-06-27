import { RepeatIcon, SettingsIcon } from '@chakra-ui/icons';
import {
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from '@chakra-ui/react';
import React from 'react';
import { useAppState } from '../state/store';

const OptionsDropdown = () => {
  const { provider, updateSettings } = useAppState((state) => ({
    provider: state.settings.provider,
    updateSettings: state.settings.actions.update,
  }));

  return (
    <Menu>
      <MenuButton
        as={IconButton}
        aria-label="Options"
        icon={<SettingsIcon />}
        variant="outline"
      />
      <MenuList>
        <MenuItem
          icon={<RepeatIcon />}
          onClick={() => {
            if (provider === 'openai') updateSettings({ openAIKey: '' });
            else if (provider === 'gemini') updateSettings({ geminiKey: '' });
            else if (provider === 'nim') updateSettings({ nimKey: '' });
            else updateSettings({ ollamaUrl: '' });
          }}
        >
          Reset Credentials
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default OptionsDropdown;
