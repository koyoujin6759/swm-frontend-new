'use client'
 
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react'; 
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination'; 
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image'; 
import { NavigationOptions } from 'swiper/types';
import { Swiper as SwiperType } from 'swiper';
import Link from 'next/link';
import { ExternalStudy } from '@/types/api/external-study';

interface SlideItemProps {  
    slideData: ExternalStudy[];
    useSlider?: boolean;
}
 
export default function ExternalStudyItem({ slideData, useSlider=false }: SlideItemProps) {
    // console.log('slideData type:', typeof slideData, 'value:', slideData);


    const [pageLoaded, setPageLoaded] = useState(false);
  
    useEffect(() => { 
        setPageLoaded(true);
    }, []);  

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const swiperElement = document.querySelector('.swiper');
            const swiper = (swiperElement as unknown as { swiper: SwiperType })?.swiper;
            if (swiper) {
                swiper.update(); 
                swiper.navigation.update();
            }
        }
    }, [slideData, pageLoaded]);

    const prevRef = useRef<HTMLButtonElement>(null);
    const nextRef = useRef<HTMLButtonElement>(null); 

    if(!slideData) {
        return <div className='flex justify-center items-center max-w-screen-xl mx-auto h-screen'>데이터가 없습니다.</div>;
    }
 
    interface ItemContentProps {
        item: ExternalStudy;  
    }

    const ItemContent = ({item}:ItemContentProps) => {
        
        return (
            <>
                <div className='px-[24px] py-[26px] bg-[#f9f9f9] rounded-[8px]'>
                    <div className='flex items-start justify-between gap-[8px]'>
                        <div className='flex-shrink-0'>
                            <span className='bg-blue-example h-[30px] box-border rounded-[16px] px-[13px] py-[9px] text-[14px] font-bold text-white'>{String(item.deadlineDate).replace(/,/g, '.') + ' 마감'}</span>
                        </div>
                        <div className='flex items-center gap-[8px] flex-wrap justify-end'>
                            {item.roles.length > 0 && item.roles.map((role, index) => (
                                <span key={`role-${index}`} className='text-[12px] font-medium text-gray-default bg-[#e9e9e9] rounded-[4px] px-[7px] py-[5px]'>{role}</span>
                            ))}
                        </div>
                    </div>
                    <p className='mt-[16px] text-[20px] font-semibold text-black line-clamp-2 min-h-[60px]'>{item.title}</p>
                    <Link href={item.link} target='_blank' className='block mt-[43px]'>
                        <span className='flex items-center gap-[4px] text-[14px] font-bold text-blue-example'>HOLA에서 보기 <Image src='/icons/icon_blue_18_right.svg' alt='arrow-right' width={18} height={18} /></span>
                    </Link>
                </div>
            </>
        );
    }
     
    if (useSlider) {
        return (
            <div className="swiper-container overflow-hidden ">
                {pageLoaded && (
                <Swiper  
                    className="my-swiper"
                    modules={[Navigation]}
                    loop={true}  
                    spaceBetween={20}   
                    observer={true}
                    observeParents={true}
                    watchOverflow={true}
                    navigation={{
                        prevEl: prevRef.current,
                        nextEl: nextRef.current,
                        enabled: true,
                    } as NavigationOptions}
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
                            spaceBetween: 20
                        },
                        768: {
                            slidesPerView: 2,
                            spaceBetween: 20
                        },
                        1024: {
                            slidesPerView: 3,
                            spaceBetween: 20
                        }
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
                <button ref={prevRef} className="swiper-button-prev !h-[24px] !w-[24px] !mt-[0]"></button>
                <button ref={nextRef} className="swiper-button-next !h-[24px] !w-[24px] !mt-[0]"></button>
                </div>
            </div>
        ) 
    } else {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-screen-xl w-full">
                {slideData.map((item, index) => (
                    <div key={`item-${index}`}>
                        <ItemContent item={item} />
                    </div>
                ))}
            </div>
        )
    }
}