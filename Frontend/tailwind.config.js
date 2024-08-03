const flowbite = require("flowbite-react/tailwind");

/** @type {import('tailwindcss').Config} */

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    flowbite.content()
  ],
  theme: {
    extend: {
      fontFamily: {
        'Onest-Bold' : ['Onest-Bold', 'sans-serif'],
        'Onest-SemiBold' : ['Onest-SemiBold', 'sans-serif'],
        'Onest-Medium' : ['Onest-Medium', 'sans-serif'],
        'Onest-Regular' : ['Onest-Regular', 'sans-serif'],
        'Onest-Light' : ['Onest-Light', 'sans-serif'],
        'Onest-Thin' : ['Onest-Thin', 'sans-serif'],
      }
    },
  },
  plugins: [
    flowbite.plugin(),
    require('tailwind-scrollbar')
  ],
}