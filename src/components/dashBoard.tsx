import React, { useEffect, useState } from "react";
import { Button, Divider, Popconfirm } from "antd";
import SwivelCard from "@/components/card";
import MemoryModal from "@/components/memoryModal";
import {
  addMemory,
  fetchTimelineData,
  toggleMemoryFavorite,
  updateMemory,
  deleteMemory,
} from "@/api";
import { Memory, MonthData } from "@/types";
import { getDateRangeForMonth } from "@/utils";
import dayjs, { Dayjs } from "dayjs";

const DashBoard: React.FC = () => {
  const [timelineData, setTimelineData] = useState<MonthData[]>([]);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState<boolean>(false);
  const [minDate, setMinDate] = useState<Dayjs | null>(null);
  const [maxDate, setMaxDate] = useState<Dayjs | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [newMemory, setNewMemory] = useState<Memory>({
    title: "",
    description: "",
    date: dayjs(),
    images: [],
  });
  const [currentMonth, setCurrentMonth] = useState<string>("");

  useEffect(() => {
    const loadTimelineData = async () => {
      const data = await fetchTimelineData();
      setTimelineData(data);
    };
    loadTimelineData();
  }, []);

  const openModal = (month: string, memory?: Memory, id?: string) => {
    setCurrentMonth(month);

    if (memory && id) {
      setIsEditing(true);
      setEditingId(id);
      setNewMemory({
        ...memory,
        date: dayjs(memory.date),
      });
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
      date: dayjs(),
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
    await deleteMemory(id, (updatedTimelineData) => {
      console.log(
        "🚀 ~ awaitdeleteMemory ~ updatedTimelineData:",
        updatedTimelineData
      );
      setTimelineData(updatedTimelineData);
    });
  };

  return (
    <div className="bg-gray-50 py-8 px-4 overflow-y-auto h-80vh pb-10vw">
      <div className="flex justify-end mb-4">
        <Button type="primary" onClick={() => openModal("")}>
          Add Memory
        </Button>
      </div>
      {timelineData.map((monthData) => (
        <div key={monthData.month} className="mb-12">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">{monthData.month}</h2>
            <Button type="link" onClick={() => openModal(monthData.month)}>
              + Add Memory
            </Button>
          </div>
          <Divider />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {monthData.events.map((event) => (
              <SwivelCard
                key={event.id}
                title={event.title}
                date={dayjs(event.date).format("MMMM D, YYYY")}
                headline={event.description}
                description={event.description}
                images={event.images}
                isLikedInitial={event.favorite}
                onHeartToggle={(liked) =>
                  toggleMemoryFavorite(event.id, liked, setTimelineData)
                }
                onEdit={() =>
                  openModal(
                    monthData.month,
                    {
                      title: event.title,
                      description: event.description,
                      date: event.date,
                      images: event.images,
                    },
                    event.id
                  )
                }
                onDelete={() => handleDeleteMemory(event.id)}
              />
            ))}
          </div>
        </div>
      ))}
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
    </div>
  );
};

export default DashBoard;
