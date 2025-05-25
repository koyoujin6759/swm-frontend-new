'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Button } from './ui/button';

interface ModalProps {
  mainText: string;
  subText: string;
  onClose: () => void;
  buttonText: string;
  path: string;
}

export default function Modal({
  mainText,
  subText,
  onClose,
  buttonText,
  path,
}: ModalProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleClick = () => {
    router.push(path);
    onClose();
  };

  return (
    <div className="absolute left-1/2 top-1/2 z-30 flex -translate-x-1/2 -translate-y-1/2 transform flex-col gap-[30px] rounded-lg border border-blue-default bg-white px-[50px] py-10">
      <div className="flex flex-col items-center justify-center gap-2">
        <h1 className="text-xl font-semibold">{mainText}</h1>
        <p className="text-sm text-gray-default">{subText}</p>
      </div>
      <div className="flex gap-[10px]">
        <Button
          onClick={
            pathname === '/find-id' ? () => router.push('/login') : onClose
          }
          size="sm"
          className="bg-blue-light text-blue-default"
        >
          {pathname === '/find-id' ? '로그인' : '닫기'}
        </Button>
        <Button onClick={handleClick} size="md" className="bg-blue-default">
          {buttonText}
        </Button>
      </div>
    </div>
  );
}
