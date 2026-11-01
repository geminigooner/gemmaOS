/**
 * GEMMAOS — APPLICATION 2: SYSTEM SETTINGS & THEME ENGINE
 * Manages Dual-Theme Live Switching (Warm Cream vs Deep Violet Night),
 * Wallpaper scenes, Per-Application PAL Permissions, IndexedDB Storage Persistence,
 * and Phase 1–6 Architectural Governance documentation.
 */

import React, { useEffect, useState } from 'react';
import {
  Palette,
  Shield,
  Database,
  Info,
  Sun,
  Moon,
  Volume2,
  Bell,
  RotateCcw,
  Download,
  Check,
} from 'lucide-react';
import {
  APP_MANIFESTS,
  AppId,
  useGemmaStore,
  WallpaperScene,
} from '../core/store';
import { getPAL } from '../infrastructure/browserAdapters';
import { PermissionScope, StorageStats } from '../pal/types';

const ALL_PERMISSION_SCOPES: { scope: PermissionScope; label: string }[] = [
  { scope: 'fs.read', label: 'Filesystem Read' },
  { scope: 'fs.write', label: 'Filesystem Write' },
  { scope: 'storage.read', label: 'Storage Read' },
  { scope: 'storage.write', label: 'Storage Write' },
  { scope: 'system.metrics', label: 'Hardware Telemetry' },
  { scope: 'notifications.send', label: 'System Notifications' },
  { scope: 'execution.sandbox', label: 'Sandbox Execution' },
  { scope: 'ai.runtime', label: 'Phase 2 AI Runtime' },
];

