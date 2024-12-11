import React, { useEffect, useState } from "react";
import {
  addMemory,
  fetchTimelineData,
  toggleMemoryFavorite,
  updateMemory,
  deleteMemory,
} from "@/api";
import MemoryModal from "@/components/memoryModal";
import ImageModal from "@/components/imageModal";
import { Memory, MonthData } from "@/types";
import { getDateRangeForMonth } from "@/utils";
import {
  CalendarOutlined,
  HeartFilled,
  HeartOutlined,
  PlusCircleOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { Button, Timeline, Popconfirm } from "antd";
import dayjs, { Dayjs } from "dayjs";

const ScrollableTimeline: React.FC = () => {
  const [timelineData, setTimelineData] = useState<MonthData[]>([]);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [currentMonth, setCurrentMonth] = useState<string>("");
  const [minDate, setMinDate] = useState<Dayjs | null>(null);
  const [maxDate, setMaxDate] = useState<Dayjs | null>(null);
  const [newMemory, setNewMemory] = useState<Memory>({
    title: "",
    description: "",
    date: null,
    images: [],
  });
  const [isDatePickerOpen, setIsDatePickerOpen] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState<boolean>(false);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [currentImages, setCurrentImages] = useState<string[]>([]);

  useEffect(() => {
    fetchTimelineData().then(setTimelineData);
  }, []);

  const openModal = (month: string, memory?: Memory, id?: string) => {
    setCurrentMonth(month);

    if (memory && id) {
      setIsEditing(true);
      setEditingId(id);
      setNewMemory(memory);
    } else {
      setIsEditing(false);
      setEditingId(null);
      setNewMemory({
        title: "",
        description: "",
        date: dayjs(),
        images: [],
      });
    }

    const dateRange = getDateRangeForMonth(month);
    if (dateRange) {
      setMinDate(dateRange.minDate);
      setMaxDate(dateRange.maxDate);
    } else {
      setMinDate(null);
      setMaxDate(null);
    }

    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setIsEditing(false);
    setEditingId(null);
    setNewMemory({
      title: "",
      description: "",
      date: null,
      images: [],
    });
  };

  const handleAddMemory = async (files: File[]) => {
    await addMemory(newMemory, setTimelineData, closeModal, files);
  };

  const handleUpdateMemory = async (memory: Memory, files: File[]) => {
    if (editingId) {
      await updateMemory(editingId, memory, setTimelineData, closeModal, files);
    }
  };

  const handleDeleteMemory = async (id: string) => {
    await deleteMemory(id, setTimelineData);
  };

  const openImageModal = (images: string[], index: number) => {
    setCurrentImages(images);
    setCurrentImageIndex(index);
    setIsImageModalOpen(true);
  };

  const closeImageModal = () => {
    setIsImageModalOpen(false);
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % currentImages.length);
  };

  const handlePreviousImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? currentImages.length - 1 : prev - 1
    );
  };

  return (
    <div className="max-w-lg mx-auto pb-10vw p-4 overflow-y-auto h-80vh">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Memory Lane</h2>
        <Button
          icon={<PlusOutlined />}
          onClick={() => openModal("")}
          type="primary"
        >
          Add Memory
        </Button>
      </div>

      <Timeline className="custom-timeline" mode="left">
        {timelineData.map((monthData) => (
          <React.Fragment key={monthData.month}>
            <Timeline.Item
              dot={
                <CalendarOutlined
                  style={{ fontSize: "20px", color: "#4a4a4a" }}
                />
              }
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold mb-2">{monthData.month}</h3>
                <PlusCircleOutlined
                  onClick={() => openModal(monthData.month)}
                  style={{
                    fontSize: "20px",
                    color: "#4a4a4a",
                    cursor: "pointer",
                  }}
                  title="Add Memory"
                />
              </div>
            </Timeline.Item>

            {monthData.events.map((event) => (
              <Timeline.Item
                key={event.id}
                dot={
                  event.favorite ? (
                    <HeartFilled
                      style={{ color: "red", fontSize: "20px" }}
                      onClick={() =>
                        toggleMemoryFavorite(
                          event.id,
                          event.favorite,
                          setTimelineData
                        )
                      }
                    />
                  ) : (
                    <HeartOutlined
                      style={{ color: "red", fontSize: "20px" }}
                      onClick={() =>
                        toggleMemoryFavorite(
                          event.id,
                          event.favorite,
                          setTimelineData
                        )
                      }
                    />
                  )
                }
              >
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-gray-800">{event.title}</h4>
                  <div className="flex items-center gap-2">
                    <EditOutlined
                      style={{ cursor: "pointer", color: "#1890ff" }}
                      onClick={() =>
                        openModal(
                          monthData.month,
                          {
                            title: event.title,
                            description: event.description,
                            date: dayjs(event.date),
                            images: event.images,
                          },
                          event.id
                        )
                      }
                      title="Edit Memory"
                    />
                    <Popconfirm
                      title="Are you sure you want to delete this memory?"
                      onConfirm={() => handleDeleteMemory(event.id)}
                      okText="Yes"
                      cancelText="No"
                    >
                      <DeleteOutlined
                        style={{ cursor: "pointer", color: "red" }}
                        title="Delete Memory"
                      />
                    </Popconfirm>
                  </div>
                </div>
                <p className="text-sm text-gray-500">
                  {dayjs(event.date).format("MMMM D, YYYY")}
                </p>
                <p className="text-gray-700">{event.description}</p>
                <div className="flex gap-2 mt-3">
                  {event.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`Event ${idx}`}
                      className="w-20 h-20 object-cover rounded-md cursor-pointer"
                      onClick={() => openImageModal(event.images, idx)}
                    />
                  ))}
                </div>
              </Timeline.Item>
            ))}
          </React.Fragment>
        ))}
      </Timeline>
      <MemoryModal
        visible={isModalVisible}
        onClose={closeModal}
        onAddMemory={handleAddMemory}
        onUpdateMemory={handleUpdateMemory}
        isEditMode={isEditing}
        currentMonth={currentMonth}
        newMemory={newMemory}
        minDate={minDate}
        maxDate={maxDate}
        isDatePickerOpen={isDatePickerOpen}
        setIsDatePickerOpen={setIsDatePickerOpen}
        onMemoryChange={(field, value) =>
          setNewMemory((prev) => ({ ...prev, [field]: value }))
        }
      />
      <ImageModal
        visible={isImageModalOpen}
        images={currentImages}
        currentIndex={currentImageIndex}
        onClose={closeImageModal}
        onNext={handleNextImage}
        onPrevious={handlePreviousImage}
      />
    </div>
  );
};

export default ScrollableTimeline;
