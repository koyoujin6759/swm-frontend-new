'use client';

import { useSearchParams } from 'next/navigation';

export default function EmailDisplay() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  return (
    <p className="bg-blue-light w-full max-w-[432px] rounded-lg p-5 text-center text-[22px] font-semibold">
      {email}
    </p>
  );
}
