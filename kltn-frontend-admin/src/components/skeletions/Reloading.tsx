import { motion } from "framer-motion";

export default function Reloading() {
  const icons = ["👗", "👕", "👖", "👟", "👜"]; // icon thời trang
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-pink-100 to-purple-200">
      <motion.h1
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="text-3xl font-bold text-purple-700 mb-6"
      >
        Thời trang đang lên sàn... ✨
      </motion.h1>

      <div className="flex space-x-3">
        {icons.map((item, i) => (
          <motion.span
            key={i}
            className="text-4xl"
            initial={{ y: 0, opacity: 0.5 }}
            animate={{ y: [0, -15, 0], opacity: [0.5, 1, 0.5] }}
            transition={{
              duration: 0.6,
              delay: i * 0.2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {item}
          </motion.span>
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="mt-6 text-purple-600 font-medium"
      >
        Xin chờ một chút... người mẫu đang catwalk 😎
      </motion.p>
    </div>
  );
}
