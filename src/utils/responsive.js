// Automatic Responsive Detection and Optimization

class ResponsiveHelper {
  constructor() {
    this.deviceType = this.detectDevice();
    this.orientation = this.detectOrientation();
    this.touchSupport = this.detectTouchSupport();
    
    this.applyDeviceClasses();
    this.setupEventListeners();
    this.optimizeForDevice();
  }

  detectDevice() {
    const width = window.innerWidth;
    const userAgent = navigator.userAgent.toLowerCase();
    
    // Device detection based on width and user agent
    if (width <= 480) {
      return 'mobile';
    } else if (width <= 768) {
      return 'tablet';
    } else if (width <= 1024) {
      return 'laptop';
    } else {
      return 'desktop';
    }
  }

  detectOrientation() {
    return window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
  }

  detectTouchSupport() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }

  applyDeviceClasses() {
    const body = document.body;
    
    // Remove existing device classes
    body.classList.remove('device-mobile', 'device-tablet', 'device-laptop', 'device-desktop');
    body.classList.remove('orientation-portrait', 'orientation-landscape');
    body.classList.remove('touch-enabled', 'touch-disabled');
    
    // Add current device classes
    body.classList.add(`device-${this.deviceType}`);
    body.classList.add(`orientation-${this.orientation}`);
    body.classList.add(this.touchSupport ? 'touch-enabled' : 'touch-disabled');
    
    // Add viewport size class
    body.classList.add(`viewport-${window.innerWidth <= 480 ? 'small' : window.innerWidth <= 768 ? 'medium' : window.innerWidth <= 1024 ? 'large' : 'xlarge'}`);
  }

  optimizeForDevice() {
    const root = document.documentElement;
    
    switch(this.deviceType) {
      case 'mobile':
        this.optimizeForMobile();
        break;
      case 'tablet':
        this.optimizeForTablet();
        break;
      case 'laptop':
        this.optimizeForLaptop();
        break;
      case 'desktop':
        this.optimizeForDesktop();
        break;
    }
  }

  optimizeForMobile() {
    // Mobile optimizations
    document.documentElement.style.setProperty('--font-scale', '0.9');
    document.documentElement.style.setProperty('--spacing-scale', '0.8');
    
    // Disable hover effects on touch devices
    if (this.touchSupport) {
      this.addTouchOptimizations();
    }
    
    // Optimize scrolling
    document.body.style.touchAction = 'pan-y';
    
    // Prevent zoom on input focus
    this.preventMobileZoom();
  }

  optimizeForTablet() {
    document.documentElement.style.setProperty('--font-scale', '0.95');
    document.documentElement.style.setProperty('--spacing-scale', '0.9');
    
    if (this.touchSupport) {
      this.addTouchOptimizations();
    }
  }

  optimizeForLaptop() {
    document.documentElement.style.setProperty('--font-scale', '1');
    document.documentElement.style.setProperty('--spacing-scale', '1');
  }

  optimizeForDesktop() {
    document.documentElement.style.setProperty('--font-scale', '1.05');
    document.documentElement.style.setProperty('--spacing-scale', '1.1');
    
    // Enable hover effects
    this.enableHoverEffects();
  }

  addTouchOptimizations() {
    // Add touch-specific CSS
    const style = document.createElement('style');
    style.textContent = `
      .touch-enabled * {
        -webkit-tap-highlight-color: transparent;
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        user-select: none;
      }
      
      .touch-enabled input, .touch-enabled textarea {
        -webkit-user-select: text;
        user-select: text;
      }
      
      .touch-enabled button, .touch-enabled a {
        cursor: pointer;
      }
      
      @media (hover: none) {
        .project-card:hover {
          transform: none !important;
        }
        
        .tech-tag:hover {
          transform: none !important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  enableHoverEffects() {
    // Enable hover effects for desktop
    const style = document.createElement('style');
    style.textContent = `
      .touch-disabled .project-card {
        transition: all 0.3s ease;
      }
      
      .touch-disabled .project-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
      }
      
      .touch-disabled .tech-tag {
        transition: all 0.2s ease;
      }
      
      .touch-disabled .tech-tag:hover {
        transform: scale(1.05);
      }
    `;
    document.head.appendChild(style);
  }

  preventMobileZoom() {
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
      input.addEventListener('focus', () => {
        document.querySelector('meta[name="viewport"]').setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0');
      });
      
      input.addEventListener('blur', () => {
        document.querySelector('meta[name="viewport"]').setAttribute('content', 'width=device-width, initial-scale=1.0');
      });
    });
  }

  setupEventListeners() {
    // Handle resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        this.deviceType = this.detectDevice();
        this.orientation = this.detectOrientation();
        this.applyDeviceClasses();
        this.optimizeForDevice();
      }, 250);
    });

    // Handle orientation change
    window.addEventListener('orientationchange', () => {
      setTimeout(() => {
        this.orientation = this.detectOrientation();
        this.applyDeviceClasses();
        this.optimizeForDevice();
      }, 100);
    });
  }

  getDeviceInfo() {
    return {
      deviceType: this.deviceType,
      orientation: this.orientation,
      touchSupport: this.touchSupport,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    };
  }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.responsiveHelper = new ResponsiveHelper();
  });
} else {
  window.responsiveHelper = new ResponsiveHelper();
}

export default ResponsiveHelper;
