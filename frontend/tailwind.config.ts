import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cvsu: {
          green: "#0E7444",
          dark: "#093C29",
          gold: "#F3B229",
          light: "#EBF7EE",
          vibrant: "#02E49B",
        },
      },
    },
  },
  plugins: [],
};

export default config;

