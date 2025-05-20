const Colors = {
  // Main theme colors
  primary: {
    100: '#E6EEF5', // Lightest navy tint
    200: '#C7D8E8',
    300: '#A4C1D7',
    400: '#6A98C0',
    500: '#3D6A9C', // Medium navy
    600: '#2A5580',
    700: '#1A406A', // Primary navy
    800: '#132F52',
    900: '#0A1F3A',
  },
   // Sekundära färger - kompletterar primärfärgerna
   secondary: {
    50: '#F5FAFF',
    100: '#E8F4FF',
    200: '#D1E9FF',
    300: '#A7D6FF',
    400: '#7CC2FF',
    500: '#3AA0FF', // Ljus havsblå
    600: '#2E81CC',
    700: '#1D5C9F',
    800: '#143F6F',
    900: '#0E2C4E',
  },
  
  // Accent färger - mer distinkt och kompletterande till marintemat
  accent: {
    50: '#FFF9EB',
    100: '#FFF3D6',
    200: '#FFE7AD',
    300: '#FFD773',
    400: '#FFCA45',
    500: '#FFBC1F', // Mer vibrerande gul-guld för bättre synlighet
    600: '#E6A500',
    700: '#B38000',
    800: '#805C00',
    900: '#664700',
  },
  
  // Status färger - tydligare och mer moderna
  status: {
    success: '#34C759', // Apple-grön - mer vibrerande
    warning: '#FF9500', // Apple-orange
    error: '#FF3B30',   // Apple-röd - mer synlig
    info: '#3AA0FF',    // Ljusare blå för information
    pending: '#5856D6',  // Lila för väntande åtgärder
  },
  
  // Priority colors - mer intuitiva och distinkta
  priority: {
    critical: '#FF3B30', // Tydlig röd för kritisk
    high: '#FF9500',     // Orange för hög
    medium: '#FFCC00',   // Gul för medium
    low: '#34C759',      // Grön för låg
  },
  
  // Neutral tones - mer blåaktiga för att passa marintemat
  neutral: {
    50: '#F7FAFD',
    100: '#EEF4F9',
    200: '#DCE7F0',
    300: '#C5D4E0',
    400: '#A3B8C9',
    500: '#7D97AD', // Mer blågrå för sekundär text
    600: '#5C738C',
    700: '#435669',
    800: '#2D3A48',
    900: '#1A222C',
  },
  
  // Water colors - mer levande och dynamiska vattenfärger
  water: {
    lightest: '#F0F7FF', // Mycket ljust vatten
    light: '#C3DFFC',    // Ljust vatten
    medium: '#68A7EA',   // Mellanblått vatten
    deep: '#1E4DA1',     // Djupt vatten
    dark: '#0C2548',     // Mycket djupt vatten
  },
  
  // Gradients för marina element
  gradients: {
    waterSurface: ['#3AA0FF', '#1E4DA1'],
    sunset: ['#FF9500', '#FF3B30'],
    morning: ['#F0F7FF', '#98C7F5'],
  },
  
  // Övriga färger
  background: '#FFFFFF',               // Vit bakgrund
  card: 'rgba(255, 255, 255, 0.95)',   // Något mer ogenomskinlig
  text: '#1A222C',                     // Mörkare text för bättre läsbarhet
  border: '#DCE7F0',                   // Mer synlig gräns
  shadow: 'rgba(12, 37, 72, 0.08)',    // Marinblå skugga
};

export default Colors;