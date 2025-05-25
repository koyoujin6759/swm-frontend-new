'use client';

import { getUserInfo } from '@/lib/api/auth';
import {
  deleteComment,
  editComment,
  getComment,
  getReply,
} from '@/lib/api/study/getComment';
import { postReply } from '@/lib/api/study/postComment';
import { useToastStore } from '@/store/useToastStore';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Suspense, useState } from 'react';
import CommentForm from './CommentForm';
import { ApiReplyResponse, Reply } from '@/types/api/study-recruit/getReply';
import LoadingBar from '@/components/ui/Loadingbar';

export default function Comment({
  studyId,
  postAuthorNickname,
}: {
  studyId: string;
  postAuthorNickname: string | undefined;
}) {
  const [page, setPage] = useState(0);
  const handlePageChange = (newPage: number) => {
    const currentPosition = window.scrollY;
    setPage(newPage);
    setTimeout(() => {
      window.scrollTo(0, currentPosition);
    }, 0);
  };

  const { data: comments, isError } = useQuery({
    queryKey: ['comment', studyId, page],
    queryFn: () => getComment(studyId, page),
  });

  const { data: user } = useQuery({
    queryKey: ['userInfo'],
    queryFn: () => getUserInfo(),
  });

  const [parentId, setParentId] = useState<string>('');

  const { data: allReplies } = useInfiniteQuery<ApiReplyResponse<Reply>[]>({
    queryKey: ['replies', comments?.data?.data?.map((c) => c.commentId)],
    initialPageParam: { lastReplyId: 0 },
    queryFn: async () => {
      if (!comments?.data?.data) return [];
      return Promise.all(
        comments.data.data.map((comment) =>
          getReply(String(comment.commentId), { lastReplyId: 0 }),
        ),
      );
    },
    enabled: !!comments?.data?.data,

    getNextPageParam: (lastPage) => {
      if (!lastPage) return undefined;
      const hasMore = lastPage.some((reply) => reply.data.data.length > 0);
      return hasMore ? lastPage[0]?.data?.data[0]?.commentId : undefined;
    },
  });

  const getRepliesForComment = (commentId: string, index: number) => {
    const replies = allReplies?.pages?.[0] as
      | ApiReplyResponse<Reply>[]
      | undefined;
    return replies?.[index]?.data?.data || [];
  };

  const router = useRouter();
  const queryClient = useQueryClient();
  const { showToast } = useToastStore();

  const [replyContent, setReplyContent] = useState('');
  const handleReplyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReplyContent(e.target.value);
  };

  const [isReplyEditing, setIsReplyEditing] = useState(false);
  const [editingReplyId, setEditingReplyId] = useState<string | null>(null);
  const [editReplyContent, setEditReplyContent] = useState('');

  const { mutate: submitReply } = useMutation({
    mutationFn: () => postReply(studyId, parentId, replyContent),
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

      console.log('답글 작성 성공', response);
      setReplyContent('');
      setParentId('');
      setShowReplyId(null);
      queryClient.invalidateQueries({ queryKey: ['replies'] });
      //   console.log('답글 작성 성공');
      showToast({
        message: '답글이 작성되었습니다.',
      });
    },
    onError: (error) => {
      console.error('API Error:', error);
      showToast({
        message: '답글 작성에 실패했습니다. 다시 시도해주세요.',
      });
    },
  });

  //   console.log('Query State:', { comments, isError });
  //   console.log('allReplies', allReplies);

  const [showReplyId, setShowReplyId] = useState<string | null>(null);
  const handleReplyClick = (commentId: string) => {
    setParentId(String(commentId));
    setShowReplyId(String(commentId));
  };

  const formatDate = (dateInput: number[] | string) => {
    if (typeof dateInput === 'string') {
      const [date, time] = dateInput.split(' ');
      const [year, month, day] = date.split('.');
      const [hours, minutes] = time.split(':');

      // UTC를 KST로 변환 (9시간 추가)
      const kstHours = (parseInt(hours) + 9) % 24;
      const formattedHours = String(kstHours).padStart(2, '0');

      return `${year}.${month}.${day} ${formattedHours}:${minutes}`;
    }
    return '날짜 형식 오류';
  };

  const [visibleReplyCounts, setVisibleReplyCounts] = useState<{
    [key: string]: { count: number; expanded: boolean };
  }>({});

  const getVisibleReplies = (commentId: string, replies: Reply[]) => {
    const visibleState = visibleReplyCounts[commentId] || {
      count: 1,
      expanded: false,
    };
    return replies.slice(
      0,
      visibleState.expanded ? replies.length : visibleState.count,
    );
  };

  const handleLoadMore = (commentId: string, replies: Reply[]) => {
    setVisibleReplyCounts((prev) => ({
      ...prev,
      [commentId]: {
        count: replies.length,
        expanded: true,
      },
    }));
  };

  const handleLoadLess = (commentId: string) => {
    setVisibleReplyCounts((prev) => ({
      ...prev,
      [commentId]: {
        count: 1,
        expanded: false,
      },
    }));
  };

  const { mutate: deleteCommentMutation } = useMutation({
    mutationFn: ({
      studyId,
      commentId,
    }: {
      studyId: string;
      commentId: string;
    }) => deleteComment(studyId, commentId),
    onSuccess: () => {
      showToast({
        message: '댓글이 삭제되었습니다.',
      });
      queryClient.invalidateQueries({ queryKey: ['comment'] });
      queryClient.invalidateQueries({ queryKey: ['replies'] });
    },
    onError: () => {
      showToast({
        message: '댓글 삭제에 실패했습니다.',
      });
    },
  });

  const handleDeleteComment = (studyId: string, commentId: string) => {
    deleteCommentMutation({ studyId, commentId });
  };

  const [isEditing, setIsEditing] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  const handleEditStart = (commentId: string) => {
    const comment = comments?.data.data.find(
      (c) => String(c.commentId) === commentId,
    );
    setEditingCommentId(commentId);
    setEditContent(comment?.content || '');
    setIsEditing(!isEditing);
  };

  const handleReplyEditStart = (replyId: string) => {
    const reply = allReplies?.pages?.[0]
      ?.flatMap((page) => page.data.data)
      .find((r) => String(r.commentId) === replyId);
    setEditingReplyId(replyId);
    setEditReplyContent(reply?.content || '');
    setIsReplyEditing(!isReplyEditing);
  };

  const { mutate: editCommentMutation } = useMutation({
    mutationFn: ({
      commentId,
      content,
    }: {
      commentId: string;
      content: string;
    }) => editComment(commentId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comment'] });
      setEditingCommentId(null);
      setEditContent('');
      setIsEditing(false);
      showToast({
        message: '댓글이 수정되었습니다.',
      });
    },
    onError: () => {
      showToast({
        message: '댓글 수정에 실패했습니다.',
      });
    },
  });

  const { mutate: editReplyMutation } = useMutation({
    mutationFn: ({ replyId, content }: { replyId: string; content: string }) =>
      editComment(replyId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['replies'] });
      setEditingReplyId(null);
      setEditReplyContent('');
      setIsReplyEditing(false);
      showToast({
        message: '답글이 수정되었습니다.',
      });
    },
    onError: () => {
      showToast({
        message: '답글 수정에 실패했습니다.',
      });
    },
  });

  const handleReplyEditSubmit = (replyId: string) => {
    if (editingReplyId) {
      editReplyMutation({ replyId, content: editReplyContent });
    }
    setIsReplyEditing(!isReplyEditing);
  };

  const handleEditSubmit = (commentId: string) => {
    if (editingCommentId) {
      editCommentMutation({ commentId, content: editContent });
    }
    setIsEditing(!isEditing);
  };

  if (isError) {
    return <div>댓글 조회 실패</div>;
  }

  return (
    <Suspense fallback={<LoadingBar />}>
      <div>
        {comments?.data.data.map((comment, index) => {
          const commentReplies = getRepliesForComment(
            String(comment.commentId),
            index,
          );
          const visibleReplies = getVisibleReplies(
            String(comment.commentId),
            commentReplies,
          );

          return (
            <div key={comment.commentId}>
              <div className="flex flex-col gap-[16px] border-b border-gray-disabled py-[24px]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-[4px]">
                    <Image
                      src="/icons/icon_no_profile.svg"
                      alt="user"
                      width={18}
                      height={18}
                    />
                    <p className="text-[14px] font-bold text-link-default">
                      {comment.nickname}
                    </p>
                  </div>
                  {comment.nickname === user?.data?.nickname && (
                    <div className="flex items-center gap-[4px]">
                      <button
                        onClick={() =>
                          handleEditStart(String(comment.commentId))
                        }
                        type="button"
                        className="flex h-[33px] w-[63px] cursor-pointer items-center justify-center gap-[2px] rounded-[4px] border border-gray-disabled bg-[#f9f9f9] text-[14px] font-medium text-[#6e6e6e]"
                      >
                        <Image
                          src="/icons/Edit-deepgray.svg"
                          alt="수정"
                          width={16}
                          height={16}
                        />
                        {isEditing ? '취소' : '수정'}
                      </button>
                      <button
                        onClick={() =>
                          handleDeleteComment(
                            studyId,
                            String(comment.commentId),
                          )
                        }
                        type="button"
                        className="flex h-[33px] w-[63px] cursor-pointer items-center justify-center gap-[2px] rounded-[4px] border border-gray-disabled bg-[#f9f9f9] text-[14px] font-medium text-[#6e6e6e]"
                      >
                        <Image
                          src="/icons/Delete-deepgray.svg"
                          alt="삭제"
                          width={16}
                          height={16}
                        />
                        삭제
                      </button>
                    </div>
                  )}
                </div>
                {isEditing ? (
                  <div>
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="h-[120px] w-full resize-none rounded-[8px] border border-gray-disabled p-[16px] text-sm text-black placeholder:text-gray-light"
                      placeholder="댓글을 수정해주세요."
                    />
                    <div className="flex justify-end">
                      <button
                        onClick={() =>
                          handleEditSubmit(String(comment.commentId))
                        }
                        type="button"
                        className="h-[40px] w-[160px] cursor-pointer rounded-[4px] border border-[#e0e0e0] bg-[#f9f9f9] text-[14px] font-semibold text-[#626262]"
                      >
                        수정 완료
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="font-regular text-[14px] text-black">
                    {comment.content}
                  </p>
                )}
                <div className="flex items-center justify-between">
                  <p className="font-regular text-[14px] text-gray-light">
                    {formatDate(comment.createdAt)}
                  </p>
                  {user?.data &&
                    comment.nickname !== user?.data?.nickname &&
                    user?.data?.nickname === postAuthorNickname && (
                      <button
                        onClick={() =>
                          handleReplyClick(String(comment.commentId))
                        }
                        type="button"
                        className="h-[33px] w-[57px] cursor-pointer rounded-[4px] border border-[#e0e0e0] bg-[#f9f9f9] text-[14px] font-semibold text-[#626262]"
                      >
                        답글
                      </button>
                    )}
                  {/* <button className="flex items-center gap-[4px]">
                    <Image
                      src="/icons/Favorite.svg"
                      alt="favorite"
                      width={18}
                      height={18}
                    />
                     <p className="font-regular text-[14px] text-gray-light">
                    {comment.likeCount}
                    </p>  
                  </button> */}
                </div>
              </div>
              {/* 답글 입력 영역 */}
              {showReplyId === String(comment.commentId) && (
                <div className="relative border-b border-gray-disabled py-[24px] pl-[48px] before:absolute before:left-[18px] before:top-[24px] before:h-[10px] before:w-[10px] before:border-b before:border-l before:border-link-default">
                  <form
                    onSubmit={() => submitReply()}
                    className="flex flex-col gap-[10px]"
                  >
                    <div>
                      <textarea
                        value={replyContent}
                        onChange={handleReplyChange}
                        className="h-[120px] w-full resize-none rounded-[8px] border border-gray-disabled p-[16px] text-sm text-gray-light"
                        placeholder="스터디에 관한 질문을 댓글로 남겨주세요."
                      />
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="h-[40px] w-[160px] cursor-pointer rounded-[4px] border border-[#e0e0e0] bg-[#f9f9f9] text-[14px] font-semibold text-[#626262]"
                      >
                        답글 등록
                      </button>
                    </div>
                  </form>
                </div>
              )}
              <div>
                {visibleReplies.map((replyItem: Reply) => (
                  <div
                    key={replyItem.commentId}
                    className="relative flex flex-col gap-[16px] border-b border-gray-disabled py-[24px] pl-[48px] before:absolute before:left-[18px] before:top-[32px] before:h-[10px] before:w-[10px] before:border-b before:border-l before:border-link-default"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-[4px]">
                        <Image
                          src="/icons/icon_no_profile.svg"
                          alt="user"
                          width={18}
                          height={18}
                        />
                        <p className="text-[14px] font-bold text-link-default">
                          {replyItem.nickname}
                        </p>
                        {replyItem.nickname === user?.data?.nickname && (
                          <span className="flex h-[33px] w-[60px] items-center justify-center rounded-[4px] bg-[#E7F3FF] text-[14px] font-medium text-link-default">
                            내 댓글
                          </span>
                        )}
                      </div>
                      {replyItem.nickname === user?.data?.nickname && (
                        <div className="flex items-center gap-[4px]">
                          <button
                            onClick={() =>
                              handleReplyEditStart(String(replyItem.commentId))
                            }
                            type="button"
                            className="flex h-[33px] w-[63px] cursor-pointer items-center justify-center gap-[2px] rounded-[4px] border border-gray-disabled bg-[#f9f9f9] text-[14px] font-medium text-[#6e6e6e]"
                          >
                            <Image
                              src="/icons/Edit-deepgray.svg"
                              alt="수정"
                              width={16}
                              height={16}
                            />
                            수정
                          </button>
                          <button
                            onClick={() =>
                              handleDeleteComment(
                                studyId,
                                String(replyItem.commentId),
                              )
                            }
                            type="button"
                            className="flex h-[33px] w-[63px] cursor-pointer items-center justify-center gap-[2px] rounded-[4px] border border-gray-disabled bg-[#f9f9f9] text-[14px] font-medium text-[#6e6e6e]"
                          >
                            <Image
                              src="/icons/Delete-deepgray.svg"
                              alt="삭제"
                              width={16}
                              height={16}
                            />
                            삭제
                          </button>
                        </div>
                      )}
                    </div>
                    {isReplyEditing ? (
                      <div>
                        <textarea
                          value={editReplyContent}
                          onChange={(e) => setEditReplyContent(e.target.value)}
                          className="h-[120px] w-full resize-none rounded-[8px] border border-gray-disabled p-[16px] text-sm text-black placeholder:text-gray-light"
                          placeholder="댓글을 수정해주세요."
                        />
                        <div className="flex justify-end">
                          <button
                            onClick={() =>
                              handleReplyEditSubmit(String(replyItem.commentId))
                            }
                            type="button"
                            className="h-[40px] w-[160px] cursor-pointer rounded-[4px] border border-[#e0e0e0] bg-[#f9f9f9] text-[14px] font-semibold text-[#626262]"
                          >
                            수정 완료
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="font-regular text-[14px] text-black">
                        {replyItem.content}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <p className="font-regular text-[14px] text-gray-light">
                        {formatDate(replyItem.createdAt)}
                      </p>
                      {/* {user?.data &&
                        replyItem.nickname !== user?.data?.nickname && (
                          <button
                            onClick={() =>
                              handleReplyClick(String(replyItem.commentId))
                            }
                            type="button"
                            className="h-[33px] w-[57px] cursor-pointer rounded-[4px] border border-[#e0e0e0] bg-[#f9f9f9] text-[14px] font-semibold text-[#626262]"
                          >
                            답글
                          </button>
                        )} */}
                      {/* <button
                        type="button"
                        className="flex items-center gap-[4px]"
                      >
                        <Image
                          src="/icons/Favorite.svg"
                          alt="favorite"
                          width={18}
                          height={18}
                        />
                        <p className="font-regular text-[14px] text-gray-light">
                          {reply.likeCount}
                        </p>
                      </button> */}
                    </div>
                  </div>
                ))}
              </div>
              {(commentReplies.length > 1 ||
                visibleReplyCounts[String(comment.commentId)]?.expanded) && (
                <div className="px-[16px] py-[27px]">
                  <button
                    onClick={() =>
                      visibleReplyCounts[String(comment.commentId)]?.expanded
                        ? handleLoadLess(String(comment.commentId))
                        : handleLoadMore(
                            String(comment.commentId),
                            commentReplies,
                          )
                    }
                    type="button"
                    className="flex cursor-pointer items-center gap-[4px] text-[14px] font-semibold text-[#828282]"
                  >
                    {visibleReplyCounts[String(comment.commentId)]?.expanded
                      ? '답글 접기'
                      : `답글 ${commentReplies.length - 1}개 더보기`}{' '}
                    <Image
                      src="/icons/icon_select_arrow.svg"
                      alt="arrow"
                      width={24}
                      height={24}
                      className={
                        visibleReplyCounts[String(comment.commentId)]?.expanded
                          ? 'rotate-180'
                          : ''
                      }
                    />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <CommentForm studyId={studyId} />
      {comments?.data?.data && comments?.data?.data?.length > 0 && (
        <div className="mt-[24px] flex items-center justify-center gap-[10px]">
          <button
            onClick={() => handlePageChange(0)}
            disabled={page === 0}
            className="cursor-pointer"
          >
            <Image
              src="/icons/AngleLeft2.svg"
              alt="arrow"
              width={14}
              height={14}
              className="rotate-180 transform"
            />
          </button>
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 0}
            className="cursor-pointer"
          >
            <Image
              src="/icons/AngleLeft.svg"
              alt="arrow"
              width={14}
              height={14}
              className="rotate-180 transform"
            />
          </button>
          {[
            ...Array(Math.min(Math.ceil(comments?.data?.totalPages ?? 1), 5)),
          ].map((_, i) => (
            <button
              key={i}
              onClick={() => handlePageChange(i)}
              className={`text-[14px] ${
                page === i ? 'font-bold text-black' : 'text-[#828282]'
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page >= Math.ceil((comments?.data?.totalPages ?? 1) - 1)}
            className="cursor-pointer"
          >
            <Image
              src="/icons/AngleLeft.svg"
              alt="arrow"
              width={14}
              height={14}
            />
          </button>
          <button
            onClick={() =>
              setPage(Math.ceil((comments?.data?.totalPages ?? 1) - 1))
            }
            disabled={page >= Math.ceil((comments?.data?.totalPages ?? 1) - 1)}
            className="cursor-pointer"
          >
            <Image
              src="/icons/AngleLeft2.svg"
              alt="arrow"
              width={14}
              height={14}
            />
          </button>
        </div>
      )}
    </Suspense>
  );
}
