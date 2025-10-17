"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  MagnifyingGlassIcon,
  HeartIcon,
  ShoppingBagIcon,
  UserCircleIcon,
  BuildingOffice2Icon,
  TagIcon,
} from "@heroicons/react/24/outline";
import {
  MagnifyingGlassIcon as MagnifyingGlassIconSolid,
  HeartIcon as HeartIconSolid,
  UserCircleIcon as UserCircleIconSolid,
  ShoppingBagIcon as ShoppingBagIconSolid,
  BuildingOffice2Icon as BuildingOffice2IconSolid,
  TagIcon as TagIconSolid,
} from "@heroicons/react/24/solid";
import { Link, usePathname } from "@/i18n/routing";
import { useAuth } from "@/providers/auth-provider";
import { CalendarFold } from "lucide-react";
import useIsDesktop from "@/hooks/useIsDesktop";
import { useTranslations } from "next-intl";

const BottomNav = () => {
  const pathname = usePathname();
  const [showNav, setShowNav] = useState(true);
  const { user, isAgent, isUser } = useAuth();
  const { isIframe, isIOS, isStandalone } = useIsDesktop();
  const t = useTranslations("navigation");

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

  // Explore logic
  const isExplore = pathname === "/" || pathname === "/search";
  const ExploreIcon = isExplore
    ? MagnifyingGlassIconSolid
    : MagnifyingGlassIcon;
  const ExploreActive = isExplore;

  // Favorites logic
  const FavoritesActive = pathname === "/favorites";
  const FavoritesIcon = FavoritesActive ? HeartIconSolid : HeartIcon;

  const ShopActive = pathname === "/shop";
  const ShopIcon = ShopActive ? ShoppingBagIconSolid : ShoppingBagIcon;

  const BookingActive = pathname === "/bookings";

  const ProductActive = pathname === "/agent/products";
  const ProductIcon = ProductActive ? TagIconSolid : TagIcon;

  const ListingActive = pathname === "/agent/listings";
  const ListingIcon = ListingActive
    ? BuildingOffice2IconSolid
    : BuildingOffice2Icon;

  // Profile/Login logic
  const profileHref = user ? "/profile" : "/auth/login";
  const profileName = user ? t("profile") : t("login");
  const ProfileActive = pathname === profileHref;
  const ProfileIcon = ProfileActive ? UserCircleIconSolid : UserCircleIcon;

  if (isIframe) return null;

  return (
    <motion.div
      initial={{ y: 0 }}
      animate={{ y: showNav ? 0 : !isStandalone ? 80 : 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={`md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 ${
        isIOS && isStandalone && "pb-6"
      }`}
    >
      <nav className="flex items-center justify-around h-16">
        {/* Explore */}
        <Link
          href="/"
          className="flex flex-col items-center justify-center flex-1 py-2"
        >
          <ExploreIcon
            className={`h-6 w-6 ${
              ExploreActive ? "text-[#FF385C]" : "text-gray-400"
            }`}
          />
          <span
            className={`text-xs mt-1 ${
              ExploreActive ? "text-[#FF385C] font-medium" : "text-gray-400"
            }`}
          >
            {t("explore")}
          </span>
        </Link>
        {/* Favorites */}
        {(!user || isUser) && (
          <Link
            href="/favorites"
            className="flex flex-col items-center justify-center flex-1 py-2"
          >
            <FavoritesIcon
              className={`h-6 w-6 ${
                FavoritesActive ? "text-[#FF385C]" : "text-gray-400"
              }`}
            />
            <span
              className={`text-xs mt-1 ${
                FavoritesActive ? "text-[#FF385C] font-medium" : "text-gray-400"
              }`}
            >
              {t("favorites")}
            </span>
          </Link>
        )}
        {isUser && (
          <Link
            href="/bookings"
            className="flex flex-col items-center justify-center flex-1 py-2"
          >
            <CalendarFold
              className={`h-6 w-6 ${
                BookingActive ? "text-[#FF385C]" : "text-gray-400"
              }`}
            />
            <span
              className={`text-xs mt-1 ${
                BookingActive ? "text-[#FF385C] font-medium" : "text-gray-400"
              }`}
            >
              {t("bookings")}
            </span>
          </Link>
        )}
        <Link
          href="/shop"
          className="flex flex-col items-center justify-center flex-1 py-2"
        >
          <ShopIcon
            className={`h-6 w-6 ${
              ShopActive ? "text-[#FF385C]" : "text-gray-400"
            }`}
          />
          <span
            className={`text-xs mt-1 ${
              ShopActive ? "text-[#FF385C] font-medium" : "text-gray-400"
            }`}
          >
            {t("shop")}
          </span>
        </Link>
        {/* Products */}
        {isAgent && (
          <Link
            href="/agent/products"
            className="flex flex-col items-center justify-center flex-1 py-2"
          >
            <ProductIcon
              className={`h-6 w-6 ${
                ProductActive ? "text-[#FF385C]" : "text-gray-400"
              }`}
            />
            <span
              className={`text-xs mt-1 ${
                ProductActive ? "text-[#FF385C] font-medium" : "text-gray-400"
              }`}
            >
              {t("products")}
            </span>
          </Link>
        )}
        {/* Listings */}
        {isAgent && (
          <Link
            href="/agent/listings"
            className="flex flex-col items-center justify-center flex-1 py-2"
          >
            <ListingIcon
              className={`h-6 w-6 ${
                ListingActive ? "text-[#FF385C]" : "text-gray-400"
              }`}
            />
            <span
              className={`text-xs mt-1 ${
                ListingActive ? "text-[#FF385C] font-medium" : "text-gray-400"
              }`}
            >
              {t("listings")}
            </span>
          </Link>
        )}
        {/* Profile / Log in */}
        <Link
          href={profileHref}
          className="flex flex-col items-center justify-center flex-1 py-2"
        >
          <ProfileIcon
            className={`h-6 w-6 ${
              ProfileActive ? "text-[#FF385C]" : "text-gray-400"
            }`}
          />
          <span
            className={`text-xs mt-1 ${
              ProfileActive ? "text-[#FF385C] font-medium" : "text-gray-400"
            }`}
          >
            {profileName}
          </span>
        </Link>
      </nav>
    </motion.div>
  );
};

export default BottomNav;
