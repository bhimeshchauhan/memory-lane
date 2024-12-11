import { ImageModalProps } from "@/types";
import { Modal } from "antd";
import React from "react";

const ImageModal: React.FC<ImageModalProps> = ({
  visible,
  images,
  currentIndex,
  onClose,
  onNext,
  onPrevious,
}) => {
  if (images.length === 0) return null;

  return (
    <Modal
      open={visible}
      footer={null}
      onCancel={onClose}
      className="w-full max-w-3xl"
    >
      <img
        src={images[currentIndex]}
        alt={`Image ${currentIndex + 1}`}
        className="w-full h-auto object-contain"
      />
      <div className="flex justify-between mt-2">
        {images.length > 1 && (
          <>
            <button
              onClick={onPrevious}
              className="p-2 bg-gray-100 hover:bg-gray-200 rounded"
            >
              Previous
            </button>
            <button
              onClick={onNext}
              className="p-2 bg-gray-100 hover:bg-gray-200 rounded"
            >
              Next
            </button>
          </>
        )}
      </div>
    </Modal>
  );
};

export default ImageModal;
