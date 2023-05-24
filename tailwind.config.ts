import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      textColor: {
        primary: "#E49A0A",
        secondary: "#fec85d",
      },
      colors: {
        primary: "#40534D",
        secondary: "#1E5552",
        tertiary: "#27a08e",
        accent: "#FABB09",
      },
    },
  },
  plugins: [],
} satisfies Config;
