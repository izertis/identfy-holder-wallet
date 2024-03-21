import React from 'react'
import { DescriptionText } from '../../atomic_components/Text/variants'
import { useTranslation } from 'react-i18next'
import requestPresentationModalI18nKeys from '../i18n/keys'

const CredentialsEmptyState = () => {
    const bundleName = "RequestPresentationModal"
    const { t } = useTranslation(bundleName)
    return (
        <DescriptionText>{t(requestPresentationModalI18nKeys.CREDENTIALS_EMPTY_STATE)}</DescriptionText>
    )
}

export default CredentialsEmptyState