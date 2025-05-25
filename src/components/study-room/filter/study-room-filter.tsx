import { useState } from 'react';
import { AlignRight, Filter, Minus, Plus } from 'lucide-react';
import { SortCriteria, StudyRoomListParams } from '@/types/api';
import { StudyRoomOption } from '@/types/api/study-room';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  LocalitySelect,
  LocalitySelectContent,
  LocalitySelectItem,
  LocalitySelectTrigger,
  LocalitySelectValue,
} from '@/components/ui/locality-select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { RangeSlider } from '@/components/ui/range-slider';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const REGIONS = [
  { label: '지역 전체', value: 'ALL' },
  { label: '강남구', value: '강남구' },
  { label: '강동구', value: '강동구' },
  { label: '강북구', value: '강북구' },
  { label: '관악구', value: '관악구' },
  { label: '광진구', value: '광진구' },
  { label: '구로구', value: '구로구' },
  { label: '금천구', value: '금천구' },
  { label: '노원구', value: '노원구' },
  { label: '도봉구', value: '도봉구' },
  { label: '동대문구', value: '동대문구' },
  { label: '동작구', value: '동작구' },
  { label: '마포구', value: '마포구' },
  { label: '서대문구', value: '서대문구' },
  { label: '서초구', value: '서초구' },
  { label: '성동구', value: '성동구' },
  { label: '성북구', value: '성북구' },
  { label: '송파구', value: '송파구' },
  { label: '양천구', value: '양천구' },
  { label: '영등포구', value: '영등포구' },
  { label: '용산구', value: '용산구' },
  { label: '은평구', value: '은평구' },
  { label: '종로구', value: '종로구' },
  { label: '중구', value: '중구' },
  { label: '중랑구', value: '중랑구' },
] as const;

const AMENITIES: { value: StudyRoomOption; label: string }[] = [
  { value: 'TV_BEAM_PROJECT', label: 'TV/프로젝터' },
  { value: 'WIFI', label: '인터넷/WIFI' },
  { value: 'PRINTING', label: '복사/인쇄기' },
  { value: 'WHITEBOARD', label: '화이트보드' },
  { value: 'MIKE', label: '음향/마이크' },
  { value: 'INTERNAL_TOILET', label: '취사시설' },
  { value: 'FOODS', label: '음식물반입가능' },
  { value: 'ALCOHOL', label: '주류반입가능' },
  { value: 'INTERNAL_TOILET', label: '샤워시설' },
  { value: 'PARKING', label: '주차' },
  { value: 'NO_SMOKE', label: '금연' },
  { value: 'FULL_MIRROR', label: '반려동물동반가능' },
  { value: 'PC_NOTEBOOK', label: 'PC/노트북' },
  { value: 'ELECTRICAL', label: '의자/테이블' },
  { value: 'SCREEN', label: '콘센트' },
  { value: 'WATER', label: '24시 운영' },
  { value: 'MART', label: '연중무휴' },
  { value: 'CHAIR_DESK', label: '카페/식당' },
];

export interface StudyRoomFilterProps {
  filters: Partial<StudyRoomListParams>;
  onFilterChange: (filters: Partial<StudyRoomListParams>) => void;
}

