import type { Config } from 'tailwindcss'
// eslint-disable-next-line import/no-extraneous-dependencies
import typography from '@tailwindcss/typography'
// eslint-disable-next-line import/no-extraneous-dependencies
import forms from '@tailwindcss/forms'

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    container: () => ({
      center: true
    }),
    screens: {
      xs: '360px',
      sm: '640px',
      md: '768px',
      lg: '992px',
      xl: '1200px',
      '2xl': '1440px',
      '3xl': '1920px'
    }
  },
  plugins: [forms, typography]
} satisfies Config
