/**
 * GEMMAOS — LAYER 3: CORE SYSTEM SERVICES & STATE MANAGER
 * Coordinates Event Bus, Permission Manager, Settings/Theme Engine, Window Manager,
 * and Application Lifecycle through the Platform Abstraction Layer (PAL).
 */

import { create } from 'zustand';
import { getPAL } from '../infrastructure/browserAdapters';
import {
  HardwareMetrics,
  PermissionScope,
  SystemNotification,
} from '../pal/types';

export type ThemeMode = 'cream' | 'violet';
export type WallpaperScene = 'twilight-clouds' | 'sakura-starlight' | 'cosmic-plum';

export type AppId =
  | 'welcome-hub'
  | 'file-explorer'
  | 'system-settings'
  | 'app-launcher'
  | 'dev-workspace'
  | 'system-monitor'
  | 'architecture-inspector';

export interface ActivityRecord {
  id: string;
  title: string;
  subtitle: string;
  timeLabel: string;
  timestamp: number;
  iconType: 'layers' | 'sparkle' | 'chat' | 'folder' | 'settings';
  targetAppId: AppId;
  targetPayload?: Record<string, string>;
}

export interface AppManifest {
  id: AppId;
  name: string;
  shortName: string;
  version: string;
  description: string;
  category: 'System' | 'Development' | 'Utilities' | 'AI Infrastructure';
  defaultWidth: number;
  defaultHeight: number;
  minWidth: number;
  minHeight: number;
  permissions: PermissionScope[];
}

export interface WindowInstance {
  id: string;
  appId: AppId;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  minWidth: number;
  minHeight: number;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  payload?: Record<string, string>;
}

export const APP_MANIFESTS: Record<AppId, AppManifest> = {
  'welcome-hub': {
    id: 'welcome-hub',
    name: 'Welcome to GemmaOS',
    shortName: 'Home',
    version: '0.6.0-beta',
    description: 'Central GemmaOS dashboard, system overview, quick actions, and recent activity feed.',
    category: 'System',
    defaultWidth: 740,
    defaultHeight: 620,
    minWidth: 520,
    minHeight: 480,
    permissions: ['system.metrics', 'storage.read', 'notifications.send'],
  },
  'file-explorer': {
    id: 'file-explorer',
    name: 'File Explorer',
    shortName: 'Files',
    version: '1.0.0',
    description: 'Browse, create, edit, and organize files across the IndexedDB Virtual File System.',
    category: 'System',
    defaultWidth: 780,
    defaultHeight: 540,
    minWidth: 540,
    minHeight: 400,
    permissions: ['fs.read', 'fs.write', 'notifications.send'],
  },
  'app-launcher': {
    id: 'app-launcher',
    name: 'Application Launcher',
    shortName: 'Apps',
    version: '1.0.0',
    description: 'Centralized application registry, permission viewer, and process launcher.',
    category: 'System',
    defaultWidth: 700,
    defaultHeight: 520,
    minWidth: 480,
    minHeight: 380,
    permissions: ['system.metrics', 'storage.read'],
  },
  'dev-workspace': {
    id: 'dev-workspace',
    name: 'Developer Workspace',
    shortName: 'Workspace',
    version: '1.0.0',
    description: 'Code editor, PAL interface inspector, and Milestone P1.1–P1.8 integration test suite.',
    category: 'Development',
    defaultWidth: 840,
    defaultHeight: 580,
    minWidth: 580,
    minHeight: 420,
    permissions: ['fs.read', 'fs.write', 'execution.sandbox', 'system.metrics'],
  },
  'system-monitor': {
    id: 'system-monitor',
    name: 'System Monitor',
    shortName: 'Monitor',
    version: '1.0.0',
    description: 'Real-time hardware telemetry, active window processes, Event Bus stream, and PAL health.',
    category: 'Utilities',
    defaultWidth: 760,
    defaultHeight: 540,
    minWidth: 520,
    minHeight: 400,
    permissions: ['system.metrics', 'storage.read'],
  },
  'system-settings': {
    id: 'system-settings',
    name: 'System Settings',
    shortName: 'Settings',
    version: '1.0.0',
    description: 'Customize Warm Cream & Deep Violet themes, wallpapers, permissions, and IndexedDB storage.',
    category: 'System',
    defaultWidth: 740,
    defaultHeight: 560,
    minWidth: 520,
    minHeight: 420,
    permissions: ['storage.read', 'storage.write', 'notifications.send'],
  },
  'architecture-inspector': {
    id: 'architecture-inspector',
    name: 'AI & Agent Architecture Hub',
    shortName: 'AI & Agents',
    version: '0.6.0-beta',
    description: 'Inspect Phase 2 Gemma & EmbeddingGemma 2 runtime contracts, Semantic Memory, and Phase 3 Agent boundaries.',
    category: 'AI Infrastructure',
    defaultWidth: 780,
    defaultHeight: 560,
    minWidth: 540,
    minHeight: 420,
    permissions: ['ai.runtime', 'system.metrics', 'storage.read'],
  },
};

