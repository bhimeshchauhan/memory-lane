import { MemoryModalProps } from "@/types";
import { CloseCircleOutlined, UploadOutlined } from "@ant-design/icons";
import { Button, DatePicker, Input, Modal, Upload } from "antd";
import dayjs from "dayjs";
import React, { useState } from "react";

const MemoryModal: React.FC<MemoryModalProps> = ({
  visible,
  onClose,
  onAddMemory,
  onUpdateMemory,
  isEditMode,
  currentMonth,
  newMemory,
  minDate,
  maxDate,
  isDatePickerOpen,
  setIsDatePickerOpen,
  onMemoryChange,
}) => {
  const [fileList, setFileList] = useState<File[]>([]);

  const handleFileChange = ({ fileList: newFileList }: any) => {
    setFileList(newFileList.map((file: any) => file.originFileObj));
  };

  const handleRemoveImage = (index: number) => {
    const updatedImages = [...newMemory.images];
    updatedImages.splice(index, 1);
    onMemoryChange("images", updatedImages);
  };

  const handleAddImageFromUrl = (url: string) => {
    if (url) {
      onMemoryChange("images", [...newMemory.images, url]);
    }
  };

  const handleSubmit = async () => {
    if (isEditMode) {
      const updatedMemory = {
        ...newMemory,
        images: [
          ...newMemory.images,
          ...fileList.map((file) => URL.createObjectURL(file)),
        ],
      };
      await onUpdateMemory(updatedMemory, fileList);
    } else {
      await onAddMemory(fileList);
    }
    setFileList([]);
  };

  return (
    <Modal
      title={`${isEditMode ? "Update" : "Add"} Memory${
        currentMonth ? ` for ${currentMonth}` : ""
      }`}
      visible={visible}
      onOk={handleSubmit}
      onCancel={onClose}
      okText={isEditMode ? "Update Memory" : "Add Memory"}
    >
      <div className="mb-4">
        <label className="block font-bold">Title</label>
        <Input
          value={newMemory.title}
          onChange={(e) => onMemoryChange("title", e.target.value)}
          placeholder="Enter memory title"
        />
      </div>
      <div className="mb-4">
        <label className="block font-bold">Description</label>
        <Input.TextArea
          value={newMemory.description}
          onChange={(e) => onMemoryChange("description", e.target.value)}
          placeholder="Enter memory description"
        />
      </div>
      <div className="mb-4">
        <label className="block font-bold">Date</label>
        <DatePicker
          value={newMemory.date}
          onChange={(date) => onMemoryChange("date", date)}
          picker="date"
          style={{ width: "100%" }}
          open={isDatePickerOpen}
          defaultPickerValue={minDate || dayjs()}
          onOpenChange={setIsDatePickerOpen}
          {...(currentMonth
            ? {
                disabledDate: (current) =>
                  current &&
                  (current < minDate?.startOf("month")! ||
                    current > maxDate?.endOf("month")!),
              }
            : {})}
        />
      </div>
      <div className="mb-4">
        <label className="block font-bold">Images</label>
        <div className="flex flex-wrap gap-2">
          {newMemory.images.map((image, index) => (
            <div key={index} className="relative">
              <img
                src={image}
                alt={`Memory ${index}`}
                className="w-24 h-24 object-cover rounded-md"
              />
              <CloseCircleOutlined
                className="absolute top-0 right-0 text-red-500 cursor-pointer"
                onClick={() => handleRemoveImage(index)}
              />
            </div>
          ))}
        </div>
        <Input
          className="mt-2"
          placeholder="Enter image URL and press Enter"
          onPressEnter={(e) => {
            handleAddImageFromUrl((e.target as HTMLInputElement).value);
            (e.target as HTMLInputElement).value = "";
          }}
        />
      </div>
      <div className="mb-4">
        <label className="block font-bold">Upload Images</label>
        <Upload
          listType="picture"
          multiple
          beforeUpload={() => false}
          onChange={handleFileChange}
        >
          <Button icon={<UploadOutlined />}>Click to Upload</Button>
        </Upload>
      </div>
    </Modal>
  );
};

export default MemoryModal;
