/**
 * GEMMAOS — APPLICATION 1: FILE EXPLORER
 * Full hierarchical directory browser, file reader/writer, search, and organizer
 * communicating strictly through PAL IFileSystem (`getPAL().fs`).
 */

import React, { useEffect, useState } from 'react';
import {
  Folder,
  FileText,
  Plus,
  FolderPlus,
  Trash2,
  Search,
  Code2,
  ArrowUp,
  Save,
  RefreshCw,
} from 'lucide-react';
import { getPAL } from '../infrastructure/browserAdapters';
import { VFSNode } from '../pal/types';
import { useGemmaStore } from '../core/store';

export function FileExplorerApp({ payload }: { payload?: Record<string, string> }) {
  const { themeMode, launchApp, publishEvent, recordActivity, sendNotification } = useGemmaStore();
  const isViolet = themeMode === 'violet';

  const [currentPath, setCurrentPath] = useState<string>(payload?.path || '/home/Documents');
  const [nodes, setNodes] = useState<VFSNode[]>([]);
  const [selectedFile, setSelectedFile] = useState<VFSNode | null>(null);
  const [fileDraft, setFileDraft] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isCreatingFile, setIsCreatingFile] = useState(false);
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [statusMsg, setStatusMsg] = useState<string>('');

  const loadDirectory = async (targetPath: string) => {
    const pal = getPAL();
    try {
      if (searchQuery.trim()) {
        const matches = await pal.fs.searchFiles(searchQuery);
        setNodes(matches);
      } else {
        const items = await pal.fs.listDirectory(targetPath);
        setNodes(items);
      }
    } catch (err) {
      setStatusMsg(err instanceof Error ? err.message : 'Error reading directory');
    }
  };

  useEffect(() => {
    loadDirectory(currentPath);
  }, [currentPath, searchQuery]);

  const handleOpenNode = async (node: VFSNode) => {
    if (node.type === 'directory') {
      setSearchQuery('');
      setSelectedFile(null);
      setCurrentPath(node.path);
    } else {
      const pal = getPAL();
      const content = await pal.fs.readFile(node.path);
      setSelectedFile(node);
      setFileDraft(content);
    }
  };

  const handleNavigateUp = () => {
    if (currentPath === '/') return;
    const parts = currentPath.split('/').filter(Boolean);
    const parent = parts.length > 1 ? `/${parts.slice(0, -1).join('/')}` : '/';
    setSelectedFile(null);
    setCurrentPath(parent);
  };

  const handleSaveFile = async () => {
    if (!selectedFile) return;
    const pal = getPAL();
    const updated = await pal.fs.writeFile(
      selectedFile.path,
      fileDraft,
      selectedFile.mimeType
    );
    setSelectedFile(updated);
    await loadDirectory(currentPath);
    publishEvent('vfs.write', 'App::FileExplorer', `Saved file ${updated.path}`);
    await recordActivity({
      title: `Edited ${updated.name}`,
      subtitle: `Saved ${updated.size} bytes to IndexedDB VFS`,
      iconType: 'folder',
      targetAppId: 'file-explorer',
      targetPayload: { path: currentPath },
    });
    setStatusMsg(`Saved ${updated.name}`);
    setTimeout(() => setStatusMsg(''), 2500);
  };

  const handleCreateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = newItemName.trim();
    if (!clean) return;
    const pal = getPAL();
    const fullPath = currentPath === '/' ? `/${clean}` : `${currentPath}/${clean}`;

    if (isCreatingFolder) {
      await pal.fs.createDirectory(fullPath);
      publishEvent('vfs.mkdir', 'App::FileExplorer', `Created folder ${fullPath}`);
    } else {
      const finalName = clean.includes('.') ? clean : `${clean}.md`;
      const fileFullPath = currentPath === '/' ? `/${finalName}` : `${currentPath}/${finalName}`;
      const created = await pal.fs.writeFile(
        fileFullPath,
        `# ${finalName}\n\nCreated in GemmaOS File Explorer via PAL IFileSystem.`,
        'text/markdown'
      );
      setSelectedFile(created);
      setFileDraft(created.content || '');
      publishEvent('vfs.create', 'App::FileExplorer', `Created file ${fileFullPath}`);
    }

    setNewItemName('');
    setIsCreatingFile(false);
    setIsCreatingFolder(false);
    await loadDirectory(currentPath);
  };

  const handleDeleteNode = async (node: VFSNode) => {
    try {
      const pal = getPAL();
      await pal.fs.deleteNode(node.path);
      if (selectedFile?.path === node.path) {
        setSelectedFile(null);
      }
      await loadDirectory(currentPath);
      publishEvent('vfs.delete', 'App::FileExplorer', `Deleted ${node.path}`);
    } catch (err) {
      await sendNotification(
        'Protected System Directory',
        err instanceof Error ? err.message : 'Cannot delete protected path',
        'security',
        'warning'
      );
    }
  };

  const quickLocations = [
    { label: 'Root (/)', path: '/' },
    { label: 'Home (/home)', path: '/home' },
    { label: 'Documents', path: '/home/Documents' },
    { label: 'Projects', path: '/home/Projects' },
    { label: 'System Config (/etc)', path: '/etc' },
    { label: 'System Logs (/var)', path: '/var' },
  ];

  return (
    <div
      className={`h-full flex flex-col select-none ${
        isViolet ? 'bg-[#2B124C] text-[#FFF8F0]' : 'bg-[#FFFDF7] text-[#2A114B]'
      }`}
    >
      {/* Top Toolbar */}
      <div
        className={`px-4 py-2.5 border-b-[2.5px] border-[#2A114B] flex flex-wrap items-center justify-between gap-2 ${
          isViolet ? 'bg-[#3C1B69]' : 'bg-[#FFF6E8]'
        }`}
      >
        <div className="flex items-center gap-2">
          <button
            onClick={handleNavigateUp}
            disabled={currentPath === '/'}
            className="gemma-pill-border gemma-btn-press p-1.5 rounded-lg bg-[#FFE484] text-[#2A114B] disabled:opacity-40 cursor-pointer"
            title="Up one directory"
          >
            <ArrowUp className="w-4 h-4 stroke-[2.5]" />
          </button>
          <div className="gemma-pill-border px-3 py-1 rounded-lg bg-[#FFFDF9] text-[#2A114B] font-mono text-xs font-semibold">
            {currentPath}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#2A114B]/60 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search VFS..."
              className="gemma-pill-border pl-8 pr-3 py-1 rounded-lg bg-[#FFFDF9] text-[#2A114B] text-xs font-medium focus:outline-none w-40"
            />
          </div>

          <button
            onClick={() => {
              setIsCreatingFile(true);
              setIsCreatingFolder(false);
            }}
            className="gemma-pill-border gemma-btn-press px-2.5 py-1 rounded-lg bg-[#FF85C8] text-[#2A114B] text-xs font-bold flex items-center gap-1 cursor-pointer whitespace-nowrap shrink-0"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>New File</span>
          </button>

          <button
            onClick={() => {
              setIsCreatingFolder(true);
              setIsCreatingFile(false);
            }}
            className="gemma-pill-border gemma-btn-press px-2.5 py-1 rounded-lg bg-[#DEC4FF] text-[#2A114B] text-xs font-bold flex items-center gap-1 cursor-pointer whitespace-nowrap shrink-0"
          >
            <FolderPlus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Folder</span>
          </button>
        </div>
      </div>

      {/* Inline Create Bar */}
      {(isCreatingFile || isCreatingFolder) && (
        <form
          onSubmit={handleCreateItem}
          className="px-4 py-2 bg-[#FFE49E] text-[#2A114B] border-b-[2.5px] border-[#2A114B] flex items-center gap-2"
        >
          <span className="text-xs font-bold">
            {isCreatingFolder ? 'New Folder Name:' : 'New File Name:'}
          </span>
          <input
            type="text"
            autoFocus
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            placeholder={isCreatingFolder ? 'e.g. Research' : 'e.g. notes.md'}
            className="gemma-pill-border px-2.5 py-1 rounded-md bg-white text-[#2A114B] text-xs font-mono focus:outline-none flex-1"
          />
          <button
            type="submit"
            className="gemma-pill-border px-3 py-1 rounded-md bg-[#FF66B5] text-[#2A114B] text-xs font-bold cursor-pointer"
          >
            Create
          </button>
          <button
            type="button"
            onClick={() => {
              setIsCreatingFile(false);
              setIsCreatingFolder(false);
            }}
            className="px-2 py-1 text-xs font-bold underline cursor-pointer"
          >
            Cancel
          </button>
        </form>
      )}

      {/* Main Split View */}
      <div className="flex-1 flex min-h-0">
        {/* Left Directory Bookmarks */}
        <div
          className={`w-44 border-r-[2.5px] border-[#2A114B] p-3 space-y-1.5 shrink-0 ${
            isViolet ? 'bg-[#230E42]' : 'bg-[#FFF6E8]'
          }`}
        >
          <div className="text-xs font-bold opacity-75 px-2 mb-2">PAL VFS Mounts</div>
          {quickLocations.map((loc) => (
            <button
              key={loc.path}
              onClick={() => {
                setSearchQuery('');
                setSelectedFile(null);
                setCurrentPath(loc.path);
              }}
              className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 cursor-pointer transition-all ${
                currentPath === loc.path
                  ? 'bg-[#FF66B5] text-[#2A114B] border-2 border-[#2A114B] shadow-[0_2px_0_#2A114B]'
                  : 'hover:bg-[#FF85C8]/25'
              }`}
            >
              <Folder className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{loc.label}</span>
            </button>
          ))}
        </div>

        {/* Center File List */}
        <div className="flex-1 p-3.5 overflow-y-auto">
          {statusMsg && (
            <div className="mb-2 px-3 py-1.5 rounded-lg bg-[#FFE484] text-[#2A114B] border-2 border-[#2A114B] text-xs font-bold">
              {statusMsg}
            </div>
          )}

          {nodes.length === 0 ? (
            <div className="h-48 flex flex-col items-center justify-center text-center opacity-75">
              <Folder className="w-10 h-10 mb-2 opacity-60" />
              <p className="text-sm font-bold">This directory is empty</p>
              <p className="text-xs mt-0.5">Use "New File" or "Folder" above to add items to IndexedDB VFS.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {nodes.map((node) => {
                const isSelected = selectedFile?.path === node.path;
                return (
                  <div
                    key={node.path}
                    onClick={() => handleOpenNode(node)}
                    className={`gemma-card-border rounded-xl p-3 flex items-center justify-between cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-[#FF85C8] text-[#2A114B]'
                        : isViolet
                        ? 'bg-[#3C1B69] hover:bg-[#4B2382]'
                        : 'bg-[#FFF6E8] hover:bg-[#FFECB3]'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-9 h-9 rounded-lg border-2 border-[#2A114B] flex items-center justify-center shrink-0 ${
                          node.type === 'directory' ? 'bg-[#FFE484]' : 'bg-[#DEC4FF]'
                        } text-[#2A114B]`}
                      >
                        {node.type === 'directory' ? (
                          <Folder className="w-4 h-4 stroke-[2.5]" />
                        ) : (
                          <FileText className="w-4 h-4 stroke-[2.5]" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-xs sm:text-sm truncate">{node.name}</div>
                        <div className="text-[11px] font-mono opacity-75">
                          {node.type === 'directory'
                            ? `DIR · ${node.permissions}`
                            : `${node.size} B · ${node.permissions}`}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteNode(node);
                      }}
                      className="p-1.5 rounded-lg hover:bg-[#FF5CAD] hover:text-[#2A114B] transition-colors cursor-pointer"
                      title="Delete node"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right File Inspector & Editor Pane */}
        {selectedFile && (
          <div
            className={`w-72 sm:w-80 border-l-[2.5px] border-[#2A114B] p-3.5 flex flex-col shrink-0 ${
              isViolet ? 'bg-[#35175E]' : 'bg-[#FFF6E8]'
            }`}
          >
            <div className="flex items-center justify-between gap-2 pb-2 border-b-2 border-[#2A114B]/20">
              <div className="min-w-0">
                <div className="font-bold text-xs truncate">{selectedFile.name}</div>
                <div className="font-mono text-[11px] opacity-75 truncate">
                  {selectedFile.path}
                </div>
              </div>
              <button
                onClick={() =>
                  launchApp('dev-workspace', { filePath: selectedFile.path })
                }
                className="gemma-pill-border gemma-btn-press px-2 py-1 rounded-md bg-[#DEC4FF] text-[#2A114B] text-[11px] font-bold flex items-center gap-1 cursor-pointer shrink-0"
                title="Open in Developer Workspace"
              >
                <Code2 className="w-3 h-3" />
                <span>IDE</span>
              </button>
            </div>

            <textarea
              value={fileDraft}
              onChange={(e) => setFileDraft(e.target.value)}
              className="flex-1 my-2.5 p-2.5 rounded-xl border-2 border-[#2A114B] bg-[#FFFDF9] text-[#2A114B] font-mono text-xs resize-none focus:outline-none"
            />

            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-[11px] opacity-75 tabular-nums">
                {new Blob([fileDraft]).size} bytes
              </span>
              <button
                onClick={handleSaveFile}
                className="gemma-pill-border gemma-btn-press px-3 py-1.5 rounded-lg bg-[#FF66B5] text-[#2A114B] text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save to VFS</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
