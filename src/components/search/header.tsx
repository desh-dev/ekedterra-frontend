"use client";

import { useState } from "react";
import Image from "next/image";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import {
  AdjustmentsHorizontalIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";
import UserMenu from "@/components/user/user-menu";
import LanguageSwitcher from "@/components/language-switcher";
import SearchBar from "../layout/search-bar";
import SearchBarDesktop from "./search-bar-desktop";
import { ArrowLeft } from "lucide-react";
import { useScroll, useMotionValueEvent } from "framer-motion";

interface HeaderProps {
  onOpenFilters?: () => void;
}

export default function Header({ onOpenFilters }: HeaderProps) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [scrolledDown, setScrolledDown] = useState(false);
  const router = useRouter();
  const path = usePathname();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolledDown(latest > 0);
  });

  return (
    <header
      className={`w-full ${
        scrolledDown ? "safe-area-top" : ""
      } sticky top-0 z-50 bg-white md:border-b border-gray-200 transition-all duration-300`}
    >
      <div className="w-full lg:max-w-7xl mx-auto lg:px-8">
        {/* Desktop */}
        <div className="hidden md:flex justify-between items-center px-6">
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
            <SearchBarDesktop />
            {path === "/search" && onOpenFilters && (
              <button
                onClick={onOpenFilters}
                className="flex items-center gap-2 text-sm font-medium border border-gray-200 p-2 rounded-full hover:shadow-md transition-shadow"
              >
                <AdjustmentsHorizontalIcon className="h-4 w-4" />

                <span>Filters</span>
              </button>
            )}
          </div>
          <div className="flex gap-2 items-center">
            <div>
              <Link
                href="/shop"
                className="space-x-2 text-sm font-medium border border-gray-200 p-2 rounded-full hover:shadow-md transition-shadow"
              >
                Shop
              </Link>
            </div>
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
        <div className="mt-4 md:hidden md:mt-0 px-6 border-b border-gray-200 pb-4">
          <div className="w-full flex gap-4 justify-center items-center">
            <button className="" onClick={() => router.back()}>
              <ArrowLeft className="" />
            </button>
            <SearchBar />
            {onOpenFilters && (
              <button className="w-8 h-8" onClick={onOpenFilters}>
                <AdjustmentsHorizontalIcon />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
