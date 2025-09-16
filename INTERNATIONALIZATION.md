# Internationalization (i18n) Setup

This project has been configured with English and French translations using Next.js and next-intl.

## Features

- **Default Language**: French (fr)
- **Supported Languages**: English (en), French (fr)
- **Language Switcher**: Available in the header (desktop only)
- **Automatic Redirect**: Root path (/) redirects to /fr by default

## File Structure

```
├── messages/
│   ├── en.json          # English translations
│   └── fr.json          # French translations
├── app/
│   ├── [locale]/        # Locale-based routing
│   │   ├── layout.tsx   # Locale layout with NextIntlClientProvider
│   │   └── page.tsx     # Home page with translations
│   └── page.tsx         # Root page (redirects to /fr)
├── components/
│   ├── language-switcher.tsx  # Language selection component
│   └── locale-provider.tsx    # Sets HTML lang attribute
├── i18n.ts              # Next-intl configuration
├── middleware.ts        # Locale routing middleware
└── next.config.ts       # Next.js config with next-intl plugin
```

## Usage

### Adding New Translations

1. Add the translation key to both `messages/en.json` and `messages/fr.json`
2. Use the translation in your component:

```tsx
import { useTranslations } from 'next-intl';

export default function MyComponent() {
  const t = useTranslations('home');
  
  return <h1>{t('hero.title')}</h1>;
}
```

### Translation Keys Structure

```json
{
  "home": {
    "hero": {
      "title": "Find your next stay",
      "subtitle": "Discover amazing places..."
    },
    "categories": {
      "all": "All",
      "apartments": "Apartments"
    }
  },
  "search": {
    "where": "Where",
    "when": "When"
  },
  "common": {
    "loading": "Loading...",
    "error": "Error"
  }
}
```

### Language Switching

The language switcher is automatically available in the header. Users can switch between French and English, and the URL will update accordingly:

- French: `/fr`
- English: `/en`

## Development

The development server will automatically handle locale routing. Visit:
- `http://localhost:5000` → redirects to `/fr`
- `http://localhost:5000/fr` → French version
- `http://localhost:5000/en` → English version

## Adding New Locales

To add a new locale (e.g., Spanish):

1. Add `'es'` to the `locales` array in `i18n.ts` and `middleware.ts`
2. Create `messages/es.json` with Spanish translations
3. Add Spanish option to the `languages` array in `components/language-switcher.tsx`
4. Update the `defaultLocale` in `middleware.ts` if needed
