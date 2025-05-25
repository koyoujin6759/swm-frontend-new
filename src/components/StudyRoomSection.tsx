'use client';

import { getStudyRoom } from '@/lib/api/study/getStudyRoom';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import StudyroomItem from './StudyroomItem';
import Loadingbar from '@/components/ui/Loadingbar';

export default function StudyRoomSection() {
  const {
    data: studyRooms,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['studyRooms'],
    queryFn: getStudyRoom,
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 24,
  });
  const studyRoomsData = studyRooms?.data;
  // console.log('studyRoomsData type:', typeof studyRoomsData, 'value:', studyRoomsData);
  if (error) return <div>에러가 발생했습니다</div>;

  return (
    <>
      <article className="relative">
        <div className="mb-[40px] flex items-center justify-between">
          <div className="flex items-center gap-[20px]">
            <h3 className="text-left text-2xl font-semibold text-black">
              요즘 뜨는 스터디룸
            </h3>
            <Link
              href="/studyroom"
              className="flex items-center gap-[6px] text-base font-semibold text-gray-light"
            >
              전체보기{' '}
              <Image
                src="/icons/icon_gry_18_back.svg"
                alt="arrow-right"
                width={14}
                height={14}
              />
            </Link>
          </div>
        </div>
        {isLoading ? (
          <div className="flex h-[300px] items-center justify-center">
            <Loadingbar />
          </div>
        ) : (
          studyRoomsData && (
            <div className="flex w-full max-w-screen-xl items-center gap-[20px]">
              <StudyroomItem slideData={studyRoomsData.data} useSlider={true} />
            </div>
          )
        )}
      </article>
    </>
  );
}
