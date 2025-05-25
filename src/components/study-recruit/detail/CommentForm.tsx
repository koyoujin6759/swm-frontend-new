'use client';

import { getUserInfo } from '@/lib/api/auth';
import { postComment } from '@/lib/api/study/postComment';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useToastStore } from '@/store/useToastStore';

export default function CommentForm({ studyId }: { studyId: string }) {
  const queryClient = useQueryClient();
  const { showToast } = useToastStore();
  const router = useRouter();

  const { data: user } = useQuery({
    queryKey: ['userInfo'],
    queryFn: () => getUserInfo(),
  });

  const [content, setContent] = useState('');
  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const { mutate: submitComment } = useMutation({
    mutationFn: () => postComment(studyId, content),
    onSuccess: (response) => {
      if (response.message === 'Expired Token') {
        showToast({
          message: '로그인이 만료되었습니다. 다시 로그인해주세요.',
          url: '/login',
          urlText: '로그인하러 가기',
        });
        router.push('/login');
        return;
      }

      //   console.log('댓글 작성 성공', response);
      setContent('');
      queryClient.invalidateQueries({ queryKey: ['comment', studyId] });
      showToast({
        message: '댓글이 작성되었습니다.',
      });
    },
    onError: (error) => {
      console.error('API Error:', error);
      showToast({
        message: '댓글 작성에 실패했습니다. 다시 시도해주세요.',
      });
    },
  });
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    submitComment();
  };
  return (
    <div className="pt-[24px]">
      <form onSubmit={handleSubmit} className="flex flex-col gap-[16px]">
        <div className="flex h-[180px] flex-col gap-[16px] rounded-[8px] border border-gray-disabled p-[24px]">
          <div className="flex items-center gap-[4px]">
            {user?.data?.nickname ? (
              <>
                <Image
                  src="/icons/icon_no_profile.svg"
                  alt="user"
                  width={18}
                  height={18}
                />
                <span className="text-[14px] font-bold text-link-default">
                  {user?.data?.nickname}
                </span>
              </>
            ) : (
              <div>로그인 후 댓글을 작성해주세요.</div>
            )}
          </div>
          {user?.data?.nickname && (
            <>
              <textarea
                name="content"
                id="content"
                placeholder="스터디에 관한 질문을 댓글로 남겨주세요."
                value={content}
                onChange={handleCommentChange}
                className="h-[100px] w-full resize-none rounded-md border-0 placeholder:text-[14px] placeholder:text-gray-light focus:outline-none"
              />
            </>
          )}
        </div> 
        <div className="flex justify-end">
          <button
            type="submit"
            className="h-[40px] w-[160px] rounded-[4px] bg-link-default text-[14px] font-semibold text-white"
          >
            댓글 작성
          </button>
        </div>
      </form>
    </div>
  );
}
