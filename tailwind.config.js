/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{html,js}"],
    theme: {
      colors: {
        transparent: 'transparent',
        current: 'currentColor',
        'ared':'#ff3b30',
        'aorange':'#ff9500',
        'ayellow':'#ffcc00',
        'agreen':'#34c759',
        'amint':'#00c7be',
        'ateal':'#30b0c7',
        'acyan':'#32ade6',
        'ablue':'#007aff',
        'aindigo':'#5856d6',
        'apurple':'#af52de',
        'apink':'#ff2d55',
      },
      extend: {},
    },
    daisyui: {
      themes: ["dim", "dark", "night"],
    },
    plugins: [require("daisyui")],
  }