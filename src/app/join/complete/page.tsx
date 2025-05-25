'use client';

import { useRouter } from 'next/navigation';
import { Suspense } from 'react';
import EmailDisplay from '@/components/EmailDisplay';
import { Button } from '@/components/ui/button';

export default function JoinComplete() {
  const router = useRouter();

  return (
    <div
      className="flex h-screen flex-col items-center justify-center gap-10"
      style={{ height: 'calc(100vh - 70px)' }}
    >
      <h1 className="text-2xl font-semibold">회원가입이 완료되었습니다.</h1>
      <Suspense fallback={<p>Loading...</p>}>
        <EmailDisplay />
      </Suspense>
      <Button onClick={() => router.push('/login')} className="bg-blue-default">
        로그인 화면 바로가기
      </Button>
    </div>
  );
}
