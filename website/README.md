## Website

#### Deployment Status:

- [![Netlify Status](https://api.netlify.com/api/v1/badges/1979c5fc-5771-46b0-8f28-e0b8a32f1da2/deploy-status?branch=develop)](https://app.netlify.com/sites/talent-atmos/deploys)

- You can visit our site via this link: [Talent-Atmos](https://talent-atmos.netlify.app)

---

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Installation
<ol>
  <li>Clone OR Fork the repository</li>
  <li>Install dependencies:</li>
</ol>

```bash
npm install
```

## Environment Variables
Create a *.env* file in the root directory and configure it based on *.env.example*

## Getting Started

First, run the development server:


```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Internationalization (i18n)

This project uses `next-intl` for internationalization. The supported languages are Thai (th) and English (en).

### Translation Files

Translation files are located in the `messages` directory:
- `th.json` - Thai translations
- `en.json` - English translations

### Using Translations in Components

To use translations in your components, import the `useTranslations` hook:

```tsx
import { useTranslations } from "next-intl";

export default function MyComponent() {
  // Get translations for a specific namespace
  const t = useTranslations("Common.buttons");
  
  return (
    <button>
      {t("login")}
    </button>
  );
}
```

### Adding New Translations

1. Identify all user-facing text in your component
2. Add the translations to both `th.json` and `en.json` files using a logical namespace structure
3. Use the `useTranslations` hook in your component to access the translations

### Routing

The application uses the Next.js app router with i18n support. The routing configuration is in `src/i18n/routing.ts`.

Language detection is automatic based on the user's browser settings, with Thai as the default language.
