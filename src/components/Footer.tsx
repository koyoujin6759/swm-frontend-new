import Image from "next/image";
import Link from "next/link"; 

export default function Footer() {
    const logo = '/icons/swm_logo.svg';

  return (
    <>
      <div className="bg-white border-t border-gray-200">
        <div className="container max-w-screen-xl mx-auto px-4 py-8">
          <div className="flex justify-between items-center">
            <Link href="/">
              <Image
                src={logo}
                alt="study with me logo"
                width={182}
                height={28}
              />
            </Link>  
          </div>
          <div className="flex flex-wrap gap-[20px] text-sm text-gray-500 mt-[20px]">
            <p>상호: 타이탄</p>
            <p>사업자등록번호: 309-60-93884</p>
            <p>대표자명: 한윤수</p>
            <p>경기도 남양주시 진접읍 금강로 1533-28, 원일에이플러스아파트 101동 1404호</p> 
          </div>
          <div className="flex flex-wrap gap-[20px] text-sm text-gray-500 mt-[10px]">  
            <p>대표전화: 010-4144-3055</p>
            <p>이메일: <a href="mailto:studywithmecrew@google.com">studywithmecrew@google.com</a></p>
          </div>
        </div>
      </div>
    </>
  );
}
