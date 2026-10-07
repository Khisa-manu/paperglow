import React, { useState } from 'react';
import { RefreshCw, Database } from 'lucide-react';

interface CloudSyncIndicatorProps {
  appName: string;
  isSyncing?: boolean;
  isOnline?: boolean;
  onManualSync?: () => void;
  className?: string;
}

export const CloudSyncIndicator: React.FC<CloudSyncIndicatorProps> = ({
  appName,
  isSyncing = false,
  isOnline = true,
  onManualSync,
  className = '',
}) => {
  const [justSynced, setJustSynced] = useState(false);

  const handleSyncClick = () => {
    if (onManualSync) {
      onManualSync();
      setJustSynced(true);
      setTimeout(() => setJustSynced(false), 2000);
    }
  };

  return (
    <div
      className={`inline-flex items-center gap-2 px-2.5 py-1 text-xs font-medium rounded-md border transition-all ${
        isOnline
          ? 'bg-emerald-50/80 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60'
          : 'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/60'
      } ${className}`}
      title={`${appName} is connected to Paperglow Multi-Tenant Cloud Database (DirectAdmin MariaDB)`}
    >
      <span className="flex items-center gap-1.5">
        <Database className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
        <span className="hidden sm:inline">MariaDB Cloud:</span>
        <span className="font-semibold">{isSyncing ? 'Syncing...' : justSynced ? 'Synced!' : 'Active'}</span>
      </span>

      {onManualSync && (
        <button
          onClick={handleSyncClick}
          disabled={isSyncing}
          className="p-0.5 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 rounded transition-colors text-emerald-700 dark:text-emerald-300"
          title="Refresh from cloud database"
        >
          <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
        </button>
      )}
    </div>
  );
};
