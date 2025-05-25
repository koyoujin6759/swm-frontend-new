'use client';

import { useStudyRoomQuery } from '@/queries';
import { devLog } from '@/utils/dev-log';
import { useStudyRoomModel } from '@/hooks/models';
import { StudyRoomFilter } from '@/components/study-room/filter/study-room-filter';
import { StudyRoomList } from '@/components/study-room/list/study-room-list';

export function StudyRoomContainer() {
  const { filters, handleFilterChange } = useStudyRoomModel();
  const { data, fetchNextPage, hasNextPage, isLoading } =
    useStudyRoomQuery(filters);

  devLog.info('StudyRoom', data);

  return (
    <div className="mx-auto max-w-screen-xl py-[40px] xl:px-0">
      <h3 className="mb-[34px] text-[24px] font-[600] text-black">스터디 룸</h3>
      <StudyRoomFilter filters={filters} onFilterChange={handleFilterChange} />
      <StudyRoomList
        data={data}
        hasNextPage={hasNextPage}
        fetchNextPage={fetchNextPage}
        isLoading={isLoading}
      />
    </div>
  );
}
