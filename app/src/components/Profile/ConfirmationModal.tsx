import { useEffect } from 'react';
import { useUserStore } from '../../stores/user.store';
import { Button } from '../common/Button';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmationModal = ({ isOpen, onClose, onConfirm }: ConfirmationModalProps) => {
  if (!isOpen) return null;

  return (
    <div
      className="modal fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h3
          id="modal-title"
          className="text-lg font-semibold text-gray-900 mb-3"
        >
          ¿Salir sin guardar cambios?
        </h3>
        <p className="text-gray-600 mb-6">
          Tienes cambios sin guardar. Si sales ahora, perderás todos los cambios realizados.
        </p>
        <div className="flex justify-end gap-3">
          <Button
            variant="secondary"
            onClick={onClose}
            className="px-4 py-2"
          >
            Cancelar
          </Button>
          <Button
            onClick={onConfirm}
            className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white"
          >
            Sí, salir
          </Button>
        </div>
      </div>
    </div>
  );
};

// Hook para prevenir salida sin guardar cambios
export const useConfirmUnsavedChanges = () => {
  const isDirty = useUserStore((state) => state.isDirty);  // ← Mejor forma (selector)

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        // Mensaje estándar en la mayoría de navegadores modernos
        e.returnValue = 'Tienes cambios sin guardar. ¿Estás seguro de querer salir?';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isDirty]);

  return { isDirty };
};

export default ConfirmationModal;