/**
 * GEMMAOS — LAYER 4: PLATFORM ABSTRACTION LAYER (PAL) CONTRACTS
 * All platform-dependent functionality is accessed strictly through these interfaces.
 * Phase 1 uses Browser/IndexedDB adapters; Phase 5 swaps in Native Linux/Wayland adapters.
 */

export type PermissionScope =
  | 'fs.read'
  | 'fs.write'
  | 'storage.read'
  | 'storage.write'
  | 'system.metrics'
  | 'notifications.send'
  | 'execution.sandbox'
  | 'ai.runtime';

export type ImplementationStatus = 'IMPLEMENTED' | 'IN DEVELOPMENT' | 'PLANNED';

// 1. IFileSystem
export interface VFSNode {
  id: string;
  name: string;
  path: string;
  parentPath: string;
  type: 'file' | 'directory';
  content?: string;
  mimeType?: string;
  size: number;
  createdAt: number;
  updatedAt: number;
  permissions: string; // e.g., 'rwxr-xr-x'
}

export interface IFileSystem {
  initialize(): Promise<void>;
  readFile(path: string): Promise<string>;
  writeFile(path: string, content: string, mimeType?: string): Promise<VFSNode>;
  createDirectory(path: string): Promise<VFSNode>;
  listDirectory(path: string): Promise<VFSNode[]>;
  deleteNode(path: string): Promise<void>;
  renameNode(path: string, newName: string): Promise<VFSNode>;
  getMetadata(path: string): Promise<VFSNode | null>;
  searchFiles(query: string): Promise<VFSNode[]>;
  exists(path: string): Promise<boolean>;
  resetToDefaults(): Promise<void>;
}

// 2. IStorageProvider
export interface StorageStats {
  backend: 'IndexedDB' | 'NativeLinuxFS';
  databaseName: string;
  recordCount: number;
  estimatedBytes: number;
  namespaces: Record<string, number>;
}

export interface IStorageProvider {
  initialize(): Promise<void>;
  get<T>(namespace: string, key: string): Promise<T | null>;
  set<T>(namespace: string, key: string, value: T): Promise<void>;
  remove(namespace: string, key: string): Promise<void>;
  listKeys(namespace: string): Promise<string[]>;
  clearNamespace(namespace: string): Promise<void>;
  exportAll(): Promise<string>;
  importAll(jsonPayload: string): Promise<void>;
  getStats(): Promise<StorageStats>;
}

// 3. INotificationService
export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  category: 'system' | 'app' | 'security' | 'ai' | 'storage';
  severity: 'info' | 'success' | 'warning' | 'error';
  timestamp: number;
  read: boolean;
  sourceAppId?: string;
}

export interface INotificationService {
  notify(
    notification: Omit<SystemNotification, 'id' | 'timestamp' | 'read'>
  ): Promise<SystemNotification>;
  markAsRead(id: string): Promise<void>;
  markAllAsRead(): Promise<void>;
  dismiss(id: string): Promise<void>;
  clearAll(): Promise<void>;
  getHistory(): Promise<SystemNotification[]>;
  subscribe(listener: (notifications: SystemNotification[]) => void): () => void;
}

// 4. IModelRuntime (Phase 1 Contract for Phase 2 Gemma & EmbeddingGemma 2)
export interface ModelConfiguration {
  modelId: string;
  displayName: string;
  role: 'generative' | 'embedding';
  provider: 'remote-authenticated' | 'local-cpu' | 'local-gpu' | 'hybrid';
  dimensions?: number;
  contextWindow?: number;
  phaseStatus: ImplementationStatus;
}

export interface ModelStatus {
  modelId: string;
  state: 'unloaded' | 'initializing' | 'ready' | 'standby-phase2' | 'error';
  provider: string;
  memoryAllocatedMB: number;
  lastHealthCheck: number;
  notes: string;
}

export interface ResourceMetrics {
  activeModels: number;
  allocatedMemoryMB: number;
  availableExecutionModes: ('local' | 'remote' | 'hybrid')[];
  gpuAccelerationDetected: boolean;
}

export interface IModelRuntime {
  load(model: ModelConfiguration): Promise<void>;
  unload(modelId: string): Promise<void>;
  getStatus(modelId: string): Promise<ModelStatus>;
  listConfiguredModels(): Promise<ModelConfiguration[]>;
  getResourceUsage(): Promise<ResourceMetrics>;
}

// 5. IHardwareProvider
export interface HardwareMetrics {
  cpuUsagePercent: number;
  cpuCores: number;
  memoryUsedMB: number;
  memoryTotalMB: number;
  storageUsedMB: number;
  storageQuotaMB: number;
  temperatureCelsius: number;
  batteryLevelPercent: number;
  batteryCharging: boolean;
  networkOnline: boolean;
  networkLatencyMs: number;
  displayResolution: string;
  platformTarget: 'browser-pal-v1' | 'linux-wayland-v5';
}

export interface IHardwareProvider {
  getMetrics(): Promise<HardwareMetrics>;
  getCapabilities(): Promise<string[]>;
}

// 6. IExecutionEnvironment
export interface SubsystemTestResult {
  id: string;
  milestone: string;
  subsystem: string;
  passed: boolean;
  durationMs: number;
  details: string;
}

export interface SandboxExecutionResult {
  success: boolean;
  output: string[];
  returnValue?: string;
  durationMs: number;
  error?: string;
}

export interface IExecutionEnvironment {
  getEnvironmentInfo(): {
    osName: string;
    version: string;
    phase: string;
    palAdapter: string;
    kernelTarget: string;
    uptimeSeconds: number;
  };
  executeDiagnosticScript(code: string): Promise<SandboxExecutionResult>;
  runMilestoneVerificationSuite(): Promise<SubsystemTestResult[]>;
}

export interface IPALContainer {
  fs: IFileSystem;
  storage: IStorageProvider;
  notifications: INotificationService;
  modelRuntime: IModelRuntime;
  hardware: IHardwareProvider;
  execution: IExecutionEnvironment;
}
