/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: 'var(--color-surface)',
        panel: 'var(--color-panel)',
        border: 'var(--color-border)',
        fg: 'var(--color-fg)',
        'fg-muted': 'var(--color-fg-muted)',
        'fg-subtle': 'var(--color-fg-subtle)',
        brand: {
          teal: '#198A77',
          'teal-dark': '#136B5C',
          'teal-light': '#E7F3F1',
          'teal-bright': '#2FBFA3',
          green: '#739E5B',
          yellow: '#F2B91B',
          'yellow-dark': '#D9A400',
          brown: '#57270F',
          orange: '#DF5B26',
          'orange-light': '#F19F1F',
        },
      },
    },
  },
  plugins: [],
}
