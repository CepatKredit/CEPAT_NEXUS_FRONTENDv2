/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      'xs1': '320px',      // Extra small devices (phones)
      'xs2': '360px',      // Extra small devices (phones)
      'xs': '390px',      // Extra small devices (phones)
      'sm': '640px',      // Small devices (tablets)
      'md': '740px',      // Medium devices (small laptops)
      'lg': '1024px',     // Large devices (laptops/desktops)
      'xl': '1280px',     // Extra large devices (large desktops)
      '2xl': '1536px',    // Dev Laptop
      '3xl': '1920px',    // large Dev Monitor
      '4xl': '2160px',    
      '5xl': '2560px',    
    },
    extend: {
    },
  },
  plugins: [],
}