interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  voucherCode: string;
}

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  voucherCode,
}: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[999999] flex items-center justify-center bg-black bg-opacity-50 p-4 backdrop-blur-sm transition-opacity duration-200"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl transition-all duration-200 dark:bg-gray-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icon */}
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
          <svg
            className="h-6 w-6 text-red-600 dark:text-red-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        {/* Content */}
        <div className="mt-4 text-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Xác nhận xóa voucher</h3>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Bạn có chắc chắn muốn xóa voucher <span className="font-semibold">{voucherCode}</span>?
            <br />
            Hành động này không thể hoàn tác.
          </p>
        </div>

        {/* Actions */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
          >
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
}
