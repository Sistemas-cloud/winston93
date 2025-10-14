/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-poppins)', 'Poppins', 'system-ui', 'sans-serif'],
        poppins: ['var(--font-poppins)', 'Poppins', 'sans-serif'],
      },
      colors: {
        'winston-yellow': '#E3FB07',
        'winston-blue': '#013BDF',
        'winston-gray': '#909090',
        // Sobrescribir los colores de Tailwind con la paleta Winston
        blue: {
          50: '#e6eeff',
          100: '#b3c9ff',
          200: '#80a3ff',
          300: '#4d7eff',
          400: '#1a59ff',
          500: '#013BDF', // Color principal
          600: '#0132b9',
          700: '#012993',
          800: '#01206d',
          900: '#011747',
        },
        yellow: {
          50: '#fefff0',
          100: '#fcffd1',
          200: '#f9ffb2',
          300: '#f7ff93',
          400: '#f4ff74',
          500: '#E3FB07', // Color principal
          600: '#cce206',
          700: '#b5c905',
          800: '#9eb004',
          900: '#879703',
        },
        gray: {
          50: '#f9f9f9',
          100: '#f0f0f0',
          200: '#e0e0e0',
          300: '#d0d0d0',
          400: '#b0b0b0',
          500: '#909090', // Color principal
          600: '#707070',
          700: '#505050',
          800: '#303030',
          900: '#101010',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
} 