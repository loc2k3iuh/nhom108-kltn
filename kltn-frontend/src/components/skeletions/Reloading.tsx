import { motion } from "framer-motion";
import { FaTshirt } from "react-icons/fa";

export default function Reloading() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-red-50 to-gray-50">
      <motion.div
        className="flex items-center gap-4"
        animate={{ scale: [1, 1.05, 1], opacity: [0.8, 1, 0.8] }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <FaTshirt className="text-5xl text-[#C92127]" />
        <h1 className="text-4xl font-bold text-[#C92127]">
          DAVINCI
        </h1>
      </motion.div>

      <p className="mt-8 text-gray-600 font-medium">
        Đang tải, vui lòng chờ...
      </p>
    </div>
  );
}
