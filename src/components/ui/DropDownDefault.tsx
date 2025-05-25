interface DropDownDefaultProps {
  options: Array<{ id: number; value: string; label: string }>;
  defaultValue: string | string[];
  onClickOption: (value: string) => void;
  onToggle: () => void;
  filterType?: string;
  className?: string;
}

export default function DropDownDefault({
  options,
  defaultValue,
  onClickOption,
  filterType,
  className,
}: DropDownDefaultProps) {
  return (
    <>
      <ul
        className={`absolute left-0 top-full z-20 mt-[10px] h-auto w-full rounded-[8px] border bg-white p-1 ${filterType === 'text' ? 'border-[#e0e0e0]' : 'border-link-default'}`}
        role="listbox"
      >
        {options.map((option) => (
          <li
            className={`${filterType === 'text' ? 'px-[16px] py-[6px] text-xs font-semibold text-[#c8c8c8] hover:text-link-default' : 'font-regular hover:text-semibold px-[13px] py-[16px] '} relative my-[2px] flex flex-row-reverse items-center justify-between gap-2 hover:cursor-pointer hover:rounded-[4px] hover:bg-[#f2f2f2] ${className ? className : 'text-[16px] text-gray-default'}`}
            key={option.id}
          >
            <input
              type="radio"
              id={option.value}
              name="select-option"
              value={option.value}
              className="peer absolute left-0 top-0 h-full w-full cursor-pointer opacity-0"
              onChange={() => onClickOption(option.value)}
              checked={defaultValue === option.value}
            />
            {filterType !== 'text' ? (
              <i
                className={`block h-[20px] w-[20px] shrink-0 rounded-full border bg-white bg-center bg-no-repeat ${
                  defaultValue === option.value
                    ? 'border-link-default bg-link-default bg-[url("/icons/icon_select_check.svg")] peer-checked:border-link-default peer-checked:bg-link-default peer-checked:bg-[url("/icons/icon_select_check.svg")]'
                    : 'border-[#c8c8c8]'
                }`}
              ></i>
            ) : null}
            <label
              htmlFor={option.value}
              className="block w-full cursor-pointer"
            >
              {option.label}
            </label>
          </li>
        ))}
      </ul>
    </>
  );
}
