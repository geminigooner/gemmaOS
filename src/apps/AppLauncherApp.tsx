/**
 * GEMMAOS — APPLICATION 3: APPLICATION LAUNCHER & REGISTRY
 * Centralized view of all registered GemmaOS applications, metadata,
 * active window instances, and permission contracts.
 */

import React, { useState } from 'react';
import { Search, Play, Square, ExternalLink } from 'lucide-react';
import { APP_MANIFESTS, AppId, useGemmaStore } from '../core/store';

export function AppLauncherApp() {
  const { themeMode, windows, launchApp, closeWindow } = useGemmaStore();
  const isViolet = themeMode === 'violet';

  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  const categories = ['All', 'System', 'Development', 'Utilities', 'AI Infrastructure'];

  const allApps = Object.values(APP_MANIFESTS).filter((app) => {
    const matchesCat = categoryFilter === 'All' || app.category === categoryFilter;
    const q = query.trim().toLowerCase();
    const matchesQuery =
      !q ||
      app.name.toLowerCase().includes(q) ||
      app.description.toLowerCase().includes(q) ||
      app.category.toLowerCase().includes(q);
    return matchesCat && matchesQuery;
  });

  return (
    <div
      className={`h-full flex flex-col p-4 select-none ${
        isViolet ? 'bg-[#2B124C] text-[#FFF8F0]' : 'bg-[#FFFDF7] text-[#2A114B]'
      }`}
    >
      {/* Top Filter & Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`gemma-pill-border gemma-btn-press px-3 py-1 rounded-full text-xs font-bold cursor-pointer whitespace-nowrap shrink-0 ${
                categoryFilter === cat
                  ? 'bg-[#FF66B5] text-[#2A114B]'
                  : isViolet
                  ? 'bg-[#3C1B69] text-[#FFF8F0]'
                  : 'bg-[#FFF6E8] text-[#2A114B]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 text-[#2A114B]/60 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter registered apps..."
            className="gemma-pill-border pl-8 pr-3 py-1.5 rounded-full bg-[#FFFDF9] text-[#2A114B] text-xs font-medium focus:outline-none w-52"
          />
        </div>
      </div>

      {/* Application Cards Grid */}
      <div className="flex-1 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-3.5 content-start">
        {allApps.map((app) => {
          const runningWin = windows.find((w) => w.appId === app.id);
          return (
            <div
              key={app.id}
              className={`gemma-card-border rounded-2xl p-4 flex flex-col justify-between ${
                isViolet ? 'bg-[#3C1B69]' : 'bg-[#FFF6E8]'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div>
                    <h3 className="font-display text-base font-bold leading-tight">
                      {app.name}
                    </h3>
                    <div className="text-xs opacity-75 font-mono">
                      {app.category} · v{app.version}
                    </div>
                  </div>
                  {runningWin && (
                    <span className="px-2 py-0.5 rounded-md bg-[#80ED99] border-2 border-[#2A114B] text-[#2A114B] font-mono text-[10px] font-bold shrink-0">
                      RUNNING
                    </span>
                  )}
                </div>

                <p className="text-xs opacity-85 leading-relaxed mb-3">{app.description}</p>
              </div>

              <div className="pt-2 border-t-2 border-[#2A114B]/15 flex items-center justify-between gap-2">
                <div className="text-[11px] font-mono opacity-75 truncate">
                  PAL: {app.permissions.join(' · ')}
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {runningWin && (
                    <button
                      onClick={() => closeWindow(runningWin.id)}
                      className="gemma-pill-border gemma-btn-press p-1.5 rounded-lg bg-[#FFA8D8] text-[#2A114B] cursor-pointer"
                      title="Terminate Application Window"
                    >
                      <Square className="w-3.5 h-3.5 fill-current" />
                    </button>
                  )}
                  <button
                    onClick={() => launchApp(app.id as AppId)}
                    className="gemma-pill-border gemma-btn-press px-3 py-1.5 rounded-lg bg-[#FF66B5] text-[#2A114B] text-xs font-bold flex items-center gap-1 cursor-pointer whitespace-nowrap shrink-0"
                  >
                    {runningWin ? (
                      <>
                        <ExternalLink className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>Focus</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>Launch</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
