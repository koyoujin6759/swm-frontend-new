import { StudyRoomService } from '@/lib/api/services';
import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { devLog } from '@/utils/dev-log';
import {
  SortCriteria,
  StudyRoomListParams,
  StudyRoomListRes,
} from '@/types/api';

export const studyRoomQueryKey = {
  list: (filters: Partial<StudyRoomListParams>) =>
    ['studyRoomList', filters] as const,
};
export const getSortValueByCriteria = (
  sortCriteria: Exclude<SortCriteria, 'STARS'> | undefined,
  lastItem: StudyRoomListRes,
) => {
  const sortValueMap: Record<Exclude<SortCriteria, 'STAR'>, number> = {
    [SortCriteria.LIKE]: lastItem.likeCount,
    [SortCriteria.REVIEW]: lastItem.reviewCount,
    [SortCriteria.PRICE_ASC]: lastItem.entireMinPricePerHour,
    [SortCriteria.PRICE_DESC]: lastItem.entireMaxPricePerHour,
  };

  return sortValueMap[sortCriteria as keyof typeof sortValueMap] ?? undefined;
};

export const useStudyRoomQuery = (filters: Partial<StudyRoomListParams>) => {
  return useSuspenseInfiniteQuery({
    queryKey: studyRoomQueryKey.list(filters),
    queryFn: async ({
      pageParam,
    }: {
      pageParam: Pick<
        StudyRoomListParams,
        | 'lastStudyRoomId'
        | 'lastSortValue'
        | 'lastAverageRatingValue'
        | 'lastLatitudeValue'
        | 'lastLongitudeValue'
      > | null;
    }) => {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      const response = await StudyRoomService.getStudyRoomList({
        queryParams: {
          ...filters,
          lastStudyRoomId: pageParam?.lastStudyRoomId,
          lastSortValue: pageParam?.lastSortValue,
          lastAverageRatingValue: pageParam?.lastAverageRatingValue,
          lastLatitudeValue: pageParam?.lastLatitudeValue,
          lastLongitudeValue: pageParam?.lastLongitudeValue,
        },
      });
      return response;
    },
    initialPageParam: null,
    getNextPageParam: (lastPage, TQueryFnData) => {
      devLog.info('TQueryFnData', TQueryFnData);

      if (lastPage.data.hasNext && lastPage.data.data.length > 0) {
        const lastItem = lastPage.data.data[lastPage.data.data.length - 1];
        const { sortCriteria } = filters;
        const lastSortValue = getSortValueByCriteria(
          (sortCriteria as Exclude<SortCriteria, 'STARS'>) ?? undefined,
          lastItem,
        );
        return {
          lastStudyRoomId: lastItem.studyRoomId,
          lastSortValue: lastSortValue,
          lastAverageRatingValue: lastItem.starAvg,
          lastLatitudeValue: lastItem.coordinates.latitude,
          lastLongitudeValue: lastItem.coordinates.longitude,
        };
      }
      return null;
    },
  });
};
