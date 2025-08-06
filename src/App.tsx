import React, { useState, useEffect } from 'react';
import { Play, Pause, Settings, Mail, Users, BarChart3, FileText, Upload, Download, AlertCircle, CheckCircle, Zap, Globe, Shuffle, Send, Eye, EyeOff } from 'lucide-react';
import ConfigPanel from './components/ConfigPanel';
import EmailSettings from './components/EmailSettings';
import Statistics from './components/Statistics';
import LogConsole from './components/LogConsole';
import EmailLists from './components/EmailLists';

interface Config {
  // Configuration générale
  SECURITY_CODE: string;
  DEBUG_MODE: boolean;
  SHOW_ERRORS_IN_PROGRESS: boolean;
  MAX_RETRIES: number;
  RETRY_DELAY: number;
  
  // Configuration SMTP
  USE_FIXED_SMTP: boolean;
  SMTP_SERVER: string;
  SMTP_PORT: number;
  
  // Configuration Proxy
  USE_PROXY: boolean;
  PROXY_HOST: string;
  PROXY_PORT: number;
  PORT_ROTATE: boolean;
  PORT_RANGE_START: number;
  PORT_RANGE_END: number;
  EMAILS_PER_PORT_ROTATION: number;
  ERRORS_PER_PORT_ROTATION: number;
  MAX_CONSECUTIVE_ERRORS: number;
  
  // Configuration Email
  EMAIL_SUBJECT: string;
  SENDER_NAME: string;
  EMAIL_USERNAME: string;
  SENDER_DOMAIN: string;
  SENDER_DOMAIN_ROTATE: boolean;
  SENDER_DOMAIN_List: string;
  EMAILS_PER_DOMAIN_ROTATION: number;
  USERNAME_MODE: string;
  USERNAME_FORMAT: string;
  
  // Configuration Token
  TOKEN_FORMAT: string;
  TOKEN_LENGTH: number;
  ADD_TOKEN_TO_SUBJECT: boolean;
  
  // Configuration BCC
  USE_BCC_MODE: boolean;
  BCC_TO_ADDRESS: string;
  BCC_TO_NAME: string;
  BCC_BATCH_SIZE: number;
  
  // Fichiers
  MESSAGE_FILE: string;
  EMAIL_LIST_FILE: string;
  ATTACHMENT_DIR: string;
}

