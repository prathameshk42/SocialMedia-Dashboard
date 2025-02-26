/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    theme: {
        extend: {
            colors: {
                emerald: '#025F4C',
                primary: '#595959',
                fillGreen: '#BCDD33',
                fillGrey: '#2D3748',
                divider: '#CBD6D3',
                errorBg: '#FAECEB',
                errorText: '#FF8080',
                hoverEmerald: '#C0D7D2',
                surface: '#F8F9FA',
                disabled: '#EEEEEE',
                turquoise: '#36D6C3',
                yellow: '#FDD506'
            }
        }
    },
    plugins: []
};
