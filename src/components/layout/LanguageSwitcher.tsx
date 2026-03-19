import { useTranslation } from 'react-i18next';

const langs = [
  { code: 'tr', label: 'TR' },
  { code: 'en', label: 'EN' },
  { code: 'ar', label: 'ع' },
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  return (
    <div className="lang-switcher">
      {langs.map(l => (
        <button
          key={l.code}
          onClick={() => i18n.changeLanguage(l.code)}
          className={i18n.language === l.code ? 'active' : ''}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
