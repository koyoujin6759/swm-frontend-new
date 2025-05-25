import { create } from 'zustand';

interface ToastStore {
  isToast: boolean;
  message: string;
  url?: string;
  urlText?: string;
  active?: boolean;
  icon?: string;
  showToast: (params: {
    message: string;
    url?: string;
    urlText?: string;
    active?: boolean;
    icon?: string;
  }) => void;
  hideToast: () => void;
}

interface ToastParams {
  message: string;
  url?: string;
  urlText?: string;
  active?: boolean;
  icon?: string;
}

export const useToastStore = create<ToastStore>((set) => ({
  isToast: false,
  message: '',
  url: '',
  urlText: '',
  active: false,
  icon: '',
  showToast: (params: ToastParams) =>
    set({
      isToast: true,
      message: params.message,
      url: params.url,
      urlText: params.urlText,
      active: params.active,
      icon: params.icon,
    }),
  hideToast: () =>
    set({
      isToast: false,
      message: '',
      url: '',
      urlText: '',
      active: false,
      icon: '',
    }),
}));
