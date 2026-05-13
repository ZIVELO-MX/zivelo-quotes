'use client'

import { useLanguage } from '@/app/language-provider'
import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)

  const languages = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'es', label: 'Español', flag: '🇲🇽' },
  ]

  const handleLanguageChange = (newLocale: string) => {
    setLanguage(newLocale as 'en' | 'es')
    setIsOpen(false)
  }

  const currentLanguage = languages.find((lang) => lang.code === language)

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm transition-colors duration-200"
        style={{
          color: '#5a5a5a',
          backgroundColor: 'rgba(0,0,0,0.04)',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.08)')}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.04)')}
      >
        <span>{currentLanguage?.flag}</span>
        <span>{currentLanguage?.label}</span>
        <ChevronDown size={16} />
      </button>

      {isOpen && (
        <div
          className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-lg border z-50"
          style={{ borderColor: 'rgba(0,0,0,0.1)' }}
        >
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className="w-full text-left px-4 py-2.5 flex items-center gap-2 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg text-sm transition-colors"
              style={{
                color: language === lang.code ? '#CC0000' : '#5a5a5a',
              }}
            >
              <span>{lang.flag}</span>
              <span>{lang.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
