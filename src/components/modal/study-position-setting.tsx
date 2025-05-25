import { useState } from 'react'; 
import Image from 'next/image';
import { FormProvider } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import FilterSelect from '@/components/ui/FilterSelect';
    import {
        GetRecruitmentPositionResponse, 
    } from '@/types/api/study-recruit/getStudyDetail';
    import { RecruitmentPositionTitle, getPositionOptions, POSITION_LABELS } from '@/types/api/study';
    import { useMutation } from '@tanstack/react-query';
    import { editRecruitmentPosition } from '@/lib/api/study/recruitmentPosition';
    import { EditRecruitmentPositionRequest } from '@/types/api/study-recruit/recruitmentPosition';
    import { useToastStore } from '@/store/useToastStore';
    import { useRouter } from 'next/navigation';
    import { useQueryClient } from '@tanstack/react-query';

const SELECT_IDS = { 
    POSITION: 'POSITION', 
  } as const;
    

export default function StudyPositionSetting({
  handleCloseModal, 
    positionOptions,
    studyId,
}: {
  handleCloseModal: () => void; 
    positionOptions: GetRecruitmentPositionResponse[];
    studyId: string;
    }) {   
    const { showToast } = useToastStore();
    const router = useRouter();
    const queryClient = useQueryClient();

    const [positionField, setPositionField] = useState(positionOptions.map((item: GetRecruitmentPositionResponse) => ({
        id: item.recruitmentPositionId,
        title: item.title,
        displayTitle: POSITION_LABELS[item.title as RecruitmentPositionTitle],
        headcount: item.headcount,
    })));  

  const [openSelectId, setOpenSelectId] = useState<keyof typeof SELECT_IDS | null>(null);
  const [, setSelectPosition] = useState<string | string[]>('필수 선택');

    const positionList = getPositionOptions().filter((item) => item.value !== 'ALL');
    // console.log('positionList', positionList);

    //포지션 필드 추가
  const handleAddPosition = () => {
        if (positionField.length >= 10) {
            showToast({
                message: '최대 10개의 직무를 설정할 수 있습니다.',
            });
            return;
        }
        if(positionField.length === positionList.length) {
            showToast({
                message: '추가 가능한 필드수를 초과했습니다.',
            });
            return;
        }
        setPositionField([...positionField, { 
            id: positionField.map((field) => field.id).length + 1, 
            title: '필수 선택' as RecruitmentPositionTitle,
            displayTitle: '필수 선택',
            headcount: 0
        }]);
        setOpenSelectId(null);
    }; 

    // 포지션 변경 핸들러
    const handlePositionChange = (value: string | string[], fieldId: number) => {
        const koreanLabel = typeof value === 'string' 
            ? POSITION_LABELS[value as RecruitmentPositionTitle] 
            : value;
        
        setPositionField(positionField.map(field => 
            field.id === fieldId ? { 
                ...field, 
                displayTitle: koreanLabel as string,
                title: value as RecruitmentPositionTitle,
                headcount: field.headcount 
            } : field
        ));
        
        setSelectPosition(value);
        methods.setValue('positions', positionField);
        setOpenSelectId(null);
    };
    
    // 인원수 변경 핸들러
    const handleHeadcountChange = (e: React.ChangeEvent<HTMLInputElement>, fieldId: number) => {
        const value = e.target.value;
        // 숫자만 입력 가능하도록
        if (/^\d*$/.test(value)) {
        setPositionField(positionField.map(field => 
            field.id === fieldId ? { ...field, headcount: parseInt(value) || 0 } : field
        ));
        }
        methods.setValue('positions', positionField);
    }; 

    const handleRemovePosition = (title: string) => {
        setPositionField(positionField.filter((field) => field.title !== title)); 
        methods.setValue('positions', positionField); 
    }; 
    
    const { mutate:editPosition } = useMutation({
        mutationFn: (positionData: EditRecruitmentPositionRequest) => editRecruitmentPosition(studyId, positionData),
        onSuccess: async (response) => {  
            // console.log('직무 수정 response', response);
            if (response.message === 'Expired Token') {
                showToast({
                message: '로그인이 만료되었습니다. 다시 로그인해주세요.',
                });
                router.push('/login');
                return;
            } 
            //   console.log('response', response);

            showToast({
                message: '직무 설정이 완료되었습니다.',
            });

            await invalidateQueries(); 
            handleCloseModal();
        },
    }); 

    // 공통으로 사용할 쿼리 무효화 함수
     const invalidateQueries = async () => {
        await queryClient.invalidateQueries({ 
        queryKey: ['study', 'studyDetail', studyId],
        refetchType: 'active'
    });
        
    await queryClient.refetchQueries({
        queryKey: ['study', 'studyDetail', studyId],
        exact: true
        });
  };

  const methods = useForm();

  const onSubmit = methods.handleSubmit(async () => {
        try {   
            const originalPositionField = positionOptions;
            // console.log('originalPositionField', originalPositionField);
             
            const currentTitles = positionField.map(field => field.title);
            const removedPositionField = originalPositionField.filter(
                (field) => !currentTitles.includes(field.title)
            );
            
            // console.log('removedPositionField', removedPositionField);
            const positionData = {
                createRecruitmentPositionRequests: positionField
                    .filter(field => !originalPositionField.some(orig => orig.title === field.title))
                    .map(field => ({
                        title: field.title,
                        headcount: field.headcount
                    })),
                updateRecruitmentPositionRequests: positionField
                    .filter(field => originalPositionField.some(orig => orig.title === field.title))
                    .map(field => ({
                        recruitmentPositionId: field.id,
                        title: field.title,
                        headcount: field.headcount
                    })),
                recruitmentPositionIdsToRemove: removedPositionField.map((field) => field.recruitmentPositionId), 
            };  
            
            // console.log('직무 수정 positionData', positionData);
            editPosition(positionData);

    handleCloseModal();
        } catch (error) {
            console.error(error);
            throw error;
        }
    });
    
    // 사용 중인 타이틀 목록
    const usedTitles = positionField.map(field => field.title);

    // 사용 가능한(아직 선택되지 않은) 포지션 목록
    const availablePositions = getPositionOptions().filter(
        item => item.value !== 'ALL' && !usedTitles.includes(item.value as RecruitmentPositionTitle)
    );
 
  return (
    <>
      <div className='fixed inset-0 left-1/2 top-1/2 z-20 flex max-h-[400px] min-h-[500px] w-[440px] -translate-x-1/2 -translate-y-1/2 flex-col gap-[10px] overflow-hidden rounded-[8px] bg-white px-[30px] py-[40px]'>
        <div className='flex h-full flex-col items-center justify-center gap-[24px]'>
            <FormProvider {...methods}>
                <div className='relative w-full'>
                <h2 className="text-[14px] font-semibold text-[#565656] text-center">모집 직무 설정</h2>
                    <button onClick={handleAddPosition} type='button' className='absolute right-[0px] top-[0px] text-link-default flex items-center gap-[4px] text-[12px] font-semibold'>
                    추가
                    <Image src='/icons/Add-blue.svg' alt='' width={14} height={14} />
                </button>
            </div> 
            <div className='w-full flex-1 overflow-y-auto '>
                <ul className='flex flex-col gap-[12px]'>
                    {positionField.map((field) => (
                        <li key={field.id} className='flex items-center justify-between gap-[8px]'>
                            <div className='flex-auto flex gap-[8px] items-center'>
                                <div className='relative flex-auto'> 
                                    <div className='w-full h-[48px]'>
                                        <FilterSelect 
                                            className='text-[#bbb] text-[14px]'
                                            type="default"
                                                onChange={(value) => handlePositionChange(value, field.id)}
                                                defaultValue={field.displayTitle || field.title}
                                                options={availablePositions.map(option => ({
                                                    ...option,
                                                    label: POSITION_LABELS[option.value as RecruitmentPositionTitle] || option.label
                                                }))} 
                                                isOpen={openSelectId === `${SELECT_IDS.POSITION}_${field.id}` as keyof typeof SELECT_IDS}
                                            onToggle={() =>
                                                setOpenSelectId(
                                                    openSelectId === `${SELECT_IDS.POSITION}_${field.id}` as keyof typeof SELECT_IDS
                                                    ? null
                                                        : `${SELECT_IDS.POSITION}_${field.id}` as keyof typeof SELECT_IDS,
                                                )
                                            }
                                        />
                                    </div>  
                                </div>
                            </div>
                            <div className='flex-shrink-0 w-[120px]'>
                                    <input type='text' placeholder='인원' className='placeholder:text-[#bbb] placeholder:text-[14px] placeholder:font-regular rounded-[8px] border border-[#e0e0e0] h-[48px] px-[10px] w-full ' value={field.headcount} onChange={(e) => handleHeadcountChange(e, field.id)} />
                            </div> 
                                <button onClick={() => handleRemovePosition(field.title)} type='button' className='w-[55px] justify-center flex-shrink-0 text-[#b6b6b6] text-[12px] font-semibold flex items-center gap-[4px]'>삭제<Image src='/icons/Clear.svg' alt='' width={14} height={14} /></button>
                        </li>
                    ))}
                </ul>
            </div>
            <div className='flex justify-end gap-[10px] w-full'>
                <button onClick={handleCloseModal} type='button' className='flex items-center justify-center rounded-[4px] bg-[#E7F3FF] h-[40px] w-[120px] flex-shrink-0 text-[14px] font-semibold text-link-default'>닫기</button>
                <button onClick={onSubmit} type='button' className='flex items-center justify-center rounded-[4px] bg-[#228BFF] h-[40px] flex-auto text-[14px] font-semibold text-white'>완료</button>
            </div>
            </FormProvider>
        </div>
      </div>
      <div
            className="fixed inset-0 z-10 bg-black/50"
            onClick={handleCloseModal}
          />
    </>
  );
}
