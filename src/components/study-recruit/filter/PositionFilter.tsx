'use client';

import { StudyFilterProps } from '@/types/filters/study-filter';
import FilterSelect from '@/components/ui/FilterSelect';

export default function PositionFilter({
  type,
  onChange,
  defaultValue,
  options,
  isOpen,
  onToggle,
}: StudyFilterProps) {
  // console.log('PositionFilter defaultValue before processing:', defaultValue);

  const handlePositionChange = (value: string | string[]) => {
    if (Array.isArray(value) && (value.length === 0 || value.includes('ALL'))) {
      onChange(['ALL']);
      return;
    }

    onChange(value);
  };

  const displayOptions = options.filter((option) => option.value !== 'ALL');

  const getDisplayValue = () => {
    // console.log('getDisplayValue input:', defaultValue);

    if (defaultValue === 'ALL') {
      const allOption = options.find((option) => option.value === 'ALL');
      return allOption?.label || '직무 전체';
    }
    return defaultValue;
  };

  const displayValue = getDisplayValue();
  // console.log('최종 displayValue:', displayValue);

  return (
    <>
      <div className="h-[50px] w-[220px]">
        <FilterSelect
          type={type as 'button'}
          onChange={handlePositionChange}
          defaultValue={displayValue}
          options={displayOptions}
          isOpen={isOpen}
          onToggle={onToggle}
          title="원하는 직무를 골라주세요."
        />
      </div>
    </>
  );
}
