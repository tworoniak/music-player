/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        background: '#111d13',
        surface: '#8fb996',
        card: '#18181D',
        border: '#22222A',

        playerBackground: '#030504',

        text: '#F5F5F5',
        muted: '#C9C9D1',
        subtle: '#8B8B95',
        faint: '#5A5A63',

        accent: '#709775', // Green Serenity
        accent2: '#a1cca5', // Electric Blue

        matteBlack: '#212738',
        eggplant: '#42313b',
        taupe: '#595149',
        slateGray: '#6b7893',
        lavender: '#eaeafc',

        // Monochromatic
        whiteSmoke: '#f5f5f5ff',
        silver: '#bdbdbdff',
        graphite: '#3a3a3aff',
        graphite2: '#2b2b2bff',
        carbonBlack: '#1a1a1aff',
      },
      fontFamily: {
        sans: ['Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
