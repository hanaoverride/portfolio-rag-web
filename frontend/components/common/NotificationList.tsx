"use client";

import React, { useEffect, useState } from 'react';
import { notificationsApi, Notification } from '@/lib/api';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Bell, Info, X } from 'lucide-react';

interface NotificationListProps {
  onClose?: () => void;
}

export const NotificationList: React.FC<NotificationListProps> = ({ onClose }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const data = await notificationsApi.list();
      setNotifications(data);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await notificationsApi.delete(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
      window.dispatchEvent(new CustomEvent('notificationsUpdated'));
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const handleDeleteAll = async () => {
    try {
      await notificationsApi.deleteAll();
      setNotifications([]);
      window.dispatchEvent(new CustomEvent('notificationsUpdated'));
    } catch (error) {
      console.error('Failed to delete all notifications:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md sm:max-w-xl glass rounded-2xl overflow-hidden shadow-2xl">
      <div className="p-4 border-b border-[var(--color-border)] flex justify-between items-center bg-[var(--color-bg-surface-elevated)]/50">
        <h3 className="text-lg font-semibold text-[var(--color-text-primary)] flex items-center gap-2">
          <Bell className="w-5 h-5 text-primary-500" />
          알림
        </h3>
        {onClose && (
          <button 
            onClick={onClose}
            className="p-1 hover:bg-[var(--color-neutral-100)] dark:hover:bg-white/10 rounded-full transition-colors text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
      
      <div className="max-h-[500px] overflow-y-auto custom-scrollbar">
        {notifications.length === 0 ? (
          <div className="p-12 text-center text-[var(--color-text-muted)] italic">
            새로운 알림이 없습니다.
          </div>
        ) : (
          <div className="divide-y divide-[var(--color-border-subtle)]">
            {notifications.map((notification) => (
              <div 
                key={notification.id} 
                className="p-5 transition-colors hover:bg-[var(--color-bg-page)]/50 flex gap-4 group relative"
              >
                <div className="flex-shrink-0 mt-1">
                  <div className="w-10 h-10 rounded-full bg-primary-500/10 flex items-center justify-center">
                    <Info className="w-5 h-5 text-primary-500" />
                  </div>
                </div>
                <div className="flex-grow min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <h4 className="text-base font-semibold text-[var(--color-text-primary)] truncate">
                      {notification.title}
                    </h4>
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] text-[var(--color-text-muted)] font-medium whitespace-nowrap">
                        {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true, locale: ko })}
                      </span>
                      <button
                        onClick={() => handleDelete(notification.id)}
                        className="p-1.5 opacity-0 group-hover:opacity-100 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-all text-[var(--color-text-muted)]"
                        title="삭제"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="mt-1.5 text-sm text-[var(--color-text-secondary)] leading-relaxed break-words">
                    {notification.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {notifications.length > 0 && (
        <div className="p-4 bg-[var(--color-bg-surface-elevated)]/50 border-t border-[var(--color-border)] text-center">
          <button 
            onClick={handleDeleteAll}
            className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-semibold transition-colors flex items-center justify-center gap-2 mx-auto"
          >
            모든 알림 삭제
          </button>
        </div>
      )}
    </div>
  );
};
