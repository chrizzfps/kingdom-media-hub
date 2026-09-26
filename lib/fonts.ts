import { Inter, Playfair_Display } from "next/font/google";

// Display + body — Inter, weight does the work (extrabold headlines, regular body).
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

// Serif accent — used only where explicitly called for (quotes, specific headlines).
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
});

export const fontVariables = `${inter.variable} ${playfair.variable}`;
