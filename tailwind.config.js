/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}', './node_modules/flowbite/**/*.js'],
  theme: {
    extend: {
      height: {
        '80vh': '80vh',
      },
      padding: {
        '10vw': '10vw',
      }
    },
  },
  plugins: ['flowbite/plugin'],
}
