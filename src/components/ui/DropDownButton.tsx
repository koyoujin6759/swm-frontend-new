'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

interface DropDownButtonProps {
  options: Array<{ id: number; value: string; label: string }>;
  defaultValue: string | string[];
  onClickOption: (value: string[]) => void;
  title?: string;
  onToggle?: () => void;
  onChange?: (value: string[]) => void;
  position?: {
    left?: string;
    right?: string;
  };
}
interface Option {
  id: number;
  value: string;
  label: string;
}
export default function DropDownButton({
  options,
  defaultValue,
  onClickOption,
  title,
  onToggle,
  onChange,
  position = { left: 'left-0', right: 'right-0' },
}: DropDownButtonProps) {
  const [checkOption, setCheckOption] = useState<Option[]>([]);
  // const defaultOption = options.filter(option =>
  //     Array.isArray(defaultValue)
  //         ? defaultValue.includes(option.value)
  //         : option.value === defaultValue
  // );

  useEffect(() => {
    const currentOptions = options.filter((option) =>
      Array.isArray(defaultValue)
        ? defaultValue.includes(option.value)
        : option.value === defaultValue,
    );
    // console.log('Filtered currentOptions:', currentOptions);

    setCheckOption(currentOptions);
  }, [defaultValue, options]);

  const selectOption = (option: Option) => {
    if (!checkOption.some((item) => item.id === option.id)) {
      const newCheckOption = [...checkOption, option];
      setCheckOption(newCheckOption);
      onChange?.(newCheckOption.map((o) => o.value));
    } else {
      const updatedOptions = checkOption.filter(
        (item) => item.id !== option.id,
      );
      setCheckOption(updatedOptions);
      onChange?.(updatedOptions.map((o) => o.value));
    }
  };

  const removeOption = (option: Option) => {
    const updatedOptions = checkOption.filter((item) => item.id !== option.id);
    setCheckOption(updatedOptions);
    onChange?.(updatedOptions.map((o) => o.value));
  };

  const handleReset = () => {
    setCheckOption([]);

    // onChange?.([]);
  };

  const onClickApply = () => {
    const selectedValues =
      checkOption.length === 0
        ? ['ALL']
        : checkOption.map((option) => option.value);
    onClickOption(selectedValues);
    onChange?.(selectedValues);
    onToggle?.();
  };

  return (
    <>
      <div
        className={`dropdown-button-content absolute z-20 ${position.left} ${position.right} mt-[10px] h-auto w-fit rounded-[8px] border border-link-default bg-white px-[30px] py-[40px]`}
      >
        <h3 className="mb-[24px] text-center text-sm font-semibold text-gray-default">
          {title}
        </h3>
        <ul role="listbox" className="flex w-[380px] flex-wrap gap-[10px]">
          {options.map((option: Option) => (
            <li
              className="relative flex h-[40px] w-[120px] items-center justify-center overflow-hidden rounded-[4px] border border-[#c8c8c8]"
              key={option.id}
            >
              <input
                className="peer absolute left-0 top-0 h-full w-full cursor-pointer opacity-0"
                type="checkbox"
                id={option.value}
                name="select-option"
                value={option.value}
                onChange={() => selectOption(option)}
                checked={checkOption.some((item) => item.id === option.id)}
              />
              <label
                htmlFor={option.value}
                className="flex h-full w-full cursor-pointer items-center justify-center text-center text-xs font-[500] text-[#c8c8c8] peer-checked:border-black peer-checked:bg-black peer-checked:text-white"
              >
                {' '}
                {option.label}
              </label>
            </li>
          ))}
        </ul>
        <ul className="my-[24px] flex w-[380px] flex-wrap gap-2">
          {checkOption.map((option) => (
            <li
              className="flex h-[28px] items-center justify-center gap-1 rounded-[4px] bg-[#eee] px-[7px] text-xs font-[500] text-[#a5a5a5]"
              key={option.id}
            >
              {option.label}
              <button>
                {' '}
                <Image
                  src="/icons/icon_delete.svg"
                  alt="삭제"
                  width={18}
                  height={18}
                  className="cursor-pointer"
                  onClick={() => removeOption(option)}
                  aria-label={`${option.label} 삭제`}
                />
              </button>
            </li>
          ))}
        </ul>
        <div className="flex justify-end gap-[10px]">
          <button
            onClick={handleReset}
            className="h-[40px] w-[120px] shrink-0 rounded-[4px] bg-[#E7F3FF] text-sm font-semibold text-link-default"
          >
            초기화
          </button>
          <button
            onClick={onClickApply}
            className="h-[40px] w-full rounded-[4px] bg-link-default text-sm font-semibold text-white"
          >
            적용
          </button>
        </div>
      </div>
    </>
  );
}
