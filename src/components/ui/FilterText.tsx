'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import DropDownDefault from './DropDownDefault';
import DropDownButton from './DropDownButton';

interface Option {
  id: number;
  value: string;
  label: string;
}

interface FilterTextProps {
  onChange: (value: string | string[]) => void;
  defaultValue: string | string[];
  options: Option[]; 
  isOpen: boolean;  
  onToggle: () => void;  
  type?: 'default' | 'button';
  title?: string;
  closeOnSelect?: boolean;
  filterName?: string; 
}

export default function FilterText({ options, defaultValue, onChange, onToggle,isOpen,type='default',title='default',closeOnSelect=true,filterName='default' }: FilterTextProps) { 

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target.tagName.toLowerCase() === 'button' || 
          target.closest('button') ||
          target.closest('.dropdown-button-content')) {
        return;
      }
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        if (isOpen) {
          onToggle();
        }
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isOpen, onToggle]); 

  const onClickOption = (value: string | string[]) => {
      if(type === 'button') { //버튼타입 드롭다운 
        onChange?.(value as string[]); 
      } else { //기본타입 드롭다운
        onChange?.(value as string);  
        if (closeOnSelect) {   
            onToggle();
        }
      }
  } 
  const containerRef = useRef<HTMLDivElement>(null);

  return (
      <div className='relative' ref={containerRef}>
          <button className={'min-w-[95px] max-w-[130px] flex gap-1 px-[8px] items-center h-[30px] text-[12px] font-semibold text-link-default'} onClick={(e) => {
              e.stopPropagation();
              onToggle();
            }}>
            <Image 
              src={(() => {
                switch(filterName) {
                  case '최신순':
                    return "/icons/icon_select_sort.svg"; 
                  case '태그':
                    return "/icons/icon_select_tag.svg"; 
                  default:
                    return "/icons/icon_select_sort.svg";
                }
              })()} 
              alt="" 
              width={18} 
              height={18}
            />
            <span className='overflow-hidden text-ellipsis whitespace-nowrap '> 
            {defaultValue && defaultValue !== '' 
            ? options.find(option => option.value === defaultValue)?.label 
            : '정렬 기준'}
            </span>
          </button> 
          {isOpen && renderDropDown()}
      </div>
  )

  function renderDropDown() {
      switch(type) {
          case 'default':
              return <DropDownDefault options={options} defaultValue={defaultValue as string} onClickOption={onClickOption} onToggle={onToggle} filterType='text' />
          case 'button':
              return <DropDownButton options={options} defaultValue={defaultValue as string[]} onClickOption={onClickOption} title={title} onToggle={onToggle} position={{left: 'left-auto',right: 'right-0'}}/> 
          default:
              return null;
      }
  }
}