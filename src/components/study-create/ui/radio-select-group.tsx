'use client';

import { Controller, useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';

export default function RadioSelectGroup({
  label,
  subLabel,
  name,
  options,
  onOptionChange,
  value,  
}: {
  label: string;
  subLabel: string;
  name: string;
  options: { id: number; value: string; name: string }[];
  onOptionChange: (value: string) => void;
  value: string;
}) {
  const { control } = useFormContext();

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <h3 className="font-semibold">
          {label}{' '}
          <span className="ml-[12px] text-[12px] font-medium text-[#bbbbbb]">
            {subLabel}
          </span>
        </h3>
      )}
      <div className="flex flex-col gap-2">
        <Controller
          name={name}
          control={control}
          defaultValue={value}
          render={({ field }) => {
            return (
              <div className="flex flex-wrap justify-start gap-2">
                {options.map((item) => (
                  <div key={item.id} className="relative">
                    <Input
                      type="radio"
                      checked={field.value === item.value} 
                      id={item.value}
                      onChange={() => {
                        field.onChange(item.value);
                        onOptionChange(item.value);
                      }}
                      className="peer absolute h-0 w-0 opacity-0"
                    />
                    <label
                      htmlFor={item.value}
                      className="border-box flex min-w-[60px] cursor-pointer items-center justify-center rounded-[8px] border border-[#E0E0E0] p-[16px] text-[16px] font-medium text-[#bbbbbb] hover:bg-gray-50 peer-checked:border-black peer-checked:bg-black peer-checked:text-white"
                    >
                      {item.name}
                    </label>
                  </div>
                ))}
              </div>
            );
          }}
        />
      </div>
    </div>
  );
}
