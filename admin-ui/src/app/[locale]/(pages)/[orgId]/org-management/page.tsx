import React from 'react'
import { useTranslations } from 'next-intl'

export default function OrgManagementPage() {
  const t = useTranslations("OrgManagement")
  
  return (
    <div>{t("title")}</div>
  )
}
