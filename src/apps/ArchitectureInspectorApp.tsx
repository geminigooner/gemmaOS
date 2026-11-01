/**
 * GEMMAOS — AI & AGENT ARCHITECTURE HUB (PHASE 2 & PHASE 3 CONTRACT INSPECTOR)
 * Connects the Left Rail & Welcome Hub ("AI", "Memory", "Agents", "Models") buttons
 * to the PAL IModelRuntime contract while strictly honoring Phase 1 Rule #8 & #10:
 * "Never represent planned functionality as implemented. Keep Phase 2 AI integration
 * requirements in mind without prematurely implementing them."
 */

import React, { useEffect, useState } from 'react';
import { Sparkles, Layers, Bot, Cpu, CheckCircle2, RefreshCw } from 'lucide-react';
import { getPAL } from '../infrastructure/browserAdapters';
import { ModelConfiguration, ModelStatus } from '../pal/types';
import { useGemmaStore } from '../core/store';

export function ArchitectureInspectorApp({ payload }: { payload?: Record<string, string> }) {
  const { themeMode, publishEvent, sendNotification } = useGemmaStore();
  const isViolet = themeMode === 'violet';

  const [activeTab, setActiveTab] = useState<'gemma' | 'memory' | 'agents' | 'models'>(
    (payload?.tab as 'gemma' | 'memory' | 'agents' | 'models') || 'gemma'
  );
  const [models, setModels] = useState<ModelConfiguration[]>([]);
  const [statuses, setStatuses] = useState<Record<string, ModelStatus>>({});

  useEffect(() => {
    if (payload?.tab) {
      setActiveTab(payload.tab as typeof activeTab);
    }
  }, [payload?.tab]);

  const refreshModelContracts = async () => {
    const pal = getPAL();
    const list = await pal.modelRuntime.listConfiguredModels();
    setModels(list);
    const statusMap: Record<string, ModelStatus> = {};
    for (const m of list) {
      statusMap[m.modelId] = await pal.modelRuntime.getStatus(m.modelId);
    }
    setStatuses(statusMap);
  };

  useEffect(() => {
    refreshModelContracts();
  }, []);

  const handleToggleStandbyModel = async (model: ModelConfiguration) => {
    const pal = getPAL();
    const current = statuses[model.modelId];
    if (current?.state === 'ready') {
      await pal.modelRuntime.unload(model.modelId);
      publishEvent('ai.runtime', 'PAL::IModelRuntime', `Unloaded contract stub for ${model.modelId}`);
    } else {
      await pal.modelRuntime.load(model);
      publishEvent('ai.runtime', 'PAL::IModelRuntime', `Verified PAL load contract for ${model.modelId}`);
      await sendNotification(
        'PAL IModelRuntime Contract Verified',
        `${model.displayName} contract validated. Ready for Phase 2 provider binding.`,
        'ai',
        'info'
      );
    }
    await refreshModelContracts();
  };

  return (
    <div
      className={`h-full flex flex-col p-4 select-none ${
        isViolet ? 'bg-[#2B124C] text-[#FFF8F0]' : 'bg-[#FFFDF7] text-[#2A114B]'
      }`}
    >
      {/* Top Subsystem Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-4 border-b-[2.5px] border-[#2A114B]">
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'gemma', label: 'Gemma (Generative AI)', icon: Sparkles },
            { id: 'memory', label: 'EmbeddingGemma 2 & Memory', icon: Layers },
            { id: 'agents', label: 'Phase 3 Agent Environment', icon: Bot },
            { id: 'models', label: 'PAL IModelRuntime Manager', icon: Cpu },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`gemma-pill-border gemma-btn-press px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 ${
                  active
                    ? 'bg-[#FF66B5] text-[#2A114B]'
                    : isViolet
                    ? 'bg-[#3C1B69] text-[#FFF8F0]'
                    : 'bg-[#FFF6E8] text-[#2A114B]'
                }`}
              >
                <Icon className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <span className="px-2.5 py-1 rounded-lg bg-[#FFE484] border-2 border-[#2A114B] text-[#2A114B] font-mono text-[11px] font-bold">
          PHASE 1 PAL CONTRACT READY
        </span>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto space-y-4">
        {activeTab === 'gemma' && (
          <div
            className={`gemma-card-border rounded-2xl p-4 space-y-3 ${
              isViolet ? 'bg-[#3C1B69]' : 'bg-[#FFF6E8]'
            }`}
          >
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-bold">
                Generative Intelligence Subsystem — Gemma
              </h2>
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-[#FFE484] text-[#2A114B] border border-[#2A114B] font-bold">
                PHASE 2 TARGET
              </span>
            </div>
            <p className="text-xs opacity-90 leading-relaxed">
              Per Phase 1 Architectural Rule #10, Gemma is not hard-coded as an isolated chatbot inside the Phase 1 UI. Instead, GemmaOS establishes the provider-independent{' '}
              <code className="font-mono font-bold">IGenerativeModel</code> and{' '}
              <code className="font-mono font-bold">IModelRuntime</code> interfaces so Phase 2 can bind local (llama.cpp / Ollama) or authenticated remote providers cleanly.
            </p>
            <pre className="p-3 rounded-xl border-2 border-[#2A114B] bg-[#1E0B36] text-[#FFF8F0] font-mono text-xs overflow-x-auto">
{`interface IGenerativeModel {
  initialize(): Promise<void>;
  generate(request: GenerationRequest): AsyncIterable<GenerationEvent>;
  cancel(requestId: string): Promise<void>;
  getStatus(): Promise<ModelStatus>;
  shutdown(): Promise<void>;
}`}
            </pre>
          </div>
        )}

        {activeTab === 'memory' && (
          <div
            className={`gemma-card-border rounded-2xl p-4 space-y-3 ${
              isViolet ? 'bg-[#3C1B69]' : 'bg-[#FFF6E8]'
            }`}
          >
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-bold">
                Semantic Intelligence — EmbeddingGemma 2 &amp; Vector Memory
              </h2>
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-[#FFE484] text-[#2A114B] border border-[#2A114B] font-bold">
                INDEPENDENT RUNTIME
              </span>
            </div>
            <p className="text-xs opacity-90 leading-relaxed">
              EmbeddingGemma 2 operates independently of Gemma generative inference to transform documents, source code, and system memories into versioned numerical vectors with preserved source provenance.
            </p>
            <pre className="p-3 rounded-xl border-2 border-[#2A114B] bg-[#1E0B36] text-[#FFF8F0] font-mono text-xs overflow-x-auto">
{`interface IEmbeddingModel {
  initialize(): Promise<void>;
  embed(input: EmbeddingInput): Promise<EmbeddingResult>;
  getDimensions(): number;
  getSupportedModalities(): Modality[];
  getStatus(): Promise<ModelStatus>;
  shutdown(): Promise<void>;
}`}
            </pre>
          </div>
        )}

        {activeTab === 'agents' && (
          <div
            className={`gemma-card-border rounded-2xl p-4 space-y-3 ${
              isViolet ? 'bg-[#3C1B69]' : 'bg-[#FFF6E8]'
            }`}
          >
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-bold">
                Phase 3 — Agent Operating Environment &amp; Authorization Policy
              </h2>
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-[#DEC4FF] text-[#2A114B] border border-[#2A114B] font-bold">
                PHASE 3 ARCHITECTURE
              </span>
            </div>
            <p className="text-xs opacity-90 leading-relaxed">
              Agents interact with GemmaOS exclusively through controlled Tool Registry adapters and three-tier authorization policies enforced by the Core Permission Manager:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
              <div className="p-3 rounded-xl border-2 border-[#2A114B] bg-[#80ED99] text-[#2A114B]">
                <div className="font-bold">Category A — Read-Only</div>
                <div className="mt-1 opacity-85">
                  Search documents, inspect app state, retrieve system telemetry. Automatic when authorized.
                </div>
              </div>
              <div className="p-3 rounded-xl border-2 border-[#2A114B] bg-[#FFE484] text-[#2A114B]">
                <div className="font-bold">Category B — Reversible</div>
                <div className="mt-1 opacity-85">
                  Create drafts, modify temporary files, toggle reversible settings with recovery checkpoints.
                </div>
              </div>
              <div className="p-3 rounded-xl border-2 border-[#2A114B] bg-[#FFA8D8] text-[#2A114B]">
                <div className="font-bold">Category C — Consequential</div>
                <div className="mt-1 opacity-85">
                  Delete files, alter system config, external actions. Requires explicit human approval.
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'models' && (
          <div className="space-y-3">
            {models.map((m) => {
              const st = statuses[m.modelId];
              const isReady = st?.state === 'ready';
              return (
                <div
                  key={m.modelId}
                  className={`gemma-card-border rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isViolet ? 'bg-[#3C1B69]' : 'bg-[#FFF6E8]'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-display font-bold text-base">{m.displayName}</span>
                      <span className="font-mono text-xs px-2 py-0.5 rounded bg-[#DEC4FF] text-[#2A114B] border border-[#2A114B] font-bold">
                        {m.role.toUpperCase()}
                      </span>
                    </div>
                    <div className="font-mono text-xs opacity-80 mt-1">
                      ID: {m.modelId} · Provider: {m.provider} · Status:{' '}
                      <span className="font-bold">{st?.state || 'standby-phase2'}</span>
                    </div>
                    <div className="text-xs opacity-75 mt-1">{st?.notes}</div>
                  </div>

                  <button
                    onClick={() => handleToggleStandbyModel(m)}
                    className="gemma-pill-border gemma-btn-press px-3.5 py-2 rounded-xl bg-[#FF66B5] text-[#2A114B] text-xs font-bold flex items-center gap-1.5 cursor-pointer shrink-0"
                  >
                    {isReady ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Unload Contract</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Test PAL Load()</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
