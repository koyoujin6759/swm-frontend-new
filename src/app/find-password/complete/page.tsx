'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function JoinComplete() {
  const router = useRouter();

  return (
    <div className="flex h-[calc(100vh-70px)] items-center justify-center">
      <div className="-mt-[70px] flex w-[432px] flex-col gap-10">
        <h1 className="text-center text-2xl font-semibold">
          비밀번호 재설정이 완료되었습니다.
        </h1>
        <div className="flex gap-[10px]">
          <Button
            onClick={() => router.push('/')}
            className="flex-1 bg-blue-light text-blue-default"
          >
            홈 화면
          </Button>
          <Button
            onClick={() => router.push('/login')}
            className="w-[280px] bg-blue-default"
          >
            로그인 화면 바로가기
          </Button>
        </div>
      </div>
    </div>
  );
}
