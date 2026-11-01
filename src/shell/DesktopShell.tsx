/**
 * GEMMAOS — LAYER 1: DESKTOP SHELL, TOP SYSTEM BAR, LEFT RAIL & BOTTOM DOCK
 * Renders the complete GemmaOS operating environment matching the uploaded visual designs.
 */

import React, { useEffect, useState } from 'react';
import {
  Bell,
  Wifi,
  Volume2,
  VolumeX,
  BatteryCharging,
  Search,
  Sun,
  Moon,
  X,
  Trash2,
} from 'lucide-react';
import { AppId, APP_MANIFESTS, useGemmaStore } from '../core/store';
import {
  ChunkyIcon,
  DesktopBackdropArtwork,
  SparkleStar,
} from './Artwork';
import { WindowFrame } from './WindowFrame';
import { WelcomeHubApp } from '../apps/WelcomeHubApp';
import { FileExplorerApp } from '../apps/FileExplorerApp';
import { SystemSettingsApp } from '../apps/SystemSettingsApp';
import { AppLauncherApp } from '../apps/AppLauncherApp';
import { DevWorkspaceApp } from '../apps/DevWorkspaceApp';
import { SystemMonitorApp } from '../apps/SystemMonitorApp';
import { ArchitectureInspectorApp } from '../apps/ArchitectureInspectorApp';

