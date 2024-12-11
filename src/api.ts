import axios from "axios";
import dayjs from "dayjs";
import { MonthData, Memory } from "./types";

const HOST = "http://localhost:4001";

// Fetch timeline data from the API and parse dates
export const fetchTimelineData = async (): Promise<MonthData[]> => {
  try {
    const { data } = await axios.get(`${HOST}/timeline`);
    return data.data.map((monthData: MonthData) => ({
      ...monthData,
      events: monthData.events.map((event) => ({
        ...event,
        date: dayjs(event.date), // Parse the date into a Day.js object
      })),
    }));
  } catch (error) {
    console.error("Error fetching timeline data:", error);
    return [];
  }
};

// Toggle favorite status for a memory
export const toggleMemoryFavorite = async (
  eventId: string,
  currentFavorite: boolean,
  setTimelineData: React.Dispatch<React.SetStateAction<MonthData[]>>
): Promise<void> => {
  try {
    setTimelineData((prevData) =>
      prevData.map((monthData) => ({
        ...monthData,
        events: monthData.events.map((event) =>
          event.id === eventId
            ? { ...event, favorite: !currentFavorite }
            : event
        ),
      }))
    );

    await axios.patch(`${HOST}/memories/${eventId}/favorite`, {
      favorite: !currentFavorite,
    });
  } catch (error) {
    console.error("Error toggling favorite status:", error);

    // Revert optimistic update on error
    setTimelineData((prevData) =>
      prevData.map((monthData) => ({
        ...monthData,
        events: monthData.events.map((event) =>
          event.id === eventId ? { ...event, favorite: currentFavorite } : event
        ),
      }))
    );
  }
};

// Add a new memory
export const addMemory = async (
  newMemory: Memory,
  setTimelineData: React.Dispatch<React.SetStateAction<MonthData[]>>,
  onSuccess: () => void,
  files: File[]
): Promise<void> => {
  try {
    const formData = new FormData();
    formData.append("title", newMemory.title);
    formData.append("description", newMemory.description);
    formData.append("date", newMemory.date?.format("YYYY-MM-DD") || "");
    newMemory.images.forEach((url) => formData.append("existingImages", url));
    files.forEach((file) => formData.append("images", file));

    await axios.post(`${HOST}/memories`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    const response = await axios.get(`${HOST}/timeline`);
    setTimelineData(response.data.data);

    onSuccess();
  } catch (error) {
    console.error("Error adding memory:", error);
  }
};

// Update a memory
export const updateMemory = async (
  id: string,
  updatedMemory: Memory,
  setTimelineData: React.Dispatch<React.SetStateAction<MonthData[]>>,
  onSuccess: () => void,
  files: File[]
): Promise<void> => {
  try {
    const formData = new FormData();

    // Add updated fields
    formData.append("title", updatedMemory.title);
    formData.append("description", updatedMemory.description);
    formData.append("date", updatedMemory.date?.format("YYYY-MM-DD") || "");

    // Filter out blob URLs from existing images
    const filteredImages = updatedMemory.images.filter(
      (url) => !url.startsWith("blob:")
    );
    formData.append("existingImages", JSON.stringify(filteredImages));

    // Add new files to the FormData
    files.forEach((file) => formData.append("images", file));

    await axios.put(`${HOST}/memories/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    const response = await fetchTimelineData();
    setTimelineData(response);

    onSuccess();
  } catch (error) {
    console.error("Error updating memory:", error);
  }
};

// Delete a memory
export const deleteMemory = async (
  id: string,
  updateTimelineData: (updatedData: MonthData[]) => void
): Promise<void> => {
  try {
    await axios.delete(`${HOST}/memories/${id}`);
    const updatedData = await fetchTimelineData();
    updateTimelineData(updatedData);
  } catch (error) {
    console.error("Error deleting memory:", error);
  }
};
