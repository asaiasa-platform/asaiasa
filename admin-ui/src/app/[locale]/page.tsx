import { Button } from "@/components/ui/button";
import {
  Calendar,
  Briefcase,
  Users,
  LogIn,
  ClipboardPen,
} from "lucide-react";
import FeatureCard from "@/features/landing-page/FeatureCard";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import ContactForm from "@/features/landing-page/ContactForm";
import LangSwitcher from "@/components/common/LangSwitcher";
import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations("HomePage");
  const tf = useTranslations("Features");

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <header className="bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="relative flex justify-start items-start w-[100px] sm:w-[150px]">
            <Image
              src={"/logo-2.png"}
              width={1500}
              height={1000}
              alt="Logo"
            />
            <span className="absolute -top-1 -right-7 text-xs text-gray-400">{t("cms")}</span>
          </div>
          <div className="flex items-center space-x-4">
            <LangSwitcher />
            <Link
              href="/docs"
              className="text-sm font-medium text-gray-500 hover:text-gray-900"
            >
              {t("documentation")}
            </Link>
            <Link
              href="/support"
              className="text-sm font-medium text-gray-500 hover:text-gray-900"
            >
              {t("support")}
            </Link>
          </div>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
            {t("tagline")}
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            {t("description")}
          </p>
          <div className="mt-8 max-w-md mx-auto sm:flex sm:justify-center sm:gap-4">
            <Button
              asChild
              size="lg"
              className="w-full sm:w-auto flex items-center justify-center mb-4 sm:mb-0"
            >
              <Link href="/org-register">
                <ClipboardPen className="mr-2 h-4 w-4" />
                {t("register-org")}
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="w-full sm:w-auto flex items-center justify-center"
            >
              <Link href="/my-organizations">
                <LogIn className="mr-2 h-4 w-4" /> {t("your-org")}
              </Link>
            </Button>
          </div>
        </div>

        <div className="mt-16">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-8">
            {t("key-features")}
          </h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={<Calendar className="h-6 w-6" />}
              title={tf("event-management.title")}
              description={tf("event-management.description")}
            />
            <FeatureCard
              icon={<Briefcase className="h-6 w-6" />}
              title={tf("job-post-management.title")}
              description={tf("job-post-management.description")}
            />
            <FeatureCard
              icon={<Users className="h-6 w-6" />}
              title={tf("member-management.title")}
              description={tf("member-management.description")}
            />
          </div>
        </div>

        <div className="mt-16">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-8">
            {t("get-in-touch")}
          </h2>
          <div className="max-w-md mx-auto">
            <ContactForm />
          </div>
        </div>
      </main>

      <footer className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="mt-8 border-t border-gray-200 pt-8 md:flex md:items-center md:justify-between">
            <div className="flex space-x-6 md:order-2">
              <Link
                href="/privacy"
                className="text-base text-gray-500 hover:text-gray-900"
              >
                {t("privacy-policy")}
              </Link>
              <Link
                href="/terms"
                className="text-base text-gray-500 hover:text-gray-900"
              >
                {t("terms-of-service")}
              </Link>
            </div>
            <p className="mt-8 text-base text-gray-400 md:mt-0 md:order-1">
              {t("copyright")}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
