import StudyRoomSection from '@/components/StudyRoomSection';
import ExternalStudySection from '@/components/ExternalStudySection';

export default async function Home() { 

  const categories = ['프론트엔드', '백엔드', '앱', '디자인', '머신러닝'];

  return (
    <>
    <div className='mt-[60px] py-[60px] bg-[linear-gradient(360deg,_#A8D3FF,_#2689EF)] max-w-screen-xl px-5 xl:px-0 mx-auto rounded-[8px]'>
        <h2 className='text-center text-2xl font-medium text-white '>함께 배우고 성장하며 꿈을 현실로 만드는 여정</h2>
        <p className='text-center text-lg font-normal text-white mt-[20px]'>다양한 분야의 팀원을 찾아보세요!</p>
        <div className='flex gap-[20px] justify-center items-center mt-[40px]'>
            {categories.map((category, index) => (
                <div key={index} className='flex items-center justify-center w-[140px] h-[140px] border border-[#e0e0e0] bg-white rounded-[16px]'>{category}</div>
            ))}  
        </div> 
    </div>
    <section className='pt-[100px] pb-[200px] max-w-screen-xl px-5 xl:px-0 mx-auto flex flex-col gap-[80px]'> 
        <StudyRoomSection />
        <ExternalStudySection />
    </section>
    </>
  );
}
