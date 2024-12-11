import ImageModal from "@/components/imageModal";
import { SwivelCardProps } from "@/types";
import { HeartIcon, PencilIcon, TrashIcon } from "@heroicons/react/20/solid";
import { Popconfirm } from "antd";
import React, { useState } from "react";

const SwivelCard: React.FC<SwivelCardProps> = ({
  title,
  date,
  headline,
  description,
  images,
  isLikedInitial = false,
  onHeartToggle,
  onEdit,
  onDelete,
}) => {
  const [isLiked, setIsLiked] = useState<boolean>(isLikedInitial);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

  const toggleLike = () => {
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    if (onHeartToggle) {
      onHeartToggle(newLikedState);
    }
  };

  const openImageModal = (index: number) => {
    setCurrentImageIndex(index);
    setIsModalOpen(true);
  };

  const closeImageModal = () => {
    setIsModalOpen(false);
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const handlePreviousImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <div className="w-full bg-white rounded-xl shadow-lg overflow-hidden flex flex-col">
      <div
        className="relative h-[50%] w-full max-h-48 cursor-pointer"
        onClick={() => openImageModal(0)}
      >
        <img
          src={images[0]}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex flex-col justify-between flex-grow p-4">
        <div>
          <h2 className="text-lg font-bold text-gray-800">{title}</h2>
          <span className="text-sm text-gray-500 block mt-1">{date}</span>
          <h3 className="text-sm text-gray-600 mt-2">{headline}</h3>
          <p className="text-sm text-gray-700 mt-4">{description}</p>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button
            className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-500 hover:bg-blue-200 transition-all"
            onClick={onEdit}
          >
            <PencilIcon className="w-5 h-5" />
          </button>
          <Popconfirm
            title="Are you sure you want to delete this memory?"
            onConfirm={onDelete}
            okText="Yes"
            cancelText="No"
          >
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-red-100 text-red-500 hover:bg-red-200 transition-all">
              <TrashIcon className="w-5 h-5" />
            </button>
          </Popconfirm>
          <button
            className={`w-8 h-8 flex items-center justify-center rounded-full border-2 ${
              isLiked
                ? "border-red-500 text-red-500 bg-red-100"
                : "border-gray-300 text-gray-300 hover:text-red-500 hover:border-red-500"
            } transition-all duration-300`}
            onClick={toggleLike}
          >
            <HeartIcon
              className={`w-5 h-5 ${
                isLiked ? "fill-current" : "stroke-current"
              }`}
            />
          </button>
        </div>
      </div>
      <ImageModal
        visible={isModalOpen}
        images={images}
        currentIndex={currentImageIndex}
        onClose={closeImageModal}
        onNext={handleNextImage}
        onPrevious={handlePreviousImage}
      />
    </div>
  );
};

export default SwivelCard;
