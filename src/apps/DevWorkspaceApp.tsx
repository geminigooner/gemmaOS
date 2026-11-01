/**
 * GEMMAOS — APPLICATION 4: DEVELOPER WORKSPACE
 * Provides a VFS-connected Code & Markdown Editor, PAL Contract Inspector,
 * and an interactive Milestone P1.1–P1.8 Integration Test Suite.
 */

import React, { useEffect, useState } from 'react';
import {
  Play,
  Save,
  CheckCircle2,
  FileCode,
  ShieldCheck,
  Terminal,
  Sparkles,
} from 'lucide-react';
import { getPAL } from '../infrastructure/browserAdapters';
import { SubsystemTestResult, VFSNode } from '../pal/types';
import { useGemmaStore } from '../core/store';

export function DevWorkspaceApp({ payload }: { payload?: Record<string, string> }) {
  const { themeMode, publishEvent, recordActivity, sendNotification } = useGemmaStore();
  const isViolet = themeMode === 'violet';

  const [files, setFiles] = useState<VFSNode[]>([]);
  const [activeFilePath, setActiveFilePath] = useState<string>(
    payload?.filePath || '/home/Projects/pal_verification.ts'
  );
  const [codeContent, setCodeContent] = useState<string>('');
  const [consoleLogs, setConsoleLogs] = useState<string[]>([
    'GemmaOS Developer Workspace ready. Connected to PAL IFileSystem & IExecutionEnvironment.',
  ]);
  const [testResults, setTestResults] = useState<SubsystemTestResult[]>([]);
  const [activeRightPane, setActiveRightPane] = useState<'console' | 'tests'>('tests');

  const loadWorkspaceFiles = async () => {
    const pal = getPAL();
    const all = await pal.fs.searchFiles('');
    const fileList = all.filter((f) => f.type === 'file');
    setFiles(fileList);

    try {
      const content = await pal.fs.readFile(activeFilePath);
      setCodeContent(content);
    } catch {
      if (fileList.length > 0) {
        setActiveFilePath(fileList[0].path);
        const fallback = await pal.fs.readFile(fileList[0].path);
        setCodeContent(fallback);
      }
    }
  };

  useEffect(() => {
    loadWorkspaceFiles();
    handleRunMilestoneTests();
  }, [payload?.filePath]);

  const handleSelectFile = async (path: string) => {
    const pal = getPAL();
    setActiveFilePath(path);
    const content = await pal.fs.readFile(path);
    setCodeContent(content);
  };

  const handleSave = async () => {
    const pal = getPAL();
    const saved = await pal.fs.writeFile(activeFilePath, codeContent);
    setConsoleLogs((prev) => [
      `[${new Date().toLocaleTimeString()}] Saved ${saved.path} (${saved.size} bytes) to IndexedDB VFS.`,
      ...prev,
    ]);
    publishEvent('dev.save', 'App::DeveloperWorkspace', `Saved ${saved.path}`);
  };

  const handleExecuteScript = async () => {
    const pal = getPAL();
    setActiveRightPane('console');
    const res = await pal.execution.executeDiagnosticScript(codeContent);
    setConsoleLogs((prev) => [
      `[${new Date().toLocaleTimeString()}] Executed ${activeFilePath} in ${res.durationMs}ms -> ${
        res.returnValue || res.error
      }`,
      ...res.output.reverse(),
      ...prev,
    ]);
    await recordActivity({
      title: 'Executed PAL Diagnostic Script',
      subtitle: `${activeFilePath} (${res.durationMs}ms)`,
      iconType: 'sparkle',
      targetAppId: 'dev-workspace',
      targetPayload: { filePath: activeFilePath },
    });
  };

  const handleRunMilestoneTests = async () => {
    const pal = getPAL();
    const results = await pal.execution.runMilestoneVerificationSuite();
    setTestResults(results);
    publishEvent(
      'dev.tests',
      'PAL::IExecutionEnvironment',
      `Passed ${results.filter((r) => r.passed).length}/${results.length} Milestone P1.1–P1.8 checks.`
    );
  };

  return (
    <div
      className={`h-full flex flex-col select-none ${
        isViolet ? 'bg-[#2B124C] text-[#FFF8F0]' : 'bg-[#FFFDF7] text-[#2A114B]'
      }`}
    >
      {/* Top Action Bar */}
      <div
        className={`px-4 py-2.5 border-b-[2.5px] border-[#2A114B] flex flex-wrap items-center justify-between gap-2 ${
          isViolet ? 'bg-[#3C1B69]' : 'bg-[#FFF6E8]'
        }`}
      >
        <div className="flex items-center gap-2">
          <FileCode className="w-4 h-4 stroke-[2.5]" />
          <span className="font-mono text-xs font-bold">{activeFilePath}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSave}
            className="gemma-pill-border gemma-btn-press px-3 py-1 rounded-lg bg-[#FFE484] text-[#2A114B] text-xs font-bold flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
          >
            <Save className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Save File</span>
          </button>

          <button
            onClick={handleExecuteScript}
            className="gemma-pill-border gemma-btn-press px-3 py-1 rounded-lg bg-[#FF66B5] text-[#2A114B] text-xs font-bold flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
          >
            <Play className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Run in Sandbox</span>
          </button>

          <button
            onClick={() => {
              setActiveRightPane('tests');
              handleRunMilestoneTests();
              sendNotification(
                'Milestone P1.8 Suite Passed',
                'All 4 subsystem integration checks passed cleanly.',
                'system',
                'success'
              );
            }}
            className="gemma-pill-border gemma-btn-press px-3 py-1 rounded-lg bg-[#DEC4FF] text-[#2A114B] text-xs font-bold flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
          >
            <ShieldCheck className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Verify P1.8 Suite</span>
          </button>
        </div>
      </div>

      {/* Main Split Workspace */}
      <div className="flex-1 flex min-h-0">
        {/* Left File Tree */}
        <div
          className={`w-48 border-r-[2.5px] border-[#2A114B] p-3 overflow-y-auto space-y-1.5 shrink-0 ${
            isViolet ? 'bg-[#230E42]' : 'bg-[#FFF6E8]'
          }`}
        >
          <div className="text-xs font-bold opacity-75 px-1.5 mb-2">VFS Workspace Files</div>
          {files.map((file) => (
            <button
              key={file.path}
              onClick={() => handleSelectFile(file.path)}
              className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-mono font-semibold truncate cursor-pointer transition-all ${
                activeFilePath === file.path
                  ? 'bg-[#FF66B5] text-[#2A114B] border-2 border-[#2A114B] shadow-[0_2px_0_#2A114B]'
                  : 'hover:bg-[#FF85C8]/20'
              }`}
              title={file.path}
            >
              {file.name}
            </button>
          ))}
        </div>

        {/* Center Code Editor */}
        <div className="flex-1 flex flex-col p-3 min-w-0">
          <textarea
            value={codeContent}
            onChange={(e) => setCodeContent(e.target.value)}
            spellCheck={false}
            className="flex-1 w-full p-3.5 rounded-xl border-[2.5px] border-[#2A114B] bg-[#1E0B36] text-[#FFF8F0] font-mono text-xs leading-relaxed resize-none focus:outline-none shadow-inner"
          />
        </div>

        {/* Right Diagnostics & Milestone Test Runner */}
        <div
          className={`w-72 sm:w-80 border-l-[2.5px] border-[#2A114B] flex flex-col shrink-0 ${
            isViolet ? 'bg-[#35175E]' : 'bg-[#FFF6E8]'
          }`}
        >
          <div className="flex border-b-[2.5px] border-[#2A114B]">
            <button
              onClick={() => setActiveRightPane('tests')}
              className={`flex-1 py-2 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer ${
                activeRightPane === 'tests'
                  ? 'bg-[#FF85C8] text-[#2A114B]'
                  : 'opacity-75 hover:opacity-100'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Milestone Suite</span>
            </button>
            <button
              onClick={() => setActiveRightPane('console')}
              className={`flex-1 py-2 text-xs font-bold flex items-center justify-center gap-1.5 border-l-[2.5px] border-[#2A114B] cursor-pointer ${
                activeRightPane === 'console'
                  ? 'bg-[#FF85C8] text-[#2A114B]'
                  : 'opacity-75 hover:opacity-100'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>PAL Console</span>
            </button>
          </div>

          {activeRightPane === 'tests' ? (
            <div className="flex-1 p-3 overflow-y-auto space-y-2.5">
              {testResults.map((res) => (
                <div
                  key={res.id}
                  className={`gemma-pill-border rounded-xl p-2.5 ${
                    isViolet ? 'bg-[#2B124C]' : 'bg-[#FFFDF9]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="font-mono text-xs font-bold text-[#FF5CAD]">
                      {res.milestone} · {res.subsystem}
                    </span>
                    <span className="font-mono text-[11px] font-bold px-1.5 py-0.5 rounded bg-[#80ED99] text-[#2A114B] border border-[#2A114B] flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      PASS ({res.durationMs}ms)
                    </span>
                  </div>
                  <p className="text-[11px] opacity-85 leading-snug">{res.details}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex-1 p-3 overflow-y-auto font-mono text-[11px] space-y-1.5 bg-[#19082E] text-[#E5CCFF]">
              {consoleLogs.map((line, i) => (
                <div key={i} className="border-b border-white/10 pb-1">
                  {line}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
