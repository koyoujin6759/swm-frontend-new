'use client';

import { useToastStore } from '@/store/useToastStore';
import Toast from './Toast';
import { useEffect } from 'react';

export default function ToastContainer() { 
  const { isToast, message, url, urlText, active, icon, hideToast } = useToastStore(); 
  useEffect(() => {
    if (isToast) {
      setTimeout(() => {
        hideToast();
      }, 3000);
    }
  }, [isToast, hideToast]);
  return (
    <>
      <div
        className={`fixed bottom-0 left-0 right-0 h-[120px] w-full min-w-[300px] text-center toast-component ${
          isToast ? 'z-[100] animate-slide-up-fade' : 'z-[-10000]'
        }`}
      >
        <Toast
          isToast={isToast}
          message={message}
          url={url}
          urlText={urlText}
          active={active}
          icon={icon}
        />
      </div>
    </>
  );
}
