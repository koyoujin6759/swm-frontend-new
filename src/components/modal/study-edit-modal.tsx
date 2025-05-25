export default function StudyEditModal({
  title,
  handleCloseModal,
  defaultValue, 
  options,
  onClickOption,
  handleConfirm,
}: {
  title: string;
  handleCloseModal: () => void;
  defaultValue: string; 
  options: { value: string; label: string }[];
  onClickOption: (value: string) => void;
  handleConfirm: () => void;
}) {
  // console.log('options', options);
  // console.log('defaultValue', defaultValue);
    return (
        <>
          <div className="fixed inset-0 left-1/2 top-1/2 z-20 flex max-h-[400px] min-h-[290px] w-[440px] -translate-x-1/2 -translate-y-1/2 flex-col gap-[10px] overflow-hidden rounded-[8px] bg-white px-[30px] py-[40px]">
            <div className="flex h-full flex-col items-center justify-center gap-[24px]">
              <h2 className="text-[14px] font-semibold text-[#565656]">
                {title}
              </h2>
              <div className="w-full flex-1 overflow-y-auto">
                <ul className="flex flex-col gap-[4px]">
                  {options?.map((option) => (
                    <li
                      key={option.value}
                      className="relative flex flex-row-reverse items-center justify-between overflow-hidden rounded-[4px] px-[16px] py-[10px] hover:bg-[#f2f2f2]"
                    >
                      <input
                        type="radio"
                        name="position"
                        value={option.value}
                        className="peer absolute left-0 top-0 h-full w-full cursor-pointer opacity-0"
                        onChange={() => onClickOption(option.value)}
                        checked={defaultValue === option.value}
                      />
                      <i
                        className={`peer:checked:border-link-default peer:checked:bg-link-default peer:checked:bg-[url(/icons/icon_select_check.svg)] block h-[20px] w-[20px] shrink-0 rounded-full border bg-white bg-center bg-no-repeat ${
                          defaultValue === option.value
                            ? 'border-link-default bg-link-default bg-[url(/icons/icon_select_check.svg)] peer-checked:border-link-default peer-checked:bg-link-default peer-checked:bg-[url(/icons/icon_select_check.svg)]'
                            : 'border-[#c8c8c8]'
                        }`}
                      ></i>
                      <label className="cursor-pointer text-[14px] font-semibold text-[#565656] peer-checked:before:absolute peer-checked:before:left-0 peer-checked:before:top-0 peer-checked:before:z-[-1] peer-checked:before:h-full peer-checked:before:w-full peer-checked:before:rounded-[4px] peer-checked:before:bg-[#f2f2f2] peer-checked:before:content-['']">
                        {option.label}
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex w-full items-center justify-center gap-[10px]">
                <button
                  type="button"
                  className="h-[40px] w-[120px] flex-shrink-0 rounded-[4px] bg-[#E7F3FF] text-[14px] font-semibold text-link-default"
                  onClick={handleCloseModal}
                >
                  닫기
                </button>
                <button
                  type="button"
                  className="h-[40px] flex-1 rounded-[4px] bg-link-default text-[14px] font-semibold text-white"
                  onClick={handleConfirm}
                >
                  변경
                </button>
              </div>
            </div>
          </div>
          <div
            className="fixed inset-0 z-10 bg-black/50"
            onClick={handleCloseModal}
          />
        </>
      );
}
