import { FormProvider, useForm } from 'react-hook-form';
import { CreateStudyRoomReq } from '@/types/api';
import { InputField } from '@/components/InputField';

export interface StudyRoomCreateProps {
  mutate: (data: CreateStudyRoomReq) => void;
  isPending: boolean;
}

export const StudyRoomCreate = (
  {
    // mutate,
    // isPending,
  }: StudyRoomCreateProps,
) => {
  const methods = useForm();

  return (
    <FormProvider {...methods}>
      <form onSubmit={() => {}}>
        <div className="flex flex-col gap-[30px]">
          <div className="flex w-full gap-[40px]">
            <div className="flex-grow">
              <InputField
                className="text-[20px]"
                name="title"
                label="제목"
                type="text"
                placeholder="제목을 입력해 주세요."
              />
            </div>
            <div className="flex-grow">
              <InputField
                className="text-[20px]"
                name="subtitle"
                label="서브 제목"
                type="text"
                placeholder="서브 제목을 입력해 주세요."
              />
            </div>
          </div>
          <InputField
            className="text-[20px]"
            name="introduce"
            label="공간 소개"
            type="text"
            placeholder="스터디 룸에 대해 소개해 주세요."
          />
          {/* NOTE: 시설안내 영역 논의 후 작업 */}
          {/* NOTE: 태그 추가 영역 논의 후 작업 */}
          <div className="flex flex-col gap-[12px]">
            <div className="flex items-center gap-[12px]">
              <h3 className="font-semibold">태그 추가</h3>
              <span className="text-[12px] text-[#bbb]">
                컴마(,)로 구분해 주세요. (ex. #태그1,#태그2,#태그3,...)
              </span>
            </div>
            <div className="box-border min-h-[60px] rounded-lg border border-[#e0e0e0] px-[16px] py-[13px]">
              <div className="flex flex-wrap gap-1">
                {/* {tagList.map((tag, index) => (
                  <span
                    key={index}
                    className="flex items-center rounded-[4px] bg-[#eee] px-2 py-1 text-[16px] font-medium text-[#a5a5a5]"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => {}}
                      className="ml-2 text-gray-500 hover:text-gray-700"
                    >
                      <Image
                        src="/icons/Clear-gray.svg"
                        alt="태그삭제"
                        width={18}
                        height={18}
                      />
                    </button>
                  </span>
                ))} */}
                <input
                  type="text"
                  // value={inputValue}
                  // onChange={handleInputChange}
                  // onKeyDown={handleKeyDown}
                  placeholder={
                    // tagList.length === 0
                    true ? '#태그를 입력해 주세요. (최대 10개)' : ''
                  }
                  className="min-w-[100px] flex-grow border-none text-[16px] leading-[34px] outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </FormProvider>
  );
};
