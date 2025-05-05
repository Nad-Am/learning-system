/** @type {import('tailwindcss').Config} */
export default{
    content: ["./src/**/*.{html,js,vue}"],
    theme: {
      extend: {
        backgroundImage:{
          cardBg:"linear-gradient(45deg,rgba(252, 237, 237, 0.8),rgba(241, 138, 138, 0.5))",
          cardBg2:"linear-gradient(145deg,rgba(72, 160, 207,0.1),rgb(242, 244, 245,0.6))",
          cardBg3:"linear-gradient(145deg,rgba(238, 113, 91,1),rgb(242, 244, 245,1))",
        },
      },
    },
    plugins: [],
    variants: {
      // 确保 hover 变体被包含
      opacity: ['responsive', 'hover', 'focus'],
    },
  }