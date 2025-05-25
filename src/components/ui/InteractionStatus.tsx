'use client';

import { deleteStudyLike } from '@/lib/api/study/postStudy';
import { addStudyLike } from '@/lib/api/study/postStudy';
import { useToastStore } from '@/store/useToastStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import { useState } from 'react';
import { InteractionStatusProps } from '@/types/api/interaction';

export default function InteractionStatus({
  likeCount,
  commentCount,
  viewCount,
  studyId,
  likeStatus,
}: InteractionStatusProps) {
  const { showToast, hideToast } = useToastStore();
  const [, setLocalLikeCount] = useState(likeCount);
  const [, setLocalLikeStatus] = useState(likeStatus);
  const [timerId, setTimerId] = useState<NodeJS.Timeout | null>(null);

  const queryClient = useQueryClient();

  const likeMutation = useMutation({
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

      setLocalLikeStatus(!likeStatus);
      setLocalLikeCount((prev) => (likeStatus ? prev - 1 : prev + 1));

      if (likeStatus) {
        await deleteStudyLike(studyId);
        showToast({
          message: '좋아요 취소',
          url: '/study-recruit', 
        });
      } else {
        await addStudyLike(studyId);
        showToast({
          message: '좋아요 추가', 
          url: '/study-recruit', 
        });
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['study'],
      });
    },
  });

  const handleLikeClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    likeMutation.mutate();
  };

  return (
    <>
      <div className="flex flex-shrink-0 items-center gap-[16px]">
        <div className="flex items-center gap-[4px]">
          <Image
            src="/icons/icon_interaction_view.svg"
            alt="view"
            width={18}
            height={18}
          />
          <span className="text-semibold text-sm text-gray-default">
            {viewCount}
          </span>
        </div>
        <div className="flex items-center gap-[4px]">
          <Image
            src="/icons/icon_interaction_review.svg"
            alt="review"
            width={18}
            height={18}
          />
          <span className="text-semibold text-sm text-gray-default">
            {commentCount}
          </span>
        </div>
        <button
          type="button"
          onClick={handleLikeClick}
          className="flex items-center gap-[4px]"
        >
          <Image
            src={
              likeStatus
                ? '/icons/icon_interaction_like_fill.svg'
                : '/icons/icon_interaction_like.svg'
            }
            alt="like"
            width={18}
            height={18}
          />
          <span
            className={`text-semibold text-sm ${
              likeStatus ? 'text-link-default' : 'text-gray-default'
            }`}
          >
            {likeCount}
          </span>
        </button>
      </div>
    </>
  );
}
