import React, { useState } from 'react';
import { Mail, User, Hash, MessageSquare, FileText, Upload, Shuffle, Target } from 'lucide-react';

interface Config {
  EMAIL_SUBJECT: string;
  SENDER_NAME: string;
  EMAIL_USERNAME: string;
  SENDER_DOMAIN: string;
  SENDER_DOMAIN_ROTATE: boolean;
  SENDER_DOMAIN_List: string;
  EMAILS_PER_DOMAIN_ROTATION: number;
  USERNAME_MODE: string;
  USERNAME_FORMAT: string;
  TOKEN_FORMAT: string;
  TOKEN_LENGTH: number;
  ADD_TOKEN_TO_SUBJECT: boolean;
  USE_BCC_MODE: boolean;
  BCC_TO_ADDRESS: string;
  BCC_TO_NAME: string;
  BCC_BATCH_SIZE: number;
  MESSAGE_FILE: string;
  ATTACHMENT_DIR: string;
}

interface EmailSettingsProps {
  config: Config;
  setConfig: React.Dispatch<React.SetStateAction<Config>>;
}

export default function EmailSettings({ config, setConfig }: EmailSettingsProps) {
  const [messagePreview, setMessagePreview] = useState('');
  const [tokenPreview, setTokenPreview] = useState('');

  const updateConfig = (key: keyof Config, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const generateTokenPreview = () => {
    const format = config.TOKEN_FORMAT;
    let preview = format;
    
    // Remplacer les # par des caractères aléatoires
    preview = preview.replace(/#/g, () => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      return chars[Math.floor(Math.random() * chars.length)];
    });
    
    setTokenPreview(preview);
  };

  React.useEffect(() => {
    generateTokenPreview();
  }, [config.TOKEN_FORMAT]);

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

  const InputField = ({ label, type = "text", value, onChange, placeholder = "", description = "" }: {
    label: string;
    type?: string;
    value: any;
    onChange: (value: any) => void;
    placeholder?: string;
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
          className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
        />
      ) : type === 'textarea' ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 resize-none"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
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

  const SelectField = ({ label, value, onChange, options, description = "" }: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: { value: string; label: string }[];
    description?: string;
  }) => (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {description && (
        <p className="mt-1 text-xs text-gray-400">{description}</p>
      )}
    </div>
  );

  return (
    <div className="h-full overflow-y-auto p-6 space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Configuration Email & Messages</h2>
        <p className="text-gray-400">Configurez le contenu et les paramètres d'expédition de vos emails</p>
      </div>

      {/* Configuration de l'expéditeur */}
      <ConfigSection title="Configuration de l'Expéditeur" icon={User}>
        <SelectField
          label="Mode nom d'utilisateur"
          value={config.USERNAME_MODE}
          onChange={(value) => updateConfig('USERNAME_MODE', value)}
          options={[
            { value: 'FIXED_SINGLE', label: 'Utilisateur fixe unique' },
            { value: 'FIXED_MULTIPLE', label: 'Rotation entre utilisateurs fixes' },
            { value: 'RANDOM_GENERATED', label: 'Génération aléatoire' }
          ]}
          description="Détermine comment les noms d'utilisateur expéditeur sont générés"
        />
        
        <div className="grid grid-cols-2 gap-4">
          <InputField
            label="Nom de l'expéditeur"
            value={config.SENDER_NAME}
            onChange={(value) => updateConfig('SENDER_NAME', value)}
            placeholder="Nom qui apparaîtra comme expéditeur"
            description="Supporte les hashtags (# = caractère aléatoire)"
          />
          <InputField
            label="Username email"
            value={config.EMAIL_USERNAME}
            onChange={(value) => updateConfig('EMAIL_USERNAME', value)}
            placeholder="nom.utilisateur"
            description="Partie avant @ de l'email expéditeur"
          />
        </div>

        {config.USERNAME_MODE === 'RANDOM_GENERATED' && (
          <InputField
            label="Format username aléatoire"
            value={config.USERNAME_FORMAT}
            onChange={(value) => updateConfig('USERNAME_FORMAT', value)}
            placeholder="user###@domain.com"
            description="Format avec hashtags: # = 1 caractère, ## = 2 caractères, etc."
          />
        )}

        {/* Domaines d'expéditeur */}
        <div className="p-4 bg-gray-700/30 rounded-lg border border-gray-600/50">
          <CheckboxField
            label="Rotation automatique des domaines"
            checked={config.SENDER_DOMAIN_ROTATE}
            onChange={(value) => updateConfig('SENDER_DOMAIN_ROTATE', value)}
            description="Change automatiquement de domaine expéditeur"
          />
          
          {config.SENDER_DOMAIN_ROTATE ? (
            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <InputField
                  label="Fichier liste domaines"
                  value={config.SENDER_DOMAIN_List}
                  onChange={(value) => updateConfig('SENDER_DOMAIN_List', value)}
                  placeholder="dom.txt"
                  description="Fichier contenant la liste des domaines"
                />
                <InputField
                  label="Emails par domaine"
                  type="number"
                  value={config.EMAILS_PER_DOMAIN_ROTATION}
                  onChange={(value) => updateConfig('EMAILS_PER_DOMAIN_ROTATION', value)}
                  description="Rotation après X emails"
                />
              </div>
            </div>
          ) : (
            <div className="mt-4">
              <InputField
                label="Domaine expéditeur fixe"
                value={config.SENDER_DOMAIN}
                onChange={(value) => updateConfig('SENDER_DOMAIN', value)}
                placeholder="exemple.com"
              />
            </div>
          )}
        </div>
      </ConfigSection>

      {/* Configuration du sujet et des tokens */}
      <ConfigSection title="Sujet & Tokens" icon={Hash}>
        <InputField
          label="Sujet de l'email"
          value={config.EMAIL_SUBJECT}
          onChange={(value) => updateConfig('EMAIL_SUBJECT', value)}
          placeholder="Sujet de votre campagne email"
          description="Supporte les hashtags pour la randomisation"
        />

        <CheckboxField
          label="Ajouter un token au sujet"
          checked={config.ADD_TOKEN_TO_SUBJECT}
          onChange={(value) => updateConfig('ADD_TOKEN_TO_SUBJECT', value)}
          description="Ajoute automatiquement un token unique à chaque email"
        />

        {config.ADD_TOKEN_TO_SUBJECT && (
          <div className="p-4 bg-gray-700/30 rounded-lg border border-gray-600/50 space-y-4">
            <InputField
              label="Format du token"
              value={config.TOKEN_FORMAT}
              onChange={(value) => updateConfig('TOKEN_FORMAT', value)}
              placeholder="Ref-####-########"
              description="Format: # = caractère aléatoire. Exemple: Ref-#### génère Ref-A7K9"
            />
            
            <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
              <div>
                <span className="text-sm text-gray-300">Aperçu du token:</span>
                <p className="text-lg font-mono text-green-400">{tokenPreview}</p>
              </div>
              <button
                onClick={generateTokenPreview}
                className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg transition-colors"
              >
                Régénérer
              </button>
            </div>
          </div>
        )}
      </ConfigSection>

      {/* Mode BCC */}
      <ConfigSection title="Mode BCC (Copie Cachée)" icon={Target}>
        <CheckboxField
          label="Utiliser le mode BCC"
          checked={config.USE_BCC_MODE}
          onChange={(value) => updateConfig('USE_BCC_MODE', value)}
          description="Envoie les emails en lots avec destinataires cachés"
        />
        
        {config.USE_BCC_MODE && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="Email destinataire visible"
                value={config.BCC_TO_ADDRESS}
                onChange={(value) => updateConfig('BCC_TO_ADDRESS', value)}
                placeholder="contact@exemple.com"
                description="Seul destinataire visible dans l'en-tête"
              />
              <InputField
                label="Nom destinataire visible"
                value={config.BCC_TO_NAME}
                onChange={(value) => updateConfig('BCC_TO_NAME', value)}
                placeholder="Service Client"
              />
            </div>
            
            <InputField
              label="Taille des lots BCC"
              type="number"
              value={config.BCC_BATCH_SIZE}
              onChange={(value) => updateConfig('BCC_BATCH_SIZE', value)}
              description="Nombre de destinataires cachés par email"
            />
          </div>
        )}
      </ConfigSection>

      {/* Fichiers et contenu */}
      <ConfigSection title="Fichiers & Contenu" icon={FileText}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <InputField
              label="Fichier message HTML"
              value={config.MESSAGE_FILE}
              onChange={(value) => updateConfig('MESSAGE_FILE', value)}
              placeholder="message.html"
              description="Fichier contenant le corps de l'email"
            />
            <button className="mt-2 flex items-center space-x-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg transition-colors">
              <Upload className="w-4 h-4" />
              <span>Charger fichier</span>
            </button>
          </div>
          
          <div>
            <InputField
              label="Dossier pièces jointes"
              value={config.ATTACHMENT_DIR}
              onChange={(value) => updateConfig('ATTACHMENT_DIR', value)}
              placeholder="attachments"
              description="Dossier contenant les fichiers à joindre"
            />
            <button className="mt-2 flex items-center space-x-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg transition-colors">
              <Upload className="w-4 h-4" />
              <span>Sélectionner dossier</span>
            </button>
          </div>
        </div>

        {messagePreview && (
          <div className="p-4 bg-gray-700/30 rounded-lg border border-gray-600/50">
            <h4 className="font-semibold text-gray-300 mb-2">Aperçu du message:</h4>
            <div 
              className="bg-white p-4 rounded-lg max-h-40 overflow-y-auto text-sm"
              dangerouslySetInnerHTML={{ __html: messagePreview }}
            />
          </div>
        )}
      </ConfigSection>

      {/* Guide des hashtags */}
      <div className="bg-purple-900/20 border border-purple-700/50 rounded-xl p-4">
        <div className="flex items-center space-x-3 mb-3">
          <Hash className="w-5 h-5 text-purple-400" />
          <h4 className="font-semibold text-purple-300">Système de Hashtags</h4>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm text-purple-200">
          <div>
            <p className="font-medium mb-2">Formats supportés:</p>
            <ul className="space-y-1">
              <li><code className="bg-purple-800/30 px-2 py-1 rounded">#</code> = 1 caractère (ex: A, 7, K)</li>
              <li><code className="bg-purple-800/30 px-2 py-1 rounded">##</code> = 2 caractères (ex: K4, B9)</li>
              <li><code className="bg-purple-800/30 px-2 py-1 rounded">###</code> = 3 caractères (ex: A7F, M3K)</li>
            </ul>
          </div>
          <div>
            <p className="font-medium mb-2">Exemples:</p>
            <ul className="space-y-1">
              <li><code className="bg-purple-800/30 px-2 py-1 rounded">user###</code> → user7AF</li>
              <li><code className="bg-purple-800/30 px-2 py-1 rounded">Ref-####</code> → Ref-M3K8</li>
              <li><code className="bg-purple-800/30 px-2 py-1 rounded">ID##-##</code> → ID7F-K3</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}