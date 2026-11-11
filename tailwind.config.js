/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#1592A6',
          darkTeal: '#0D6C7C',
          deepTeal: '#084854',
          lightTeal: '#E8F6F8',
          subtle: '#F0F9FA',
        },
        maritime: {
          navy: '#122534',
          slate: '#5C7181',
          muted: '#92A4B2',
          card: '#FFFFFF',
          bg: '#F4F7F9',
        },
        status: {
          warningBg: '#FFF8E7',
          warningBorder: '#FFE6A8',
          warningText: '#926306',
          dangerBg: '#FFF2EC',
          dangerBorder: '#FFD7C7',
          dangerText: '#A8481F',
          successBg: '#E7F8F2',
          successBorder: '#B2EBD8',
          successText: '#0D7A5C',
          preparingBg: '#FFF5DC',
          preparingText: '#A06E00',
        },
      },
      borderRadius: {
        '2xl': '20px',
        '3xl': '24px',
        '4xl': '32px',
      },
    },
  },
  plugins: [],
};
