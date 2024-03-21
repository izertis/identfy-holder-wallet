import React from 'react';
import { DescriptionText } from '../../../atomic_components/Text/variants'
import { useTranslation } from 'react-i18next'
import { bundleName } from '../constants'
import stateWrapperI18nKeys from '../i18n/keys'

const DefaultEmptyState = () => {

  const { t } = useTranslation(bundleName)
    return (
        <DescriptionText>{t(stateWrapperI18nKeys.EMPTY_STATE_MESSAGE)}</DescriptionText>
    );
};

export default DefaultEmptyState;