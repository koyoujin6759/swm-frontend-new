import { InfiniteData } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import {
  BookmarkIcon,
  HeartIcon,
  MapPinIcon,
  PencilIcon,
  UsersIcon,
} from 'lucide-react';
import { devLog } from '@/utils/dev-log';
import { StudyRoomListResponse } from '@/types/api';
import { StudyRoomLoading } from '@/components/loading';
import StudyRoomSearchEmpty from '@/components/study-room/ui/study-room-search-empty';

export interface StudyRoomListProps {
  data: InfiniteData<StudyRoomListResponse> | undefined;
  hasNextPage: boolean;
  fetchNextPage: () => void;
  isLoading: boolean;
}

export const StudyRoomList = ({
  data,
  hasNextPage,
  fetchNextPage,
  isLoading,
}: StudyRoomListProps) => {
  const nextFetchTargetRef = useRef<HTMLDivElement | null>(null);
  const isEmptyStudyRoomList =
    data?.pages.flatMap((page) => page.data.data).length === 0;

  useEffect(() => {
    const nextFetchTarget = nextFetchTargetRef.current;
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5,
    };

    const fetchCallback: IntersectionObserverCallback = (entries, observer) => {
      devLog.info('check', entries);
      entries.forEach((entry) => {
        if (entry.isIntersecting && hasNextPage) {
          fetchNextPage?.();
          observer.unobserve(entry.target);
        }
      });
    };

    const observer = new IntersectionObserver(fetchCallback, options);

    if (nextFetchTarget) {
      devLog.info('nextFetchTarget', nextFetchTarget);
      observer.observe(nextFetchTarget);
    }

    return () => {
      if (nextFetchTarget) {
        observer.unobserve(nextFetchTarget);
      }
    };
  }, [data, hasNextPage, fetchNextPage]);

  if (isEmptyStudyRoomList) {
    return (
      <div className="flex min-h-[800px] flex-col items-center justify-center">
        <StudyRoomSearchEmpty />
      </div>
    );
  }

  return (
    <div className="mt-[34px] flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-[20px] sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {data?.pages.flatMap((page) =>
          page.data.data.map((room) => (
            <div
              key={room.title + room.studyRoomId}
              className="group w-full min-w-[413px] cursor-pointer"
            >
              <div className="relative aspect-[413/160] overflow-hidden rounded-tl-[8px] rounded-tr-[8px]">
                <div className="h-full w-full bg-gray-100">
                  {room.thumbnail ? (
                    <img
                      src={room.thumbnail}
                      alt="Study Room Image"
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/no-image-square.png';
                      }}
                    />
                  ) : (
                    <img
                      src="/no-image-square.png"
                      alt="No Image Available"
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
              </div>

              <div className="space-y-2 rounded-bl-[8px] rounded-br-[8px] bg-[#F9F9F9] px-[26px] py-[24px]">
                <div className="flex justify-between">
                  <div className="inline-block rounded-[16px] border border-[#4998E9]">
                    <span className="px-[12px] py-[9px] text-sm font-[700] font-medium text-[#4998E9]">
                      {room.entireMinPricePerHour || '0'}원
                      <span className="font-[500] text-[#828282]">/시간</span>
                    </span>
                  </div>
                  <button>
                    <BookmarkIcon className="h-5 w-5 text-gray-600" />
                  </button>
                </div>

                <h3 className="text-lg font-semibold leading-tight">
                  {room.title}
                </h3>

                <div className="flex items-center gap-1 text-gray-500">
                  <MapPinIcon className="h-4 w-4" />
                  <span className="text-sm">{room.locality}</span>
                </div>

                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <UsersIcon className="h-4 w-4" />
                  <span>최대 {room.entireMaxHeadcount || 'N'}명</span>
                </div>

                <div className="flex items-center justify-end gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <PencilIcon className="h-4 w-4" />
                    <span>{room.reviewCount || '0'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <HeartIcon className="h-4 w-4" />
                    <span>{room.starAvg || '0'}</span>
                  </div>
                </div>
              </div>
            </div>
          )),
        )}
      </div>

      {!isLoading && hasNextPage && (
        <div ref={nextFetchTargetRef}>
          <StudyRoomLoading />
        </div>
      )}
    </div>
  );
};
