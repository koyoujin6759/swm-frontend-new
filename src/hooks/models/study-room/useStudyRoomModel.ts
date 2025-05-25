import { useState } from 'react';
import { StudyRoomListParams } from "@/types/api";

export const useStudyRoomModel = () => {
  const [filters, setFilters] = useState<Partial<StudyRoomListParams>>({
    sortCriteria: undefined,
    headCount: undefined,
    minPricePerHour: undefined,
    maxPricePerHour: undefined,
    options: [],
    title: '',
    userLatitude: undefined,
    userLongitude: undefined,
  });

  const handleFilterChange = (newFilters: Partial<StudyRoomListParams>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  };

  return {
    filters,
    handleFilterChange
  };
}; 