import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#40534D",
          100: "#ebebeb",
          200: "#d0d0d0",
          300: "#b5b5b5",
          400: "#7f7f7f",
          500: "#494949",
          600: "#424242",
          700: "#373737",
          800: "#2c2c2c",
          900: "#232323",
        },
        secondary: {
          50: "#1CCDB3",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
