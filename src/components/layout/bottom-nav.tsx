'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  MagnifyingGlassIcon, 
  HeartIcon, 
  UserCircleIcon,
  HomeIcon 
} from '@heroicons/react/24/outline';
import {
  MagnifyingGlassIcon as MagnifyingGlassIconSolid,
  HeartIcon as HeartIconSolid,
  UserCircleIcon as UserCircleIconSolid,
  HomeIcon as HomeIconSolid
} from '@heroicons/react/24/solid';

const navItems = [
  {
    name: 'Explore',
    href: '/',
    icon: MagnifyingGlassIcon,
    iconSolid: MagnifyingGlassIconSolid,
  },
  {
    name: 'Wishlists',
    href: '/wishlists',
    icon: HeartIcon,
    iconSolid: HeartIconSolid,
  },
  {
    name: 'Trips',
    href: '/trips',
    icon: HomeIcon,
    iconSolid: HomeIconSolid,
  },
  {
    name: 'Log in',
    href: '/login',
    icon: UserCircleIcon,
    iconSolid: UserCircleIconSolid,
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <nav className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = isActive ? item.iconSolid : item.icon;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className="flex flex-col items-center justify-center flex-1 py-2"
            >
              <Icon className={`h-6 w-6 ${isActive ? 'text-[#FF385C]' : 'text-gray-400'}`} />
              <span className={`text-xs mt-1 ${isActive ? 'text-[#FF385C] font-medium' : 'text-gray-400'}`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}