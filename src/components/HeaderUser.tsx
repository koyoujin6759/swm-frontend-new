'use client';

import { getUserInfo } from '@/lib/api/auth';
import { logout } from '@/lib/api/auth';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function HeaderUser() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('로그아웃 에러:', error);
    } finally {
      setIsLoggedIn(false);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('expirationTime');
      window.dispatchEvent(new Event('logout'));
      router.push('/');
    }
  };

  const { data } = useQuery({
    queryKey: ['userInfo'],
    queryFn: () => getUserInfo(),
    enabled: isLoggedIn,
  });

  // console.log('userInfo', data);

  return (
    <div className="flex items-center gap-2">
      {!isLoggedIn ? (
        <>
          <Link
            href="/join"
            className="rounded-[4px] bg-[#e9e9e9] px-[12px] py-[6px] text-xs font-medium text-gray-default"
          >
            회원가입
          </Link>
          <Link
            href="/login"
            className="rounded-[4px] bg-[#e9e9e9] px-[12px] py-[6px] text-xs font-medium text-gray-default"
          >
            로그인
          </Link>
        </>
      ) : (
        <>
          <div className="font-regular flex items-center gap-2 text-sm text-gray-default">
            <p>
              <Image
                src={
                  data?.data?.profileImageUrl || '/icons/icon_no_profile.svg'
                }
                alt="profile"
                width={18}
                height={18}
              />
            </p>
            <Link href="/mypage" className="font-bold text-link-default">
              {data?.data?.nickname} 님
            </Link>{' '}
            환영합니다.
          </div>
          <button
            className="rounded-[4px] bg-[#e9e9e9] px-[12px] py-[6px] text-xs font-medium text-gray-default"
            onClick={handleLogout}
          >
            로그아웃
          </button>
        </>
      )}
    </div>
  );
}
