import React, { useState } from 'react';
import {
  AlertCircle,
  RefreshCw,
  Plus,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Inbox,
  SearchX,
} from 'lucide-react';

/**
 * 1. Skeleton Loader for Dashboards
 */
export const DashboardSkeleton: React.FC<{ cards?: number }> = ({ cards = 4 }) => {
  return (
    <div className="space-y-6 animate-pulse" aria-busy="true" aria-label="Loading dashboard data">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#14171d] p-5 rounded-xl border border-neutral-200/80 dark:border-neutral-800">
        <div className="space-y-2.5">
          <div className="h-3.5 w-28 bg-neutral-200 dark:bg-neutral-800 rounded" />
          <div className="h-6 w-64 bg-neutral-200 dark:bg-neutral-800 rounded" />
          <div className="h-3.5 w-48 bg-neutral-100 dark:bg-neutral-800/60 rounded" />
        </div>
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-28 bg-neutral-200 dark:bg-neutral-800 rounded-lg" />
          <div className="h-9 w-32 bg-red-600/20 dark:bg-red-900/30 rounded-lg" />
        </div>
      </div>

      {/* KPI Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: cards }).map((_, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-[#14171d] p-5 rounded-xl border border-neutral-200/80 dark:border-neutral-800 space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="h-3 w-24 bg-neutral-200 dark:bg-neutral-800 rounded" />
              <div className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800" />
            </div>
            <div className="h-7 w-32 bg-neutral-200 dark:bg-neutral-800 rounded" />
            <div className="h-3 w-20 bg-neutral-100 dark:bg-neutral-800/70 rounded" />
          </div>
        ))}
      </div>

      {/* Main Content Split Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-[#14171d] p-5 rounded-xl border border-neutral-200/80 dark:border-neutral-800 space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
            <div className="h-4 w-40 bg-neutral-200 dark:bg-neutral-800 rounded" />
            <div className="h-3.5 w-16 bg-neutral-100 dark:bg-neutral-800 rounded" />
          </div>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((row) => (
              <div key={row} className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-neutral-100 dark:bg-neutral-800" />
                  <div className="space-y-1.5">
                    <div className="h-3.5 w-36 bg-neutral-200 dark:bg-neutral-800 rounded" />
                    <div className="h-2.5 w-24 bg-neutral-100 dark:bg-neutral-800/70 rounded" />
                  </div>
                </div>
                <div className="h-4 w-20 bg-neutral-200 dark:bg-neutral-800 rounded" />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-[#14171d] p-5 rounded-xl border border-neutral-200/80 dark:border-neutral-800 space-y-4">
          <div className="h-4 w-32 bg-neutral-200 dark:bg-neutral-800 rounded" />
          <div className="space-y-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/40 space-y-2">
                <div className="h-3.5 w-28 bg-neutral-200 dark:bg-neutral-700 rounded" />
                <div className="h-2.5 w-full bg-neutral-100 dark:bg-neutral-800 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * 2. Skeleton Loader for Tables & Lists
 */
export const TableSkeleton: React.FC<{ rows?: number; columns?: number }> = ({
  rows = 5,
  columns = 5,
}) => {
  return (
    <div className="bg-white dark:bg-[#14171d] rounded-xl border border-neutral-200/80 dark:border-neutral-800 overflow-hidden animate-pulse">
      <div className="px-5 py-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
        <div className="h-4 w-40 bg-neutral-200 dark:bg-neutral-800 rounded" />
        <div className="h-8 w-48 bg-neutral-100 dark:bg-neutral-800 rounded-lg" />
      </div>
      <div className="divide-y divide-neutral-100 dark:divide-neutral-800/70">
        {Array.from({ length: rows }).map((_, rIdx) => (
          <div key={rIdx} className="px-5 py-3.5 flex items-center justify-between gap-4">
            {Array.from({ length: columns }).map((__, cIdx) => (
              <div
                key={cIdx}
                className={`h-3.5 bg-neutral-200/80 dark:bg-neutral-800 rounded ${
                  cIdx === 0 ? 'w-36' : cIdx === columns - 1 ? 'w-16' : 'w-24'
                }`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * 3. Reusable Polished Empty State
 */
export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  isSearchEmpty?: boolean;
  compact?: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  isSearchEmpty = false,
  compact = false,
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center bg-white dark:bg-[#14171d] rounded-xl border border-dashed border-neutral-200 dark:border-neutral-800 ${
        compact ? 'py-8 px-4' : 'py-12 px-6'
      }`}
    >
      <div className="w-11 h-11 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/40 flex items-center justify-center text-red-600 dark:text-red-400 mb-3.5">
        {icon || (isSearchEmpty ? <SearchX className="w-5 h-5" /> : <Inbox className="w-5 h-5" />)}
      </div>
      <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{title}</h3>
      <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-sm mt-1 leading-relaxed">
        {description}
      </p>
      {(actionLabel || secondaryActionLabel) && (
        <div className="flex flex-wrap items-center justify-center gap-2.5 mt-4">
          {actionLabel && onAction && (
            <button
              type="button"
              onClick={onAction}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-red-600 hover:bg-red-700 active:scale-[0.99] text-white shadow-xs transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{actionLabel}</span>
            </button>
          )}
          {secondaryActionLabel && onSecondaryAction && (
            <button
              type="button"
              onClick={onSecondaryAction}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 transition-colors cursor-pointer"
            >
              <span>{secondaryActionLabel}</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

/**
 * 4. Friendly Error State with Retry Action
 */
export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Unable to load workspace data',
  message = 'We encountered a temporary issue loading this view. Your saved records are safe.',
  onRetry,
}) => {
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = () => {
    if (!onRetry) return;
    setIsRetrying(true);
    setTimeout(() => {
      setIsRetrying(false);
      onRetry();
    }, 300);
  };

  return (
    <div className="flex flex-col items-center justify-center text-center py-10 px-6 bg-red-50/50 dark:bg-red-950/10 rounded-xl border border-red-200/80 dark:border-red-900/40">
      <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/40 flex items-center justify-center text-red-600 dark:text-red-400 mb-3">
        <AlertCircle className="w-5 h-5" />
      </div>
      <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{title}</h3>
      <p className="text-xs text-neutral-600 dark:text-neutral-400 max-w-md mt-1">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={handleRetry}
          disabled={isRetrying}
          className="mt-4 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-900 dark:text-neutral-100 border border-neutral-300 dark:border-neutral-700 shadow-2xs transition-all cursor-pointer disabled:opacity-60"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRetrying ? 'animate-spin text-red-600' : ''}`} />
          <span>{isRetrying ? 'Retrying...' : 'Try Again'}</span>
        </button>
      )}
    </div>
  );
};

/**
 * 5. Micro-interaction Action Button with Loading & Confirmation Feedback
 */
export interface ActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  loadingText?: string;
  showSuccess?: boolean;
  successText?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  children,
  isLoading = false,
  loadingText = 'Saving...',
  showSuccess = false,
  successText = 'Saved',
  variant = 'primary',
  size = 'md',
  icon,
  className = '',
  disabled,
  ...props
}) => {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs min-h-[34px]',
    md: 'px-4 py-2 text-xs min-h-[38px]',
    lg: 'px-5 py-2.5 text-sm min-h-[42px]',
  }[size];

  const variantClasses = {
    primary:
      'bg-red-600 hover:bg-red-700 text-white shadow-xs border border-transparent',
    secondary:
      'bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:hover:bg-neutral-200 text-white dark:text-neutral-900 border border-transparent',
    outline:
      'bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700',
    danger:
      'bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-950/60 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/50',
  }[variant];

  return (
    <button
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center gap-1.5 font-semibold rounded-lg transition-all duration-150 active:scale-[0.99] disabled:opacity-60 disabled:pointer-events-none cursor-pointer ${sizeClasses} ${variantClasses} ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
          <span>{loadingText}</span>
        </>
      ) : showSuccess ? (
        <>
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>{successText}</span>
        </>
      ) : (
        <>
          {icon && <span className="shrink-0">{icon}</span>}
          <span>{children}</span>
        </>
      )}
    </button>
  );
};

/**
 * 6. Dashboard View-All Footer Link for Compact Lists
 */
export const ViewAllFooter: React.FC<{
  totalCount: number;
  visibleCount: number;
  label?: string;
  onViewAll: () => void;
}> = ({ totalCount, visibleCount, label = 'View all records', onViewAll }) => {
  return (
    <div className="px-5 py-3 bg-neutral-50/70 dark:bg-neutral-900/40 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between text-xs">
      <span className="text-neutral-500 dark:text-neutral-400">
        Showing <strong className="font-semibold text-neutral-700 dark:text-neutral-300">{Math.min(visibleCount, totalCount)}</strong> of{' '}
        <strong className="font-semibold text-neutral-700 dark:text-neutral-300">{totalCount}</strong>
      </span>
      <button
        type="button"
        onClick={onViewAll}
        className="inline-flex items-center gap-1 font-semibold text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors cursor-pointer"
      >
        <span>{label}</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

/**
 * 7. Clean Segmented Tabs for Dashboard Density Reduction
 */
export interface DashboardTabItem {
  id: string;
  label: string;
  count?: number;
  badgeColor?: 'default' | 'red' | 'amber' | 'emerald';
}

export const DashboardTabs: React.FC<{
  tabs: DashboardTabItem[];
  activeTab: string;
  onChange: (id: string) => void;
}> = ({ tabs, activeTab, onChange }) => {
  return (
    <div className="flex items-center gap-1 p-1 bg-neutral-200/70 dark:bg-neutral-800/80 rounded-lg w-fit max-w-full overflow-x-auto no-scrollbar">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer ${
              isActive
                ? 'bg-white dark:bg-[#14171d] text-neutral-900 dark:text-neutral-100 shadow-2xs'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
            }`}
          >
            <span>{tab.label}</span>
            {typeof tab.count === 'number' && (
              <span
                className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                  isActive
                    ? tab.badgeColor === 'red'
                      ? 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-400'
                      : 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300'
                    : 'bg-neutral-300/60 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-400'
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
