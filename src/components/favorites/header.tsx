"use client";

import Link from "next/link";
import Image from "next/image";
import LanguageSwitcher from "../language-switcher";
import { useState } from "react";
import { Bars3Icon } from "@heroicons/react/24/outline";
import UserMenu from "../user/user-menu";
import TopPadding from "../top-padding";

const Header = () => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  return (
    <header className="hidden md:flex w-full sticky top-0 z-50 bg-white md:bg-gray-50 md:border-b border-gray-200">
      <TopPadding />
      <div className="w-full shadow-md md:shadow-none lg:max-w-7xl mx-auto lg:px-8">
        {/* Desktop */}
        <div className="flex justify-between items-center px-6">
          <div>
            <Link href="/" className="flex place-self-center hidden lg:block">
              <Image src="/logo-lg.webp" alt="Logo" width={140} height={80} />
            </Link>
            <Link
              href="/"
              className="flex place-self-center hidden md:block lg:hidden"
            >
              <Image src="/logo.webp" alt="Logo" width={120} height={60} />
            </Link>
          </div>
          <div className="flex gap-2 items-center">
            <Link
              href="/shop"
              className="space-x-2 text-sm font-medium border border-gray-200 p-2 rounded-full hover:shadow-md transition-shadow"
            >
              Shop
            </Link>
            <LanguageSwitcher />
            <div>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-2 border border-gray-200 p-2 rounded-full hover:shadow-md transition-shadow"
              >
                <Bars3Icon className="h-5 w-5 text-gray-600" />
              </button>
              {isUserMenuOpen && (
                <UserMenu onClose={() => setIsUserMenuOpen(false)} />
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
