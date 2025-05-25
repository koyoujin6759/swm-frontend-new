'use client'

import FilterText from '@/components/ui/FilterText';
import { StudyFilterProps } from '@/types/filters/study-filter';

export default function TagFilter({type,onChange,defaultValue,options,isOpen,onToggle}:StudyFilterProps) {
    return <div>
        <FilterText type={type as "button"} title='원하는 태그를 골라주세요.' onChange={onChange} defaultValue={defaultValue} options={options} isOpen={isOpen} onToggle={onToggle}/>
    </div>
}