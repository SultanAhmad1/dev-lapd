/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}', // Note the addition of the `app` directory.
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
 
    // Or if using `src` directory:
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],

  theme: {
    extend: {
      animation: {
        smoke: 'smoke 1.5s ease-out infinite',
        smoke2: 'smoke 2.2s ease-out infinite',
      },
     keyframes: {
        smoke: {
          '0%': { opacity: 0.7, transform: 'translateX(0) scale(1)' },
          '100%': { opacity: 0, transform: 'translateX(-20px) scale(1.5)' },
        },
        smoke2: {
          '0%': { opacity: 0.6, transform: 'translateX(0) scale(1)' },
          '100%': { opacity: 0, transform: 'translateX(-15px) scale(1.3)' },
        },
      },
    },
  },

  plugins: [require('@tailwindcss/typography')],
}
