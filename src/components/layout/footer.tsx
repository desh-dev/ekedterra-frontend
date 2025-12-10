"use client";

import { Link } from "@/i18n/routing";
import useIsDesktop from "@/hooks/useIsDesktop";
import { useTranslations } from "next-intl";
import { Instagram, Facebook, Linkedin, Music2 as TikTok } from "lucide-react";

export default function Footer() {
  const { isStandalone } = useIsDesktop();
  const tNav = useTranslations("navigation");
  const tCommon = useTranslations("common");

  if (isStandalone) return null;

  return (
    <footer className="w-full bg-gray-50 border-t border-gray-200 pt-8 pb-4 mt-8 text-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="font-semibold mb-3">{tCommon("footerExplore")}</div>
            <ul className="space-y-1 text-gray-600">
              <li>
                <Link href="/" className="hover:underline">
                  {tNav("explore")}
                </Link>
              </li>
              <li>
                <Link href="/favorites" className="hover:underline">
                  {tNav("favorites")}
                </Link>
              </li>
              <li>
                <Link href="/bookings" className="hover:underline">
                  {tNav("bookings")}
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:underline">
                  {tNav("shop")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <div className="font-semibold mb-3">{tCommon("footerAgents")}</div>
            <ul className="space-y-1 text-gray-600">
              <li>
                <Link href="/agent/listings" className="hover:underline">
                  {tNav("listings")}
                </Link>
              </li>
              <li>
                <Link href="/agent/products" className="hover:underline">
                  {tNav("products")}
                </Link>
              </li>
              <li>
                <Link href="/profile" className="hover:underline">
                  {tNav("profile")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <div className="font-semibold mb-3">{tCommon("footerCompany")}</div>
            <ul className="space-y-1 text-gray-600">
              <li>
                <Link href="/contact-us" className="hover:underline">
                  {tCommon("footerContactUs")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <div className="font-semibold mb-3">
              {tCommon("footerFollowUs")}
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <a
                href="#"
                aria-label="Instagram"
                className="hover:text-gray-900"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" aria-label="Facebook" className="hover:text-gray-900">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" aria-label="TikTok" className="hover:text-gray-900">
                <TikTok className="h-5 w-5" />
              </a>
              <a href="#" aria-label="LinkedIn" className="hover:text-gray-900">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between border-t border-gray-200 pt-4">
          <div className="text-gray-500 mb-2 md:mb-0">
            &copy; {new Date().getFullYear()} ekedterra.{" "}
            {tCommon("footerAllRightsReserved")}
          </div>
        </div>
      </div>
    </footer>
  );
}
