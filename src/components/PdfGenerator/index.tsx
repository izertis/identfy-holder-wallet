import React, { useState } from 'react'
import { View } from 'react-native'
import { Button } from 'react-native-paper'
import RNHTMLtoPDF from 'react-native-html-to-pdf'
import Share from 'react-native-share'
import ConfirmationDialog from '../ConfirmationDialog'
import i18next from 'i18next'
import { useTranslation } from 'react-i18next'
import localeES from './i18n/es'
import PDFGeneratorI18nKeys from './i18n/keys'
import { ColorKeys, getThemeColor } from '../../constants/Colors'

interface PDFGeneratorProps {
  data: any
}

const PDFGenerator: React.FC<PDFGeneratorProps> = ({ data }) => {
  const bundle = "PDFGenerator"
  i18next.addResourceBundle("es", bundle, localeES)
  const { t } = useTranslation(bundle)

  const [isDialogVisible, setDialogVisible] = useState(false)

  const generatePDF = async () => {
    try {
      const formattedData = JSON.stringify(data, null, 2)
      const htmlContent = `
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
          }
          code {
            white-space: pre-wrap;
          }
        </style>
      </head>
      <body>
        <code>${formattedData.replace(/\n/g, '<br>')}</code>
      </body>
      </html>
    `

      const options = {
        html: htmlContent,
        fileName: 'Credential',
        directory: 'Documents',
      }

      const pdf = await RNHTMLtoPDF.convert(options)

      return pdf.filePath
    } catch (error) {
      console.error('Error generating PDF:', error)
    }
  }

  const sharePDF = async () => {
    const pdfUri = await generatePDF()
    if (pdfUri) {
      try {
        await Share.open({
          url: `file://${pdfUri}`,
          type: 'application/pdf',
        })
      } catch (error) {
        console.error('Error sharing PDF:', error)
      }
    }
  }

  return (
    <View>
      <Button
        icon={'share'}
        textColor={getThemeColor(ColorKeys.primary)}
        onPress={() => setDialogVisible(true)}
        onLongPress={() => setDialogVisible(true)}
      >
        {t(PDFGeneratorI18nKeys.BUTTON_GENERATE)}
      </Button>

      <ConfirmationDialog
        visible={isDialogVisible}
        titleLabel={t(PDFGeneratorI18nKeys.DIALOG_TITLE)!}
        message={t(PDFGeneratorI18nKeys.DIALOG_DESCRIPTION)!}
        onPress={() => {
          sharePDF()
          setDialogVisible(false)
        }}
        onCancel={() => {
          setDialogVisible(false)
        }}
      />
    </View>
  )
}

export default PDFGenerator;

