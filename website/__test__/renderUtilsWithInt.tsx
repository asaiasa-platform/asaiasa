import { render } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";

type Messages = Record<string, Record<string, string>>;

type RenderWithIntlOptions = {
  locale?: string;
  messages?: Messages;
};

const defaultMessages = {
  HomePage: {
    title: "Talents Atmos",
    about: "Go to the about page",
  },
};

const langList = ["en", "th"]; // Define your language list here

export const renderWithIntl = (
  ui: React.ReactElement,
  { locale = "en", messages = defaultMessages }: RenderWithIntlOptions = {}
) => {
  return render(
    <NextIntlClientProvider locale={locale} messages={messages}>
      {ui}
    </NextIntlClientProvider>
  );
};

// Export the language list for reuse in tests
export const getLangList = () => langList;
