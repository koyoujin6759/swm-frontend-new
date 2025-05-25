'use client';

import { getUserInfo } from '@/lib/api/auth';
import { getStudyDetail } from '@/lib/api/study/getStudyDetail';
import { deleteStudy } from '@/lib/api/study/getStudyDetail';
import { addStudyBookmark } from '@/lib/api/study/postStudy';
import { deleteStudyBookmark } from '@/lib/api/study/postStudy';
import { changeRecruitmentPosition } from '@/lib/api/study/recruitmentPosition'; 
import { useToastStore } from '@/store/useToastStore';
import { useQuery } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { NavigationOptions } from 'swiper/types';
import {
  ApiResponse,
} from '@/types/api/study-recruit/recruitmentPosition';
import { getPositionOptions } from '@/types/api/study-recruit/study';
import StudyPositionChange from '@/components/modal/study-position-change';
import Comment from '@/components/study-recruit/detail/Comment';
import BookMarkIcon from '@/components/ui/BookMarkIcon';
import InteractionStatus from '@/components/ui/InteractionStatus';
import {
  GetRecruitmentPositionResponse,
  GetTagResponse,
} from '@/types/api/study-recruit/getStudyDetail';
import { UpdateStudyStatusRequest } from '@/types/api/study-recruit/studyStatus';
import { updateStudyStatus } from '@/lib/api/study/editStudy'; 
import StudyStatusChange from '@/components/modal/study-status-change'; 
import StudyPositionSetting from '@/components/modal/study-position-setting';