const INITIAL_ACTIVITIES: ActivityRecord[] = [
  {
    id: 'act-1',
    title: 'Indexed new documents',
    subtitle: 'Added 24 files to memory',
    timeLabel: '2h ago',
    timestamp: Date.now() - 7200000,
    iconType: 'layers',
    targetAppId: 'file-explorer',
    targetPayload: { path: '/home/Documents' },
  },
  {
    id: 'act-2',
    title: 'Agent task completed',
    subtitle: 'Organized project files',
    timeLabel: '4h ago',
    timestamp: Date.now() - 14400000,
    iconType: 'sparkle',
    targetAppId: 'dev-workspace',
    targetPayload: { filePath: '/home/Projects/pal_verification.ts' },
  },
  {
    id: 'act-3',
    title: 'Gemma conversation',
    subtitle: '“Planned next development steps ✏️”',
    timeLabel: 'Yesterday',
    timestamp: Date.now() - 86400000,
    iconType: 'chat',
    targetAppId: 'architecture-inspector',
    targetPayload: { tab: 'gemma' },
  },
];

export interface SystemEventLog {
  id: string;
  timestamp: number;
  topic: string;
  source: string;
  summary: string;
}

interface GemmaOSState {
  initialized: boolean;
  themeMode: ThemeMode;
  wallpaper: WallpaperScene;
  soundEnabled: boolean;
  notificationsEnabled: boolean;
  activeLeftRailTab: string;

  // Window Manager State
  windows: WindowInstance[];
  focusedWindowId: string | null;
  topZIndex: number;

  // Core Services State
  activities: ActivityRecord[];
  eventLogs: SystemEventLog[];
  notifications: SystemNotification[];
  hardwareMetrics: HardwareMetrics;
  appPermissions: Record<AppId, PermissionScope[]>;

  // Actions
  bootstrapOS: () => Promise<void>;
  setThemeMode: (mode: ThemeMode) => Promise<void>;
  toggleThemeMode: () => Promise<void>;
  setWallpaper: (wallpaper: WallpaperScene) => Promise<void>;
  setSoundEnabled: (enabled: boolean) => Promise<void>;
  setNotificationsEnabled: (enabled: boolean) => Promise<void>;
  setActiveLeftRailTab: (tab: string) => void;

  // Window Manager Actions
  launchApp: (appId: AppId, payload?: Record<string, string>) => void;
  closeWindow: (windowId: string) => void;
  focusWindow: (windowId: string) => void;
  toggleMinimizeWindow: (windowId: string) => void;
  toggleMaximizeWindow: (windowId: string) => void;
  updateWindowBounds: (
    windowId: string,
    bounds: Partial<Pick<WindowInstance, 'x' | 'y' | 'width' | 'height'>>
  ) => void;

  // Core Service Actions
  publishEvent: (topic: string, source: string, summary: string) => void;
  recordActivity: (
    activity: Omit<ActivityRecord, 'id' | 'timestamp' | 'timeLabel'>
  ) => Promise<void>;
  toggleAppPermission: (appId: AppId, scope: PermissionScope) => Promise<void>;
  refreshHardwareTelemetry: () => Promise<void>;
  sendNotification: (
    title: string,
    message: string,
    category?: SystemNotification['category'],
    severity?: SystemNotification['severity']
  ) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;
  clearNotifications: () => Promise<void>;
}

// Gentle Web Audio synthesized UI click (no external audio assets required)
function playToyClick(enabled: boolean, pitch = 520) {
  if (!enabled || typeof window === 'undefined') return;
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(pitch, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(pitch * 1.35, ctx.currentTime + 0.055);
    gain.gain.setValueAtTime(0.06, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.065);
    setTimeout(() => ctx.close().catch(() => {}), 120);
  } catch {
    // Ignore audio context restriction
  }
}

