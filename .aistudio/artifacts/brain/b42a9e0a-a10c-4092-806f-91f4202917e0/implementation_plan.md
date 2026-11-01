# GemmaOS — Phase 1: Desktop Foundation & Platform Abstraction Layer

GemmaOS Phase 1 delivers a modular, browser-accessible AI-native desktop operating environment engineered with strict separation of concerns and a complete Platform Abstraction Layer (PAL) so all applications and core services can migrate cleanly to a native Linux desktop in Phase 5 without rewriting business logic.

## User Review & Critical Decisions

> [!IMPORTANT]
> The following architectural and visual decisions have been confirmed from your requirements and reference designs:

- **Confirmed Scope (Phase 1 Desktop Foundation)**: Full implementation of Milestones P1.1 through P1.8—establishing the Platform Abstraction Layer (`IFileSystem`, `IStorageProvider`, `INotificationService`, `IModelRuntime`, `IHardwareProvider`, `IExecutionEnvironment`), Core System Services, IndexedDB Persistence, Window Manager, Desktop Shell, and the 5 initial applications plus the Welcome Hub.
- **Confirmed Visual Identity (Dual-Theme Live Toggle)**: Support for both uploaded reference aesthetics with instant switching in System Settings and top-bar quick toggle:
  - **Warm Cream Day Mode** (Default): Saturated lavender/violet sky backdrop, warm cream (`#FFF8EE`) window surfaces, bubblegum/hot pink headers (`#FF6BB5`), pastel yellow/lavender action cards, and thick deep-plum (`#2D124D`) outlines with chunky toy-like rounded geometry.
  - **Deep Violet Night Mode**: Starry midnight-purple backdrop, rich violet (`#34195B`) window surfaces, glowing magenta-pink headers, and crisp cream typography with deep-plum borders.
- **Confirmed Shell Layout (Welcome Hub + Dual Docks)**: Includes the top status bar (`GemmaOS` brand, system tray indicators, live clock, and quick search), the vertical Left Rail Dock (`Home`, `Files`, `Apps`, `AI`, `Agents`, `Models`, `Memory`, `Settings`), the floating Bottom Quick-Launch Dock, and the `Welcome to GemmaOS` interactive dashboard window.

---

## 1. Overview & Core Concept

- **What It Does**: Provides a cohesive, interactive desktop operating system inside the browser featuring multi-window management, a virtual hierarchical filesystem persisted in IndexedDB, system telemetry, event-driven notifications, customizable themes, and six integrated applications (Welcome Hub + 5 Phase 1 core apps: File Explorer, System Settings, Application Launcher, Developer Workspace, and System Monitor).
- **Target Audience / Persona**: Systems engineers, AI developers, and power users building and testing an extensible OS environment designed for seamless transition from browser-hosted Phase 1 to Gemma/EmbeddingGemma intelligence (Phase 2), Agent Operating Environment (Phase 3), and bootable Linux (Phases 5–6).
- **Key Value**: Enforces strict dependency boundaries where no application or core service directly invokes browser globals (`window`, `localStorage`, ` indexedDB`, `navigator`), routing all platform calls through typed PAL interfaces backed by browser adapters.

---

## 2. User Experience & Visual Design

### Key User Flows
1. **Desktop Boot & Welcome Hub**: Upon startup, thePersistence Service restores saved user theme preferences, virtual files, and window states from IndexedDB. The `Welcome to GemmaOS` window opens at center stage displaying real-time system version (`v0.6.0-beta`), hardware temperature/status via `IHardwareProvider`, unread notification count, quick-launch cards (`Chat`, `Memory`, `Agents`, `Apps`), and a live `Recent Activity` feed recorded by the Event Bus.
2. **Multi-Window Workspace Management**: Users launch apps from the Left Rail, Bottom Dock, Welcome Hub cards, or Application Launcher. Each window supports dragging via title bar, 8-direction resizing, focus elevation (z-index stacking), minimize-to-dock, maximize/restore, and close.
3. **Virtual Filesystem & Code Editing**: Users browse directories, create folders/files, rename, and delete items in **File Explorer**, or open files directly inside **Developer Workspace** to edit TypeScript/JSON/Markdown files, inspect PAL contracts, and execute sandboxed diagnostic scripts via `IExecutionEnvironment`.
4. **Live Theme & System Customization**: Opening **System Settings** lets users switch between *Warm Cream* and *Deep Violet* themes, customize desktop wallpaper scenes (Dreamy Twilight Clouds, Sakura Starlight, Cyber Lavender Grid), configure notification policies, inspect application permissions, and export/reset persistent IndexedDB storage.

