// Simple CSS-based page transitions without external dependencies
let isTransitioning = false;

export function initPageTransitions() {
  if (typeof window === 'undefined') {
    return null;
  }

  // Add CSS transitions for smooth page changes
  const style = document.createElement('style');
  style.textContent = `
    .page-transition {
      opacity: 1;
      transform: translateY(0);
      transition: opacity 0.3s ease-out, transform 0.3s ease-out;
    }
    
    .page-transition-exit {
      opacity: 0;
      transform: translateY(-20px);
    }
    
    .page-transition-enter {
      opacity: 0;
      transform: translateY(20px);
    }
  `;
  document.head.appendChild(style);

  // Add transition effect to main content
  const main = document.querySelector('main');
  if (main) {
    main.classList.add('page-transition');
  }

  return true;
}

export function triggerPageTransition(callback?: () => void) {
  if (isTransitioning) return;
  
  isTransitioning = true;
  const main = document.querySelector('main');
  
  if (main) {
    main.classList.add('page-transition-exit');
    
    setTimeout(() => {
      callback?.();
      main.classList.remove('page-transition-exit');
      main.classList.add('page-transition-enter');
      
      setTimeout(() => {
        main.classList.remove('page-transition-enter');
        isTransitioning = false;
      }, 50);
    }, 300);
  } else {
    callback?.();
    isTransitioning = false;
  }
}

export function destroyPageTransitions() {
  if (swupInstance) {
    swupInstance.destroy();
    swupInstance = null;
  }
}

export function getSwupInstance() {
  return swupInstance;
}