export default function StudyRecruitPage({
  params,
}: {
  params: { id: string };
}) {
  const { data } = useQuery({
    queryKey: ['study', 'studyDetail', params.id],
    queryFn: async () => {
      try {
        const response = await getStudyDetail(params.id);

        if (response?.message === 'Expired Token') {
          localStorage.removeItem('accessToken');
          return { message: '정상 처리 되었습니다.', data: null };
        }

        return response;
      } catch (error) {
        console.error('상세 조회 API 오류:', error);
        throw error;
      }
    },
    staleTime: 0, // 항상 최신 데이터 fetch
    gcTime: 0,
  });

  // console.log('detail data', data);

  const router = useRouter();

  // console.log('studyBookmarkId:', data?.data?.studyBookmarkId);

  // 스터디참여신청 가능여부 데이터수정후 수정하기
  const studyApplyStatus = data?.data?.getStudyParticipationStatusResponse?.status;
  // console.log('studyApplyStatus', studyApplyStatus);

  const isBookmark = data?.data?.studyBookmarkId !== null;

  const [timerId, setTimerId] = useState<NodeJS.Timeout | null>(null);

  const { showToast, hideToast } = useToastStore();

  const queryClient = useQueryClient();

  const bookmarkMutation = useMutation({
    mutationFn: async () => {
      if (timerId) {
        clearTimeout(timerId);
      }

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
        const bookmarkId = String(data?.data?.studyBookmarkId);
        if (!bookmarkId) throw new Error('Bookmark ID not found');
        await deleteStudyBookmark(bookmarkId);
        showToast({
          message: '북마크 해제',
          icon: '/icons/icon_bookmark_off.svg',
          url: '/study-recruit',
          urlText: '내 북마크 보기',
        });
      } else {
        await addStudyBookmark(params.id);
        showToast({
          message: '북마크 완료',
          active: true,
          icon: '/icons/icon_bookmark_on.svg',
          url: '/study-recruit',
          urlText: '내 북마크 보기',
        });
      }

      const newTimerId = setTimeout(() => {
        hideToast();
      }, 2000);
      setTimerId(newTimerId);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['study', 'studyDetail', params.id],
        refetchActive: true,
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

  const positionList = getPositionOptions();

  const [pageLoaded, setPageLoaded] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); 

  const handleOptionsClick = () => {
    setIsEditModalOpen(!isEditModalOpen);
  };

  const handleDeleteStudy = async () => {
    try {
      await deleteStudy(params.id);
      
      showToast({
        message: '스터디가 삭제되었습니다.',
      });

      // 삭제 후 바로 리다이렉트
      router.push('/study-recruit');
      
      // 리다이렉트 후 캐시 무효화
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['study'] });
      }, 0);
    } catch (error) {
      console.error('스터디 삭제 중 오류 발생:', error);
      showToast({
        message: error instanceof Error ? error.message : '스터디 삭제에 실패했습니다.',
      });
    }
  };

  useEffect(() => {
    setPageLoaded(true);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const swiperElement = document.querySelector('.swiper');
      const swiper = (swiperElement as unknown as { swiper: SwiperType })
        ?.swiper;
      if (swiper) {
        swiper.update();
        swiper.navigation.update();
      }
    }
  }, [pageLoaded]);

  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  const { data: user } = useQuery({
    queryKey: ['userInfo'],
    queryFn: () => getUserInfo(), 
  });
  // console.log('user', user);

  const formatDate = (dateInput: number[] | string) => {
    if (!dateInput) return '날짜 정보 없음';

    if (typeof dateInput === 'string') {
      const [date, time] = dateInput.split(' ');
      const [year, month, day] = date.split('.');
      const [hours, minutes] = time.split(':');

      const utcDate = new Date(
        `20${year}-${month}-${day}T${hours}:${minutes}:00Z`,
      );
      const kstDate = new Date(utcDate.getTime() + 9 * 60 * 60 * 1000);

      const kstYear = String(kstDate.getUTCFullYear()).slice(-2);
      const kstMonth = String(kstDate.getUTCMonth() + 1).padStart(2, '0');
      const kstDay = String(kstDate.getUTCDate()).padStart(2, '0');
      const kstHours = String(kstDate.getUTCHours()).padStart(2, '0');
      const kstMinutes = String(kstDate.getUTCMinutes()).padStart(2, '0');

      const formattedDate = `${kstYear}.${kstMonth}.${kstDay} ${kstHours}:${kstMinutes}`;
      return formattedDate;
    }
    return '날짜 형식 오류';
  };

  const [activeTab, setActiveTab] = useState('info');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const commentSection = document.getElementById(
        'tab-item-content-comment',
      );
      const infoSection = document.getElementById('tab-item-content-info');

      if (commentSection && infoSection) {
        const commentOffset = commentSection.offsetTop;
        const infoOffset = infoSection.offsetTop;

        if (scrollPosition >= commentOffset) {
          setActiveTab('comment');
        } else if (scrollPosition >= infoOffset) {
          setActiveTab('info');
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const moveActiveTab = (tab: string) => {
    setActiveTab(tab);
    const tabItemContent = document.getElementById('tab-item-content-' + tab);
    if (tabItemContent) {
      tabItemContent.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const moveEditPage = () => {
    router.push(`/study-recruit/${params.id}/edit`);
  }; 

  type ModalType = 'position' | 'status' | 'positionSetting' | null;
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  //모집직무 설정 팝업
  const handleOpenPositionSettingModal = () => {
    setActiveModal('positionSetting');
  };

  // 신청 포지션변경 팝업
  const handleOpenPositionChangeModal = () => {
    setActiveModal('position');
    // console.log('data', data);
  };

  // 스터디 상태 변경 팝업
  const handleOpenStatusChangeModal = () => {
    setActiveModal('status'); 
  };
 

  const handleCloseModal = () => {
    setActiveModal(null);
  };

  // 스터디참여 모집 포지션 수정
  const { mutate: changePosition } = useMutation<
    ApiResponse<null>,
    Error,
    string
  >({
    mutationFn: (value: string) => {
      // 인증 확인
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('로그인이 필요합니다');
      }
        
      const participationId = String(
        data?.data?.getStudyParticipationStatusResponse?.participationId
      );
      
      if (!participationId) throw new Error('Participation ID not found'); 
      
      return changeRecruitmentPosition(value, participationId);
    },
    onSuccess: async (response) => {
      console.log('Position change success:', response);
      showToast({
        message: '신청 포지션이 변경되었습니다.',
      });
      await queryClient.invalidateQueries({
        queryKey: ['study', 'studyDetail', params.id],
        refetchActive: true,
      });
      handleCloseModal();
    },
    onError: (error) => {
      console.error('Position change error details:', error);
      // 오류 메시지를 더 구체적으로 표시
      let errorMessage = '신청 포지션 변경에 실패했습니다.';
      
      if (error instanceof Error) {
        if (error.message.includes('401') || error.message.includes('Unauthorized')) {
          errorMessage = '로그인이 만료되었습니다. 다시 로그인해주세요.';
        } else if (error.message.includes('404') || error.message.includes('Not Found')) {
          errorMessage = '해당 참여 정보를 찾을 수 없습니다.';
        }
      }
      
      showToast({
        message: errorMessage,
      });
    },
  });

  const handleChangePosition = (value: string) => {
    console.log('value', value);
    const token = localStorage.getItem('accessToken');
    if (!token) {
      showToast({
        message: '로그인 후 이용해주세요.',
        url: '/login',
        urlText: '로그인하러 가기',
      });
      return;
    }  
    
    const recruitmentPositionId = data?.data?.getRecruitmentPositionResponses.find(
      (item: GetRecruitmentPositionResponse) => item.title === value
    )?.recruitmentPositionId;
    changePosition(String(recruitmentPositionId));
  };

  const {mutate: updateStudyStatusMutation} = useMutation<
    ApiResponse<UpdateStudyStatusRequest>,
    Error,
    UpdateStudyStatusRequest
  >({
    mutationFn: (statusData : UpdateStudyStatusRequest) => {
      const studyId = String(data?.data?.studyId);
      if (!studyId) throw new Error('Study ID not found');
      return updateStudyStatus(studyId, statusData.status);
    },
    onSuccess: async (response) => {
      console.log(response);
      await queryClient.invalidateQueries({
        queryKey: ['study', 'studyDetail', params.id],
        refetchActive: true,
      });
    },
    onError: (error) => {
      console.error(error);
    },
  }); 

  const handleChangeStatus = (value: string) => { 
    const token = localStorage.getItem('accessToken');
    if (!token) {
      showToast({
        message: '로그인 후 이용해주세요.',
        url: '/login',
        urlText: '로그인하러 가기',
      }); 
      return;
    }

    const statusData: UpdateStudyStatusRequest = {
      status: value,
    };
    updateStudyStatusMutation(statusData, {
      onSuccess: () => {
        showToast({
          message: '스터디 상태가 변경되었습니다.',
        });
        queryClient.invalidateQueries({ queryKey: ['study', 'studyDetail', params.id] });
      },
    });
    
  };

  //스터디 참여하기
  const handleStudyApply = () => { 
    router.push(`/study-recruit/${params.id}/study-apply`); 
  };  

  

  return (
    <>
      <div className="mx-auto flex max-w-screen-xl items-start justify-between gap-[40px] px-5 pb-[100px] pt-[40px] xl:px-0">
        {/* 왼쪽 영역 */}
        <div className="flex flex-auto flex-col gap-[60px] pt-[20px]">
          <div className="flex flex-col gap-[16px]">
            <div className="flex w-full items-center justify-between">
              <div className="flex items-center gap-[12px]">
                <button
                  onClick={handleOpenStatusChangeModal}
                  type="button"
                  className={`flex min-w-[60px] items-center justify-center gap-[2px] rounded-full border   bg-white px-[12px] py-[5px] text-sm font-bold   ${data?.data?.nickname === user?.data?.nickname ? 'cursor-pointer' : 'cursor-default'} ${data?.data?.status === 'ACTIVE' ? 'border-link-default text-link-default' : 'border-gray-light text-gray-light'}`}
                >
                  {data?.data?.status === 'ACTIVE' ? '모집중' : '모집마감'}
                  {data?.data?.nickname === user?.data?.nickname && (
                    <i className="relative top-[1px] flex h-[17px] w-[17px] items-center justify-center rounded-full bg-[#eee]">
                      <Image
                        src="/icons/Edit.svg"
                      alt="edit"
                      width={11}
                      height={11}
                      />
                    </i>
                  )}
                </button>
                <div className="flex items-center gap-[4px]">
                  <Image
                    src={
                      data?.data?.profileImageUrl ||
                      '/icons/icon_no_profile.svg'
                    }
                    alt="study-recruit-icon-1"
                    width={18}
                    height={18}
                    className="overflow-hidden rounded-full"
                  />
                  <p className="text-sm font-bold text-link-default">
                    {data?.data?.nickname}
                  </p>
                </div>
              </div>
              <div className="flex items-center">
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
                {user?.data?.userId &&
                  data?.data?.userId === user?.data.userId && (
                    <div className="relative h-[24px] w-[24px]">
                      <button
                        onClick={handleOptionsClick}
                        className="cursor-pointer"
                      >
                        <Image
                          src="/icons/options.svg"
                          alt="options"
                          width={24}
                          height={24}
                        />
                      </button>
                      {isEditModalOpen && (
                        <div className="z-5 absolute right-0 top-[40px]">
                          <ul className="flex w-[220px] flex-col rounded-[8px] border border-link-default bg-white px-[8px] py-[4px]">
                            <li className="border-b border-gray-disabled">
                              <button
                                onClick={moveEditPage}
                                className="flex w-full items-center justify-between px-[16px] py-[10px] text-sm font-semibold text-gray-default"
                              >
                                <Image
                                  src="/icons/mode_edit.svg"
                                  alt="edit"
                                  width={20}
                                  height={20}
                                />
                                스터디 수정
                              </button>
                            </li>
                            <li className="border-b border-gray-disabled last:border-b-0">
                              <button
                                onClick={handleDeleteStudy}
                                className="flex w-full items-center justify-between px-[16px] py-[10px] text-sm font-semibold text-red-error"
                              >
                                <Image
                                  src="/icons/Delete_red.svg"
                                  alt="delete"
                                  width={20}
                                  height={20}
                                />
                                스터디 삭제
                              </button>
                            </li>
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
              </div>
            </div>
            <div className="font-regular text-sm text-gray-light">
              {formatDate(data?.data?.createdAt || '')}
            </div>
            <div className="text-[24px] font-semibold text-black">
              {data?.data?.title}
            </div>
            <div className="flex items-center gap-[4px]">
              {data?.data?.getRecruitmentPositionResponses.map(
                (item: GetRecruitmentPositionResponse) => (
                  <div
                    key={item.recruitmentPositionId}
                    className="rounded-[4px] bg-[#eee] px-[7px] py-[5px] text-sm font-medium text-[#565656]"
                  >
                    {
                      positionList.find(
                        (position) => position.value === item.title,
                      )?.label
                    }{' '}
                    <span className="text-link-default">
                      {item.headcount}명
                    </span>
                  </div>
                ),
              )}
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-[4px]">
                {data?.data?.getTagResponses.map((item: GetTagResponse) => (
                  <span
                    key={item.tagId}
                    className="h-[30px] min-w-[30px] rounded-[4px] border border-[#eee] bg-white px-[7px] py-[5px] text-sm font-medium text-[#a5a5a5]"
                  >
                    #{item.name}
                  </span>
                ))}
              </div>
              <InteractionStatus
                likeCount={data?.data?.likeCount || 0}
                commentCount={data?.data?.commentCount || 0}
                viewCount={data?.data?.viewCount || 0}
                studyId={params.id}
                likeStatus={data?.data?.likeStatus || false}
              />
            </div>
            <div className="w-full max-w-[860px] overflow-hidden">
              <div className="swiper-container overflow-hidden">
                {pageLoaded && (
                  <Swiper
                    className="my-swiper"
                    modules={[Navigation]}
                    loop={false}
                    spaceBetween={10}
                    slidesPerView="auto"
                    observer={true}
                    observeParents={true}
                    watchOverflow={true}
                    navigation={
                      {
                        prevEl: prevRef.current,
                        nextEl: nextRef.current,
                        enabled: true,
                      } as NavigationOptions
                    }
                    onSwiper={(swiper) => {
                      setTimeout(() => {
                        swiper.update();
                      }, 100);
                    }}
                    onBeforeInit={(swiper) => {
                      if (typeof swiper.params.navigation !== 'boolean') {
                        const nav = swiper.params.navigation;
                        if (nav) {
                          nav.prevEl = prevRef.current;
                          nav.nextEl = nextRef.current;
                        }
                      }
                    }}
                    breakpoints={{
                      320: {
                        slidesPerView: 1.3,
                      },
                      768: {
                        slidesPerView: 2.3,
                      },
                      1024: {
                        slidesPerView: 3.3,
                      },
                    }}
                  >
                    {(() => {
                      // const imageList = data?.data?.getImageResponses
                      //   .filter(image => image && image.imageUrl)
                      //   .map(image => ({
                      //     imageUrl: image.imageUrl,
                      //     imageId: image.imageId
                      //   })) || [];
                      const imageList = data?.data?.getImageResponses || [];

                      const sortedImageList = [...imageList].sort(
                        (a, b) => a.imageId - b.imageId,
                      );

                      return sortedImageList.map((item) => (
                        <SwiperSlide key={item.imageId}>
                          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[8px] border border-gray-disabled">
                            <Image
                              src={item.imageUrl || '/no-image.png'}
                              alt={`study-image-${item.imageId}`}
                              fill
                              className="object-cover"
                            />
                          </div>
                        </SwiperSlide>
                      ));
                    })()}
                  </Swiper>
                )}
              </div>
              <div className="swiper-navigation mt-[16px] !h-[18px] justify-end !gap-[10px]">
                <button
                  ref={prevRef}
                  className="swiper-button-prev !mt-[0] !h-[18px] !w-[18px]"
                ></button>
                <button
                  ref={nextRef}
                  className="swiper-button-next !mt-[0] !h-[18px] !w-[18px]"
                ></button>
              </div>
            </div>
          </div>
          <div className="tab-container">
            <div className="z-5 sticky top-[0px] flex h-[50px] items-center bg-white">
              <div
                className={`tab-item-title ${activeTab === 'info' ? 'tab-item-title-active border-link-default' : 'border-gray-disabled'} h-[50px] min-w-[100px] border-b-2 px-[18px] py-[15px]`}
              >
                <div
                  onClick={() => moveActiveTab('info')}
                  className="tab-item-title-text cursor-pointer text-sm font-semibold text-gray-default"
                >
                  스터디 소개
                </div>
              </div>
              <div
                className={`tab-item-title ${activeTab === 'comment' ? 'tab-item-title-active border-link-default' : 'border-gray-disabled'} h-[50px] min-w-[100px] border-b-2 px-[18px] py-[15px]`}
              >
                <div
                  onClick={() => moveActiveTab('comment')}
                  className="tab-item-title-text flex cursor-pointer items-center justify-center gap-[8px] text-sm font-semibold text-gray-default"
                >
                  댓글{' '}
                  <span className="text-link-default">
                    {data?.data?.commentCount || 0}
                  </span>
                </div>
              </div>
            </div>
            <div className="tab-item-content" id="tab-item-content-info">
              <div className="tab-item-content-text pt-[40px]">
                <div className="rounded-[8px] pb-[24px] text-[20px] font-semibold text-black">
                  스터디 소개
                </div>
                <div className="font-regular rounded-[8px] border border-gray-disabled p-[24px] text-sm text-black">
                  {data?.data?.content}
                </div>
              </div>
              <div
                className="tab-item-content-text pt-[40px]"
                id="tab-item-content-comment"
              >
                <div className="pb-[24px] text-[20px] font-semibold text-black">
                  댓글{' '}
                  <span className="text-link-default">
                    {data?.data?.commentCount || 0}
                  </span>
                </div>
                <div className="font-regular border-t border-gray-disabled text-sm text-gray-light">
                  <Comment
                    studyId={params.id}
                    postAuthorNickname={data?.data?.nickname || ''}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* 오른쪽 영역 */}
        <div className="sticky top-[0px] flex w-[380px] flex-shrink-0 flex-col gap-[40px] bg-white pt-[20px]">
          <div className="flex flex-col gap-[30px]">
            <div className='flex items-center justify-between'>
              <div className="text-[24px] font-semibold text-black">모집 현황</div>
              {data?.data?.nickname === user?.data?.nickname && (
                <button onClick={handleOpenPositionSettingModal} type='button' className='group flex items-center gap-[4px] text-[14px] font-medium text-[#a5a5a5] hover:text-link-default'>
                  <div className='relative w-[14px] h-[14px]'>
                    <Image src='/icons/Settings.svg' alt='' width={14} height={14} className="transition-opacity group-hover:opacity-0" />
                    <Image src='/icons/Settings-blue.svg' alt='' width={14} height={14} className="opacity-0 transition-opacity group-hover:opacity-100 absolute top-0 left-0" />
                  </div>
                  모집 직무 설정 
                </button>
              )}
            </div> 
            <ul>
              {data?.data?.getRecruitmentPositionResponses.map(
                (item: GetRecruitmentPositionResponse) => (
                  <li
                    key={item.recruitmentPositionId}
                    className="flex items-center justify-between gap-[5px] border-t border-gray-disabled py-[16px]"
                  >
                    <div className="flex items-center gap-[8px]">
                      <div className="text-[16px] font-semibold text-black">
                        {
                          positionList.find(
                            (position) => position.value === item.title,
                          )?.label
                        }{' '}
                        <span className="text-link-default">
                          {item.headcount}명
                        </span>{' '}
                        모집중
                      </div>
                      {/* <div className="h-[30px] min-w-[40px] rounded-[4px] bg-[#E7F3FF] px-[6px] py-[4px] text-[14px] font-medium text-link-default">
                      신청함
                    </div> */}
                    </div>
                    <div>
                      <span className="box-border block h-[30px] min-w-[50px] rounded-[4px] border border-[#eee] px-[6px] py-[4px] text-[14px] font-medium text-[#a5a5a5]">
                        {item.participatedCount}명 신청중
                      </span>
                    </div>
                  </li>
                ),
              )}
            </ul>
          </div>
          {user?.data?.userId !== data?.data?.userId && (
            <>
              <div className="flex flex-col gap-[30px]">
                <div className="text-[24px] font-semibold text-black">
                  내 신청 현황
                </div>

                {!studyApplyStatus ? (
                  <div className="text-left text-[16px] font-semibold text-[#a5a5a5] border-t border-gray-disabled py-[16px]">
                    신청한 직무가 없습니다
                  </div>
                ) : (
                  <ul>
                    <li className="flex w-full items-center justify-between gap-[5px] border-t border-gray-disabled py-[16px]">
                      <div className="flex w-full items-center justify-between gap-[8px]">
                        <div className="flex items-center gap-[8px]">
                          <div className="text-[16px] font-semibold text-black">
                            {
                              positionList.find(
                                (position) => position.value === data?.data?.getStudyParticipationStatusResponse?.title,
                              )?.label || ''
                            } 직무
                          </div>
                          <div className={`h-[30px] min-w-[40px] rounded-[4px] px-[6px] py-[4px] text-[14px] font-medium ${
                            studyApplyStatus === 'PENDING' 
                              ? 'bg-[#E7F3FF] text-link-default' 
                              : studyApplyStatus === 'ACCEPTED' 
                                ? 'bg-[#4998E9] text-white' 
                                : 'bg-[#FFE7E7] text-red-600'
                          }`}>
                            {studyApplyStatus === 'PENDING' 
                              ? '신청완료' 
                              : studyApplyStatus === 'ACCEPTED' 
                                ? '승인완료' 
                                : '거절됨'}
                          </div>
                        </div>
                        <button
                          onClick={handleOpenPositionChangeModal}
                          type="button"
                          className="cursor-pointer text-sm font-medium text-[#a5a5a5] hover:text-link-default"
                        >
                          신청 포지션 변경
                        </button>
                      </div>
                    </li>
                  </ul>
                )}
              </div> 
               
              <button
                onClick={studyApplyStatus === 'PENDING' ? undefined :handleStudyApply }
                type="button"
                disabled={studyApplyStatus === 'PENDING'}
              className={`h-[60px] w-full rounded-[8px] text-[16px] font-semibold text-white ${studyApplyStatus === 'PENDING' ? 'bg-[#e0e0e0] cursor-default' : 'bg-link-default cursor-pointer'}`}
            >
              {studyApplyStatus === 'PENDING' ? '이미 신청한 스터디입니다' : '스터디 참여하기'}
              </button>  
            </> 
          )} 
          {user?.data?.userId === data?.data?.userId && (
            <div className='flex justify-end'>
              <button onClick={() => router.push(`/study-recruit/${params.id}/recruitStatus`)} type='button' className='flex items-center gap-[4px] text-[14px] font-medium text-[#a5a5a5] hover:text-link-default'>    
                모집 현황 자세히 보기 
                <Image src='/icons/icon_gry_18_back.svg' alt='' width={14} height={14} />
              </button>
            </div>
          )} 
        </div>
      </div>
      {activeModal === 'position' && ( // 신청 포지션 변경 팝업
        <StudyPositionChange
          handleCloseModal={handleCloseModal}
          defaultValue={
            positionList.find(
              (position) =>
                position.value === data?.data?.getStudyParticipationStatusResponse?.title,
            )?.value || ''
          }
          position={
            data?.data?.getRecruitmentPositionResponses.map(
              (position: GetRecruitmentPositionResponse) => position.title,
            ) || []
          }
          onClickOption={handleChangePosition} 
        />
      )}
      {activeModal === 'status' && ( // 스터디 상태 변경 팝업
        <StudyStatusChange
          handleCloseModal={handleCloseModal}
          defaultValue={data?.data?.status || ''}
          options={['ACTIVE', 'INACTIVE']}
          onClickOption={handleChangeStatus}
        />
      )} 
      {activeModal === 'positionSetting' && ( // 모집 직무 설정 팝업
        <StudyPositionSetting
          studyId={params.id}
          positionOptions={data?.data?.getRecruitmentPositionResponses || []}
          handleCloseModal={handleCloseModal} 
        />
      )}
    </>
  );
}
