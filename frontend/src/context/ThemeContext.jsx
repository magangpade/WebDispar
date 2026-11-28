import { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';

const DEFAULT_THEME = {
  primary_color: '#1F5BA6',
  secondary_color: '#383087',
  accent_color: '#5C2180',
  highlight_color: '#f59e0b',
  nama_tema: 'Sulteng Biru Ungu',
  badge_icon: 'none',
  seasonal_badge: ''
};

const ThemeContext = createContext({
  theme: DEFAULT_THEME,
  loading: false,
  updateThemeState: () => {},
  fetchTheme: () => {}
});

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    try {
      const cached = localStorage.getItem('app_theme');
      return cached ? JSON.parse(cached) : DEFAULT_THEME;
    } catch {
      return DEFAULT_THEME;
    }
  });
  const [loading, setLoading] = useState(false);

  const applyCssVariables = (t) => {
    if (!t) return;
    const root = document.documentElement;
    const p = t.primary_color || '#1F5BA6';
    const s = t.secondary_color || '#383087';
    const a = t.accent_color || '#5C2180';
    const h = t.highlight_color || '#f59e0b';

    root.style.setProperty('--color-primary', p);
    root.style.setProperty('--color-secondary', s);
    root.style.setProperty('--color-accent', a);
    root.style.setProperty('--color-highlight', h);

    // Sync Admin Ruang CSS variables
    root.style.setProperty('--blue', p);
    root.style.setProperty('--purple', a);
    root.style.setProperty('--amber', h);
    root.style.setProperty('--grad', `linear-gradient(120deg, ${p} 0%, ${s} 55%, ${a} 100%)`);

    // Gradient Variasi
    root.style.setProperty('--theme-gradient', `linear-gradient(to right, ${p}, ${s}, ${a})`);
    root.style.setProperty('--theme-gradient-vertical', `linear-gradient(to bottom, ${a}, ${s}, ${p})`);
    root.style.setProperty('--theme-gradient-diagonal', `linear-gradient(135deg, ${p}, ${s}, ${a})`);
  };

  const fetchTheme = () => {
    setLoading(true);
    api.get('/tema')
      .then((res) => {
        if (res.data) {
          setTheme(res.data);
          localStorage.setItem('app_theme', JSON.stringify(res.data));
          applyCssVariables(res.data);
        }
      })
      .catch(() => {
        applyCssVariables(DEFAULT_THEME);
      })
      .finally(() => setLoading(false));
  };

  const updateThemeState = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('app_theme', JSON.stringify(newTheme));
    applyCssVariables(newTheme);
  };

  useEffect(() => {
    applyCssVariables(theme);
    fetchTheme();
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, loading, updateThemeState, fetchTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