export const StudyRoomFilter = ({
  filters,
  onFilterChange,
}: StudyRoomFilterProps) => {
  const [tempOptions, setTempOptions] = useState<StudyRoomOption[]>(
    filters.options || [],
  );
  const [open, setOpen] = useState(false);
  const [tempPriceRange, setTempPriceRange] = useState<[number, number]>([
    0, 300000,
  ]);
  const [tempHeadCount, setTempHeadCount] = useState<number>(0);
  const [isPriceOpen, setIsPriceOpen] = useState(false);
  const [isHeadCountOpen, setIsHeadCountOpen] = useState(false);

  const handlePriceInit = () => {
    setTempPriceRange([0, 300000]);
    onFilterChange({
      minPricePerHour: undefined,
      maxPricePerHour: undefined,
    });
    setIsPriceOpen(false);
  };

  const handlePriceChange = (value: [number, number]) => {
    setTempPriceRange(value);
  };

  const handlePriceApply = () => {
    onFilterChange({
      minPricePerHour: tempPriceRange[0],
      maxPricePerHour: tempPriceRange[1],
    });
    setIsPriceOpen(false);
  };

  const handleHeadCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (Number(e.target.value) > 50 || Number(e.target.value) < 0) {
      return;
    }
    setTempHeadCount(Number(e.target.value));
  };

  const handleHeadCountMinus = () => {
    if (tempHeadCount > 0) {
      setTempHeadCount(tempHeadCount - 1);
    }
  };

  const handleHeadCountPlus = () => {
    if (tempHeadCount < 50) {
      setTempHeadCount(tempHeadCount + 1);
    }
  };

  const handleHeadCountInit = () => {
    setTempHeadCount(0);
    onFilterChange({ headCount: undefined });
    setIsHeadCountOpen(false);
  };

  const handleHeadCountApply = () => {
    onFilterChange({ headCount: tempHeadCount });
    setIsHeadCountOpen(false);
  };

  const handleOptionsInit = () => {
    setTempOptions([]);
    onFilterChange({ options: [] });
    setOpen(false);
  };

  const handleOptionsApply = () => {
    onFilterChange({ options: tempOptions });
    setOpen(false);
  };

  return (
    <div className="flex justify-between">
      <div className="flex gap-[20px]">
        <LocalitySelect
          value={filters.locality || 'ALL'}
          onValueChange={(value) =>
            onFilterChange({ locality: value === 'ALL' ? '' : value })
          }
        >
          <LocalitySelectTrigger className="h-[50px] w-[220px] bg-white">
            <LocalitySelectValue placeholder="지역" />
          </LocalitySelectTrigger>
          <LocalitySelectContent className="w-[220px] bg-white">
            <ScrollArea className="h-[472px]">
              {REGIONS.map((region) => (
                <LocalitySelectItem
                  key={region.label + Math.random()}
                  value={region.value}
                >
                  {region.label}
                </LocalitySelectItem>
              ))}
            </ScrollArea>
          </LocalitySelectContent>
        </LocalitySelect>

        <Select value="" open={isPriceOpen} onOpenChange={setIsPriceOpen}>
          <SelectTrigger className="h-[50px] w-[220px] bg-white">
            <SelectValue
              defaultValue={''}
              placeholder={
                filters.minPricePerHour === undefined &&
                filters.maxPricePerHour === undefined
                  ? '가격'
                  : `${filters.minPricePerHour?.toLocaleString()}원 ~ ${filters.maxPricePerHour?.toLocaleString()}원`
              }
              className="text-[#565656]"
            />
          </SelectTrigger>
          <SelectContent className="h-[238px] w-[340px] rounded-[8px] bg-white">
            <div className="flex h-full flex-col items-center justify-center space-y-7 px-[30px] py-[40px]">
              <div className="text-center">
                <h3 className="mb-2 text-[14px] font-[600] text-[#565656]">
                  가격을 설정해 주세요.
                </h3>
                <p className="text-[20px] font-[600] text-[#565656]">
                  {tempPriceRange[0].toLocaleString()}원 ~{' '}
                  {tempPriceRange[1].toLocaleString()}원
                </p>
              </div>

              <RangeSlider
                defaultValue={[0, 300000]}
                min={0}
                max={300000}
                step={1000}
                value={tempPriceRange}
                onValueChange={handlePriceChange}
                className="[&_[role=slider]]:border-[#E0E0E0]"
                minStepsBetweenThumbs={1}
              />

              <div className="flex w-full gap-2">
                <Button
                  variant="outline"
                  className="w-[80px] flex-shrink-0 border-0 bg-[#E7F3FF] font-[600] text-[#4998E9] hover:bg-[#E7F3FF]/90"
                  onClick={handlePriceInit}
                >
                  초기화
                </Button>
                <Button
                  className="flex-grow-1 w-full bg-[#4998E9] font-[600] text-white hover:bg-[#4998E9]/90"
                  onClick={handlePriceApply}
                >
                  적용
                </Button>
              </div>
            </div>
          </SelectContent>
        </Select>

        <Select
          value=""
          open={isHeadCountOpen}
          onOpenChange={setIsHeadCountOpen}
        >
          <SelectTrigger className="h-[50px] w-[220px] bg-white">
            <SelectValue
              defaultValue=""
              placeholder={
                filters.headCount === undefined
                  ? '인원'
                  : `${filters.headCount}명`
              }
              className="text-[#565656]"
            />
          </SelectTrigger>
          <SelectContent className="h-[238px] w-[340px] rounded-[8px] bg-white">
            <div className="flex h-full flex-col items-center justify-center space-y-7 px-[30px] py-[40px]">
              <div className="text-center">
                <h3 className="mb-2 text-[14px] font-[600] text-[#565656]">
                  인원을 설정해 주세요.
                </h3>
              </div>
              <div className="flex w-[258px] items-center rounded-[8px] border border-[#E0E0E0]">
                <Button
                  variant="ghost"
                  className="h-[50px] w-[50px] disabled:bg-[#ffffff] disabled:opacity-30"
                  onClick={handleHeadCountMinus}
                  disabled={tempHeadCount === 0}
                >
                  <Minus />
                </Button>
                <Input
                  value={tempHeadCount}
                  onChange={handleHeadCountChange}
                  min={1}
                  max={50}
                  type="number"
                  className="rounded-none border-b-0 border-t-0 text-center text-[20px] font-[600] text-[#565656] focus:border-transparent focus:outline-none focus:ring-0 focus-visible:border-[#E0E0E0] focus-visible:outline-none focus-visible:ring-0 active:border-transparent active:outline-none active:ring-0"
                />
                <Button
                  variant="ghost"
                  className="h-[50px] w-[50px] disabled:bg-white disabled:opacity-50"
                  onClick={handleHeadCountPlus}
                  disabled={tempHeadCount === 50}
                >
                  <Plus />
                </Button>
              </div>

              <div className="flex w-full gap-2">
                <Button
                  variant="outline"
                  className="w-[80px] flex-shrink-0 border-0 bg-[#E7F3FF] font-[600] text-[#4998E9] hover:bg-[#E7F3FF]/90"
                  onClick={handleHeadCountInit}
                >
                  초기화
                </Button>
                <Button
                  className="flex-grow-1 w-full bg-[#4998E9] font-[600] text-white hover:bg-[#4998E9]/90"
                  onClick={handleHeadCountApply}
                >
                  적용
                </Button>
              </div>
            </div>
          </SelectContent>
        </Select>
      </div>
      <div className="flex gap-1">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              className="text-[12px] font-[600] text-[#4998E9]"
            >
              <Filter className="h-[18px] w-[18px]" fill="#4998E9" />
              필터
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[440px] border border-[#4998E9] bg-white px-[30px] py-[40px] shadow-none">
            <div className="space-y-6">
              <h3 className="text-center text-[14px] font-[600] text-[#565656]">
                원하는 옵션을 골라주세요.
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {AMENITIES.map((amenity) => (
                  <button
                    key={amenity.value}
                    className="h-[40px] w-[120px] rounded-[4px] border border-[#C8C8C8] px-4 text-[12px] font-[500] text-[#C8C8C8] hover:border-[#000000] hover:text-[#000000] data-[selected=true]:border-[#000000] data-[selected=true]:bg-[#000000] data-[selected=true]:text-[#FFFFFF]"
                    data-selected={tempOptions.includes(amenity.value)}
                    onClick={() => {
                      setTempOptions((prev) =>
                        prev.includes(amenity.value)
                          ? prev.filter((a) => a !== amenity.value)
                          : [...prev, amenity.value],
                      );
                    }}
                  >
                    {amenity.label}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="w-[80px] flex-shrink-0 border-0 bg-[#E7F3FF] font-[600] text-[#4998E9] hover:bg-[#E7F3FF]/90"
                  onClick={handleOptionsInit}
                >
                  초기화
                </Button>
                <Button
                  className="flex-grow-1 w-full bg-[#4998E9] font-[600] text-white hover:bg-[#4998E9]/90"
                  onClick={handleOptionsApply}
                >
                  적용
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
        <Select
          value={filters.sortCriteria || ''}
          onValueChange={(value) =>
            onFilterChange({ sortCriteria: value as SortCriteria })
          }
        >
          <SelectTrigger
            hideChevron
            className="flex items-center gap-2 border-0 bg-white text-[12px] font-[600] text-[#4998E9] focus:ring-0 focus-visible:ring-0"
          >
            <AlignRight className="h-[18px] w-[18px]" />
            <SelectValue defaultValue="" placeholder="평점순" />
          </SelectTrigger>
          <SelectContent className="w-[95px] bg-white">
            <SelectGroup>
              <SelectItem
                hideCheck
                value={SortCriteria.STAR}
                className="h-[35px] pl-[16px] font-[600] hover:bg-transparent data-[state=checked]:bg-[#F2F2F2] data-[state=checked]:text-[#4998E9] data-[state=unchecked]:text-[#C8C8C8]"
              >
                평점순
              </SelectItem>
              <SelectItem
                hideCheck
                value={SortCriteria.LIKE}
                className="h-[35px] pl-[16px] font-[600] hover:bg-transparent data-[state=checked]:bg-[#F2F2F2] data-[state=checked]:text-[#4998E9] data-[state=unchecked]:text-[#C8C8C8]"
              >
                좋아요순
              </SelectItem>
              <SelectItem
                hideCheck
                value={SortCriteria.REVIEW}
                className="h-[35px] pl-[16px] font-[600] hover:bg-transparent data-[state=checked]:bg-[#F2F2F2] data-[state=checked]:text-[#4998E9] data-[state=unchecked]:text-[#C8C8C8]"
              >
                후기순
              </SelectItem>
              <SelectItem
                hideCheck
                value={SortCriteria.PRICE_ASC}
                className="h-[35px] pl-[16px] font-[600] hover:bg-transparent data-[state=checked]:bg-[#F2F2F2] data-[state=checked]:text-[#4998E9] data-[state=unchecked]:text-[#C8C8C8]"
              >
                가격 오름차순
              </SelectItem>
              <SelectItem
                hideCheck
                value={SortCriteria.PRICE_DESC}
                className="h-[35px] pl-[16px] font-[600] hover:bg-transparent data-[state=checked]:bg-[#F2F2F2] data-[state=checked]:text-[#4998E9] data-[state=unchecked]:text-[#C8C8C8]"
              >
                가격 내림차순
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
