export interface Event {
  id: string;
  title: string;
  date: string;
  description: string;
  images: string[];
  favorite: boolean;
}

export interface MonthData {
  month: string;
  events: Event[];
}

export interface Memory {
  title: string;
  description: string;
  date: Dayjs | null;
  images: string[];
}

export type SwivelCardProps = {
  title: string;
  date: string;
  headline: string;
  description: string;
  images: string[];
  isLikedInitial?: boolean;
  onHeartToggle?: (liked: boolean) => void;
  onEdit?: () => void;
  onDelete?: () => void;
};

export interface ImageModalProps {
  visible: boolean;
  images: string[];
  currentIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

export interface MemoryModalProps {
  visible: boolean;
  onClose: () => void;
  onAddMemory: (files: File[]) => Promise<void>;
  onUpdateMemory: (memory: Memory, files: File[]) => Promise<void>;
  isEditMode: boolean;
  currentMonth: string;
  newMemory: Memory;
  minDate: Dayjs | null;
  maxDate: Dayjs | null;
  isDatePickerOpen: boolean;
  setIsDatePickerOpen: (open: boolean) => void;
  onMemoryChange: (field: keyof Memory, value: any) => void;
}