export function DesktopShell() {
  const {
    themeMode,
    wallpaper,
    soundEnabled,
    activeLeftRailTab,
    windows,
    notifications,
    launchApp,
    toggleThemeMode,
    setSoundEnabled,
    setActiveLeftRailTab,
    markAllNotificationsRead,
    clearNotifications,
    sendNotification,
  } = useGemmaStore();

  const [clockText, setClockText] = useState<string>('Mon, Jan 27  10:24 AM');
  const [showNotifDrawer, setShowNotifDrawer] = useState(false);
  const [showQuickSearch, setShowQuickSearch] = useState(false);
  const [quickSearchQuery, setQuickSearchQuery] = useState('');

  const isViolet = themeMode === 'violet';
  const unreadNotifs = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const dayStr = now.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });
      const timeStr = now.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
      });
      setClockText(`${dayStr}  ${timeStr}`);
    };
    updateClock();
    const timer = setInterval(updateClock, 15000);
    return () => clearInterval(timer);
  }, []);

  const leftRailItems: {
    id: string;
    label: string;
    icon: Parameters<typeof ChunkyIcon>[0]['name'];
    action: () => void;
  }[] = [
    {
      id: 'Home',
      label: 'Home',
      icon: 'home',
      action: () => {
        setActiveLeftRailTab('Home');
        launchApp('welcome-hub');
      },
    },
    {
      id: 'Files',
      label: 'Files',
      icon: 'files',
      action: () => {
        setActiveLeftRailTab('Files');
        launchApp('file-explorer');
      },
    },
    {
      id: 'Apps',
      label: 'Apps',
      icon: 'apps',
      action: () => {
        setActiveLeftRailTab('Apps');
        launchApp('app-launcher');
      },
    },
    {
      id: 'AI',
      label: 'AI',
      icon: 'ai',
      action: () => {
        setActiveLeftRailTab('AI');
        launchApp('architecture-inspector', { tab: 'gemma' });
      },
    },
    {
      id: 'Agents',
      label: 'Agents',
      icon: 'agents',
      action: () => {
        setActiveLeftRailTab('Agents');
        launchApp('architecture-inspector', { tab: 'agents' });
      },
    },
    {
      id: 'Models',
      label: 'Models',
      icon: 'models',
      action: () => {
        setActiveLeftRailTab('Models');
        launchApp('architecture-inspector', { tab: 'models' });
      },
    },
    {
      id: 'Memory',
      label: 'Memory',
      icon: 'memory',
      action: () => {
        setActiveLeftRailTab('Memory');
        launchApp('architecture-inspector', { tab: 'memory' });
      },
    },
    {
      id: 'Settings',
      label: 'Settings',
      icon: 'settings',
      action: () => {
        setActiveLeftRailTab('Settings');
        launchApp('system-settings');
      },
    },
  ];

  const bottomDockItems: {
    id: string;
    title: string;
    icon: Parameters<typeof ChunkyIcon>[0]['name'];
    onClick: () => void;
  }[] = [
    {
      id: 'dock-terminal',
      title: 'Developer Workspace & PAL IDE',
      icon: 'terminal',
      onClick: () => launchApp('dev-workspace'),
    },
    {
      id: 'dock-files',
      title: 'File Explorer (IndexedDB VFS)',
      icon: 'files',
      onClick: () => launchApp('file-explorer'),
    },
    {
      id: 'dock-arch',
      title: 'Master Architecture Spec',
      icon: 'globe',
      onClick: () =>
        launchApp('dev-workspace', {
          filePath: '/home/Documents/GemmaOS_Architecture_Spec.md',
        }),
    },
    {
      id: 'dock-ai',
      title: 'Gemma & EmbeddingGemma 2 Contracts',
      icon: 'ai',
      onClick: () => launchApp('architecture-inspector', { tab: 'gemma' }),
    },
    {
      id: 'dock-themes',
      title: 'Theme & Wallpaper Studio',
      icon: 'gallery',
      onClick: () => launchApp('system-settings'),
    },
    {
      id: 'dock-audio',
      title: 'System Monitor & Telemetry',
      icon: 'music',
      onClick: () => launchApp('system-monitor'),
    },
    {
      id: 'dock-verify',
      title: 'Run Milestone P1.8 Verification',
      icon: 'play',
      onClick: () => {
        launchApp('dev-workspace');
        sendNotification(
          'Milestone P1.8 Suite Triggered',
          'Opened Developer Workspace to inspect PAL subsystem checks.',
          'system',
          'success'
        );
      },
    },
    {
      id: 'dock-launcher',
      title: 'Application Launcher',
      icon: 'apps',
      onClick: () => launchApp('app-launcher'),
    },
  ];

  const renderWindowContent = (appId: AppId, payload?: Record<string, string>) => {
    switch (appId) {
      case 'welcome-hub':
        return <WelcomeHubApp />;
      case 'file-explorer':
        return <FileExplorerApp payload={payload} />;
      case 'system-settings':
        return <SystemSettingsApp />;
      case 'app-launcher':
        return <AppLauncherApp />;
      case 'dev-workspace':
        return <DevWorkspaceApp payload={payload} />;
      case 'system-monitor':
        return <SystemMonitorApp />;
      case 'architecture-inspector':
        return <ArchitectureInspectorApp payload={payload} />;
      default:
        return <WelcomeHubApp />;
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden select-none">
      {/* Illustrated Twilight Cloud & Sakura Backdrop */}
      <DesktopBackdropArtwork wallpaper={wallpaper} />

      {/* ====================================================================
          TOP SYSTEM BAR (GemmaOS Wordmark + System Tray + Live Clock + Search)
      ==================================================================== */}
      <header className="relative z-40 h-12 px-5 flex items-center justify-between text-[#FFF8F0]">
        {/* Brand Zone */}
        <button
          onClick={() => launchApp('welcome-hub')}
          className="flex items-center gap-2 cursor-pointer group"
          title="Welcome to GemmaOS"
        >
          <SparkleStar className="w-6 h-6 group-hover:scale-110 transition-transform" />
          <div className="relative">
            <span className="font-display text-2xl font-bold tracking-tight text-[#FFF8F0] drop-shadow-[0_2px_0_#2A114B]">
              GemmaOS
            </span>
            <span className="block h-1 w-full rounded-full bg-gradient-to-r from-[#FF66B5] to-[#C77DFF]" />
          </div>
          <SparkleStar className="w-5 h-5 group-hover:scale-110 transition-transform" />
        </button>

        {/* System Tray & Status Zone */}
        <div className="flex items-center gap-3.5 text-sm font-semibold drop-shadow-[0_1.5px_0_#2A114B]">
          {/* Quick Theme Switcher Pill */}
          <button
            onClick={toggleThemeMode}
            className="gemma-pill-border gemma-btn-press px-2.5 py-1 rounded-full bg-[#FFF6E8] text-[#2A114B] text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            title="Switch between Warm Cream & Deep Violet themes"
          >
            {isViolet ? (
              <>
                <Moon className="w-3.5 h-3.5 text-[#7B3FE4] stroke-[2.5]" />
                <span>Violet Night</span>
              </>
            ) : (
              <>
                <Sun className="w-3.5 h-3.5 text-[#FF5CAD] stroke-[2.5]" />
                <span>Warm Cream</span>
              </>
            )}
          </button>

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifDrawer((prev) => !prev);
                markAllNotificationsRead();
              }}
              className="relative p-1 hover:opacity-85 cursor-pointer"
              title="System Notifications"
              aria-label="System Notifications"
            >
              <Bell className="w-5 h-5 fill-[#FFF8F0] text-[#FFF8F0]" />
              {unreadNotifs > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#FF5CAD] border-2 border-[#2A114B]" />
              )}
            </button>

            {showNotifDrawer && (
              <div
                className={`absolute right-0 mt-2 w-80 rounded-2xl gemma-window-border p-3.5 z-50 ${
                  isViolet ? 'bg-[#2B124C] text-[#FFF8F0]' : 'bg-[#FFFDF7] text-[#2A114B]'
                }`}
              >
                <div className="flex items-center justify-between pb-2 mb-2 border-b-2 border-[#2A114B]/20">
                  <span className="font-display font-bold text-sm">System Notifications</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={clearNotifications}
                      className="p-1 rounded hover:bg-[#FF85C8]/30 cursor-pointer"
                      title="Clear All"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setShowNotifDrawer(false)}
                      className="p-1 rounded hover:bg-[#FF85C8]/30 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {notifications.length === 0 ? (
                  <div className="py-6 text-center text-xs opacity-75">
                    No active notifications.
                  </div>
                ) : (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-2.5 rounded-xl border-2 border-[#2A114B] text-xs ${
                          isViolet ? 'bg-[#3C1B69]' : 'bg-[#FFF6E8]'
                        }`}
                      >
                        <div className="font-bold">{n.title}</div>
                        <div className="opacity-85 mt-0.5 leading-snug">{n.message}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <button
            onClick={() => launchApp('system-monitor')}
            className="hover:opacity-85 cursor-pointer"
            title="Network Connected — Open System Monitor"
          >
            <Wifi className="w-5 h-5 stroke-[2.5]" />
          </button>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="hover:opacity-85 cursor-pointer"
            title={soundEnabled ? 'Mute UI Sounds' : 'Enable UI Sounds'}
          >
            {soundEnabled ? (
              <Volume2 className="w-5 h-5 stroke-[2.5]" />
            ) : (
              <VolumeX className="w-5 h-5 stroke-[2.5] opacity-60" />
            )}
          </button>

          <button
            onClick={() => launchApp('system-monitor')}
            className="hover:opacity-85 cursor-pointer"
            title="Battery 94% (Charging)"
          >
            <BatteryCharging className="w-6 h-6 stroke-[2.2]" />
          </button>

          <span className="opacity-50">|</span>

          <button
            onClick={() => launchApp('system-monitor')}
            className="font-sans text-xs sm:text-sm font-bold tracking-tight whitespace-nowrap cursor-pointer"
          >
            {clockText}
          </button>

          <button
            onClick={() => setShowQuickSearch((prev) => !prev)}
            className="p-1 hover:scale-110 transition-transform cursor-pointer"
            title="Quick Search Applications & Files"
            aria-label="Quick Search"
          >
            <Search className="w-4 h-4 stroke-[3]" />
          </button>
        </div>
      </header>

      {/* ====================================================================
          VERTICAL LEFT RAIL DOCK (Home, Files, Apps, AI, Agents, Models, Memory, Settings)
      ==================================================================== */}
      <aside
        className={`fixed left-4 top-14 bottom-24 w-28 rounded-[34px] gemma-dock-border z-30 py-3 px-2 flex flex-col items-center justify-between overflow-y-auto transition-colors ${
          isViolet ? 'bg-[#2D1452]/95 text-[#FFF8F0]' : 'bg-[#FFF9EE]/95 text-[#2A114B]'
        }`}
      >
        {leftRailItems.map((item) => {
          const isActive = activeLeftRailTab === item.id;
          return (
            <button
              key={item.id}
              onClick={item.action}
              className="w-full flex flex-col items-center gap-0.5 py-1 group cursor-pointer"
            >
              <div className="group-hover:scale-105 transition-transform">
                <ChunkyIcon name={item.icon} className="w-9 h-9" />
              </div>
              <span
                className={`px-3 py-0.5 rounded-full text-xs font-bold leading-tight transition-all ${
                  isActive
                    ? 'bg-[#FF5CAD] text-[#FFF8F0] border-2 border-[#2A114B] shadow-[0_2px_0_#2A114B]'
                    : 'group-hover:bg-[#FF85C8]/25'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </aside>

      {/* ====================================================================
          FLOATING BOTTOM QUICK-LAUNCH DOCK
      ==================================================================== */}
      <footer
        className={`fixed bottom-3.5 left-1/2 -translate-x-1/2 h-18 px-5 rounded-[30px] gemma-dock-border z-30 flex items-center gap-3.5 transition-colors ${
          isViolet ? 'bg-[#35175E]/95' : 'bg-[#FFF9EE]/95'
        }`}
      >
        {bottomDockItems.map((item) => (
          <button
            key={item.id}
            onClick={item.onClick}
            className="hover:-translate-y-1.5 active:translate-y-0 transition-transform cursor-pointer"
            title={item.title}
          >
            <ChunkyIcon name={item.icon} className="w-11 h-11" />
          </button>
        ))}
      </footer>

      {/* ====================================================================
          WINDOW MANAGER WORKSPACE CANVAS
      ==================================================================== */}
      <main className="relative z-20 w-full h-full pointer-events-none">
        {windows.map((win) => (
          <div key={win.id} className="pointer-events-auto">
            <WindowFrame windowInstance={win}>
              {renderWindowContent(win.appId, win.payload)}
            </WindowFrame>
          </div>
        ))}
      </main>

      {/* ====================================================================
          QUICK COMMAND PALETTE / SEARCH OVERLAY
      ==================================================================== */}
      {showQuickSearch && (
        <div
          onClick={() => setShowQuickSearch(false)}
          className="fixed inset-0 bg-[#1A0833]/50 backdrop-blur-xs z-50 flex items-start justify-center pt-20"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`w-full max-w-md rounded-3xl gemma-window-border p-4 ${
              isViolet ? 'bg-[#2B124C] text-[#FFF8F0]' : 'bg-[#FFFDF7] text-[#2A114B]'
            }`}
          >
            <div className="flex items-center gap-2 pb-3 border-b-2 border-[#2A114B]/20">
              <Search className="w-4 h-4 text-[#FF5CAD]" />
              <input
                type="text"
                autoFocus
                value={quickSearchQuery}
                onChange={(e) => setQuickSearchQuery(e.target.value)}
                placeholder="Jump to GemmaOS application or subsystem..."
                className="flex-1 bg-transparent text-sm font-bold focus:outline-none"
              />
              <button
                onClick={() => setShowQuickSearch(false)}
                className="p-1 rounded-lg hover:bg-[#FF85C8]/25 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-3 space-y-1.5 max-h-64 overflow-y-auto">
              {Object.values(APP_MANIFESTS)
                .filter(
                  (a) =>
                    !quickSearchQuery.trim() ||
                    a.name.toLowerCase().includes(quickSearchQuery.toLowerCase()) ||
                    a.description.toLowerCase().includes(quickSearchQuery.toLowerCase())
                )
                .map((app) => (
                  <button
                    key={app.id}
                    onClick={() => {
                      launchApp(app.id as AppId);
                      setShowQuickSearch(false);
                      setQuickSearchQuery('');
                    }}
                    className={`w-full text-left p-2.5 rounded-xl border-2 border-[#2A114B] flex items-center justify-between cursor-pointer ${
                      isViolet
                        ? 'bg-[#3C1B69] hover:bg-[#51258C]'
                        : 'bg-[#FFF6E8] hover:bg-[#FFECB3]'
                    }`}
                  >
                    <div>
                      <div className="font-display font-bold text-sm">{app.name}</div>
                      <div className="text-xs opacity-80">{app.description}</div>
                    </div>
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#FF85C8] text-[#2A114B] font-bold ml-2 shrink-0">
                      OPEN
                    </span>
                  </button>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
