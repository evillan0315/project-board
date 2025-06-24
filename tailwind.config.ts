extend: {
  animation: {
    'loading-bar': 'loadingBar 1.5s infinite linear',
    shadowPulse: 'shadowPulse 2s ease-in-out infinite',
    shadowGradient: 'shadowGradient 2s ease-in-out infinite',
  },
  keyframes: {
    loadingBar: {
      '0%': { transform: 'translateX(-100%)' },
      '100%': { transform: 'translateX(100%)' },
    },
  },
  
}

