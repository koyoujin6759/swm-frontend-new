'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { NavigationOptions } from 'swiper/types';
import { StudyRoom } from '@/types/api/study-rooms';

export interface SlideItemProps {
  slideData: StudyRoom[];
  useSlider?: boolean;
}

export default function StudyroomItem({
  slideData,
  useSlider = false,
}: SlideItemProps) {
  // console.log('slideData type ff:', typeof slideData, 'value:', slideData);

  const [pageLoaded, setPageLoaded] = useState(false);

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
  }, [slideData, pageLoaded]);

  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  if (!slideData) {
    return (
      <div className="mx-auto flex h-screen max-w-screen-xl items-center justify-center">
        데이터가 없습니다.
      </div>
    );
  }

  interface ItemContentProps {
    item: StudyRoom;
  }

  const ItemContent = ({ item }: ItemContentProps) => {
    const handleCopy = (phoneNumber: string) => {
      navigator.clipboard
        .writeText(phoneNumber)
        .then(() => {
          alert('복사되었습니다.');
        })
        .catch(() => {
          alert('복사에 실패했습니다.');
        });
    };
    return (
      <>
        <div>
          <div className="relative aspect-[4/1.55] w-full overflow-hidden rounded-[8px]">
            <Link href={`/studyroom/${item.studyRoomId}`}>
              {item.thumbnail ? (
                // <Image src={item.thumbnail} alt={item.title} fill className="object-cover" />
                <Image
                  src={'/no-image.png'}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <Image
                  src={'/no-image.png'}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              )}
            </Link>
          </div>
          <div className="pt-[25px]">
            <div className="flex items-center justify-between gap-1">
              <Link
                href={`/studyroom/${item.studyRoomId}`}
                className="text-[20px] font-bold text-black"
              >
                {item.title}
              </Link>
              <div className="flex items-center gap-[10px]">
                <button className="rounded-[4px] border border-link-default px-[10px] py-[6px] text-[12px] font-semibold text-link-default">
                  홈페이지
                </button>
                <button className="rounded-[4px] border border-link-default px-[10px] py-[6px] text-[12px] font-semibold text-link-default">
                  지도에서 보기
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-[6px] pt-[16px]">
              <p className="font-regular flex items-center gap-[4px] text-[14px] text-black">
                <Image
                  src={'/icons/icon_pin.svg'}
                  alt="location"
                  width={20}
                  height={20}
                />
                {item.locality}
              </p>
              <p className="font-regular flex items-center gap-[4px] text-[14px] text-black">
                <Image
                  src={'/icons/icon_call.svg'}
                  alt="call"
                  width={20}
                  height={20}
                />
                {item.phoneNumber}
                <button onClick={() => handleCopy(item.phoneNumber)}>
                  <Image
                    src={'/icons/icon_blue_18_copy.svg'}
                    alt="복사하기"
                    width={20}
                    height={20}
                  />
                </button>
              </p>
            </div>
            <div className="pt-[16px]">
              <p className="font-regular text-[12px] text-[#828282]">
                종로3가 5번출구로 나오셔서 낙원동 98-1로 찾아오시면됩니다. 약
                70m
              </p>
            </div>
          </div>
        </div>
      </>
    );
  };

  if (useSlider) {
    return (
      <div className="swiper-container overflow-hidden">
        {pageLoaded && (
          <Swiper
            className="my-swiper"
            modules={[Navigation]}
            loop={true}
            spaceBetween={20}
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
            slidesPerView="auto"
            breakpoints={{
              320: {
                slidesPerView: 1,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 20,
              },
            }}
          >
            {slideData.map((item, index) => (
              <SwiperSlide key={`slide-${index}`}>
                <ItemContent item={item} />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
        <div className="swiper-navigation absolute right-0 top-4 !gap-[10px] !h-[24px]">
          <button
            ref={prevRef}
            className="swiper-button-prev !h-[24px] !w-[24px] !mt-[0]"
          ></button>
          <button
            ref={nextRef}
            className="swiper-button-next !h-[24px] !w-[24px] !mt-[0]"
          ></button>
        </div>
      </div>
    );
  } else {
    return (
      <div className="grid w-full max-w-screen-xl grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {slideData.map((item, index) => (
          <div key={`item-${index}`}>
            <ItemContent item={item} />
          </div>
        ))}
      </div>
    );
  }
}
