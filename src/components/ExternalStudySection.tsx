'use client';

import { getExternalStudy } from '@/lib/api/study/getExternalStudy';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import ExternalStudyItem from './ExternalStudyItem';
import Loadingbar from '@/components/ui/Loadingbar';

export default function ExternalStudySection() {
  const {
    data: externalStudy,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['externalStudy'],
    queryFn: getExternalStudy,
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 24,
  });
  const externalStudyData = externalStudy?.data.externalStudies;
  // console.log('externalStudyData type:', typeof externalStudyData, 'value:', externalStudyData);
  if (error) return <div>에러가 발생했습니다</div>;

  return (
    <>
      <article className="relative">
        <div className="mb-[40px] flex items-center justify-between">
          <div className="flex items-center gap-[20px]">
            <h3 className="text-left text-2xl font-semibold text-black">
              곧 마감되는 스터디
            </h3>
            <Link
              href="/external-studies"
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
          <div className="mx-auto flex max-w-screen-xl items-center justify-center">
            <Loadingbar />
          </div>
        ) : (
          externalStudyData && (
            <div className="flex w-full max-w-screen-xl items-center gap-[20px]">
              <ExternalStudyItem
                slideData={externalStudyData.content}
                useSlider={true}
              />
            </div>
          )
        )}
      </article>
    </>
  );
}