export function SystemSettingsApp() {
  const {
    themeMode,
    wallpaper,
    soundEnabled,
    notificationsEnabled,
    appPermissions,
    setThemeMode,
    setWallpaper,
    setSoundEnabled,
    setNotificationsEnabled,
    toggleAppPermission,
    sendNotification,
  } = useGemmaStore();

  const [activeTab, setActiveTab] = useState<'appearance' | 'permissions' | 'storage' | 'roadmap'>('appearance');
  const [storageStats, setStorageStats] = useState<StorageStats | null>(null);
  const [exportedJson, setExportedJson] = useState<string>('');

  const isViolet = themeMode === 'violet';

  const refreshStats = async () => {
    const stats = await getPAL().storage.getStats();
    setStorageStats(stats);
  };

  useEffect(() => {
    refreshStats();
  }, [activeTab, themeMode, wallpaper]);

  const handleExportBackup = async () => {
    const dump = await getPAL().storage.exportAll();
    setExportedJson(dump);
    await sendNotification(
      'IndexedDB Backup Exported',
      'Serialized persistent GemmaOS configuration and state.',
      'storage',
      'success'
    );
  };

  const handleFactoryResetVFS = async () => {
    await getPAL().fs.resetToDefaults();
    await refreshStats();
    await sendNotification(
      'VFS Restored to Defaults',
      'Re-seeded /home/Documents, /home/Projects, /etc, and /var.',
      'storage',
      'info'
    );
  };

  return (
    <div
      className={`h-full flex min-h-0 select-none ${
        isViolet ? 'bg-[#2B124C] text-[#FFF8F0]' : 'bg-[#FFFDF7] text-[#2A114B]'
      }`}
    >
      {/* Left Navigation Sidebar */}
      <div
        className={`w-48 border-r-[2.5px] border-[#2A114B] p-3.5 space-y-2 shrink-0 ${
          isViolet ? 'bg-[#230E42]' : 'bg-[#FFF6E8]'
        }`}
      >
        <div className="text-xs font-bold opacity-75 px-2 mb-2">System Control</div>

        {[
          { id: 'appearance', label: 'Theme & Desktop', icon: Palette },
          { id: 'permissions', label: 'App Permissions', icon: Shield },
          { id: 'storage', label: 'IndexedDB Storage', icon: Database },
          { id: 'roadmap', label: 'Phases 1–6 Spec', icon: Info },
        ].map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`w-full px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2.5 cursor-pointer transition-all ${
                active
                  ? 'bg-[#FF66B5] text-[#2A114B] border-2 border-[#2A114B] shadow-[0_2px_0_#2A114B]'
                  : 'hover:bg-[#FF85C8]/20'
              }`}
            >
              <Icon className="w-4 h-4 stroke-[2.5]" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-5 overflow-y-auto space-y-5">
        {activeTab === 'appearance' && (
          <>
            <div>
              <h2 className="font-display text-xl font-bold">Visual Design System &amp; Theme Engine</h2>
              <p className="text-xs opacity-80 mt-0.5">
                Switch live between the two GemmaOS reference themes. Persisted via PAL IStorageProvider.
              </p>
            </div>

            {/* Dual Theme Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => setThemeMode('cream')}
                className={`gemma-card-border gemma-btn-press rounded-2xl p-4 text-left cursor-pointer transition-all bg-[#FFF9F0] text-[#2A114B] ${
                  themeMode === 'cream' ? 'ring-4 ring-[#FF5CAD]' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-9 h-9 rounded-xl bg-[#FFE484] border-2 border-[#2A114B] flex items-center justify-center">
                    <Sun className="w-5 h-5 text-[#2A114B] stroke-[2.5]" />
                  </div>
                  {themeMode === 'cream' && (
                    <span className="px-2.5 py-0.5 rounded-full bg-[#FF66B5] border-2 border-[#2A114B] text-[11px] font-bold">
                      Active
                    </span>
                  )}
                </div>
                <div className="font-display text-base font-bold">Warm Cream Mode</div>
                <div className="text-xs opacity-80 mt-1">
                  Warm cream panels (#FFF8EE), bubblegum pink headers, butter highlights, and deep-plum outlines.
                </div>
              </button>

              <button
                onClick={() => setThemeMode('violet')}
                className={`gemma-card-border gemma-btn-press rounded-2xl p-4 text-left cursor-pointer transition-all bg-[#34195B] text-[#FFF8F0] ${
                  themeMode === 'violet' ? 'ring-4 ring-[#FF5CAD]' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="w-9 h-9 rounded-xl bg-[#C77DFF] border-2 border-[#2A114B] flex items-center justify-center text-[#2A114B]">
                    <Moon className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  {themeMode === 'violet' && (
                    <span className="px-2.5 py-0.5 rounded-full bg-[#FF66B5] border-2 border-[#2A114B] text-[#2A114B] text-[11px] font-bold">
                      Active
                    </span>
                  )}
                </div>
                <div className="font-display text-base font-bold">Deep Violet Night</div>
                <div className="text-xs opacity-85 mt-1">
                  Rich midnight-violet window surfaces (#34195B), neon pink accents, and high-contrast twilight cards.
                </div>
              </button>
            </div>

            {/* Wallpaper Scene Selector */}
            <div
              className={`gemma-card-border rounded-2xl p-4 ${
                isViolet ? 'bg-[#3C1B69]' : 'bg-[#FFF6E8]'
              }`}
            >
              <div className="font-display text-base font-bold mb-2.5">Desktop Backdrop Scene</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {(
                  [
                    {
                      id: 'twilight-clouds',
                      title: 'Dreamy Twilight Clouds',
                      gradient: 'from-[#6425B8] via-[#A44CD8] to-[#FF7CC3]',
                    },
                    {
                      id: 'sakura-starlight',
                      title: 'Sakura Starlight',
                      gradient: 'from-[#48168A] via-[#8338EC] to-[#FF5CAD]',
                    },
                    {
                      id: 'cosmic-plum',
                      title: 'Cosmic Lavender',
                      gradient: 'from-[#240B4C] via-[#531CB3] to-[#9B5DE5]',
                    },
                  ] as { id: WallpaperScene; title: string; gradient: string }[]
                ).map((scene) => (
                  <button
                    key={scene.id}
                    onClick={() => setWallpaper(scene.id)}
                    className={`gemma-pill-border gemma-btn-press rounded-xl p-2.5 text-left cursor-pointer ${
                      wallpaper === scene.id
                        ? 'bg-[#FF85C8] text-[#2A114B]'
                        : isViolet
                        ? 'bg-[#2B124C]'
                        : 'bg-[#FFFDF9]'
                    }`}
                  >
                    <div
                      className={`h-12 w-full rounded-lg border-2 border-[#2A114B] bg-gradient-to-r ${scene.gradient} mb-2`}
                    />
                    <div className="text-xs font-bold flex items-center justify-between">
                      <span>{scene.title}</span>
                      {wallpaper === scene.id && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Audio & Notification Toggles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div
                className={`gemma-card-border rounded-2xl p-3.5 flex items-center justify-between ${
                  isViolet ? 'bg-[#3C1B69]' : 'bg-[#FFF6E8]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#DEC4FF] border-2 border-[#2A114B] flex items-center justify-center text-[#2A114B]">
                    <Volume2 className="w-4 h-4 stroke-[2.5]" />
                  </div>
                  <div>
                    <div className="text-xs font-bold">Synthesized Toy Clicks</div>
                    <div className="text-[11px] opacity-75">Tactile Web Audio feedback</div>
                  </div>
                </div>
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={`gemma-pill-border px-3 py-1 rounded-full text-xs font-bold cursor-pointer ${
                    soundEnabled ? 'bg-[#FF66B5] text-[#2A114B]' : 'bg-gray-300 text-[#2A114B]'
                  }`}
                >
                  {soundEnabled ? 'ON' : 'OFF'}
                </button>
              </div>

              <div
                className={`gemma-card-border rounded-2xl p-3.5 flex items-center justify-between ${
                  isViolet ? 'bg-[#3C1B69]' : 'bg-[#FFF6E8]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#FFE484] border-2 border-[#2A114B] flex items-center justify-center text-[#2A114B]">
                    <Bell className="w-4 h-4 stroke-[2.5]" />
                  </div>
                  <div>
                    <div className="text-xs font-bold">System Notifications</div>
                    <div className="text-[11px] opacity-75">INotificationService alerts</div>
                  </div>
                </div>
                <button
                  onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                  className={`gemma-pill-border px-3 py-1 rounded-full text-xs font-bold cursor-pointer ${
                    notificationsEnabled
                      ? 'bg-[#FF66B5] text-[#2A114B]'
                      : 'bg-gray-300 text-[#2A114B]'
                  }`}
                >
                  {notificationsEnabled ? 'ON' : 'OFF'}
                </button>
              </div>
            </div>
          </>
        )}

        {activeTab === 'permissions' && (
          <>
            <div>
              <h2 className="font-display text-xl font-bold">Centralized Permission Manager</h2>
              <p className="text-xs opacity-80 mt-0.5">
                Control which Platform Abstraction Layer (PAL) capabilities each registered application may invoke.
              </p>
            </div>

            <div className="space-y-3">
              {(Object.keys(APP_MANIFESTS) as AppId[]).map((appId) => {
                const manifest = APP_MANIFESTS[appId];
                const granted = appPermissions[appId] || [];
                return (
                  <div
                    key={appId}
                    className={`gemma-card-border rounded-2xl p-3.5 ${
                      isViolet ? 'bg-[#3C1B69]' : 'bg-[#FFF6E8]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <span className="font-display font-bold text-sm">{manifest.name}</span>
                        <span className="ml-2 font-mono text-xs opacity-75">v{manifest.version}</span>
                      </div>
                      <span className="text-xs font-semibold opacity-75">{manifest.category}</span>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {ALL_PERMISSION_SCOPES.map(({ scope, label }) => {
                        const isGranted = granted.includes(scope);
                        return (
                          <button
                            key={scope}
                            onClick={() => toggleAppPermission(appId, scope)}
                            className={`px-2.5 py-1 rounded-lg border-2 border-[#2A114B] text-[11px] font-bold cursor-pointer transition-all ${
                              isGranted
                                ? 'bg-[#FF85C8] text-[#2A114B] shadow-[0_2px_0_#2A114B]'
                                : 'bg-white/50 text-[#2A114B]/60'
                            }`}
                          >
                            {isGranted ? '✓ ' : '+ '}
                            {label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {activeTab === 'storage' && (
          <>
            <div>
              <h2 className="font-display text-xl font-bold">Persistence Infrastructure (IndexedDB)</h2>
              <p className="text-xs opacity-80 mt-0.5">
                Inspect PAL IStorageProvider &amp; IFileSystem state, export portable JSON snapshots, or reset VFS defaults.
              </p>
            </div>

            {storageStats && (
              <div
                className={`gemma-card-border rounded-2xl p-4 grid grid-cols-2 sm:grid-cols-4 gap-3 ${
                  isViolet ? 'bg-[#3C1B69]' : 'bg-[#FFF6E8]'
                }`}
              >
                <div>
                  <div className="text-xs opacity-75">Adapter Backend</div>
                  <div className="font-mono font-bold text-sm mt-0.5">{storageStats.backend}</div>
                </div>
                <div>
                  <div className="text-xs opacity-75">Database Name</div>
                  <div className="font-mono font-bold text-sm mt-0.5">{storageStats.databaseName}</div>
                </div>
                <div>
                  <div className="text-xs opacity-75">KV Records</div>
                  <div className="font-mono font-bold text-sm mt-0.5 tabular-nums">
                    {storageStats.recordCount}
                  </div>
                </div>
                <div>
                  <div className="text-xs opacity-75">Payload Size</div>
                  <div className="font-mono font-bold text-sm mt-0.5 tabular-nums">
                    {storageStats.estimatedBytes} B
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleExportBackup}
                className="gemma-pill-border gemma-btn-press px-4 py-2 rounded-xl bg-[#FF66B5] text-[#2A114B] text-xs font-bold flex items-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4 stroke-[2.5]" />
                <span>Export Storage Snapshot</span>
              </button>

              <button
                onClick={handleFactoryResetVFS}
                className="gemma-pill-border gemma-btn-press px-4 py-2 rounded-xl bg-[#FFE484] text-[#2A114B] text-xs font-bold flex items-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4 stroke-[2.5]" />
                <span>Re-seed Default Virtual Filesystem</span>
              </button>
            </div>

            {exportedJson && (
              <div>
                <div className="text-xs font-bold mb-1">Portable Migration Snapshot (JSON):</div>
                <pre className="p-3 rounded-xl border-2 border-[#2A114B] bg-[#FFFDF9] text-[#2A114B] font-mono text-xs overflow-x-auto max-h-48">
                  {exportedJson}
                </pre>
              </div>
            )}
          </>
        )}

        {activeTab === 'roadmap' && (
          <>
            <div>
              <h2 className="font-display text-xl font-bold">Architectural Governance &amp; Phase Trajectory</h2>
              <p className="text-xs opacity-80 mt-0.5">
                Authoritative implementation status across all 6 GemmaOS phases per Section 9 Governance rules.
              </p>
            </div>

            <div className="space-y-2.5">
              {[
                {
                  phase: 'Phase 1 — Desktop Foundation & PAL',
                  status: 'IMPLEMENTED',
                  badgeBg: 'bg-[#80ED99]',
                  details:
                    'Desktop Shell, Window Manager, Application Registry, Core Services, IndexedDB Persistence, and 6 PAL Contracts.',
                },
                {
                  phase: 'Phase 2 — AI Intelligence Infrastructure',
                  status: 'PLANNED',
                  badgeBg: 'bg-[#FFE484]',
                  details:
                    'Independent Gemma generative runtime, EmbeddingGemma 2 semantic representation, AI Orchestrator, and Vector Memory.',
                },
                {
                  phase: 'Phase 3 — Agent Operating Environment',
                  status: 'PLANNED',
                  badgeBg: 'bg-[#FFE484]',
                  details:
                    'Agent Runtime lifecycle, Task Decomposition, Tool Registry, Category A/B/C Permission Policies, and Workflow Engine.',
                },
                {
                  phase: 'Phase 4 — System Integration & Hardening',
                  status: 'PLANNED',
                  badgeBg: 'bg-[#DEC4FF]',
                  details:
                    'Transaction-safe persistence, threat modeling, resource concurrency queues, structured observability, and portability audit.',
                },
                {
                  phase: 'Phase 5 — Native Linux & Wayland Migration',
                  status: 'PLANNED',
                  badgeBg: 'bg-[#DEC4FF]',
                  details:
                    'Replace Browser PAL adapters with ILinuxFileSystem, ILinuxStorageProvider, Wayland windowing, and hardware-aware runtimes.',
                },
                {
                  phase: 'Phase 6 — Bootable OS Distribution & Release',
                  status: 'PLANNED',
                  badgeBg: 'bg-[#FFA8D8]',
                  details:
                    'Debian/Ubuntu base image, UEFI bootloader, system installer, first-boot AI setup wizard, and staged release channels.',
                },
              ].map((item) => (
                <div
                  key={item.phase}
                  className={`gemma-card-border rounded-2xl p-3.5 ${
                    isViolet ? 'bg-[#3C1B69]' : 'bg-[#FFF6E8]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-display font-bold text-sm">{item.phase}</span>
                    <span
                      className={`px-2.5 py-0.5 rounded-md border-2 border-[#2A114B] text-[#2A114B] font-mono text-[11px] font-bold ${item.badgeBg}`}
                    >
                      {item.status}
                    </span>
                  </div>
                  <p className="text-xs opacity-85">{item.details}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
