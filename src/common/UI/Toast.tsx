//Un componente toast es para informar al usuario pero no interrumpe la experiencia

import { useEffect } from 'react';
import { IoCheckmarkCircleOutline, IoCloseCircleOutline, IoInformationCircleOutline } from 'react-icons/io5';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export const Toast = ({ message, type, isVisible, onClose, duration = 3000 }: ToastProps) => {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const icons = {
    success: <IoCheckmarkCircleOutline className="text-2xl" />,
    error: <IoCloseCircleOutline className="text-2xl" />,
    info: <IoInformationCircleOutline className="text-2xl" />
  };

  const styles = {
    success: 'bg-primary text-white',
    error: 'bg-accent text-white',
    info: 'bg-neutral-800 text-white'
  };

  return (
    <div className="fixed top-6 right-6 z-50 animate-slide-in-right">
      <div className={`${styles[type]} rounded-2xl shadow-2xl p-4 flex items-center gap-3 min-w-[300px] max-w-md`}>
        {icons[type]}
        <p className="font-bold flex-1">{message}</p>
        <button
          onClick={onClose}
          className="p-1 hover:bg-white/20 rounded-lg transition-colors"
          aria-label="Cerrar"
        >
          <IoCloseCircleOutline className="text-xl" />
        </button>
      </div>
    </div>
  );
};