function applyThemeToDOM(mode: ThemeMode) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  if (mode === 'violet') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}

export const useGemmaStore = create<GemmaOSState>((set, get) => ({
  initialized: false,
  themeMode: 'cream',
  wallpaper: 'twilight-clouds',
  soundEnabled: true,
  notificationsEnabled: true,
  activeLeftRailTab: 'Home',

  windows: [
    {
      id: 'win-welcome-initial',
      appId: 'welcome-hub',
      title: 'Welcome to GemmaOS',
      x: 205,
      y: 62,
      width: 750,
      height: 615,
      minWidth: 520,
      minHeight: 480,
      isMinimized: false,
      isMaximized: false,
      zIndex: 10,
    },
  ],
  focusedWindowId: 'win-welcome-initial',
  topZIndex: 10,

  activities: INITIAL_ACTIVITIES,
  eventLogs: [
    {
      id: 'evt-init-1',
      timestamp: Date.now() - 5000,
      topic: 'system.boot',
      source: 'PAL::BrowserExecutionEnvironment',
      summary: 'Initialized GemmaOS v0.6.0-beta Desktop Foundation and mounted IndexedDB VFS.',
    },
    {
      id: 'evt-init-2',
      timestamp: Date.now() - 3000,
      topic: 'pal.contracts',
      source: 'PAL::IModelRuntime',
      summary: 'Registered Phase 2 standby contracts for Gemma and EmbeddingGemma 2.',
    },
  ],
  notifications: [],
  hardwareMetrics: {
    cpuUsagePercent: 24,
    cpuCores: 8,
    memoryUsedMB: 2140,
    memoryTotalMB: 8192,
    storageUsedMB: 14.2,
    storageQuotaMB: 1024,
    temperatureCelsius: 42,
    batteryLevelPercent: 94,
    batteryCharging: true,
    networkOnline: true,
    networkLatencyMs: 18,
    displayResolution: '1440×900',
    platformTarget: 'browser-pal-v1',
  },
  appPermissions: {
    'welcome-hub': [...APP_MANIFESTS['welcome-hub'].permissions],
    'file-explorer': [...APP_MANIFESTS['file-explorer'].permissions],
    'app-launcher': [...APP_MANIFESTS['app-launcher'].permissions],
    'dev-workspace': [...APP_MANIFESTS['dev-workspace'].permissions],
    'system-monitor': [...APP_MANIFESTS['system-monitor'].permissions],
    'system-settings': [...APP_MANIFESTS['system-settings'].permissions],
    'architecture-inspector': [...APP_MANIFESTS['architecture-inspector'].permissions],
  },

  bootstrapOS: async () => {
    if (get().initialized) return;
    const pal = getPAL();
    await pal.storage.initialize();
    await pal.fs.initialize();

    const savedTheme = await pal.storage.get<ThemeMode>('settings', 'themeMode');
    const savedWallpaper = await pal.storage.get<WallpaperScene>('settings', 'wallpaper');
    const savedSound = await pal.storage.get<boolean>('settings', 'soundEnabled');
    const savedActivities = await pal.storage.get<ActivityRecord[]>('system', 'activities');
    const savedPerms = await pal.storage.get<Record<AppId, PermissionScope[]>>(
      'security',
      'appPermissions'
    );

    const activeTheme = savedTheme || 'cream';
    applyThemeToDOM(activeTheme);

    // Center Welcome Window nicely on current viewport
    if (typeof window !== 'undefined') {
      const vw = Math.max(960, window.innerWidth);
      const vh = Math.max(680, window.innerHeight);
      const winW = Math.min(760, vw - 240);
      const winH = Math.min(615, vh - 170);
      const startX = Math.max(175, Math.round((vw - winW) / 2) + 45);
      const startY = Math.max(54, Math.round((vh - winH) / 2) - 24);

      set((state) => ({
        windows: state.windows.map((w) =>
          w.id === 'win-welcome-initial'
            ? { ...w, x: startX, y: startY, width: winW, height: winH }
            : w
        ),
      }));
    }

    pal.notifications.subscribe((items) => {
      set({ notifications: items });
    });

    const hw = await pal.hardware.getMetrics();

    set({
      initialized: true,
      themeMode: activeTheme,
      wallpaper: savedWallpaper || 'twilight-clouds',
      soundEnabled: savedSound ?? true,
      activities: savedActivities && savedActivities.length > 0 ? savedActivities : INITIAL_ACTIVITIES,
      appPermissions: savedPerms || get().appPermissions,
      hardwareMetrics: hw,
    });
  },

  setThemeMode: async (mode: ThemeMode) => {
    const pal = getPAL();
    applyThemeToDOM(mode);
    playToyClick(get().soundEnabled, mode === 'violet' ? 440 : 620);
    set({ themeMode: mode });
    await pal.storage.set('settings', 'themeMode', mode);
    get().publishEvent(
      'theme.changed',
      'Core::ThemeEngine',
      `Switched visual identity to ${mode === 'cream' ? 'Warm Cream' : 'Deep Violet Night'} mode.`
    );
  },

  toggleThemeMode: async () => {
    const next: ThemeMode = get().themeMode === 'cream' ? 'violet' : 'cream';
    await get().setThemeMode(next);
  },

  setWallpaper: async (wallpaper: WallpaperScene) => {
    const pal = getPAL();
    playToyClick(get().soundEnabled, 560);
    set({ wallpaper });
    await pal.storage.set('settings', 'wallpaper', wallpaper);
    get().publishEvent(
      'desktop.wallpaper',
      'Core::SettingsManager',
      `Updated desktop backdrop scene to ${wallpaper}.`
    );
  },

  setSoundEnabled: async (enabled: boolean) => {
    const pal = getPAL();
    set({ soundEnabled: enabled });
    if (enabled) playToyClick(true, 660);
    await pal.storage.set('settings', 'soundEnabled', enabled);
  },

  setNotificationsEnabled: async (enabled: boolean) => {
    const pal = getPAL();
    set({ notificationsEnabled: enabled });
    await pal.storage.set('settings', 'notificationsEnabled', enabled);
  },

  setActiveLeftRailTab: (tab: string) => {
    set({ activeLeftRailTab: tab });
  },

  launchApp: (appId: AppId, payload?: Record<string, string>) => {
    const state = get();
    playToyClick(state.soundEnabled, 580);
    const manifest = APP_MANIFESTS[appId];
    const existing = state.windows.find((w) => w.appId === appId);
    const nextZ = state.topZIndex + 1;

    // Map appId to Left Rail highlight
    const railMap: Record<AppId, string> = {
      'welcome-hub': 'Home',
      'file-explorer': 'Files',
      'app-launcher': 'Apps',
      'dev-workspace': 'Apps',
      'system-monitor': 'Models',
      'system-settings': 'Settings',
      'architecture-inspector': payload?.tab === 'agents' ? 'Agents' : payload?.tab === 'memory' ? 'Memory' : payload?.tab === 'models' ? 'Models' : 'AI',
    };

    if (existing) {
      set({
        windows: state.windows.map((w) =>
          w.id === existing.id
            ? {
                ...w,
                isMinimized: false,
                zIndex: nextZ,
                payload: payload || w.payload,
              }
            : w
        ),
        focusedWindowId: existing.id,
        topZIndex: nextZ,
        activeLeftRailTab: railMap[appId] || state.activeLeftRailTab,
      });
      state.publishEvent(
        'app.focus',
        'Core::WindowManager',
        `Focused window "${manifest.name}"`
      );
      return;
    }

    const offset = (state.windows.length % 5) * 26;
    const vw = typeof window !== 'undefined' ? window.innerWidth : 1440;
    const vh = typeof window !== 'undefined' ? window.innerHeight : 900;
    const width = Math.min(manifest.defaultWidth, vw - 230);
    const height = Math.min(manifest.defaultHeight, vh - 175);
    const x = Math.max(175, Math.min(vw - width - 30, 210 + offset));
    const y = Math.max(56, Math.min(vh - height - 110, 68 + offset));

    const newWin: WindowInstance = {
      id: `win-${appId}-${Date.now()}`,
      appId,
      title: manifest.name,
      x,
      y,
      width,
      height,
      minWidth: manifest.minWidth,
      minHeight: manifest.minHeight,
      isMinimized: false,
      isMaximized: false,
      zIndex: nextZ,
      payload,
    };

    set({
      windows: [...state.windows, newWin],
      focusedWindowId: newWin.id,
      topZIndex: nextZ,
      activeLeftRailTab: railMap[appId] || state.activeLeftRailTab,
    });

    state.publishEvent(
      'app.launch',
      'Core::ApplicationRegistry',
      `Launched application "${manifest.name}" (${manifest.version})`
    );
  },

  closeWindow: (windowId: string) => {
    const state = get();
    playToyClick(state.soundEnabled, 420);
    const target = state.windows.find((w) => w.id === windowId);
    const remaining = state.windows.filter((w) => w.id !== windowId);
    const nextFocused =
      remaining.length > 0
        ? [...remaining].sort((a, b) => b.zIndex - a.zIndex)[0].id
        : null;

    set({
      windows: remaining,
      focusedWindowId: nextFocused,
    });

    if (target) {
      state.publishEvent(
        'window.close',
        'Core::WindowManager',
        `Closed window "${target.title}"`
      );
    }
  },

  focusWindow: (windowId: string) => {
    const state = get();
    const target = state.windows.find((w) => w.id === windowId);
    if (!target) return;
    if (state.focusedWindowId === windowId && !target.isMinimized) return;

    const nextZ = state.topZIndex + 1;
    set({
      windows: state.windows.map((w) =>
        w.id === windowId ? { ...w, isMinimized: false, zIndex: nextZ } : w
      ),
      focusedWindowId: windowId,
      topZIndex: nextZ,
    });
  },

  toggleMinimizeWindow: (windowId: string) => {
    const state = get();
    playToyClick(state.soundEnabled, 480);
    set({
      windows: state.windows.map((w) =>
        w.id === windowId ? { ...w, isMinimized: !w.isMinimized } : w
      ),
    });
  },

  toggleMaximizeWindow: (windowId: string) => {
    const state = get();
    playToyClick(state.soundEnabled, 600);
    const nextZ = state.topZIndex + 1;
    set({
      windows: state.windows.map((w) =>
        w.id === windowId
          ? { ...w, isMaximized: !w.isMaximized, isMinimized: false, zIndex: nextZ }
          : w
      ),
      focusedWindowId: windowId,
      topZIndex: nextZ,
    });
  },

  updateWindowBounds: (windowId, bounds) => {
    set((state) => ({
      windows: state.windows.map((w) => (w.id === windowId ? { ...w, ...bounds } : w)),
    }));
  },

  publishEvent: (topic: string, source: string, summary: string) => {
    const entry: SystemEventLog = {
      id: `evt-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      timestamp: Date.now(),
      topic,
      source,
      summary,
    };
    set((state) => ({
      eventLogs: [entry, ...state.eventLogs].slice(0, 80),
    }));
  },

  recordActivity: async (input) => {
    const pal = getPAL();
    const item: ActivityRecord = {
      ...input,
      id: `act-${Date.now()}`,
      timestamp: Date.now(),
      timeLabel: 'Just now',
    };
    const updated = [item, ...get().activities].slice(0, 20);
    set({ activities: updated });
    await pal.storage.set('system', 'activities', updated);
  },

  toggleAppPermission: async (appId: AppId, scope: PermissionScope) => {
    const pal = getPAL();
    const current = get().appPermissions[appId] || [];
    const exists = current.includes(scope);
    const nextScopes = exists
      ? current.filter((s) => s !== scope)
      : [...current, scope];
    const nextMap = {
      ...get().appPermissions,
      [appId]: nextScopes,
    };
    set({ appPermissions: nextMap });
    await pal.storage.set('security', 'appPermissions', nextMap);
    get().publishEvent(
      'security.permission',
      'Core::PermissionManager',
      `${exists ? 'Revoked' : 'Granted'} "${scope}" for ${APP_MANIFESTS[appId].name}`
    );
  },

  refreshHardwareTelemetry: async () => {
    const pal = getPAL();
    const hw = await pal.hardware.getMetrics();
    set({ hardwareMetrics: hw });
  },

  sendNotification: async (
    title,
    message,
    category = 'system',
    severity = 'info'
  ) => {
    if (!get().notificationsEnabled) return;
    const pal = getPAL();
    await pal.notifications.notify({
      title,
      message,
      category,
      severity,
    });
  },

  markAllNotificationsRead: async () => {
    const pal = getPAL();
    await pal.notifications.markAllAsRead();
  },

  clearNotifications: async () => {
    const pal = getPAL();
    await pal.notifications.clearAll();
  },
}));
