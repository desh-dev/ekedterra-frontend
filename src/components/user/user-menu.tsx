"use client";

import { Fragment } from "react";
import { Link, useRouter } from "@/i18n/routing";

interface UserMenuProps {
  onClose: () => void;
}

export default function UserMenu({ onClose }: UserMenuProps) {
  const router = useRouter();

  const handleLogin = () => {
    router.push("/auth/login");
    onClose();
  };

  const handleSignUp = () => {
    router.push("/auth/sign-up");
    onClose();
  };

  // TODO: Replace with actual auth state
  const isLoggedIn = false;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40" onClick={onClose} />

      {/* Menu */}
      <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
        {!isLoggedIn ? (
          <Fragment>
            <button
              onClick={handleLogin}
              className="block w-full text-left px-4 py-3 text-sm font-medium text-gray-900 hover:bg-gray-50"
            >
              Log in
            </button>
            <button
              onClick={handleSignUp}
              className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
            >
              Sign up
            </button>
            <hr className="my-1" />
            <Link
              href="/host"
              className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
              onClick={onClose}
            >
              Airbnb your home
            </Link>
            <Link
              href="/help"
              className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
              onClick={onClose}
            >
              Help Center
            </Link>
          </Fragment>
        ) : (
          <Fragment>
            <Link
              href="/trips"
              className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
              onClick={onClose}
            >
              Trips
            </Link>
            <Link
              href="/wishlists"
              className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
              onClick={onClose}
            >
              Wishlists
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
