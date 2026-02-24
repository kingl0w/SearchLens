import type { Config } from "tailwindcss";

//kept for compatibility with tools that read tailwind.config.ts
const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/hooks/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}",
  ],
};

export default config;
