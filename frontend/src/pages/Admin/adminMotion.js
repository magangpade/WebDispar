// Animate UI motion tokens (More / Expressive level for WebDispar Admin)
export const EASE = {
  out: [0.23, 1, 0.32, 1],
  soft: [0.215, 0.61, 0.355, 1],
  drawer: [0.32, 0.72, 0, 1],
  away: [0.33, 0.17, 0.67, 0.5],
  in: [0.4, 0, 1, 1],
  inOut: [0.77, 0, 0.175, 1],
};

export const SPRING = {
  press: { type: 'spring', stiffness: 550, damping: 30, restSpeed: 10 },
  pop: { type: 'spring', stiffness: 400, damping: 29 },
  dialog: { type: 'spring', stiffness: 150, damping: 25 },
  toast: { type: 'spring', stiffness: 280, damping: 24 },
  selection: { type: 'spring', stiffness: 300, damping: 30 },
  highlight: { type: 'spring', stiffness: 500, damping: 40 },
  entrance: { type: 'spring', stiffness: 220, damping: 22 },
  number: { type: 'spring', stiffness: 90, damping: 50 },
};

export const TRANSITION = {
  menu: { duration: 0.22, ease: EASE.soft },
  overlay: { duration: 0.36, ease: EASE.soft },
  reveal: { duration: 0.34, ease: EASE.out },
  swap: { duration: 0.15, ease: EASE.out },
  dismiss: { duration: 0.2, ease: EASE.away },
  drawer: { duration: 0.4, ease: EASE.drawer },
  drawerOut: { duration: 0.16, ease: EASE.in },
  sheet: { duration: 0.4, ease: EASE.soft },
};

export const SPRING_SHEET = {
  type: 'spring',
  stiffness: 360,
  damping: 32,
  mass: 0.9,
};

export const SCALE = {
  press: 0.97,
  choice: 0.985,
  popover: 0.85,
  dialog: 0.85,
  toast: 0.96,
  icon: 0.5,
};

export const BLUR = {
  icon: 'blur(2px)',
  surface: 'blur(4px)',
  none: 'blur(0px)',
};

export const getPageVariants = (reduce) => ({
  initial: reduce
    ? { opacity: 0 }
    : { opacity: 0, y: 18, filter: BLUR.surface },
  animate: reduce
    ? { opacity: 1 }
    : {
        opacity: 1,
        y: 0,
        filter: BLUR.none,
        transition: { duration: 0.38, ease: EASE.out },
      },
  exit: reduce
    ? { opacity: 0 }
    : {
        opacity: 0,
        y: -10,
        filter: BLUR.surface,
        transition: { duration: 0.18, ease: EASE.out },
      },
});

export const getStaggerContainer = (reduce, delay = 0.04) => ({
  hidden: {},
  show: {
    transition: reduce
      ? { staggerChildren: 0 }
      : { staggerChildren: 0.045, delayChildren: delay },
  },
});

export const getStaggerItem = (reduce) => ({
  hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.985 },
  show: reduce
    ? { opacity: 1, transition: { duration: 0.15 } }
    : {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: SPRING.entrance,
      },
});