function App() {
  const [activeTab, setActiveTab] = useState<'config' | 'email' | 'lists' | 'stats' | 'logs'>('config');
  const [config, setConfig] = useState<Config>({
    SECURITY_CODE: '',
    DEBUG_MODE: false,
    SHOW_ERRORS_IN_PROGRESS: false,
    MAX_RETRIES: 5,
    RETRY_DELAY: 1,
    
    USE_FIXED_SMTP: true,
    SMTP_SERVER: 'smtp.vialis.net',
    SMTP_PORT: 25,
    
    USE_PROXY: false,
    PROXY_HOST: '127.0.0.1',
    PROXY_PORT: 30000,
    PORT_ROTATE: false,
    PORT_RANGE_START: 30000,
    PORT_RANGE_END: 30005,
    EMAILS_PER_PORT_ROTATION: 50,
    ERRORS_PER_PORT_ROTATION: 2,
    MAX_CONSECUTIVE_ERRORS: 2,
    
    EMAIL_SUBJECT: '',
    SENDER_NAME: '',
    EMAIL_USERNAME: 'infocetelem',
    SENDER_DOMAIN: 'vialis.net',
    SENDER_DOMAIN_ROTATE: false,
    SENDER_DOMAIN_List: 'dom.txt',
    EMAILS_PER_DOMAIN_ROTATION: 100,
    USERNAME_MODE: 'FIXED_SINGLE',
    USERNAME_FORMAT: '',
    
    TOKEN_FORMAT: 'Ref-####-########',
    TOKEN_LENGTH: 12,
    ADD_TOKEN_TO_SUBJECT: true,
    
    USE_BCC_MODE: false,
    BCC_TO_ADDRESS: 'keevcloud@gmail.com',
    BCC_TO_NAME: 'Keev Cloud',
    BCC_BATCH_SIZE: 50,
    
    MESSAGE_FILE: 'message.html',
    EMAIL_LIST_FILE: 'liste.txt',
    ATTACHMENT_DIR: 'attachments'
  });

  const [isRunning, setIsRunning] = useState(false);
  const [stats, setStats] = useState({
    emailsSent: 0,
    emailsSuccess: 0,
    emailsError: 0,
    currentRate: 0,
    elapsedTime: 0,
    currentPort: 30000,
    currentDomain: 'vialis.net',
    emailsOnPort: 0,
    errorsOnPort: 0
  });

  const [logs, setLogs] = useState<Array<{
    timestamp: string;
    type: 'info' | 'success' | 'error' | 'warning';
    message: string;
  }>>([]);

  const tabs = [
    { id: 'config', label: 'Configuration', icon: Settings },
    { id: 'email', label: 'Email & Messages', icon: Mail },
    { id: 'lists', label: 'Listes & Domaines', icon: Users },
    { id: 'stats', label: 'Statistiques', icon: BarChart3 },
    { id: 'logs', label: 'Console', icon: FileText }
  ];

  const addLog = (type: 'info' | 'success' | 'error' | 'warning', message: string) => {
    const newLog = {
      timestamp: new Date().toLocaleTimeString(),
      type,
      message
    };
    setLogs(prev => [newLog, ...prev].slice(0, 1000)); // Garder les 1000 derniers logs
  };

  const handleStartStop = async () => {
    if (isRunning) {
      setIsRunning(false);
      addLog('warning', 'Arrêt de l\'envoi demandé...');
    } else {
      // Validation basique
      if (!config.SECURITY_CODE) {
        addLog('error', 'Code de sécurité requis');
        return;
      }
      if (!config.EMAIL_SUBJECT) {
        addLog('error', 'Sujet d\'email requis');
        return;
      }
      
      setIsRunning(true);
      addLog('info', 'Démarrage de l\'envoi d\'emails...');
      
      // TODO: Implémenter l'envoi réel d'emails ici
      // Pour l'instant, simulation
      simulateEmailSending();
    }
  };

  const simulateEmailSending = () => {
    let emailCount = 0;
    let successCount = 0;
    let errorCount = 0;
    const startTime = Date.now();

    const interval = setInterval(() => {
      if (!isRunning) {
        clearInterval(interval);
        return;
      }

      emailCount++;
      const success = Math.random() > 0.1; // 90% de succès
      
      if (success) {
        successCount++;
        addLog('success', `Email #${emailCount} envoyé avec succès`);
      } else {
        errorCount++;
        addLog('error', `Erreur lors de l'envoi de l'email #${emailCount}`);
      }

      const elapsed = (Date.now() - startTime) / 1000;
      const rate = emailCount / elapsed;

      setStats({
        emailsSent: emailCount,
        emailsSuccess: successCount,
        emailsError: errorCount,
        currentRate: rate,
        elapsedTime: elapsed,
        currentPort: config.PROXY_PORT + (emailCount % 5),
        currentDomain: config.SENDER_DOMAIN,
        emailsOnPort: emailCount % config.EMAILS_PER_PORT_ROTATION,
        errorsOnPort: errorCount % config.ERRORS_PER_PORT_ROTATION
      });

      // Arrêt automatique pour la démo
      if (emailCount >= 100) {
        setIsRunning(false);
        clearInterval(interval);
        addLog('info', 'Envoi terminé (démo)');
      }
    }, 100);
  };

  const loadConfig = async () => {
    try {
      // TODO: Implémenter le chargement depuis un fichier
      addLog('info', 'Configuration chargée');
    } catch (error) {
      addLog('error', 'Erreur lors du chargement de la configuration');
    }
  };

  const saveConfig = async () => {
    try {
      // TODO: Implémenter la sauvegarde dans un fichier
      addLog('success', 'Configuration sauvegardée');
    } catch (error) {
      addLog('error', 'Erreur lors de la sauvegarde de la configuration');
    }
  };

  const exportLogs = async () => {
    try {
      const logContent = logs.map(log => 
        `[${log.timestamp}] ${log.type.toUpperCase()}: ${log.message}`
      ).join('\n');
      
      // TODO: Implémenter l'export des logs
      addLog('success', 'Logs exportés');
    } catch (error) {
      addLog('error', 'Erreur lors de l\'export des logs');
    }
  };

  const clearLogs = () => {
    setLogs([]);
    addLog('info', 'Console vidée');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700/50 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Zap className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">YODA Send MIX SMTP</h1>
                <p className="text-sm text-gray-400">v2.7 - Enhanced Port + Domain Rotation</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={loadConfig}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg text-gray-300 transition-colors"
            >
              <Upload className="w-4 h-4" />
              <span>Charger Config</span>
            </button>
            
            <button
              onClick={saveConfig}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg text-gray-300 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Sauver Config</span>
            </button>
            
            <button
              onClick={handleStartStop}
              disabled={!config.SECURITY_CODE || !config.EMAIL_SUBJECT}
              className={`flex items-center space-x-2 px-6 py-2 rounded-lg font-semibold transition-all ${
                isRunning
                  ? 'bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30'
                  : 'bg-green-500/20 hover:bg-green-500/30 text-green-300 border border-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed'
              }`}
            >
              {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              <span>{isRunning ? 'Arrêter' : 'Démarrer'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex h-[calc(100vh-80px)]">
        {/* Sidebar */}
        <div className="w-64 bg-gray-800/30 border-r border-gray-700/50 p-4">
          <nav className="space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                  activeTab === tab.id
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    : 'text-gray-400 hover:text-gray-300 hover:bg-gray-700/30'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </nav>

          {/* Status Indicators */}
          <div className="mt-8 space-y-3">
            <div className="p-3 bg-gray-700/30 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <div className={`w-2 h-2 rounded-full ${isRunning ? 'bg-green-400' : 'bg-gray-500'}`} />
                <span className="text-sm font-medium text-gray-300">Status</span>
              </div>
              <p className="text-xs text-gray-400">
                {isRunning ? 'Envoi en cours...' : 'En attente'}
              </p>
            </div>

            {config.USE_PROXY && (
              <div className="p-3 bg-gray-700/30 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Globe className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-medium text-gray-300">Proxy</span>
                </div>
                <p className="text-xs text-gray-400">
                  {config.PROXY_HOST}:{stats.currentPort}
                </p>
                {config.PORT_ROTATE && (
                  <p className="text-xs text-purple-400">
                    Rotation activée
                  </p>
                )}
              </div>
            )}

            {config.SENDER_DOMAIN_ROTATE && (
              <div className="p-3 bg-gray-700/30 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Shuffle className="w-4 h-4 text-purple-400" />
                  <span className="text-sm font-medium text-gray-300">Domaine</span>
                </div>
                <p className="text-xs text-gray-400">{stats.currentDomain}</p>
                <p className="text-xs text-purple-400">Rotation activée</p>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          {activeTab === 'config' && (
            <ConfigPanel config={config} setConfig={setConfig} />
          )}
          {activeTab === 'email' && (
            <EmailSettings config={config} setConfig={setConfig} />
          )}
          {activeTab === 'lists' && (
            <EmailLists config={config} setConfig={setConfig} />
          )}
          {activeTab === 'stats' && (
            <Statistics stats={stats} isRunning={isRunning} />
          )}
          {activeTab === 'logs' && (
            <LogConsole 
              logs={logs} 
              onClear={clearLogs}
              onExport={exportLogs}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;