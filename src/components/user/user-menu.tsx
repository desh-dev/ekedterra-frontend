"use client";

import { Fragment } from "react";
import { Link, useRouter } from "@/i18n/routing";
import { useCategoryStore } from "@/providers/category-store-provider";
import { useAuth } from "@/providers/auth-provider";
import { HelpCircle } from "lucide-react";
import Image from "next/image";

interface UserMenuProps {
  onClose: () => void;
}

export default function UserMenu({ onClose }: UserMenuProps) {
  const setLogin = useCategoryStore((state) => state.setLogin);
  const router = useRouter();

  const handleAuth = () => {
    setLogin(true);
    onClose();
  };
  const { user, isAgent, isUser, signOut } = useAuth();

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40" onClick={onClose} />

      {/* Menu */}
      <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
        {!user ? (
          <Fragment>
            <button
              onClick={handleAuth}
              className="block w-full text-left px-4 py-3 text-sm font-medium text-gray-900 hover:bg-gray-50"
            >
              Log in or Sign up
            </button>
          </Fragment>
        ) : (
          <Fragment>
            {isUser && (
              <div>
                <Link
                  href="/bookings"
                  className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                  onClick={onClose}
                >
                  Bookings
                </Link>
                <Link
                  href="/favorites"
                  className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                  onClick={onClose}
                >
                  Favorites
                </Link>
                <Link
                  href="/profile"
                  className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                  onClick={onClose}
                >
                  Account
                </Link>
              </div>
            )}
            {isAgent && (
              <div>
                <Link
                  href="/listings"
                  className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                  onClick={onClose}
                >
                  Manage listings
                </Link>
                <Link
                  href="/products"
                  className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                  onClick={onClose}
                >
                  Manage products
                </Link>
                <Link
                  href="/profile"
                  className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                  onClick={onClose}
                >
                  Account
                </Link>
              </div>
            )}
          </Fragment>
        )}
        {!isAgent && (
          <div>
            <hr className="my-1" />

            <Link
              href="/agent"
              className="flex px-4 py-3 hover:bg-gray-50"
              onClick={onClose}
            >
              <div className="flex flex-col">
                <p className="font-semibold  text-sm">Become an agent</p>
                <p className="text-xs text-gray-500">
                  It&#39;s easy to become an Ekedterra agent and earn extra
                  income
                </p>
              </div>
              <Image
                src="/become-agent.png"
                alt="become agent"
                width={44}
                height={44}
                // className="mt-2"
              />
            </Link>
          </div>
        )}
        <hr className="my-1" />
        <Link
          href="/help"
          className="flex gap-2 items-center px-4 py-3 hover:bg-gray-50"
          onClick={onClose}
        >
          <HelpCircle size={16} />
          <span className=" text-sm text-gray-700">Help Center</span>
        </Link>
        {user && (
          <div>
            <hr className="my-1" />

            <button
              className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
              onClick={() => {
                // TODO: Implement logout
                signOut();
                onClose();
              }}
            >
              Log out
            </button>
          </div>
        )}
      </div>
    </>
  );
}
