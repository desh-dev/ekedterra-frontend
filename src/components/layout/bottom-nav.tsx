"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  MagnifyingGlassIcon,
  HeartIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import {
  MagnifyingGlassIcon as MagnifyingGlassIconSolid,
  HeartIcon as HeartIconSolid,
  UserCircleIcon as UserCircleIconSolid,
} from "@heroicons/react/24/solid";
import { Link, usePathname } from "@/i18n/routing";
import { createClient } from "@/lib/supabase/client";

const nav = [
  {
    name: "Explore",
    href: "/",
    icon: MagnifyingGlassIcon,
    iconSolid: MagnifyingGlassIconSolid,
  },
  {
    name: "Wishlists",
    href: "/favorites",
    icon: HeartIcon,
    iconSolid: HeartIconSolid,
  },
  {
    name: "Log in",
    href: "/login",
    icon: UserCircleIcon,
    iconSolid: UserCircleIconSolid,
  },
];

const BottomNav = () => {
  const pathname = usePathname();
  const [showNav, setShowNav] = useState(true);
  const [navItems, setNavItems] = useState(nav);

  useEffect(() => {
    const getClaims = async () => {
      try {
        const supabase = createClient();
        const { data } = await supabase.auth.getClaims();
        if (data?.claims) {
          setNavItems((items) =>
            items.map((item) =>
              item.href === "/login"
                ? { ...item, name: "Profile", href: "/profile" }
                : item
            )
          );
        }
      } catch (error) {
        console.error("Error fetching user claims:", error);
      }
    };

    getClaims();
  }, []);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      if (window.scrollY > lastScrollY + 5) {
        setShowNav(false);
      } else if (window.scrollY < lastScrollY - 5) {
        setShowNav(true);
      }
      lastScrollY = window.scrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.div
      initial={{ y: 0 }}
      animate={{ y: showNav ? 0 : 80 }} // push it down out of view
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50"
    >
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
              <Icon
                className={`h-6 w-6 ${
                  isActive ? "text-[#FF385C]" : "text-gray-400"
                }`}
              />
              <span
                className={`text-xs mt-1 ${
                  isActive ? "text-[#FF385C] font-medium" : "text-gray-400"
                }`}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>
    </motion.div>
  );
};

export default BottomNav;
