'use client';

import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { defaultSiteSettings, SiteSettings } from '@/lib/default-settings';

export function useSiteSettings() {
  const firestore = useFirestore();

  const settingsDocRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return doc(firestore, 'siteSettings', 'general');
  }, [firestore]);

  const { data: remoteData, isLoading, error } = useDoc<Partial<SiteSettings>>(settingsDocRef);

  const settings: SiteSettings = {
    ...defaultSiteSettings,
    ...(remoteData || {}),
    // Ensure featuredVideos is properly populated
    featuredVideos: ((remoteData?.featuredVideos && remoteData.featuredVideos.length > 0)
      ? remoteData.featuredVideos
      : defaultSiteSettings.featuredVideos).map(v => {
        if ((v.id === '0DmyalU2zL4' || v.youtubeId === '0DmyalU2zL4') && (!v.title || v.title.includes('HAY FESTIVAL') || v.title === 'Diálogos de Cambio')) {
          return { ...v, title: 'COP 16' };
        }
        return v;
      })
  };

  return {
    settings,
    isLoading,
    error
  };
}
