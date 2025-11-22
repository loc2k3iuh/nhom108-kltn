import { X } from "lucide-react";
import { useState } from "react";

interface ChangeStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedOrderIds: number[];
  onConfirm: (newStatus: string) => void;
}

const statusOptions = [
  { value: "PENDING", label: "Chờ xác nhận" },
  { value: "CONFIRMED", label: "Đã xác nhận" },
  { value: "PACKING", label: "Đang đóng gói" },
  { value: "DELIVERING", label: "Đang giao" },
  { value: "COMPLETED", label: "Hoàn thành" },
  { value: "CANCELLED", label: "Đã hủy" },
];

export default function ChangeStatusModal({ isOpen, onClose, selectedOrderIds, onConfirm }: ChangeStatusModalProps) {
  const [selectedStatus, setSelectedStatus] = useState("CONFIRMED");

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm(selectedStatus);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-boxdark rounded-lg shadow-xl w-full max-w-md p-6 border border-stroke dark:border-strokedark">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Đổi trạng thái đơn hàng</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-meta-4 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {/* Content */}
          <div className="space-y-4">
            <p className="text-gray-600 dark:text-gray-300">
              Bạn đang đổi trạng thái cho <span className="font-bold text-gray-900 dark:text-white">{selectedOrderIds.length}</span> đơn hàng
            </p>

            {/* Status Select */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Trạng thái mới
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-4 py-2 rounded border border-stroke bg-transparent text-gray-900 dark:text-white focus:outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Preview */}
            <div className="bg-gray-50 dark:bg-meta-4 rounded-lg p-3 border border-stroke dark:border-strokedark">
              <p className="text-sm text-gray-600 dark:text-gray-400">Xem trước:</p>
              <p className="text-gray-900 dark:text-white mt-1">
                {selectedOrderIds.length} đơn hàng → <span className="font-semibold text-primary">
                  {statusOptions.find(opt => opt.value === selectedStatus)?.label}
                </span>
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded border border-stroke bg-white dark:bg-boxdark hover:bg-gray-50 dark:hover:bg-meta-4 text-gray-900 dark:text-white font-medium transition-colors dark:border-strokedark"
            >
              Hủy
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 px-4 py-2 bg-primary hover:bg-opacity-90 text-white rounded-lg font-medium transition-colors"
            >
              Xác nhận
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
