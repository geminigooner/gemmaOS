/**
 * GEMMAOS — APPLICATION 5: SYSTEM MONITOR
 * Real-time telemetry via PAL IHardwareProvider, active Window/Process manager,
 * and live Event Bus message stream. All numeric metrics use tabular-nums.
 */

import React, { useEffect } from 'react';
import { Cpu, HardDrive, Thermometer, Activity, XCircle, Radio } from 'lucide-react';
import { useGemmaStore } from '../core/store';

export function SystemMonitorApp() {
  const {
    themeMode,
    hardwareMetrics,
    windows,
    eventLogs,
    refreshHardwareTelemetry,
    closeWindow,
    focusWindow,
  } = useGemmaStore();

  const isViolet = themeMode === 'violet';

  useEffect(() => {
    refreshHardwareTelemetry();
    const timer = setInterval(() => {
      refreshHardwareTelemetry();
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  const ramPercent = Math.round(
    (hardwareMetrics.memoryUsedMB / hardwareMetrics.memoryTotalMB) * 100
  );

  return (
    <div
      className={`h-full overflow-y-auto p-4 space-y-4 select-none ${
        isViolet ? 'bg-[#2B124C] text-[#FFF8F0]' : 'bg-[#FFFDF7] text-[#2A114B]'
      }`}
    >
      {/* Top 4 Telemetry Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div
          className={`gemma-card-border rounded-2xl p-3.5 ${
            isViolet ? 'bg-[#3C1B69]' : 'bg-[#FFF6E8]'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-bold opacity-80 mb-1">
            <span>CPU Load</span>
            <Cpu className="w-4 h-4 text-[#FF5CAD]" />
          </div>
          <div className="font-mono text-2xl font-bold tabular-nums">
            {hardwareMetrics.cpuUsagePercent}%
          </div>
          <div className="text-[11px] font-mono opacity-75 mt-0.5 tabular-nums">
            {hardwareMetrics.cpuCores} Logical Cores
          </div>
        </div>

        <div
          className={`gemma-card-border rounded-2xl p-3.5 ${
            isViolet ? 'bg-[#3C1B69]' : 'bg-[#FFF6E8]'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-bold opacity-80 mb-1">
            <span>Memory</span>
            <Activity className="w-4 h-4 text-[#C77DFF]" />
          </div>
          <div className="font-mono text-2xl font-bold tabular-nums">{ramPercent}%</div>
          <div className="text-[11px] font-mono opacity-75 mt-0.5 tabular-nums">
            {hardwareMetrics.memoryUsedMB} / {hardwareMetrics.memoryTotalMB} MB
          </div>
        </div>

        <div
          className={`gemma-card-border rounded-2xl p-3.5 ${
            isViolet ? 'bg-[#3C1B69]' : 'bg-[#FFF6E8]'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-bold opacity-80 mb-1">
            <span>Thermal</span>
            <Thermometer className="w-4 h-4 text-[#FF85C8]" />
          </div>
          <div className="font-mono text-2xl font-bold tabular-nums">
            {hardwareMetrics.temperatureCelsius}°C
          </div>
          <div className="text-[11px] font-mono opacity-75 mt-0.5">
            Target: {hardwareMetrics.platformTarget}
          </div>
        </div>

        <div
          className={`gemma-card-border rounded-2xl p-3.5 ${
            isViolet ? 'bg-[#3C1B69]' : 'bg-[#FFF6E8]'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-bold opacity-80 mb-1">
            <span>VFS Storage</span>
            <HardDrive className="w-4 h-4 text-[#FFE484]" />
          </div>
          <div className="font-mono text-2xl font-bold tabular-nums">
            {hardwareMetrics.storageUsedMB} MB
          </div>
          <div className="text-[11px] font-mono opacity-75 mt-0.5 tabular-nums">
            Quota: {hardwareMetrics.storageQuotaMB} MB
          </div>
        </div>
      </div>

      {/* Active Window Processes Table */}
      <div
        className={`gemma-card-border rounded-2xl p-4 ${
          isViolet ? 'bg-[#3C1B69]' : 'bg-[#FFF6E8]'
        }`}
      >
        <div className="font-display text-base font-bold mb-2.5">
          Active Window Processes ({windows.length})
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b-2 border-[#2A114B]/25 font-mono opacity-75">
                <th className="py-1.5 px-2">PID / Window ID</th>
                <th className="py-1.5 px-2">Application</th>
                <th className="py-1.5 px-2">Geometry</th>
                <th className="py-1.5 px-2">State</th>
                <th className="py-1.5 px-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="font-mono tabular-nums">
              {windows.map((win) => (
                <tr
                  key={win.id}
                  onClick={() => focusWindow(win.id)}
                  className="border-b border-[#2A114B]/15 hover:bg-[#FF85C8]/20 cursor-pointer"
                >
                  <td className="py-2 px-2 truncate max-w-[140px]">{win.id}</td>
                  <td className="py-2 px-2 font-sans font-bold">{win.title}</td>
                  <td className="py-2 px-2">
                    {win.width}×{win.height} @ ({win.x},{win.y})
                  </td>
                  <td className="py-2 px-2">
                    {win.isMinimized ? 'MINIMIZED' : win.isMaximized ? 'MAXIMIZED' : 'ACTIVE'}
                  </td>
                  <td className="py-2 px-2 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        closeWindow(win.id);
                      }}
                      className="px-2 py-0.5 rounded bg-[#FF66B5] border border-[#2A114B] text-[#2A114B] font-sans font-bold text-[11px] inline-flex items-center gap-1 cursor-pointer"
                    >
                      <XCircle className="w-3 h-3" />
                      <span>End</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Live Event Bus Stream */}
      <div
        className={`gemma-card-border rounded-2xl p-4 ${
          isViolet ? 'bg-[#3C1B69]' : 'bg-[#FFF6E8]'
        }`}
      >
        <div className="flex items-center justify-between mb-2.5">
          <div className="font-display text-base font-bold flex items-center gap-2">
            <Radio className="w-4 h-4 text-[#FF5CAD]" />
            <span>Core Event Bus Telemetry Stream</span>
          </div>
          <span className="font-mono text-xs opacity-75 tabular-nums">
            {eventLogs.length} events recorded
          </span>
        </div>

        <div className="space-y-1.5 max-h-44 overflow-y-auto font-mono text-xs">
          {eventLogs.map((evt) => (
            <div
              key={evt.id}
              className={`px-3 py-1.5 rounded-lg border border-[#2A114B]/30 flex items-center justify-between gap-2 ${
                isViolet ? 'bg-[#2B124C]' : 'bg-[#FFFDF9]'
              }`}
            >
              <div className="truncate">
                <span className="font-bold text-[#FF5CAD]">[{evt.topic}]</span>{' '}
                <span className="opacity-75">{evt.source}:</span> {evt.summary}
              </div>
              <span className="text-[11px] opacity-65 shrink-0 tabular-nums">
                {new Date(evt.timestamp).toLocaleTimeString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