### Visual Identity & Theme
- **Aesthetic Direction**: Playful, cohesive 2D illustrated toy-like desktop environment with crisp vector iconography, celestial decorative accents (crescent moon, stars, clouds, cherry blossoms), thick `3px` deep-plum borders (`#2A114B`), and tactile offset block shadows (`0 4px 0 #2A114B`).
- **Color Palette & Mood**:
  - `--bg-desktop`: Dreamy twilight gradient (`#7B3FE4` → `#C058F5` → `#FF77C8`)
  - `--surface-window`: `#FFF9F0` (Warm Cream mode) / `#32195A` (Deep Violet mode)
  - `--surface-header`: Linear gradient `#FF66B3` to `#FF85C8` (Warm Cream) / `#8A3FFC` to `#FF55B8` (Deep Violet)
  - `--border-plum`: `#2A114B` (`3px solid` outer frames, `2px solid` inner cards)
  - `--accent-pink`: `#FF5CAD` (Primary interactive pills, active indicators)
  - `--accent-butter`: `#FFE699` (Warm highlight cards & folder icons)
  - `--accent-lavender`: `#DEC4FF` (Secondary interactive cards & badges)
- **Typography & Hierarchy**:
  - *Display & Window Titles*: `Fredoka` / `Plus Jakarta Sans` (Bold 700, rounded friendly geometry with tight tracking).
  - *UI Body & Controls*: `Plus Jakarta Sans` (Medium 500 / SemiBold 600 for crisp legibility at 13px–15px).
  - *Code & Telemetry*: `JetBrains Mono` with `tabular-nums` for System Monitor metrics, Developer Workspace editor, and clock/timestamps.
- **Interactive Feedback & Motion**: Spring-physics window open/minimize/maximize transitions via Framer Motion (`transform` and `opacity` only, settling within 180ms), tactile button press depression (`translate-y-0.5`), and toast notifications sliding from the top-right system tray.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Strict Platform Abstraction Layer (PAL) Dependency Injection**
  - *Chosen Approach*: All platform APIs (`IFileSystem`, `IStorageProvider`, `INotificationService`, `IModelRuntime`, `IHardwareProvider`, `IExecutionEnvironment`) are instantiated in the Infrastructure Layer and injected into Core Services and Application contexts via a central PAL Registry.
  - *Why*: Guarantees zero coupling to browser APIs inside application logic, satisfying Acceptance Criteria #9 and #11 for Linux migration.
  - *Alternatives Considered*: Direct `localStorage` or `indexedDB` calls inside Zustand stores—rejected because it violates Phase 1 architectural rules and complicates Phase 5 native Linux adapter replacement.
- **Decision 2: Dual-Layer Persistence (IndexedDB + In-Memory Reactive Cache)**
  - *Chosen Approach*: Browser adapters persist virtual filesystem nodes, settings, window layouts, and activity logs in IndexedDB (`gemmaos_db`), while syncing with reactive Zustand stores for zero-latency UI rendering.
  - *Why*: IndexedDB supports large structured objects and asynchronous transactions (mirroring future SQLite/filesystem storage on Linux), while Zustand keeps 60fps window dragging and UI updates snappy.
- **Decision 3: Phase 2/3 Forward-Compatible Stubs in Left Rail**
  - *Chosen Approach*: Left Rail buttons for `AI`, `Agents`, `Models`, and `Memory` open dedicated Phase 1 Architecture Inspector / Readiness views inside the desktop (connected to `IModelRuntime` status checks and PAL contract diagnostics) while clearly marking Phase 2/3 runtime capabilities as `PLANNED` per Implementation Rule #8.
  - *Why*: Matches the uploaded reference mockup's exact navigation rail while strictly honoring Rule #8 ("Never represent planned functionality as implemented") and Rule #10 ("Keep Phase 2 AI integration requirements in mind without prematurely implementing them").

---

## 4. Technical Architecture & Data Strategy *(Technical Reference)*

### Architecture & Component Diagram

