'use client';

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { getStudyDetail } from '@/lib/api/study/getStudyDetail';
import Loadingbar from '@/components/ui/Loadingbar';
import { useRouter } from "next/navigation";
import { getApplyStudyDetail } from "@/lib/api/study/getApplyStudyDetail";
import { POSITION_LABELS, RecruitmentPositionTitle } from "@/types/api/study-recruit/study";
export default function StudyApplyCompletePage() {
    const router = useRouter();
    const params = useParams();
    const { data, isLoading} = useQuery({
        queryKey: ['study','studyDetail', params.id],
        queryFn: async () => await getStudyDetail(params.id as string), 
    }); 

    const { data: applyData} = useQuery({
        queryKey: ['study', 'applyDetail', params.id],
        queryFn: async () => {
            const participationId = data?.data?.getStudyParticipationStatusResponse?.participationId; 
            return participationId ? await getApplyStudyDetail(String(participationId)) : null;
        },
        enabled: !!data?.data?.getStudyParticipationStatusResponse?.participationId,
    }); 
    // console.log('applyData', applyData);
   if(isLoading) return <div className="flex justify-center items-center h-screen"><Loadingbar /></div>

    return (
        <>
            <div className='mx-auto flex flex-col items-center gap-[40px] py-[160px] xl:px-0'>
                <div className='text-[24px] font-semibold text-black text-center'>스터디 참여 신청이 완료되었습니다.</div>
                <div className='w-[860px] text-left rounded-[10px] bg-[#E7F3FF] px-[40px] py-[50px]'>
                    <div className='text-[24px] font-semibold text-black'>{data?.data?.title}</div>
                    <div className='my-[30px] border-t border-[#ababab]'></div>
                    <div className='flex flex-col gap-[16px]'>
                        <div className='flex gap-[16px] items-center'>
                            <div className='flex-1 flex gap-[20px]'>
                                <div className='text-[18px] font-regular text-[#6d6d6d]'>신청 직무</div>
                                <div className='text-[18px] font-medium text-black'>{POSITION_LABELS[data?.data?.getStudyParticipationStatusResponse?.title as keyof typeof RecruitmentPositionTitle]}</div>
                            </div>
                            <div className='flex-1 flex gap-[10px]'>
                                <div className='text-[18px] font-regular text-[#6d6d6d]'>카카오톡 아이디</div>
                                <div className='text-[18px] font-medium text-black'>{applyData?.data?.kakaoId}</div>
                            </div> 
                        </div>
                        {applyData?.data?.links && applyData?.data?.links.length > 0 && (
                            <div className='flex gap-[20px] items-start'>
                                <div className='text-[16px] font-regular text-[#6d6d6d]'>URL</div>
                                <div className='text-[16px] font-medium text-black'>
                                    {applyData?.data?.links.map((link, index) => (
                                        <a key={index} href={link} target="_blank" rel="noopener noreferrer" className="hover:underline text-link-default flex">{link}</a>
                                    ))}
                                </div>
                            </div>
                        )}
                        {applyData?.data?.fileInfo && (
                            <div className='flex gap-[20px] items-center'>
                                <div className='text-[16px] font-regular text-[#6d6d6d]'>파일</div>
                                <div className='text-[16px] font-medium text-black'>
                                    <a
                                        href={applyData?.data?.fileInfo?.fileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        download={applyData?.data?.fileInfo?.fileName}
                                    >
                                        {applyData?.data?.fileInfo?.fileName}
                                    </a>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className='flex gap-[24px] flex-col'>
                    <div className='flex gap-[10px] justify-center w-[440px] mx-auto'>
                        <button onClick={() => router.push('/')} type='button' className='w-[120px] h-[60px] flex-shrink-0 rounded-[4px] bg-[#E7F3FF] text-[16px] font-semibold text-link-default'>홈 화면</button>
                        <button onClick={() => router.push(`/study-recruit/${params.id}`)} type='button' className='flex-auto h-[60px] rounded-[4px] bg-link-default text-[16px] font-semibold text-white'>스터디 상세페이지로 돌아가기</button>
                    </div>
                    <div className='text-[14px] font-regular text-[#a2a2a2] text-center'>스터디 신청 내역은 <span className='text-[#565656]'>[마이페이지 &gt; 내 활동 &gt; 내 스터디]</span>에서 확인할 수 있습니다.</div>
                </div> 
            </div>
        </>
    )
}