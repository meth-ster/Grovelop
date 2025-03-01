import { Dimensions } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Grovelop Design System - Layout & Spacing
export const Layout = {
  // Screen Dimensions
  screen: {
    width: screenWidth,
    height: screenHeight,
  },
  
  // Spacing System (8pt grid)
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    '2xl': 48,
    '3xl': 64,
  },
  
  // Border Radius
  borderRadius: {
    none: 0,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    '2xl': 24,
    full: 9999,
  },
  
  // Touch Targets (Minimum recommended sizes)
  touchTarget: {
    small: 44,
    medium: 48,
    large: 56,
  },
  
  // Container Widths
  container: {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
  },
  
  // Header Heights
  header: {
    default: 56,
    large: 64,
  },
  
  // Tab Bar Height
  tabBar: {
    default: 80,
  },
  
  // Common Breakpoints
  breakpoints: {
    phone: 0,
    tablet: 768,
    desktop: 1024,
  },
  
  // Z-Index Layers
  zIndex: {
    base: 0,
    overlay: 10,
    modal: 20,
    popover: 30,
    tooltip: 40,
    alert: 50,
  },
};

export default Layout;