'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import HeaderUser from './HeaderUser';

export default function Header() {
  const path = usePathname();
  const logo = '/icons/swm_logo.svg';
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem('accessToken');
      setIsLoggedIn(!!token);
    };
    checkLoginStatus();
    window.addEventListener('storage', checkLoginStatus);
    window.addEventListener('login', checkLoginStatus);
    window.addEventListener('logout', checkLoginStatus);

    return () => {
      window.removeEventListener('storage', checkLoginStatus);
      window.removeEventListener('login', checkLoginStatus);
      window.removeEventListener('logout', checkLoginStatus);
    };
  }, []);

  const navList = [
    { name: '스터디 모집', href: '/study-recruit' },
    { name: '스터디 룸', href: '/studyroom' },
    { name: '외부 스터디 룸', href: '/external-studyrooms' },
    { name: '외부 스터디', href: '/external-studies' },
    ...(isLoggedIn ? [{ name: '스터디 생성', href: '/study-create' }] : []),
    // TODO: 사업자 검수 조회 state 필요. 현재는 로그인 후 보이도록 설정 by EJ
    ...(isLoggedIn ? [{ name: '스터디 룸 생성', href: '/studyroom/new' }] : []),
  ];

  const logoOnlyPaths = ['/login/', '/join/', '/join/complete/'];

  if (logoOnlyPaths.includes(path)) {
    return (
      <div className="border-b-2 border-border">
        <div className="mx-auto flex max-w-screen-xl items-center justify-between px-5 py-5 xl:px-0">
          <h2 className="w-[197px] text-2xl font-semibold text-black">
            <Link href="/">
              <Image
                src={logo}
                alt="study with me logo"
                width={182}
                height={28}
              />
            </Link>
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="border-b-2 border-border">
      <div className="mx-auto flex max-w-screen-xl items-center justify-between px-5 py-5 xl:px-0">
        <div className="flex items-center gap-5">
          <h2 className="w-[197px] text-2xl font-semibold text-black">
            <Link href="/">
              <Image
                src={logo}
                alt="study with me logo"
                width={182}
                height={28}
              />
            </Link>
          </h2>
          <ul className="flex items-center">
            {navList.map((nav, index) => (
              <li key={index} className="px-4">
                <Link
                  href={nav.href}
                  className={`text-base font-medium text-gray-default ${
                    path === nav.href ? 'text-primary-default' : ''
                  }`}
                >
                  {nav.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <HeaderUser />
      </div>
    </div>
  );
}
