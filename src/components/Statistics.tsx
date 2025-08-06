import React from 'react';
import { TrendingUp, Mail, CheckCircle, XCircle, Clock, Zap, Globe, Shuffle } from 'lucide-react';

interface Stats {
  emailsSent: number;
  emailsSuccess: number;
  emailsError: number;
  currentRate: number;
  elapsedTime: number;
  currentPort: number;
  currentDomain: string;
  emailsOnPort: number;
  errorsOnPort: number;
}

interface StatisticsProps {
  stats: Stats;
  isRunning: boolean;
}

export default function Statistics({ stats, isRunning }: StatisticsProps) {
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const successRate = stats.emailsSent > 0 ? ((stats.emailsSuccess / stats.emailsSent) * 100) : 0;
  const errorRate = stats.emailsSent > 0 ? ((stats.emailsError / stats.emailsSent) * 100) : 0;

  const StatCard = ({ title, value, icon: Icon, color, subtitle = "", trend = "" }: {
    title: string;
    value: string | number;
    icon: any;
    color: string;
    subtitle?: string;
    trend?: string;
  }) => (
    <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/50">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg bg-${color}-500/20`}>
          <Icon className={`w-6 h-6 text-${color}-400`} />
        </div>
        {trend && (
          <div className="text-right">
            <div className="text-xs text-gray-400">{trend}</div>
          </div>
        )}
      </div>
      <div>
        <p className="text-2xl font-bold text-white mb-1">{value}</p>
        <p className="text-sm text-gray-400">{title}</p>
        {subtitle && (
          <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
        )}
      </div>
    </div>
  );

  const ProgressBar = ({ label, current, total, color }: {
    label: string;
    current: number;
    total: number;
    color: string;
  }) => {
    const percentage = total > 0 ? (current / total) * 100 : 0;
    return (
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-300">{label}</span>
          <span className="text-sm text-gray-400">{current}/{total}</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div
            className={`bg-${color}-500 h-2 rounded-full transition-all duration-500`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      </div>
    );
  };

  const ChartSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/50">
      <h3 className="text-lg font-semibold text-white mb-6 flex items-center space-x-2">
        <TrendingUp className="w-5 h-5 text-blue-400" />
        <span>{title}</span>
      </h3>
      {children}
    </div>
  );

  return (
    <div className="h-full overflow-y-auto p-6 space-y-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Statistiques en Temps Réel</h2>
            <p className="text-gray-400">Suivi des performances de votre campagne email</p>
          </div>
          <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
            isRunning ? 'bg-green-500/20 text-green-300' : 'bg-gray-700/50 text-gray-400'
          }`}>
            <div className={`w-2 h-2 rounded-full ${isRunning ? 'bg-green-400 animate-pulse' : 'bg-gray-500'}`} />
            <span className="text-sm font-medium">{isRunning ? 'Envoi en cours' : 'En attente'}</span>
          </div>
        </div>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Emails Envoyés"
          value={stats.emailsSent.toLocaleString()}
          icon={Mail}
          color="blue"
          subtitle="Total traité"
        />
        
        <StatCard
          title="Succès"
          value={stats.emailsSuccess.toLocaleString()}
          icon={CheckCircle}
          color="green"
          subtitle={`${successRate.toFixed(1)}% de réussite`}
        />
        
        <StatCard
          title="Erreurs"
          value={stats.emailsError.toLocaleString()}
          icon={XCircle}
          color="red"
          subtitle={`${errorRate.toFixed(1)}% d'échec`}
        />
        
        <StatCard
          title="Vitesse"
          value={stats.currentRate.toFixed(1)}
          icon={Zap}
          color="yellow"
          subtitle="emails/seconde"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Informations de session */}
        <ChartSection title="Session Actuelle">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-blue-400" />
                <span className="text-gray-300">Temps écoulé</span>
              </div>
              <span className="text-xl font-mono text-white">{formatTime(stats.elapsedTime)}</span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
              <div className="flex items-center space-x-3">
                <Globe className="w-5 h-5 text-purple-400" />
                <span className="text-gray-300">Port Proxy Actuel</span>
              </div>
              <span className="text-xl font-mono text-white">{stats.currentPort}</span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
              <div className="flex items-center space-x-3">
                <Shuffle className="w-5 h-5 text-green-400" />
                <span className="text-gray-300">Domaine Actuel</span>
              </div>
              <span className="text-lg text-white">{stats.currentDomain}</span>
            </div>
          </div>
        </ChartSection>

        {/* Progression par port */}
        <ChartSection title="Rotation des Ports">
          <div className="space-y-4">
            <ProgressBar
              label="Emails sur ce port"
              current={stats.emailsOnPort}
              total={50} // Limite configurée
              color="blue"
            />
            
            <ProgressBar
              label="Erreurs sur ce port"
              current={stats.errorsOnPort}
              total={2} // Limite configurée
              color="red"
            />
            
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="text-center p-3 bg-blue-500/10 rounded-lg">
                <p className="text-2xl font-bold text-blue-400">{stats.emailsOnPort}</p>
                <p className="text-xs text-gray-400">Emails ce port</p>
              </div>
              <div className="text-center p-3 bg-red-500/10 rounded-lg">
                <p className="text-2xl font-bold text-red-400">{stats.errorsOnPort}</p>
                <p className="text-xs text-gray-400">Erreurs ce port</p>
              </div>
            </div>
          </div>
        </ChartSection>
      </div>

      {/* Graphiques de tendance */}
      <ChartSection title="Performance Globale">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="relative w-24 h-24 mx-auto mb-4">
              <svg className="w-24 h-24 transform -rotate-90">
                <circle
                  cx="48"
                  cy="48"
                  r="44"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-gray-700"
                />
                <circle
                  cx="48"
                  cy="48"
                  r="44"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${successRate * 2.76} 276`}
                  className="text-green-500"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">{Math.round(successRate)}%</span>
              </div>
            </div>
            <p className="text-sm text-gray-400">Taux de Succès</p>
          </div>

          <div className="text-center">
            <div className="relative w-24 h-24 mx-auto mb-4">
              <svg className="w-24 h-24 transform -rotate-90">
                <circle
                  cx="48"
                  cy="48"
                  r="44"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-gray-700"
                />
                <circle
                  cx="48"
                  cy="48"
                  r="44"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${errorRate * 2.76} 276`}
                  className="text-red-500"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">{Math.round(errorRate)}%</span>
              </div>
            </div>
            <p className="text-sm text-gray-400">Taux d'Erreur</p>
          </div>

          <div className="text-center">
            <div className="relative w-24 h-24 mx-auto mb-4">
              <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">{stats.currentRate.toFixed(1)}</div>
                  <div className="text-xs text-gray-400">e/s</div>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-400">Vitesse Actuelle</p>
          </div>
        </div>
      </ChartSection>

      {/* Résumé rapide */}
      {stats.emailsSent > 0 && (
        <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-700/50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Résumé de Performance</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-blue-400">{stats.emailsSent}</p>
              <p className="text-xs text-gray-400">Total Traité</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-400">{Math.round(successRate)}%</p>
              <p className="text-xs text-gray-400">Réussite</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-400">{stats.currentRate.toFixed(1)}</p>
              <p className="text-xs text-gray-400">Emails/sec</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-400">{formatTime(stats.elapsedTime)}</p>
              <p className="text-xs text-gray-400">Durée</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}