'use client';

import { Fragment } from 'react';
import { Link } from '@/i18n/routing';
import { useAppStore } from '@/providers/app-store-provider';
import { useAuth } from '@/providers/auth-provider';
import { HelpCircle } from 'lucide-react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

interface UserMenuProps {
  onClose: () => void;
}

export default function UserMenu({ onClose }: UserMenuProps) {
  const setLogin = useAppStore((state) => state.setLogin);
  const t = useTranslations('common');

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
              {t('logInOrSignUp')}
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
                  {t('bookings')}
                </Link>
                <Link
                  href="/favorites"
                  className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                  onClick={onClose}
                >
                  {t('favorites')}
                </Link>
                <Link
                  href="/profile"
                  className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                  onClick={onClose}
                >
                  {t('account')}
                </Link>
              </div>
            )}
            {isAgent && (
              <div>
                <Link
                  href="/agent/listings"
                  className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                  onClick={onClose}
                >
                  {t('manageListings')}
                </Link>
                <Link
                  href="/agent/products"
                  className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                  onClick={onClose}
                >
                  {t('manageProducts')}
                </Link>
                <Link
                  href="/profile"
                  className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                  onClick={onClose}
                >
                  {t('account')}
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
                <p className="font-semibold  text-sm">{t('becomeAnAgent')}</p>
                <p className="text-xs text-gray-500">
                  {t('itsEasyToBecomeAgent')}
                </p>
              </div>
              <Image
                src="/become-agent.webp"
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
          <span className=" text-sm text-gray-700">{t('helpCenter')}</span>
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
              {t('logOut')}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
