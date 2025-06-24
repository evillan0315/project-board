import { type Component, Show } from 'solid-js';
import Header from './Header';
import { Footer } from './Footer';
import LeftSidebar from './LeftSidebar';
import RightSidebar from './RightSidebar';
import CommandPalette from './CommandPalette';
import ModalSettings from './ModalSettings';

import { useStore } from '@nanostores/solid';
import MiniAudioPlayer from '../media/MiniAudioPlayer';
import MiniVideoPlayer from '../media/MiniVideoPlayer';

import {
  showSettingsStore,
  settingsStore,
  settingsTabStore,
  closeSettings,
  updateSetting,
  saveSettingsToStorage,
} from '../../stores/settings';

import type { MenuItem } from './../types';

interface LayoutProps {
  title: string;
  menus: MenuItem[];
  content: JSX.Element;
  header?: JSX.Element;
  stickyHeader?: boolean;
  leftSidebar?: boolean;
  rightSidebar?: boolean;
  leftFooter?: boolean;
  rightFooter?: boolean;
  middleFooter?: boolean;
}

export default function Layout({
  title,
  menus,
  content,
  header,
  stickyHeader = false,
  leftSidebar = false,
  rightSidebar = false,
  leftFooter = true,
  middleFooter = false,
  rightFooter = false,
}: LayoutProps) {
  // Subscribe to stores
  const $showSettings = useStore(showSettingsStore);
  const $settings = useStore(settingsStore);
  const $settingsTab = useStore(settingsTabStore);

  return (
    <div class="flex flex-col h-full relative">
      <Show when={header}>{header}</Show>

      {content}

      <Footer left={leftFooter} middle={middleFooter} right={rightFooter} />

      <CommandPalette />

      {/** <Show when={$settings().showMiniAudioPlayer}>
        <MiniAudioPlayer />
      </Show>
      <MiniVideoPlayer /> **/}
      <Show when={$showSettings()}>
        <ModalSettings
          settings={$settings()}
          onChange={updateSetting}
          onSave={() => {
            saveSettingsToStorage();
            closeSettings();
          }}
          onClose={closeSettings}
          activeTab={$settingsTab()}
        />
      </Show>
    </div>
  );
}
