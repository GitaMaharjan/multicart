// "use client";
// import { X } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";

// interface ModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   children: React.ReactNode;
// }

// const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
//   const handleContentClick = (e: React.MouseEvent) => {
//     e.stopPropagation();
//   };

//   return (
//     <AnimatePresence>
//       {isOpen && (
//         <motion.div
//           onClick={onClose}
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//           className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
//         >
//           <motion.div
//             onClick={handleContentClick}
//             initial={{ scale: 0.9, opacity: 0 }}
//             animate={{ scale: 1, opacity: 1 }}
//             exit={{ scale: 0.9, opacity: 0 }}
//             transition={{ duration: 0.3 }}
//             className="relative bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-3xl p-8 w-full max-w-lg mx-2 shadow-2xl"
//           >
//             {/* Close button in top-right corner */}
//             <button
//               onClick={onClose}
//               className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
//             >
//               <X className="w-6 h-6" />
//             </button>

//             {/* Modal content */}
//             <div className="space-y-4">{children}</div>
//           </motion.div>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   );
// };

// export default Modal;

"use client";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  const handleContentClick = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
        >
          <motion.div
            onClick={handleContentClick}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative bg-white rounded-3xl p-8 w-full max-w-lg mx-2 shadow-2xl"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="space-y-4">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
