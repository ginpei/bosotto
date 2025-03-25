import React from 'react';
import Dialog from '../../../shared/components/Dialog';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message,
  confirmLabel = "OK", 
  cancelLabel = "Cancel"
}) => {
  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={title}
    >
      <div className="text-sm">
        <p className="mb-4">{message}</p>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded"
          >
            {cancelLabel}
          </button>
          <button
            autoFocus
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </Dialog>
  );
};

export default ConfirmDialog;