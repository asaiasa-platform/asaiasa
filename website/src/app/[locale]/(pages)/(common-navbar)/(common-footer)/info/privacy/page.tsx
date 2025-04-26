import React from "react";
import { getTranslations } from "next-intl/server";

export default async function PrivacyTermPage() {
  const t = await getTranslations("Privacy");
  
  return (
    <div className="font-prompt max-w-[1170px] mx-auto px-6 min-h-[80vh] mt-[90px]">
      <h1 className="text-3xl font-bold mb-8">{t("title")}</h1>

      <div className="space-y-6">
        <section>
          <h2 className="text-xl font-semibold mb-4">
            {t("section1.title")}
          </h2>
          <p className="text-gray-600">
            {t("section1.intro")}
          </p>
          <ul className="list-disc ml-6 mt-2 text-gray-600">
            <li>{t("section1.items.item1")}</li>
            <li>{t("section1.items.item2")}</li>
            <li>{t("section1.items.item3")}</li>
            <li>{t("section1.items.item4")}</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">
            {t("section2.title")}
          </h2>
          <p className="text-gray-600">{t("section2.intro")}</p>
          <ul className="list-disc ml-6 mt-2 text-gray-600">
            <li>{t("section2.items.item1")}</li>
            <li>{t("section2.items.item2")}</li>
            <li>{t("section2.items.item3")}</li>
            <li>{t("section2.items.item4")}</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">{t("section3.title")}</h2>
          <p className="text-gray-600">
            {t("section3.intro")}
          </p>
          <ul className="list-disc ml-6 mt-2 text-gray-600">
            <li>{t("section3.items.item1")}</li>
            <li>{t("section3.items.item2")}</li>
            <li>{t("section3.items.item3")}</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">{t("section4.title")}</h2>
          <p className="text-gray-600">
            {t("section4.content")}
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">{t("section5.title")}</h2>
          <p className="text-gray-600">{t("section5.intro")}</p>
          <ul className="list-disc ml-6 mt-2 text-gray-600">
            <li>{t("section5.items.item1")}</li>
            <li>{t("section5.items.item2")}</li>
            <li>{t("section5.items.item3")}</li>
            <li>{t("section5.items.item4")}</li>
            <li>{t("section5.items.item5")}</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">{t("section6.title")}</h2>
          <p className="text-gray-600">
            {t("section6.intro")}
          </p>
          <div className="mt-2 text-gray-600">
            <p>{t("section6.contact.email")}</p>
            <p>{t("section6.contact.phone")}</p>
            <p>{t("section6.contact.address")}</p>
          </div>
        </section>

        <section className="mt-8">
          <p className="text-sm text-gray-500">
            {t("lastUpdated")} {t("effectiveDate")}
          </p>
        </section>
      </div>
    </div>
  );
}
