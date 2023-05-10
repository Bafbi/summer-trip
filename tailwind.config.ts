import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      'body':['Verdana',' Geneva', 'Tahoma', 'sans-serif']
    },
    extend: {},
  },
  plugins: [],
} satisfies Config;
