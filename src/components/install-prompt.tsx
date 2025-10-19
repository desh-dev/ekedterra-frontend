'use client';

import { useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import useIsDesktop from '@/hooks/useIsDesktop';
import { useTranslations } from 'next-intl';

const InstallPrompt = () => {
  const { isIOS, isStandalone, isIframe } = useIsDesktop();
  const t = useTranslations('common');

  useEffect(() => {
    if (!isStandalone && !isIframe) {
      const message = isIOS
        ? t('tapShareButtonAddToHomeScreen')
        : t('installWebAppForBetterExperience');

      toast(message, {
        duration: 10000,
        position: 'bottom-center',
        icon: '📱',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });
    }
  }, [isIOS, isStandalone, isIframe]);

  if (isStandalone || isIframe) {
    return null;
  }

  return <Toaster position="bottom-center" />;
};

export default InstallPrompt;
