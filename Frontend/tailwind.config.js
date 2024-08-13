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
      screens: {
        'md-mobile' : '350px'
      },  
      fontFamily: {
        'Onest-Bold' : ['Onest-Bold', 'sans-serif'],
        'Onest-SemiBold' : ['Onest-SemiBold', 'sans-serif'],
        'Onest-Medium' : ['Onest-Medium', 'sans-serif'],
        'Onest-Regular' : ['Onest-Regular', 'sans-serif'],
        'Onest-Light' : ['Onest-Light', 'sans-serif'],
        'Onest-Thin' : ['Onest-Thin', 'sans-serif'],
      },
      backgroundImage: {
        "hero-bg" : "url(/src/assets/images/bg-hero.png)",
        "btn-bg" : "url(/src/assets/images/btnBg.png)"
      }
    },
  },
  plugins: [
    flowbite.plugin(),
    require('tailwind-scrollbar')
  ],
}