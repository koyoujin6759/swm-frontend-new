import { StudyRoomService } from '@/lib/api/services';
import { useMutation } from '@tanstack/react-query';
import { CreateStudyRoomReq } from '@/types/api';

export const studyRoomCreateQueryKey = {
  create: () => ['studyRoomCreate'] as const,
};

export const useStudyRoomCreateQuery = () => {
  return useMutation({
    mutationFn: async (createStudyRoomReq: CreateStudyRoomReq) => {
      const response =
        await StudyRoomService.createStudyRoom(createStudyRoomReq);
      return response;
    },
  });
};
