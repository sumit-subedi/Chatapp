/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  darkMode: 'class', 
  theme: {
    extend: {
      transitionProperty: {
        'colors-background': 'background-color, color',
      },
      transitionDuration: {
        600: '900ms',
      },
      transitionTimingFunction: {
        'in-out-smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  variants: {
    extend: {
      backgroundColor: ['dark'],
      textColor: ['dark'],
    },
  },
  plugins: [],
};