```
┌────────────────────────────────────────────────────────────────────────────┐
│                        1. PRESENTATION LAYER (Shell & UI)                  │
│  ┌──────────────────┐  ┌──────────────────────┐  ┌──────────────────────┐  │
│  │ Top System Bar   │  │ Desktop Canvas &     │  │ Left Rail & Bottom   │  │
│  │ (Clock, Tray,    │  │ Window Manager       │  │ Quick-Launch Docks   │  │
│  │  Search, Theme)  │  │ (Drag/Resize/Z-Stack)│  │ (App Indicators)     │  │
│  └────────┬─────────┘  └──────────┬───────────┘  └──────────┬───────────┘  │
└───────────┼───────────────────────┼─────────────────────────┼──────────────┘
            │                       │                         │
┌───────────▼───────────────────────▼─────────────────────────▼──────────────┐
│                          2. APPLICATION LAYER                              │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │ Application Registry & Execution Context Provider                    │  │
│  └────┬────────────┬────────────┬────────────┬─────────────┬────────────┘  │
│       ▼            ▼            ▼            ▼             ▼               │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌──────────┐  ┌──────────┐         │
│  │ Welcome │  │  File   │  │ System  │  │Developer │  │  System  │         │
│  │   Hub   │  │Explorer │  │Settings │  │Workspace │  │ Monitor  │         │
│  └─────────┘  └─────────┘  └─────────┘  └──────────┘  └──────────┘         │
└───────────────────────────────────┬────────────────────────────────────────┘
                                    │
┌───────────────────────────────────▼────────────────────────────────────────┐
│                         3. CORE SERVICES LAYER                             │
│  ┌────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────────────┐ │
│  │ Event Bus  │ │State Manager │ │Theme &       │ │ Permission, File &   │ │
│  │ (Pub/Sub)  │ │(Zustand Sync)│ │Settings Svc  │ │ Notification Svc     │ │
│  └────────────┘ └──────────────┘ └──────────────┘ └──────────────────────┘ │
└───────────────────────────────────┬────────────────────────────────────────┘
                                    │
┌───────────────────────────────────▼────────────────────────────────────────┐
│                   4. PLATFORM ABSTRACTION LAYER (PAL)                      │
│  • IFileSystem          • IStorageProvider       • INotificationService    │
│  • IHardwareProvider    • IExecutionEnvironment  • IModelRuntime (Contract)│
└───────────────────────────────────┬────────────────────────────────────────┘
                                    │
┌───────────────────────────────────▼────────────────────────────────────────┐
│                 5. INFRASTRUCTURE LAYER (Browser Adapters)                 │
│  ┌────────────────────────┐ ┌────────────────────┐ ┌────────────────────┐  │
│  │ IndexedDB VFS &        │ │ Browser Hardware & │ │ Sandbox Execution  │  │
│  │ Key-Value Store (`idb`)│ │ Notification APIs  │ │ & Runtime Adapters │  │
│  └────────────────────────┘ └────────────────────┘ └────────────────────┘  │
└────────────────────────────────────────────────────────────────────────────┘
```

### Data Model & State
- **Virtual File System (`VFSNode`)**: `{ id, name, path, parentPath, type: 'file' | 'directory', content, mimeType, size, createdAt, updatedAt, permissions }`, seeded with `/home/user/Documents`, `/home/user/Projects/gemmaos-arch.md`, `/etc/gemmaos/config.json`, and sample code files.
- **Window State (`WindowInstance`)**: `{ id, appId, title, icon, x, y, width, height, minWidth, minHeight, isMinimized, isMaximized, zIndex, instanceState }` persisted across reloads.
- **Application Metadata (`AppManifest`)**: `{ id, name, version, description, category, icon, defaultWindowSize, singleton, permissions: PermissionScope[] }`.
- **System Settings (`SystemConfig`)**: `{ themeMode: 'cream' | 'violet', wallpaperId: string, soundEffects: boolean, notificationsEnabled: boolean, dockAutoHide: boolean, scaleFactor: number }`.

### Interactive Component & State Mapping
- **Welcome Hub (`welcome-hub`)**: Displays live system metrics from `IHardwareProvider`, clickable action cards that launch or focus target apps via `ApplicationRegistry.launchApp()`, and a real-time `Recent Activity` list populated from `EventBus` history (with a working `View all` filter modal and ability to clear or inspect events).
- **File Explorer (`file-explorer`)**: Full directory tree navigation, breadcrumb bar, search filter, grid/list view toggle, create folder/file modal, inline file preview/rename, delete with confirmation, and "Open in Developer Workspace" action.
- **System Settings (`system-settings`)**: Interactive tabs for *Appearance* (Warm Cream vs. Deep Violet theme switch, wallpaper selector, UI scale), *Permissions* (toggle per-app PAL permission grants), *Storage & Persistence* (inspect IndexedDB table counts, export JSON backup, factory reset), and *About GemmaOS* (Phase 1–6 roadmap status tracker: `IMPLEMENTED`, `IN DEVELOPMENT`, `PLANNED`).
- **Application Launcher (`app-launcher`)**: Searchable, category-filtered grid of all registered applications and system utilities with keyboard navigation, running instance badges, and instant launch/terminate actions.
- **Developer Workspace (`dev-workspace`)**: Multi-tab file editor reading/writing directly to `IFileSystem`, coupled with a PAL Contract & Subsystem Inspector and an interactive test runner that validates all 6 PAL interfaces (`IFileSystem`, `IStorageProvider`, `INotificationService`, `IModelRuntime`, `IHardwareProvider`, `IExecutionEnvironment`) and logs structured execution output.
- **System Monitor (`system-monitor`)**: Real-time charts and tabular telemetry (`tabular-nums`) for CPU/Memory/Storage metrics via `IHardwareProvider`, active window/process manager with "Terminate Process" controls, Event Bus live stream inspector, and PAL adapter health statuses.
