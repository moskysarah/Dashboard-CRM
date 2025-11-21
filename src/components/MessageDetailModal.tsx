import React from "react";
import { Button } from "./ui/Button";

interface MessageDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: any;
}

const MessageDetailModal: React.FC<MessageDetailModalProps> = ({
  isOpen,
  onClose,
  message,
}) => {
  if (!isOpen || !message) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Détails du message</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Titre
              </label>
              <p className="text-gray-900">{message.title || "N/A"}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Contenu
              </label>
              <p className="text-gray-900">{message.content || message.message}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Date
              </label>
              <p className="text-gray-900">
                {message.created_at ? new Date(message.created_at).toLocaleString() : "N/A"}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Statut
              </label>
              <p className="text-gray-900">{message.status || "N/A"}</p>
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <Button onClick={onClose}>Fermer</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageDetailModal;
