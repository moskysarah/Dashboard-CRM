import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface DialogProps {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  children: React.ReactNode;
  className?: string;
}

export const Dialog: React.FC<DialogProps> = ({
  open,
  onOpenChange,
  children,
  className = "",
}) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => onOpenChange(false)}
        >
          <motion.div
            className={`bg-white rounded-2xl shadow-xl p-6 w-full max-w-lg relative ${className}`}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()} // empêche de fermer en cliquant sur le contenu
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Header du dialog
export const DialogHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="mb-4 border-b pb-2">{children}</div>
);

// Titre du dialog
export const DialogTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h2 className="text-lg font-semibold text-gray-800">{children}</h2>
);

// Contenu du dialog
export const DialogContent: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = "",
}) => <div className={`space-y-4 ${className}`}>{children}</div>;
