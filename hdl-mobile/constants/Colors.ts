const tintColorLight = '#728c69';
const tintColorDark = '#cba135';

export const earthPalette = {
  light: '#fbf9f6',
  sage: '#728c69',
  forest: '#3f5936',
  gold: '#cba135',
  terra: '#cc6633',
  whatsapp: '#25D366'
};

export default {
  light: {
    text: '#3f5936', 
    background: earthPalette.light,
    tint: tintColorLight,
    tabIconDefault: '#a0aab2',
    tabIconSelected: tintColorLight,
    card: '#fff',
    border: '#e1e5e8'
  },
  dark: {
    text: '#fbf9f6',
    background: '#1a2416',
    tint: tintColorDark,
    tabIconDefault: '#5f6f65',
    tabIconSelected: tintColorDark,
    card: '#2c3a25',
    border: '#3f5936'
  },
};
