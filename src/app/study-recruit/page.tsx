'use client';

import { getStudy } from '@/lib/api/study/getStudy';
import { useInfiniteQuery } from '@tanstack/react-query'; 
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRef } from 'react';
import {
  RecruitmentPositionTitle,
  SearchStudyParams,
  SortCriteria,
  Study,
  StudyCategory,
  StudyStatus,
  getCategoryOptions,
  getPositionOptions,
  getSortOptions,
  getStatusOptions,
} from '@/types/api/study-recruit/study';
import CategoryFilter from '@/components/study-recruit/filter/CategoryFilter';
import PositionFilter from '@/components/study-recruit/filter/PositionFilter';
import SortFilter from '@/components/study-recruit/filter/SortFilter';
import StatusFilter from '@/components/study-recruit/filter/StatusFilter';
import StudyItem from '@/components/study-recruit/list/StudyItem';
import Loadingbar from '@/components/ui/Loadingbar';

const SELECT_IDS = {
  CATEGORY: 'CATEGORY',
  POSITION: 'POSITION',
  STATUS: 'STATUS',
  SORT: 'SORT',
} as const;

export default function StudyRecruit() {
  const [selectCategory, setSelectCategory] = useState<string | string[]>(
    'ALL',
  );
  const [selectPosition, setSelectPosition] = useState<string | string[]>(
    'ALL',
  );
  const [selectStatus, setSelectStatus] = useState<string | string[]>('ALL');
  const [selectSort, setSelectSort] = useState<string | string[]>(
    SortCriteria.NEWEST,
  );

  const [openSelectId, setOpenSelectId] = useState<
    keyof typeof SELECT_IDS | null
  >(null);

  const {
    data: study,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: [
      'study',
      'studyDetail',
      selectSort,
      selectCategory,
      selectPosition,
      selectStatus,
    ],
    initialPageParam: { lastStudyId: 0, lastSortValue: 0 },
    queryFn: async ({ pageParam = { lastStudyId: 0, lastSortValue: 0 } }) => {
      try {
        const params: SearchStudyParams = {
          sortCriteria: selectSort as SortCriteria,
          ...(selectCategory !== 'ALL' && {
            category: selectCategory as StudyCategory,
          }),
          ...(selectStatus !== 'ALL' && {
            status: selectStatus as StudyStatus,
          }),
          ...(selectPosition !== 'ALL' &&
            Array.isArray(selectPosition) &&
            selectPosition.length > 0 && {
              recruitmentPositionTitles:
                selectPosition as RecruitmentPositionTitle[],
            }),
          ...(selectPosition !== 'ALL' &&
            !Array.isArray(selectPosition) && {
              recruitmentPositionTitles: [
                selectPosition as RecruitmentPositionTitle,
              ],
            }),
          ...(pageParam?.lastStudyId && { lastStudyId: pageParam.lastStudyId }),
          ...(pageParam?.lastSortValue && {
            lastSortValue: pageParam.lastSortValue,
          }),
        };
        // console.log('api params', params);
        const response = await getStudy(params);
        if (response?.message === 'Expired Token') {
          localStorage.removeItem('accessToken');
          return { message: '정상 처리 되었습니다.', data: null };
        }
        return response;

      } catch (error) {
        console.error('Error fetching study:', error);
        throw error;
      }
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage.data?.hasNext) return undefined;

      const lastItem = lastPage.data.data[lastPage.data.data.length - 1];
      return {
        lastStudyId: lastItem.studyId,
        lastSortValue:
          selectSort === SortCriteria.LIKE
            ? lastItem.likeCount
            : selectSort === SortCriteria.COMMENT
              ? lastItem.commentCount
              : lastItem.studyId,
      };
    },
    staleTime: 0,
    refetchOnMount: true,
  });

  const observerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isLoading) {
          fetchNextPage();
        }
      },
      { threshold: 1.0 },
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [fetchNextPage, hasNextPage, isLoading]);

  if (isLoading) {
    return (
      <div className="mx-auto flex h-screen max-w-screen-xl items-center justify-center">
        <Loadingbar />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto flex h-screen max-w-screen-xl items-center justify-center">
        에러가 발생했습니다.
      </div>
    );
  }

  const handleCategoryChange = (value: string | string[]) => {
    setSelectCategory(value || 'ALL');
  };

  const handlePositionChange = (value: string | string[]) => {
    if (Array.isArray(value) && value.length === 0) {
      setSelectPosition('ALL');
      return;
    }
    
    if (value === '') {
      setSelectPosition('ALL');
      return;
    }
    
    if (Array.isArray(value) && value.includes('ALL')) {
      setSelectPosition('ALL');
      return;
    }
    
    if (value === 'ALL') {
      setSelectPosition('ALL');
      return;
    }
    
    setSelectPosition(value);
  };

  const handleStatusChange = (value: string | string[]) => {
    setSelectStatus(value || 'ALL');
  };

  const handleSortChange = (value: string | string[]) => {
    setSelectSort(value || SortCriteria.NEWEST);
  };

  const categoryOptions = getCategoryOptions();
  const positionOptions = getPositionOptions();
  const statusOptions = getStatusOptions();
  const sortOptions = getSortOptions();

  return (
    <section className="mx-auto max-w-screen-xl px-5 pb-[110px] pt-10 xl:px-0">
      <h2 className="mb-[34px] text-2xl font-semibold">스터디 모집</h2>
      <div className="mb-[34px] flex items-end justify-between">
        <div className="flex items-center justify-start gap-5">
          <CategoryFilter
            type="default"
            onChange={handleCategoryChange}
            defaultValue={selectCategory}
            options={categoryOptions}
            isOpen={openSelectId === SELECT_IDS.CATEGORY}
            onToggle={() =>
              setOpenSelectId(
                openSelectId === SELECT_IDS.CATEGORY
                  ? null
                  : SELECT_IDS.CATEGORY,
              )
            }
          />
          <PositionFilter
            type="button"
            onChange={handlePositionChange}
            defaultValue={selectPosition}
            options={positionOptions}
            isOpen={openSelectId === SELECT_IDS.POSITION}
            onToggle={() =>
              setOpenSelectId(
                openSelectId === SELECT_IDS.POSITION
                  ? null
                  : SELECT_IDS.POSITION,
              )
            }
          />
          <StatusFilter
            type="default"
            onChange={handleStatusChange}
            defaultValue={selectStatus}
            options={statusOptions}
            isOpen={openSelectId === SELECT_IDS.STATUS}
            onToggle={() =>
              setOpenSelectId(
                openSelectId === SELECT_IDS.STATUS ? null : SELECT_IDS.STATUS,
              )
            }
          />
        </div>
        <div className="flex items-center gap-1">
          {/* <TagFilter type='button' onChange={handleTagChange} defaultValue={selectTag} options={dummyTags.map((tag)=> ({id: tag.id,value: tag.value, label: tag.label}))} isOpen={openSelectId === 'select4'} onToggle={() => setOpenSelectId(openSelectId === 'select4' ? null : 'select4')} filterName='태그' /> */}
          <SortFilter
            type="default"
            onChange={handleSortChange}
            defaultValue={selectSort}
            options={sortOptions.map((sort) => ({
              id: sort.id,
              value: sort.value,
              label: sort.label,
            }))}
            isOpen={openSelectId === SELECT_IDS.SORT}
            onToggle={() =>
              setOpenSelectId(
                openSelectId === SELECT_IDS.SORT ? null : SELECT_IDS.SORT,
              )
            }
            filterName="최신순"
          />
        </div>
      </div>
      {!study?.pages || study?.pages[0]?.data?.data?.length === 0 ? (
        <div className="flex h-[300px] items-center justify-center">
          <div className="flex w-full max-w-[480px] flex-col items-center justify-center rounded-[8px] bg-[#f9f9f9] py-[40px]">
            <Image
              src="/icons/icon_no_result.svg"
              alt="search"
              width={65}
              height={65}
            />
            <h3 className="mt-[30px] text-[20px] font-semibold text-black">
              스터디를 찾지 못했습니다.
            </h3>
            <p className="text-regular mt-[12px] text-sm text-gray-default">
              검색 결과가 없습니다.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid w-full max-w-screen-xl grid-cols-1 gap-x-5 gap-y-[26px] md:grid-cols-2 lg:grid-cols-3">
          {study.pages.map((page) => {
            return page.data?.data.map((item) => {
              return (
                <StudyItem
                  key={`${item.studyId}-${item.title}`}
                  data={item as Study}
                />
              );
            });
          })}
        </div>
      )}
      <div ref={observerRef} className="h-4" />
    </section>
  );
}
