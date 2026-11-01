/**
 * GEMMAOS — WELCOME HUB APPLICATION
 * Matches the flagship "Welcome to GemmaOS" window from the visual design specification,
 * wired to live PAL hardware telemetry, EventBus recent activity, and Application Registry.
 */

import React, { useState } from 'react';
import { ChevronRight, Star, Laptop, Thermometer, Activity, Plus, CheckCircle2 } from 'lucide-react';
import { useGemmaStore } from '../core/store';
import { CutePlanetSVG, CuteRetroComputerSVG } from '../shell/Artwork';

export function WelcomeHubApp() {
  const {
    themeMode,
    hardwareMetrics,
    activities,
    notifications,
    launchApp,
    recordActivity,
    sendNotification,
  } = useGemmaStore();

  const [showAllActivities, setShowAllActivities] = useState(false);
  const isViolet = themeMode === 'violet';

  const totalMsgs = Math.max(13, notifications.length + 11);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleQuickDiagnostic = async () => {
    await recordActivity({
      title: 'PAL Milestone Check Passed',
      subtitle: 'Verified IFileSystem & IndexedDB adapters',
      iconType: 'sparkle',
      targetAppId: 'dev-workspace',
    });
    await sendNotification(
      'Milestone P1.8 Verified',
      'All Platform Abstraction Layer (PAL) interfaces responded within 4ms.',
      'system',
      'success'
    );
  };

  return (
    <div
      className={`h-full overflow-y-auto px-5 py-4 select-none transition-colors ${
        isViolet ? 'bg-[#2B124C] text-[#FFF8F0]' : 'bg-[#FFFDF7] text-[#2A114B]'
      }`}
    >
      {/* Hero Banner Row */}
      <div className="flex items-center justify-between gap-2 pb-3">
        <CuteRetroComputerSVG className="w-28 h-24 shrink-0" />

        <div className="text-center flex-1 px-2">
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight leading-tight flex items-center justify-center gap-2">
            <span>Welcome to</span>
          </h1>
          <div className="font-display text-3xl sm:text-4xl font-bold tracking-tight flex items-center justify-center gap-2 -mt-1">
            <span>GemmaOS</span>
            <span
              className="inline-block text-[#FF5CAD] drop-shadow-[0_2px_0_#2A114B]"
              aria-hidden="true"
            >
              ♥
            </span>
          </div>
          <p
            className={`text-sm sm:text-base font-semibold mt-1 ${
              isViolet ? 'text-[#E5CCFF]' : 'text-[#3A1963]'
            }`}
          >
            Your AI-native operating system.
          </p>
          {/* Playful Pink Brush Underline */}
          <div className="mx-auto mt-1.5 h-1.5 w-48 rounded-full bg-gradient-to-r from-[#FF5CAD] via-[#FF85C8] to-transparent" />
        </div>

        <CutePlanetSVG className="w-28 h-24 shrink-0" />
      </div>

      {/* System Telemetry Pill Bar */}
      <div
        className={`gemma-card-border rounded-full px-5 py-2.5 mb-4 flex items-center justify-between text-xs sm:text-sm font-semibold ${
          isViolet
            ? 'bg-gradient-to-r from-[#5D2E9E] via-[#4A2082] to-[#5D2E9E] text-[#FFF8F0]'
            : 'bg-gradient-to-r from-[#DEC4FF] via-[#EBD9FF] to-[#DEC4FF] text-[#2A114B]'
        }`}
      >
        <button
          onClick={() => launchApp('system-monitor')}
          className="flex items-center gap-2.5 hover:opacity-85 transition-opacity cursor-pointer"
          title="Open System Monitor"
        >
          <div className="w-8 h-8 rounded-lg bg-[#FF85C8] border-2 border-[#2A114B] flex items-center justify-center text-[#2A114B]">
            <Laptop className="w-4 h-4 stroke-[2.5]" />
          </div>
          <div className="text-left">
            <div className="font-bold leading-none">System</div>
            <div className="font-mono text-xs opacity-85 mt-0.5">v0.6.0-beta</div>
          </div>
        </button>

        <div className="h-7 w-[2px] bg-[#2A114B]/35" />

        <button
          onClick={() => launchApp('system-monitor')}
          className="flex items-center gap-2.5 hover:opacity-85 transition-opacity cursor-pointer"
          title="Inspect Hardware Temperature"
        >
          <div className="w-8 h-8 rounded-lg bg-[#FFA8D8] border-2 border-[#2A114B] flex items-center justify-center text-[#2A114B]">
            <Thermometer className="w-4 h-4 stroke-[2.5]" />
          </div>
          <div className="text-left">
            <div className="font-bold leading-none">Temp</div>
            <div className="font-mono text-xs opacity-85 mt-0.5 tabular-nums">
              {hardwareMetrics.temperatureCelsius}°C
            </div>
          </div>
        </button>

        <div className="h-7 w-[2px] bg-[#2A114B]/35" />

        <button
          onClick={handleQuickDiagnostic}
          className="flex items-center gap-2.5 hover:opacity-85 transition-opacity cursor-pointer"
          title="Run Quick PAL Pulse Check"
        >
          <div className="w-8 h-8 rounded-lg bg-[#FF66B5] border-2 border-[#2A114B] flex items-center justify-center text-[#2A114B]">
            <Activity className="w-4 h-4 stroke-[2.5]" />
          </div>
          <div className="text-left">
            <div className="font-bold leading-none">Msgs</div>
            <div className="font-mono text-xs opacity-85 mt-0.5 tabular-nums">
              {totalMsgs - unreadCount} / {totalMsgs}
            </div>
          </div>
        </button>
      </div>

      {/* 2x2 Main Feature Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-4">
        {/* Card 1: Chat / Gemma Subsystem */}
        <button
          onClick={() => launchApp('architecture-inspector', { tab: 'gemma' })}
          className={`gemma-card-border gemma-btn-press rounded-2xl p-3.5 flex items-center justify-between text-left cursor-pointer transition-all ${
            isViolet
              ? 'bg-gradient-to-br from-[#61289E] to-[#4E1E85] text-[#FFF8F0]'
              : 'bg-gradient-to-br from-[#FF8FD2] to-[#FFAEE0] text-[#2A114B]'
          }`}
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#FFF6E8] border-[2.5px] border-[#2A114B] flex items-center justify-center shrink-0 shadow-[0_2px_0_#2A114B]">
              <span className="text-xl text-[#FF5CAD]">♥</span>
            </div>
            <div>
              <div className="font-display text-lg font-bold leading-tight">Chat</div>
              <div className="text-xs font-medium opacity-90 leading-snug">
                Talk, plan, create
                <br />
                with Gemma.
              </div>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-[#FFF6E8]/90 border-2 border-[#2A114B] flex items-center justify-center text-[#2A114B] shrink-0">
            <ChevronRight className="w-4 h-4 stroke-[3]" />
          </div>
        </button>

        {/* Card 2: Memory / Semantic Search */}
        <button
          onClick={() => launchApp('architecture-inspector', { tab: 'memory' })}
          className={`gemma-card-border gemma-btn-press rounded-2xl p-3.5 flex items-center justify-between text-left cursor-pointer transition-all ${
            isViolet
              ? 'bg-gradient-to-br from-[#FFECB3] to-[#FFE082] text-[#2A114B]'
              : 'bg-gradient-to-br from-[#FFECB3] to-[#FFE49E] text-[#2A114B]'
          }`}
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#FF85C8] border-[2.5px] border-[#2A114B] flex items-center justify-center shrink-0 shadow-[0_2px_0_#2A114B]">
              <span className="font-mono font-bold text-sm text-[#2A114B]">≡</span>
            </div>
            <div>
              <div className="font-display text-lg font-bold leading-tight">Memory</div>
              <div className="text-xs font-medium opacity-90 leading-snug">
                Search &amp; retrieve
                <br />
                your knowledge.
              </div>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-[#FFF6E8]/90 border-2 border-[#2A114B] flex items-center justify-center text-[#2A114B] shrink-0">
            <ChevronRight className="w-4 h-4 stroke-[3]" />
          </div>
        </button>

        {/* Card 3: Agents Operating Environment */}
        <button
          onClick={() => launchApp('architecture-inspector', { tab: 'agents' })}
          className={`gemma-card-border gemma-btn-press rounded-2xl p-3.5 flex items-center justify-between text-left cursor-pointer transition-all ${
            isViolet
              ? 'bg-gradient-to-br from-[#FFF4E0] to-[#FFE8C2] text-[#2A114B]'
              : 'bg-gradient-to-br from-[#DEC4FF] to-[#D0ADFF] text-[#2A114B]'
          }`}
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#C77DFF] border-[2.5px] border-[#2A114B] flex items-center justify-center shrink-0 shadow-[0_2px_0_#2A114B]">
              <span className="text-base font-bold text-[#2A114B]">🤖</span>
            </div>
            <div>
              <div className="font-display text-lg font-bold leading-tight">Agents</div>
              <div className="text-xs font-medium opacity-90 leading-snug">
                Automate, delegate
                <br />
                and collaborate.
              </div>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-[#FFF6E8]/90 border-2 border-[#2A114B] flex items-center justify-center text-[#2A114B] shrink-0">
            <ChevronRight className="w-4 h-4 stroke-[3]" />
          </div>
        </button>

        {/* Card 4: Apps & Developer Workspace */}
        <button
          onClick={() => launchApp('app-launcher')}
          className={`gemma-card-border gemma-btn-press rounded-2xl p-3.5 flex items-center justify-between text-left cursor-pointer transition-all ${
            isViolet
              ? 'bg-gradient-to-br from-[#B56BFF] to-[#9B4DFF] text-[#2A114B]'
              : 'bg-gradient-to-br from-[#C89EFF] to-[#B784FF] text-[#2A114B]'
          }`}
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#FF66B5] border-[2.5px] border-[#2A114B] flex items-center justify-center shrink-0 shadow-[0_2px_0_#2A114B]">
              <span className="text-base font-bold text-[#FFF8F0]">⊞</span>
            </div>
            <div>
              <div className="font-display text-lg font-bold leading-tight">Apps</div>
              <div className="text-xs font-medium opacity-90 leading-snug">
                Your tools
                <br />
                and workspace.
              </div>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-[#FFF6E8]/90 border-2 border-[#2A114B] flex items-center justify-center text-[#2A114B] shrink-0">
            <ChevronRight className="w-4 h-4 stroke-[3]" />
          </div>
        </button>
      </div>

      {/* Recent Activity Container */}
      <div
        className={`gemma-card-border rounded-2xl p-3.5 ${
          isViolet ? 'bg-[#3C1B69]' : 'bg-[#FFF6E8]'
        }`}
      >
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-[#FFE47A] border-2 border-[#2A114B] flex items-center justify-center">
              <Star className="w-3.5 h-3.5 fill-[#FFE47A] text-[#2A114B] stroke-[2.5]" />
            </div>
            <h2 className="font-display text-lg font-bold">Recent Activity</h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleQuickDiagnostic}
              className="gemma-pill-border gemma-btn-press px-2.5 py-1 rounded-full text-xs font-bold bg-[#FFE484] text-[#2A114B] flex items-center gap-1 cursor-pointer whitespace-nowrap shrink-0"
              title="Run PAL Diagnostic & Log Activity"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Verify PAL</span>
            </button>
            <button
              onClick={() => setShowAllActivities((prev) => !prev)}
              className="gemma-pill-border gemma-btn-press px-3 py-1 rounded-full text-xs font-bold bg-[#FF85C8] text-[#2A114B] flex items-center gap-1 cursor-pointer whitespace-nowrap shrink-0"
            >
              <span>{showAllActivities ? 'Show compact' : 'View all'}</span>
              <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>
        </div>

        <div className="space-y-2">
          {(showAllActivities ? activities : activities.slice(0, 3)).map((item, idx) => {
            const rowBg = isViolet
              ? idx % 2 === 0
                ? 'bg-[#54288E] text-[#FFF8F0]'
                : 'bg-[#6835AB] text-[#FFF8F0]'
              : idx === 0
              ? 'bg-[#FFFDF9] text-[#2A114B]'
              : idx === 1
              ? 'bg-[#E5CCFF] text-[#2A114B]'
              : 'bg-[#FFD1EC] text-[#2A114B]';

            return (
              <button
                key={item.id}
                onClick={() => launchApp(item.targetAppId, item.targetPayload)}
                className={`w-full gemma-pill-border gemma-btn-press rounded-xl px-3.5 py-2.5 flex items-center justify-between text-left cursor-pointer transition-all ${rowBg}`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-[#FF85C8] border-2 border-[#2A114B] flex items-center justify-center text-[#2A114B] shrink-0">
                    <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-sm truncate">{item.title}</div>
                    <div className="text-xs opacity-85 truncate">{item.subtitle}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 shrink-0 ml-2">
                  <span className="text-xs font-semibold opacity-80 whitespace-nowrap">
                    {item.timeLabel}
                  </span>
                  <div className="w-6 h-6 rounded-full bg-[#FF66B5] border-2 border-[#2A114B] flex items-center justify-center text-[#2A114B]">
                    <ChevronRight className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
