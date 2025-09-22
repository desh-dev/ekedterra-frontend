"use client";

import { Fragment } from "react";
import { Link, useRouter } from "@/i18n/routing";
import { useCategoryStore } from "@/providers/category-store-provider";
import { useAuth } from "@/providers/auth-provider";

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
  const { user, isAgent, signOut } = useAuth();

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
            <hr className="my-1" />
            <Link
              href="/host"
              className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
              onClick={onClose}
            >
              Ekedterra agent
            </Link>
            {/* <Link
              href="/help"
              className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
              onClick={onClose}
            >
              Help Center
            </Link> */}
          </Fragment>
        ) : (
          <Fragment>
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
            <hr className="my-1" />
            <Link
              href="/host"
              className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
              onClick={onClose}
            >
              Manage listings
            </Link>
            <Link
              href="/account"
              className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
              onClick={onClose}
            >
              Account
            </Link>
            <hr className="my-1" />
            <Link
              href="/help"
              className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
              onClick={onClose}
            >
              Help Center
            </Link>
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
          </Fragment>
        )}
      </div>
    </>
  );
}
