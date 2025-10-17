"use client";

import { useState } from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { Bars3Icon } from "@heroicons/react/24/outline";
import UserMenu from "@/components/user/user-menu";
import LanguageSwitcher from "@/components/language-switcher";
import SearchBar from "../layout/search-bar";
import CategoryTabs from "./category-tabs";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import useIsDesktop from "@/hooks/useIsDesktop";

export default function Header() {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [scrolledDown, setScrolledDown] = useState(false);
  const { isDesktop } = useIsDesktop();

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolledDown(latest > 0);
  });
  return (
    <motion.header
      initial={{ height: "auto" }}
      animate={{
        height: isDesktop ? (scrolledDown ? "120px" : "220px") : "auto",
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="w-full sticky top-0 z-50 bg-white md:bg-gray-50 md:border-b border-gray-200 md:pb-4"
    >
      <div className="w-full shadow-md md:shadow-none lg:max-w-7xl mx-auto lg:px-8">
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

          <motion.div
            initial={{ y: 0, opacity: 1 }}
            animate={
              isDesktop
                ? {
                    y: scrolledDown ? -40 : 0,
                    opacity: scrolledDown ? 0 : 1,
                  }
                : {}
            }
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <CategoryTabs />
          </motion.div>

          <div className="flex gap-2 items-center">
            <motion.div
              initial={{ y: 0, opacity: 1 }}
              animate={
                isDesktop
                  ? {
                      y: scrolledDown ? -40 : 0,
                      opacity: scrolledDown ? 0 : 1,
                    }
                  : {}
              }
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <Link
                href="/shop"
                className="space-x-2 text-sm font-medium border border-gray-200 p-2 rounded-full hover:shadow-md transition-shadow"
              >
                Shop
              </Link>
            </motion.div>
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
        <motion.div
          initial={{ y: 0, scale: 1 }}
          animate={
            isDesktop
              ? {
                  y: scrolledDown ? -90 : 0,
                  scale: scrolledDown ? 0.71 : 1,
                }
              : {}
          }
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="mt-4 md:mt-0 px-6"
        >
          <div className="w-full flex flex-col gap-2 justify-center items-center">
            <SearchBar />
            <div className="w-full flex justify-center md:hidden">
              <CategoryTabs />
            </div>
          </div>
        </motion.div>
      </div>
    </motion.header>
  );
}
