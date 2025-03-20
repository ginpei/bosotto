import React, { useEffect, useRef } from 'react';
import './dialog.css';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Dialog: React.FC<DialogProps> = ({ isOpen, onClose, title, children }) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (isOpen && dialogRef.current) {
      dialogRef.current.showModal();
    } else if (dialogRef.current && dialogRef.current.open) {
      dialogRef.current.close();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (isOpen && e.key === 'Escape') {
        e.preventDefault(); // Prevent default Escape behavior
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  // Native dialog element already handles outside clicks to close

  return (
    <dialog
      ref={dialogRef}
      className="p-0 rounded-lg shadow-xl border-0 max-w-md"
      onClick={(e) => {
        // Close when clicking on backdrop (dialog itself, not its contents)
        if (e.target === dialogRef.current) {
          onClose();
        }
      }}
    >
      <div className="bg-white">
        <div className="flex justify-between items-center p-3 border-b">
          <h3 className="font-medium">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <div className="p-4">
          {children}
        </div>
      </div>
    </dialog>
  );
};

export default Dialog;