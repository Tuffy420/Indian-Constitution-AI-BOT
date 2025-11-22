/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#000080", // Navy Blue (Ashoka Chakra)
                secondary: "#FF9933", // Saffron
                accent: "#138808", // India Green
                parchment: "#FDFBF7", // Paper background
                cream: "#FFFDD0",
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                serif: ['Playfair Display', 'serif'],
            },
            backgroundImage: {
                'chakra-pattern': "url('https://www.transparenttextures.com/patterns/cubes.png')", // Subtle texture placeholder
            }
        },
    },
    plugins: [],
}
