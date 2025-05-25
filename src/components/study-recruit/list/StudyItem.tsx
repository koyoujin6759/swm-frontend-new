'use client';

import {
  addStudyBookmark,
  deleteStudyBookmark,
} from '@/lib/api/study/postStudy';
import { useToastStore } from '@/store/useToastStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Study } from '@/types/api/study-recruit/study';
import BookMarkIcon from '@/components/ui/BookMarkIcon';
import InteractionStatus from '@/components/ui/InteractionStatus';
import { RecruitmentPositionTitle, POSITION_LABELS } from '@/types/api/study-recruit/study';

export default function StudyItem({ data }: { data: Study }) { 
  const [timerId, setTimerId] = useState<NodeJS.Timeout | null>(null);
  const router = useRouter();
  const queryClient = useQueryClient();

  const positionList = data.getRecruitmentPositionResponses
    ?.map((pos) => ({
      value: pos.title,
      label: POSITION_LABELS[pos.title as keyof typeof RecruitmentPositionTitle],
      headcount: pos.headcount,
    }));

  const isBookmark = data.studyBookmarkId !== null;

  const { showToast, hideToast } = useToastStore();

  const bookmarkMutation = useMutation({
    mutationFn: async () => {
      if (timerId) {
        clearTimeout(timerId);
      }

      const newTimerId = setTimeout(() => {
        hideToast();
      }, 2000);
      setTimerId(newTimerId);

      const token = localStorage.getItem('accessToken');
      if (!token) {
        showToast({
          message: '로그인 후 이용해주세요.',
          url: '/login',
          urlText: '로그인하러 가기',
        });
        return;
      }

      if (isBookmark) {
        const bookmarkId = String(studyBookmarkId);
        if (!bookmarkId) throw new Error('Bookmark ID not found');
        await deleteStudyBookmark(bookmarkId);
        showToast({
          message: '북마크 해제',
          icon: '/icons/icon_bookmark_off.svg',
          url: '/study-recruit',
          active: false,
          urlText: '내 북마크 보기',
        });
      } else {
        await addStudyBookmark(studyId.toString());
        showToast({
          message: '북마크 완료',
          icon: '/icons/icon_bookmark_on.svg',
          url: '/study-recruit',
          active: true,
          urlText: '내 북마크 보기',
        });
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['study'],
      });
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const handleBookmarkClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    bookmarkMutation.mutate();
  };

  const handleMoveDetail = () => {
    router.push(`/study-recruit/${data.studyId}`);
  };

  const { likeCount, commentCount, viewCount, studyBookmarkId, studyId } = data;

  return (
    <>
      <div
        onClick={handleMoveDetail}
        className="block cursor-pointer transition-transform hover:-translate-y-1"
      >
        <div className="flex min-h-[340px] flex-col justify-between gap-[10px] rounded-[8px] bg-[#f9f9f9] px-[24px] py-[26px]">
          <div className="flex h-full flex-col gap-4">
            <div className="flex items-center justify-between">
              {data.status === 'ACTIVE' ? (
                <div className="flex h-[30px] min-w-[60px] items-center justify-center rounded-[16px] border border-link-default bg-[white] px-[12px] text-sm font-bold text-link-default">
                  모집중
                </div>
              ) : (
                <div className="flex h-[30px] min-w-[60px] items-center justify-center rounded-[16px] border border-gray-light bg-[white] px-[12px] text-sm font-bold text-gray-light">
                  모집마감
                </div>
              )}
              <div className="w-30 h-30">
                <button
                  type="button"
                  onClick={handleBookmarkClick}
                  className="relative z-10"
                >
                  <BookMarkIcon
                    color={isBookmark ? '#4998E9' : '#f9f9f9'}
                    strokeColor={isBookmark ? '#4998E9' : '#c8c8c8'}
                  />
                </button>
              </div>
            </div>
            <h3 className="line-clamp-2 text-xl font-semibold text-black">
              {data.title}
            </h3>
            <div className="flex flex-wrap items-center justify-start gap-2">
              {positionList.map((tag) => (
                <span
                  key={`${tag.value}-${tag.headcount}`}
                  className="flex h-[28px] min-w-[30px] items-center justify-center rounded-[4px] bg-[#eee] px-[7px] text-xs font-[500] text-gray-default"
                >
                  {tag.label}
                  <span className="ml-1 text-link-default">
                    {tag.headcount}
                  </span>
                </span>
              ))}
            </div>
            <p className="text-regular line-clamp-2 text-sm text-[#828282]">
              {data.content}
            </p>
          </div>
          <div className="flex items-end justify-between gap-[16px]">
            <div className="flex flex-wrap items-center gap-1">
              {data.getTagResponses.map((item) => (
                <span
                  key={`${item.tagId}-${item.name}`}
                  className="flex h-[26px] min-w-[30px] items-center justify-center rounded-[4px] border border-[#eee] bg-white px-[7px] text-[10px] font-[500] text-[#a5a5a5]"
                >
                  #{item.name}
                </span>
              ))}
            </div>
            <InteractionStatus
              likeCount={likeCount}
              commentCount={commentCount}
              viewCount={viewCount}
              studyId={data.studyId.toString()}
              likeStatus={data.liked}
            />
          </div>
        </div>
      </div>
    </>
  );
}
