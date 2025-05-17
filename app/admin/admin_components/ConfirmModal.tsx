import React from "react";

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    message: string;
}

export default function ConfirmModal({isOpen, onClose, onConfirm, message}: ConfirmModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md">
                <h2 className="text-xl font-semibold mb-4">Подтвердите действие</h2>
                <p className="mb-6">{message}</p>
                <div className="flex justify-end gap-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-md"
                    >
                        Отмена
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-md"
                    >
                        Удалить
                    </button>
                </div>
            </div>
        </div>
    );
}
