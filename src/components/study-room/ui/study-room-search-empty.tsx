import { CircleAlert } from 'lucide-react';

export default function StudyRoomSearchEmpty() {
  return (
    <div className="align-center flex flex-col justify-center">
      <div className="w-[480px] bg-[#F9F9F9] py-[40px]">
        <div className="flex flex-col items-center gap-[36px]">
          <CircleAlert
            strokeWidth={1}
            className="h-[65px] w-[65px] text-[#4998E9]"
          />
          <div className="flex flex-col items-center gap-[12px]">
            <h3 className="text-[20px] font-[600] text-black">
              스터디 룸을 찾지 못했습니다.
            </h3>
            <p className="text-[14px] font-[400] text-[#565656]">
              검색 필터를 다시 설정해 주세요.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
