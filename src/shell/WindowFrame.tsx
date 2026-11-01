/**
 * GEMMAOS — WINDOW MANAGER FRAME COMPONENT
 * Implements window dragging, 8-direction / corner resizing, z-index focus stacking,
 * minimize, maximize/restore, and close with the signature toy-like pink header bar
 * and chunky deep-plum (#2A114B) borders.
 */

import React, { useRef } from 'react';
import { Minus, Square, X } from 'lucide-react';
import { useGemmaStore, WindowInstance } from '../core/store';

export function WindowFrame({
  windowInstance,
  children,
}: {
  windowInstance: WindowInstance;
  children: React.ReactNode;
}) {
  const {
    themeMode,
    focusedWindowId,
    focusWindow,
    closeWindow,
    toggleMinimizeWindow,
    toggleMaximizeWindow,
    updateWindowBounds,
  } = useGemmaStore();

  const isViolet = themeMode === 'violet';
  const isFocused = focusedWindowId === windowInstance.id;
  const dragStartRef = useRef<{
    mouseX: number;
    mouseY: number;
    winX: number;
    winY: number;
  } | null>(null);

  const resizeStartRef = useRef<{
    mouseX: number;
    mouseY: number;
    winW: number;
    winH: number;
  } | null>(null);

  if (windowInstance.isMinimized) {
    return null;
  }

  const handleHeaderMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) return;
    focusWindow(windowInstance.id);
    if (windowInstance.isMaximized) return;

    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      winX: windowInstance.x,
      winY: windowInstance.y,
    };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!dragStartRef.current) return;
      const dx = moveEvent.clientX - dragStartRef.current.mouseX;
      const dy = moveEvent.clientY - dragStartRef.current.mouseY;
      const nextX = Math.max(150, Math.min(window.innerWidth - 180, dragStartRef.current.winX + dx));
      const nextY = Math.max(46, Math.min(window.innerHeight - 120, dragStartRef.current.winY + dy));
      updateWindowBounds(windowInstance.id, { x: nextX, y: nextY });
    };

    const handleMouseUp = () => {
      dragStartRef.current = null;
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    focusWindow(windowInstance.id);
    if (windowInstance.isMaximized) return;

    resizeStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      winW: windowInstance.width,
      winH: windowInstance.height,
    };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!resizeStartRef.current) return;
      const dw = moveEvent.clientX - resizeStartRef.current.mouseX;
      const dh = moveEvent.clientY - resizeStartRef.current.mouseY;
      const nextW = Math.max(
        windowInstance.minWidth,
        Math.min(window.innerWidth - windowInstance.x - 16, resizeStartRef.current.winW + dw)
      );
      const nextH = Math.max(
        windowInstance.minHeight,
        Math.min(window.innerHeight - windowInstance.y - 90, resizeStartRef.current.winH + dh)
      );
      updateWindowBounds(windowInstance.id, { width: nextW, height: nextH });
    };

    const handleMouseUp = () => {
      resizeStartRef.current = null;
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const style: React.CSSProperties = windowInstance.isMaximized
    ? {
        left: 162,
        top: 52,
        width: 'calc(100vw - 178px)',
        height: 'calc(100vh - 156px)',
        zIndex: windowInstance.zIndex,
      }
    : {
        left: windowInstance.x,
        top: windowInstance.y,
        width: windowInstance.width,
        height: windowInstance.height,
        zIndex: windowInstance.zIndex,
      };

  return (
    <div
      style={style}
      onMouseDown={() => focusWindow(windowInstance.id)}
      className={`fixed rounded-[28px] gemma-window-border flex flex-col overflow-hidden transition-shadow duration-150 ${
        isViolet ? 'bg-[#2B124C]' : 'bg-[#FFFDF7]'
      } ${isFocused ? 'ring-2 ring-[#FFE47A]/70' : 'opacity-95'}`}
    >
      {/* Window Title Bar (Matching Reference Pink/Magenta Header) */}
      <div
        onMouseDown={handleHeaderMouseDown}
        onDoubleClick={() => toggleMaximizeWindow(windowInstance.id)}
        className={`h-11 px-4 border-b-[3.5px] border-[#2A114B] flex items-center justify-between cursor-grab active:cursor-grabbing shrink-0 ${
          isViolet
            ? 'bg-gradient-to-r from-[#8A3FFC] via-[#C94BFF] to-[#FF5CAD]'
            : 'bg-gradient-to-r from-[#FF66B5] via-[#FF7AC2] to-[#FF94D0]'
        }`}
      >
        <div className="flex items-center gap-2 min-w-0">
          <span className="font-display text-sm sm:text-base font-bold text-[#2A114B] truncate">
            {windowInstance.appId === 'welcome-hub' ? '' : windowInstance.title}
          </span>
        </div>

        {/* Chunky Toy-like Window Control Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => toggleMinimizeWindow(windowInstance.id)}
            className="w-8 h-6 rounded-full bg-[#FFF6E8] border-[2.5px] border-[#2A114B] shadow-[0_2px_0_#2A114B] flex items-center justify-center text-[#2A114B] hover:bg-[#FFE484] gemma-btn-press cursor-pointer"
            title="Minimize Window"
            aria-label="Minimize Window"
          >
            <Minus className="w-3.5 h-3.5 stroke-[3.5]" />
          </button>

          <button
            onClick={() => toggleMaximizeWindow(windowInstance.id)}
            className="w-8 h-6 rounded-full bg-[#FFF6E8] border-[2.5px] border-[#2A114B] shadow-[0_2px_0_#2A114B] flex items-center justify-center text-[#2A114B] hover:bg-[#DEC4FF] gemma-btn-press cursor-pointer"
            title="Maximize / Restore Window"
            aria-label="Maximize Window"
          >
            <Square className="w-3 h-3 stroke-[3.5]" />
          </button>

          <button
            onClick={() => closeWindow(windowInstance.id)}
            className="w-8 h-6 rounded-full bg-[#FF5CAD] border-[2.5px] border-[#2A114B] shadow-[0_2px_0_#2A114B] flex items-center justify-center text-[#2A114B] hover:bg-[#FF3D9A] gemma-btn-press cursor-pointer"
            title="Close Window"
            aria-label="Close Window"
          >
            <X className="w-3.5 h-3.5 stroke-[3.5]" />
          </button>
        </div>
      </div>

      {/* Window Content Viewport */}
      <div className="flex-1 min-h-0 overflow-hidden relative">{children}</div>

      {/* Corner Resize Handle */}
      {!windowInstance.isMaximized && (
        <div
          onMouseDown={handleResizeMouseDown}
          className="absolute bottom-1 right-1 w-5 h-5 cursor-nwse-resize flex items-end justify-end p-0.5 opacity-60 hover:opacity-100"
          title="Resize Window"
        >
          <svg viewBox="0 0 12 12" className="w-3.5 h-3.5">
            <path
              d="M10 2L2 10M10 6L6 10M10 10L10 10"
              stroke="#2A114B"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          </svg>
        </div>
      )}
    </div>
  );
}
