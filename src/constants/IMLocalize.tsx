import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as RNLocalize from 'react-native-localize';

import en from './translations/en';
import es from './translations/es';

const LANGUAGES = {
  en,
  es,
};

const LANG_CODES: any = Object.keys(LANGUAGES);

const LANGUAGE_DETECTOR: any = {
  type: 'languageDetector',
  async: true,
  detect: (callback: (lng: string) => void) => {
    AsyncStorage.getItem('APP_LANG', (err, lng) => {
      if (err || !lng) {
        const bestLng = RNLocalize.findBestLanguageTag(LANG_CODES);

        return callback(bestLng?.languageTag ?? 'en');
      }
      return callback(lng);
    });
  },
  init: () => {},
  cacheUserLanguage: (language: any) => {
    AsyncStorage.setItem('user-language', language);
  },
};

i18n
  // detect language
  .use(LANGUAGE_DETECTOR)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // set options
  .init({
    compatibilityJSON: 'v4',
    resources: LANGUAGES,
    react: {
      useSuspense: false,
    },
    interpolation: {
      escapeValue: false,
    },
    defaultNS: 'common',
  });
