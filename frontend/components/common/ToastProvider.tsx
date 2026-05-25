'use client';

import * as Toast from '@radix-ui/react-toast';
import { X, CheckCircle2, AlertCircle } from 'lucide-react';
import { ToastProvider as ToastStateProvider, useToast } from '@/lib/hooks/useToast';
import { cn } from '@/lib/utils';

function ToastUI() {
  const { toasts, removeToast } = useToast();

  return (
    <>
      <Toast.Viewport className="fixed bottom-0 right-0 p-4 flex flex-col gap-3 max-w-sm w-full z-50" />
      {toasts.map((toast) => (
        <Toast.Root
          key={toast.id}
          data-type={toast.type}
          open={toast.visible}
          onOpenChange={(open) => {
            if (!open) removeToast(toast.id);
          }}
          className={cn(
            'relative flex items-center gap-3 rounded-2xl shadow-xl p-4 pr-10 backdrop-blur-xl border animate-slide-in-right',
            toast.type === 'success' && 'bg-primary-600/90 border-primary-500/30 text-white',
            toast.type === 'error' && 'bg-red-600/90 border-red-500/30 text-white'
          )}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="h-5 w-5 shrink-0 text-white/80" />
          ) : (
            <AlertCircle className="h-5 w-5 shrink-0 text-white/80" />
          )}
          <Toast.Title className="text-sm font-medium leading-5">
            {toast.message}
          </Toast.Title>
          {toast.action && (
            <Toast.Action
              altText={toast.action.label}
              onClick={(e) => {
                e.preventDefault();
                toast.action?.onClick();
                removeToast(toast.id);
              }}
              className="ml-auto mr-1 text-xs font-bold underline hover:text-white/85 shrink-0 cursor-pointer transition-colors bg-white/10 hover:bg-white/20 px-2 py-1 rounded-md"
            >
              {toast.action.label}
            </Toast.Action>
          )}
          <Toast.Close
            className="absolute top-3.5 right-3 inline-flex items-center justify-center rounded-full p-1 text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200"
            aria-label="Close toast"
          >
            <X className="h-3.5 w-3.5" />
          </Toast.Close>
        </Toast.Root>
      ))}
    </>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  return (
    <ToastStateProvider>
      <Toast.Provider swipeDirection="right" label="Notifications">
        {children}
        <ToastUI />
      </Toast.Provider>
    </ToastStateProvider>
  );
}
