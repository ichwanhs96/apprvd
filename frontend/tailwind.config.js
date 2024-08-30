import { transform } from 'typescript'

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'primary': '#88df95',
        'secondary': '#01252c',
        'primary-gray': '#80ca8c',
        'tertiary': '#2c3b47'
      },
      animation: {
        marquee_left: 'marquee_left 20s linear infinite',
        marquee2_left: 'marquee2_left 20s linear infinite',
        marquee_right: 'marquee_right 20s linear infinite',
        marquee2_right: 'marquee2_right 20s linear infinite',
        marquee_slow: 'marquee_slow 30s linear infinite',
        typing: 'typing 2s steps(20) alternate, blink .7s infinite'
      },
      keyframes: {
        marquee_left: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        marquee2_left: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0%)' },
        },
        marquee_slow: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        marquee_right: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0%)' },
        },
        marquee2_right: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        typing: {
          "0%": {
            width: "0%",
            visibility: "hidden"
          },
          "100%": {
            width: "100%"
          }  
        },
      },
    },
  },
  plugins: [],
}

