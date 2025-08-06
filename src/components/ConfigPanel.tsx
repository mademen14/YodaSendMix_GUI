import React, { useState } from 'react';
import { Shield, Server, Globe, Settings2, AlertCircle, Eye, EyeOff, RefreshCw, Zap } from 'lucide-react';

interface Config {
  SECURITY_CODE: string;
  DEBUG_MODE: boolean;
  SHOW_ERRORS_IN_PROGRESS: boolean;
  MAX_RETRIES: number;
  RETRY_DELAY: number;
  USE_FIXED_SMTP: boolean;
  SMTP_SERVER: string;
  SMTP_PORT: number;
  USE_PROXY: boolean;
  PROXY_HOST: string;
  PROXY_PORT: number;
  PORT_ROTATE: boolean;
  PORT_RANGE_START: number;
  PORT_RANGE_END: number;
  EMAILS_PER_PORT_ROTATION: number;
  ERRORS_PER_PORT_ROTATION: number;
  MAX_CONSECUTIVE_ERRORS: number;
}

interface ConfigPanelProps {
  config: Config;
  setConfig: React.Dispatch<React.SetStateAction<Config>>;
}

export default function ConfigPanel({ config, setConfig }: ConfigPanelProps) {
  const [showSecurityCode, setShowSecurityCode] = useState(false);

  const updateConfig = (key: keyof Config, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const ConfigSection = ({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) => (
    <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/50">
      <div className="flex items-center space-x-3 mb-6">
        <Icon className="w-5 h-5 text-blue-400" />
        <h3 className="text-lg font-semibold text-white">{title}</h3>
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );

  const InputField = ({ label, type = "text", value, onChange, placeholder = "", disabled = false, description = "" }: {
    label: string;
    type?: string;
    value: any;
    onChange: (value: any) => void;
    placeholder?: string;
    disabled?: boolean;
    description?: string;
  }) => (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
      {type === 'number' ? (
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value) || 0)}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 disabled:opacity-50"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 disabled:opacity-50"
        />
      )}
      {description && (
        <p className="mt-1 text-xs text-gray-400">{description}</p>
      )}
    </div>
  );

  const CheckboxField = ({ label, checked, onChange, description = "" }: {
    label: string;
    checked: boolean;
    onChange: (value: boolean) => void;
    description?: string;
  }) => (
    <div className="flex items-start space-x-3">
      <button
        onClick={() => onChange(!checked)}
        className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
          checked 
            ? 'bg-blue-500 border-blue-500' 
            : 'border-gray-600 hover:border-gray-500'
        }`}
      >
        {checked && <span className="text-white text-xs">✓</span>}
      </button>
      <div>
        <label className="text-sm font-medium text-gray-300 cursor-pointer" onClick={() => onChange(!checked)}>
          {label}
        </label>
        {description && (
          <p className="text-xs text-gray-400 mt-1">{description}</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="h-full overflow-y-auto p-6 space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Configuration Générale</h2>
        <p className="text-gray-400">Configurez les paramètres de base de votre campagne d'email</p>
      </div>

      {/* Sécurité */}
      <ConfigSection title="Sécurité & Authentification" icon={Shield}>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Code de Sécurité</label>
          <div className="relative">
            <input
              type={showSecurityCode ? "text" : "password"}
              value={config.SECURITY_CODE}
              onChange={(e) => updateConfig('SECURITY_CODE', e.target.value)}
              placeholder="Entrez le code de sécurité requis"
              className="w-full px-4 py-2 pr-12 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
            />
            <button
              type="button"
              onClick={() => setShowSecurityCode(!showSecurityCode)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
            >
              {showSecurityCode ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          <p className="mt-1 text-xs text-gray-400">Code requis pour utiliser l'application</p>
        </div>
      </ConfigSection>

      {/* Configuration SMTP */}
      <ConfigSection title="Serveur SMTP" icon={Server}>
        <CheckboxField
          label="Utiliser un serveur SMTP fixe"
          checked={config.USE_FIXED_SMTP}
          onChange={(value) => updateConfig('USE_FIXED_SMTP', value)}
          description="Si désactivé, utilise la résolution MX automatique"
        />
        
        <div className="grid grid-cols-2 gap-4">
          <InputField
            label="Serveur SMTP"
            value={config.SMTP_SERVER}
            onChange={(value) => updateConfig('SMTP_SERVER', value)}
            placeholder="smtp.exemple.com"
            disabled={!config.USE_FIXED_SMTP}
          />
          <InputField
            label="Port SMTP"
            type="number"
            value={config.SMTP_PORT}
            onChange={(value) => updateConfig('SMTP_PORT', value)}
            disabled={!config.USE_FIXED_SMTP}
          />
        </div>
      </ConfigSection>

      {/* Configuration Proxy */}
      <ConfigSection title="Proxy SOCKS5" icon={Globe}>
        <CheckboxField
          label="Utiliser un proxy SOCKS5"
          checked={config.USE_PROXY}
          onChange={(value) => updateConfig('USE_PROXY', value)}
          description="Routage des connexions via un proxy SOCKS5"
        />
        
        <div className="grid grid-cols-2 gap-4">
          <InputField
            label="Adresse du proxy"
            value={config.PROXY_HOST}
            onChange={(value) => updateConfig('PROXY_HOST', value)}
            placeholder="127.0.0.1"
            disabled={!config.USE_PROXY}
          />
          <InputField
            label="Port du proxy"
            type="number"
            value={config.PROXY_PORT}
            onChange={(value) => updateConfig('PROXY_PORT', value)}
            disabled={!config.USE_PROXY}
          />
        </div>

        {/* Rotation des ports */}
        <div className="mt-6 p-4 bg-gray-700/30 rounded-lg border border-gray-600/50">
          <CheckboxField
            label="Rotation automatique des ports"
            checked={config.PORT_ROTATE}
            onChange={(value) => updateConfig('PORT_ROTATE', value)}
            description="Change automatiquement de port proxy pour éviter les blocages"
          />
          
          {config.PORT_ROTATE && (
            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <InputField
                  label="Port de début"
                  type="number"
                  value={config.PORT_RANGE_START}
                  onChange={(value) => updateConfig('PORT_RANGE_START', value)}
                />
                <InputField
                  label="Port de fin"
                  type="number"
                  value={config.PORT_RANGE_END}
                  onChange={(value) => updateConfig('PORT_RANGE_END', value)}
                />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <InputField
                  label="Emails par port"
                  type="number"
                  value={config.EMAILS_PER_PORT_ROTATION}
                  onChange={(value) => updateConfig('EMAILS_PER_PORT_ROTATION', value)}
                  description="Rotation après X emails"
                />
                <InputField
                  label="Erreurs par port"
                  type="number"
                  value={config.ERRORS_PER_PORT_ROTATION}
                  onChange={(value) => updateConfig('ERRORS_PER_PORT_ROTATION', value)}
                  description="Rotation après X erreurs"
                />
                <InputField
                  label="Erreurs consécutives max"
                  type="number"
                  value={config.MAX_CONSECUTIVE_ERRORS}
                  onChange={(value) => updateConfig('MAX_CONSECUTIVE_ERRORS', value)}
                  description="Force la rotation"
                />
              </div>
            </div>
          )}
        </div>
      </ConfigSection>

      {/* Options de Debug et Retry */}
      <ConfigSection title="Options Avancées" icon={Settings2}>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <CheckboxField
              label="Mode Debug"
              checked={config.DEBUG_MODE}
              onChange={(value) => updateConfig('DEBUG_MODE', value)}
              description="Affiche des informations de débogage détaillées"
            />
            
            <CheckboxField
              label="Afficher les erreurs en temps réel"
              checked={config.SHOW_ERRORS_IN_PROGRESS}
              onChange={(value) => updateConfig('SHOW_ERRORS_IN_PROGRESS', value)}
              description="Affiche toutes les erreurs pendant l'envoi"
            />
          </div>
          
          <div className="space-y-4">
            <InputField
              label="Tentatives maximum"
              type="number"
              value={config.MAX_RETRIES}
              onChange={(value) => updateConfig('MAX_RETRIES', value)}
              description="Nombre de tentatives par email"
            />
            
            <InputField
              label="Délai entre tentatives (sec)"
              type="number"
              value={config.RETRY_DELAY}
              onChange={(value) => updateConfig('RETRY_DELAY', value)}
              description="Attente entre les tentatives"
            />
          </div>
        </div>
      </ConfigSection>

      {/* Informations système */}
      <div className="bg-blue-900/20 border border-blue-700/50 rounded-xl p-4">
        <div className="flex items-center space-x-3 mb-3">
          <AlertCircle className="w-5 h-5 text-blue-400" />
          <h4 className="font-semibold text-blue-300">Informations importantes</h4>
        </div>
        <ul className="space-y-2 text-sm text-blue-200">
          <li>• Le code de sécurité est vérifié automatiquement en ligne</li>
          <li>• La rotation des ports améliore la délivrabilité via proxy</li>
          <li>• Le mode debug peut ralentir l'envoi mais aide au diagnostic</li>
          <li>• Les tentatives multiples augmentent le taux de succès</li>
        </ul>
      </div>
    </div>
  );
}