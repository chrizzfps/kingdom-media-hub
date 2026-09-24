import { Plus_Jakarta_Sans, Geist, Geist_Mono, Newsreader } from "next/font/google";

// Display / headings — geometric, premium, Apple-adjacent.
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

// Editorial serif accent — used sparingly for italic editorial warmth in headlines
const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  style: ["normal", "italic"],
});

// Body / UI — Vercel's Geist, closest web equivalent to SF Pro Text.
const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

// Mono — eyebrows, metrics, ROI calculator.
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const fontVariables = `${jakarta.variable} ${newsreader.variable} ${geist.variable} ${geistMono.variable}`;

