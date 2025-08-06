import React, { useRef, useEffect, useState } from 'react';
import { Terminal, Download, Trash2, Search, Filter, Play, Pause } from 'lucide-react';

interface LogEntry {
  timestamp: string;
  type: 'info' | 'success' | 'error' | 'warning';
  message: string;
}

interface LogConsoleProps {
  logs: LogEntry[];
  onClear: () => void;
  onExport: () => void;
}

export default function LogConsole({ logs, onClear, onExport }: LogConsoleProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);
  const [filter, setFilter] = useState<'all' | 'info' | 'success' | 'error' | 'warning'>('all');
  const [search, setSearch] = useState('');

  // Auto-scroll vers le bas quand de nouveaux logs arrivent
  useEffect(() => {
    if (autoScroll && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs, autoScroll]);

  const filteredLogs = logs.filter(log => {
    const matchesFilter = filter === 'all' || log.type === filter;
    const matchesSearch = search === '' || 
      log.message.toLowerCase().includes(search.toLowerCase()) ||
      log.timestamp.includes(search);
    return matchesFilter && matchesSearch;
  });

  const getLogColor = (type: string) => {
    switch (type) {
      case 'success': return 'text-green-400';
      case 'error': return 'text-red-400';
      case 'warning': return 'text-yellow-400';
      case 'info':
      default: return 'text-blue-400';
    }
  };

  const getLogIcon = (type: string) => {
    switch (type) {
      case 'success': return '✓';
      case 'error': return '✗';
      case 'warning': return '⚠';
      case 'info':
      default: return 'ℹ';
    }
  };

  const getTypeCount = (type: 'info' | 'success' | 'error' | 'warning') => {
    return logs.filter(log => log.type === type).length;
  };

  const filterButtons = [
    { id: 'all', label: 'Tous', count: logs.length },
    { id: 'info', label: 'Info', count: getTypeCount('info') },
    { id: 'success', label: 'Succès', count: getTypeCount('success') },
    { id: 'warning', label: 'Avertissements', count: getTypeCount('warning') },
    { id: 'error', label: 'Erreurs', count: getTypeCount('error') }
  ] as const;

  return (
    <div className="h-full flex flex-col p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Console des Logs</h2>
        <p className="text-gray-400">Surveillance en temps réel des activités et événements</p>
      </div>

      {/* Barre d'outils */}
      <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50 mb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            {/* Recherche */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher dans les logs..."
                className="w-64 pl-10 pr-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>

            {/* Contrôle auto-scroll */}
            <button
              onClick={() => setAutoScroll(!autoScroll)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                autoScroll 
                  ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                  : 'bg-gray-700/50 text-gray-400 hover:text-gray-300'
              }`}
            >
              {autoScroll ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
              <span className="text-sm">Auto-scroll</span>
            </button>
          </div>

          {/* Actions */}
          <div className="flex space-x-2">
            <button
              onClick={onExport}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Exporter</span>
            </button>
            <button
              onClick={onClear}
              className="flex items-center space-x-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>Vider</span>
            </button>
          </div>
        </div>

        {/* Filtres */}
        <div className="flex space-x-2">
          {filterButtons.map((button) => (
            <button
              key={button.id}
              onClick={() => setFilter(button.id)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                filter === button.id
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                  : 'bg-gray-700/50 text-gray-400 hover:text-gray-300'
              }`}
            >
              <span>{button.label}</span>
              <span className="px-2 py-0.5 bg-gray-600/50 rounded-full text-xs">
                {button.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Zone de logs */}
      <div className="flex-1 bg-gray-900/50 rounded-xl border border-gray-700/50 overflow-hidden">
        <div className="p-4 bg-gray-800/50 border-b border-gray-700/50">
          <div className="flex items-center space-x-3">
            <Terminal className="w-5 h-5 text-green-400" />
            <span className="text-white font-medium">Console de logs</span>
            <span className="text-sm text-gray-400">({filteredLogs.length} entrées)</span>
          </div>
        </div>
        
        <div 
          ref={scrollRef}
          className="h-full overflow-y-auto p-4 font-mono text-sm"
          style={{ maxHeight: 'calc(100vh - 350px)' }}
        >
          {filteredLogs.length === 0 ? (
            <div className="text-center py-12">
              <Terminal className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">
                {search || filter !== 'all' 
                  ? 'Aucun log correspondant aux critères de recherche'
                  : 'Aucun log disponible'
                }
              </p>
              {(search || filter !== 'all') && (
                <button
                  onClick={() => { setSearch(''); setFilter('all'); }}
                  className="mt-2 text-blue-400 hover:text-blue-300 text-sm"
                >
                  Réinitialiser les filtres
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-1">
              {filteredLogs.map((log, index) => (
                <div key={index} className="flex items-start space-x-3 py-1 hover:bg-gray-800/30 px-2 rounded transition-colors">
                  <span className="text-gray-500 text-xs mt-0.5 w-20 flex-shrink-0">
                    {log.timestamp}
                  </span>
                  <span className={`${getLogColor(log.type)} w-4 flex-shrink-0 mt-0.5`}>
                    {getLogIcon(log.type)}
                  </span>
                  <span className="text-gray-300 flex-1 break-words leading-relaxed">
                    {log.message}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Statistiques en bas */}
      <div className="mt-4 grid grid-cols-4 gap-4">
        <div className="bg-blue-900/20 border border-blue-700/50 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-blue-400">{getTypeCount('info')}</div>
          <div className="text-xs text-gray-400">Info</div>
        </div>
        <div className="bg-green-900/20 border border-green-700/50 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-green-400">{getTypeCount('success')}</div>
          <div className="text-xs text-gray-400">Succès</div>
        </div>
        <div className="bg-yellow-900/20 border border-yellow-700/50 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-yellow-400">{getTypeCount('warning')}</div>
          <div className="text-xs text-gray-400">Avertissements</div>
        </div>
        <div className="bg-red-900/20 border border-red-700/50 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-red-400">{getTypeCount('error')}</div>
          <div className="text-xs text-gray-400">Erreurs</div>
        </div>
      </div>
    </div>
  );
}