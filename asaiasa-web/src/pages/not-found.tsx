import { ArrowLeft } from "@untitledui/icons";
import { useNavigate } from "react-router";
import { useTranslations } from 'next-intl';
import { Button } from "@/components/base/buttons/button";

export function NotFound() {
    const router = useNavigate();
    const t = useTranslations('NotFound');

    return (
        <section className="flex min-h-screen items-start bg-primary py-16 md:items-center md:py-24">
            <div className="mx-auto max-w-container grow px-4 md:px-8">
                <div className="flex w-full max-w-3xl flex-col gap-8 md:gap-12">
                    <div className="flex flex-col gap-4 md:gap-6">
                        <div className="flex flex-col gap-3">
                            <span className="text-md font-semibold text-brand-secondary">{t('error')}</span>
                            <h1 className="text-display-md font-semibold text-primary md:text-display-lg lg:text-display-xl">{t('title')}</h1>
                        </div>
                        <p className="text-lg text-tertiary md:text-xl">{t('description')}</p>
                    </div>

                    <div className="flex flex-col-reverse gap-3 sm:flex-row">
                        <Button color="secondary" size="xl" iconLeading={ArrowLeft} onClick={() => router(-1)}>
                            {t('goBack')}
                        </Button>
                        <Button size="xl" onClick={() => router(-1)}>
                            {t('takeHome')}
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}
