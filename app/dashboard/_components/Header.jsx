'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { UserButton } from '@clerk/nextjs';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

function Header() {
  const path = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsMobileMenuOpen(false); // close menu on route change
  }, [path]);

  const navItems = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Upgrade', href: '/dashboard/Upgrade' },
    { name: 'How it Works?', href: '/how' },
  ];

  return (
    <div className="flex items-center justify-between p-4 bg-gray-300 shadow-md relative">
      {/* Logo */}
      <Image
        src="/logo-transparent.png"
        width={50}
        height={50}
        alt="logo"
        className="scale-150 mx-2"
      />

      {/* Desktop Navigation */}
      <ul className="hidden md:flex gap-6">
        {navItems.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className={`hover:text-violet-700 hover:font-bold transition-all cursor-pointer ${
                path === item.href ? 'text-violet-700 font-bold' : ''
              }`}
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>

      {/* User Button */}
      <div className="hidden md:block">
        <UserButton />
      </div>

      {/* Mobile Menu Toggle */}
      <div className="md:hidden flex items-center gap-3">
        <UserButton />
        <button
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          className="focus:outline-none"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-gray-200 shadow-md flex flex-col items-start p-4 gap-3 z-50 md:hidden">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`w-full py-1 hover:text-violet-700 transition ${
                path === item.href ? 'text-violet-700 font-bold' : ''
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default Header;
