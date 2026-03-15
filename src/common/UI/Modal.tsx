//Un componente modal interfiere la experiencia de usuario hasta que este haga algo, como confirmar o cancelar
import { useEffect } from 'react';
import { IoCloseOutline } from 'react-icons/io5';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

export const Modal = ({ isOpen, onClose, children, title }: ModalProps) => {
  // Cerrar con ESC
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {title && (
          <div className="flex items-center justify-between p-6 border-b border-neutral-100">
            <h2 className="text-2xl font-black text-neutral-900">{title}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-neutral-100 rounded-xl transition-colors"
              aria-label="Cerrar"
            >
              <IoCloseOutline className="text-2xl text-neutral-400" />
            </button>
          </div>
        )}
        {/* Contenido */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};