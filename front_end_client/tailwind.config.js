/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#eb3e32",
        tabs: "#ed4e2e",
        gray1: "#323c42",
        gray2: "#9e9e9e",
        gray3: "#ebebeb",
        footer: "#24272e",
        tfooter: "#8b8e96",
        green_btn: "#33b530",
        yellow_btn: "#ffb416",
        red: "#ff0000",
        price:"#dd2f2c"
      },
      scale: {
        '110': '1.1',
      }
    },
  },
  plugins: [],
}

