/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // screens: { // <--- ADDED SCREENS BLOCK
      //   'xs': '475px', // Custom Extra Small Breakpoint
      //   // Standard Tailwind Breakpoints (Active by default, listed here for reference):
      //   'sm': '640px', 
      //   'md': '768px',
      //   'lg': '1024px',
      //   'xl': '1280px',
      //   '2xl': '1536px',
      // },
      width: {
        "w-90": "90%",
        "w-80": "80%",
      },
    },
  },
  plugins: [],
};
