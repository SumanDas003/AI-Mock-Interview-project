'use client'
import React, { useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { UserButton } from '@clerk/nextjs'
import { usePathname } from 'next/navigation'
import { useUser } from '@clerk/nextjs'

function Header() {
  const path = usePathname();
  const { user } = useUser();

  useEffect(() => {
    console.log(path);
  }, [path]);

  return (
    <div className='flex p-4 items-center justify-between bg-gray-300 shadow-md'>
      <Image src={'/logo-transparent.png'} width={100} height={100} alt={'logo'} className='scale-100 mx-2' />
      
      <ul className='hidden md:flex gap-6'>
        <li>
          <Link
            href="/dashboard"
            className={`hover:text-violet-700 hover:font-bold transition-all cursor-pointer ${
              path === '/dashboard' ? 'text-violet-700 font-bold' : ''
            }`}
          >
            Dashboard
          </Link>
        </li>
        <li>
          <Link
            href="/dashboard/Upgrade"
            className={`hover:text-violet-700 hover:font-bold transition-all cursor-pointer ${
              path === '/dashboard/Upgrade' ? 'text-violet-700 font-bold' : ''
            }`}
          >
            Upgrade
          </Link>
        </li>
        <li>
          <Link
            href="/how"
            className={`hover:text-violet-700 hover:font-bold transition-all cursor-pointer ${
              path === '/how' ? 'text-violet-700 font-bold' : ''
            }`}
          >
            How it Works?
          </Link>
        </li>
      </ul>

      <UserButton />
    </div>
  );
}

export default Header;
