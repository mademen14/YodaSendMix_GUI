import React, { useState } from 'react';
import { Users, Plus, Upload, Download, Trash2, Eye, Globe, FileText, Search } from 'lucide-react';

interface Config {
  EMAIL_LIST_FILE: string;
  SENDER_DOMAIN_List: string;
}

interface EmailListsProps {
  config: Config;
  setConfig: React.Dispatch<React.SetStateAction<Config>>;
}

export default function EmailLists({ config, setConfig }: EmailListsProps) {
  const [emailList, setEmailList] = useState<string[]>([]);
  const [domainList, setDomainList] = useState<string[]>([]);
  const [fixedUsers, setFixedUsers] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'emails' | 'domains' | 'users'>('emails');
  const [searchTerm, setSearchTerm] = useState('');
  const [newItem, setNewItem] = useState('');

  // Mock data pour la démo
  React.useEffect(() => {
    setEmailList([
      'user1@exemple.com',
      'contact@test.fr',
      'admin@demo.org',
      'support@company.net',
      'info@business.com'
    ]);
    setDomainList([
      'vialis.net',
      'exemple.com',
      'test.fr',
      'demo.org',
      'company.net'
    ]);
    setFixedUsers([
      'infocetelem',
      'support',
      'contact',
      'admin',
      'service'
    ]);
  }, []);

  const updateConfig = (key: keyof Config, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const filteredEmails = emailList.filter(email => 
    email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredDomains = domainList.filter(domain => 
    domain.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredUsers = fixedUsers.filter(user => 
    user.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addItem = (type: 'emails' | 'domains' | 'users') => {
    if (!newItem.trim()) return;

    switch (type) {
      case 'emails':
        if (newItem.includes('@') && !emailList.includes(newItem)) {
          setEmailList(prev => [...prev, newItem]);
        }
        break;
      case 'domains':
        if (newItem.includes('.') && !domainList.includes(newItem)) {
          setDomainList(prev => [...prev, newItem]);
        }
        break;
      case 'users':
        if (!fixedUsers.includes(newItem)) {
          setFixedUsers(prev => [...prev, newItem]);
        }
        break;
    }
    setNewItem('');
  };

  const removeItem = (type: 'emails' | 'domains' | 'users', index: number) => {
    switch (type) {
      case 'emails':
        setEmailList(prev => prev.filter((_, i) => i !== index));
        break;
      case 'domains':
        setDomainList(prev => prev.filter((_, i) => i !== index));
        break;
      case 'users':
        setFixedUsers(prev => prev.filter((_, i) => i !== index));
        break;
    }
  };

  const handleFileUpload = (type: 'emails' | 'domains' | 'users') => {
    // TODO: Implémenter l'upload de fichier
    console.log(`Upload fichier pour ${type}`);
  };

  const exportList = (type: 'emails' | 'domains' | 'users') => {
    // TODO: Implémenter l'export
    console.log(`Export liste ${type}`);
  };

  const tabs = [
    { id: 'emails', label: 'Liste Emails', icon: Users, count: emailList.length },
    { id: 'domains', label: 'Domaines', icon: Globe, count: domainList.length },
    { id: 'users', label: 'Utilisateurs Fixes', icon: FileText, count: fixedUsers.length }
  ];

  const ListSection = ({ title, items, type, placeholder }: {
    title: string;
    items: string[];
    type: 'emails' | 'domains' | 'users';
    placeholder: string;
  }) => (
    <div className="space-y-4">
      {/* En-tête avec actions */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <p className="text-sm text-gray-400">{items.length} éléments</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => handleFileUpload(type)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg transition-colors"
          >
            <Upload className="w-4 h-4" />
            <span>Importer</span>
          </button>
          <button
            onClick={() => exportList(type)}
            className="flex items-center space-x-2 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-300 rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Exporter</span>
          </button>
        </div>
      </div>

      {/* Ajout d'élément */}
      <div className="flex space-x-2">
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder={placeholder}
          className="flex-1 px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          onKeyPress={(e) => e.key === 'Enter' && addItem(type)}
        />
        <button
          onClick={() => addItem(type)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Ajouter</span>
        </button>
      </div>

      {/* Recherche */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Rechercher..."
          className="w-full pl-10 pr-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
        />
      </div>

      {/* Liste des éléments */}
      <div className="bg-gray-800/30 rounded-xl border border-gray-700/50 max-h-96 overflow-y-auto">
        {items.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Eye className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-400">Aucun élément dans cette liste</p>
            <p className="text-sm text-gray-500 mt-1">Ajoutez des éléments ou importez un fichier</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-700/50">
            {items.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 hover:bg-gray-700/20 transition-colors">
                <div className="flex-1">
                  <p className="text-white font-medium">{item}</p>
                  {type === 'emails' && (
                    <p className="text-sm text-gray-400">{item.split('@')[1]}</p>
                  )}
                </div>
                <button
                  onClick={() => removeItem(type, index)}
                  className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="h-full overflow-y-auto p-6 space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Gestion des Listes & Domaines</h2>
        <p className="text-gray-400">Gérez vos listes d'emails, domaines d'expéditeur et utilisateurs fixes</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-700/50">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                setSearchTerm('');
                setNewItem('');
              }}
              className={`flex items-center space-x-2 px-1 py-4 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-300'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
              <span className="px-2 py-1 bg-gray-700/50 rounded-full text-xs">
                {tab.count}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Configuration des fichiers */}
      <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/50">
        <h3 className="text-lg font-semibold text-white mb-4">Configuration des Fichiers</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Fichier liste emails
            </label>
            <input
              type="text"
              value={config.EMAIL_LIST_FILE}
              onChange={(e) => updateConfig('EMAIL_LIST_FILE', e.target.value)}
              placeholder="liste.txt"
              className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Fichier domaines expéditeur
            </label>
            <input
              type="text"
              value={config.SENDER_DOMAIN_List}
              onChange={(e) => updateConfig('SENDER_DOMAIN_List', e.target.value)}
              placeholder="dom.txt"
              className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
        </div>
      </div>

      {/* Contenu des tabs */}
      {activeTab === 'emails' && (
        <ListSection
          title="Liste des Destinataires"
          items={filteredEmails}
          type="emails"
          placeholder="email@exemple.com"
        />
      )}

      {activeTab === 'domains' && (
        <ListSection
          title="Domaines d'Expéditeur"
          items={filteredDomains}
          type="domains"
          placeholder="exemple.com"
        />
      )}

      {activeTab === 'users' && (
        <ListSection
          title="Utilisateurs Fixes"
          items={filteredUsers}
          type="users"
          placeholder="nom.utilisateur"
        />
      )}

      {/* Statistiques rapides */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-blue-900/20 border border-blue-700/50 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-blue-400 mb-1">{emailList.length}</div>
          <div className="text-sm text-gray-400">Emails</div>
        </div>
        <div className="bg-purple-900/20 border border-purple-700/50 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-purple-400 mb-1">{domainList.length}</div>
          <div className="text-sm text-gray-400">Domaines</div>
        </div>
        <div className="bg-green-900/20 border border-green-700/50 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-green-400 mb-1">{fixedUsers.length}</div>
          <div className="text-sm text-gray-400">Utilisateurs</div>
        </div>
      </div>
    </div>
  );
}