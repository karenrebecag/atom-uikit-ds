// Burger Icon (Burger ↔ X) Animation
// DOM contract: [data-menu-button-animate] on button (IconButton)
// Children: 3x .burger-icon__line inside .burger-icon
// State: data-menu-button="burger" | "close"
//
// Requires: gsap, CustomEase (global)

type CleanupFn = () => void;

declare const gsap: any;
declare const CustomEase: any;

export function initMenuButton(): CleanupFn {
  if (typeof gsap === 'undefined' || typeof CustomEase === 'undefined') {
    return () => {};
  }

  gsap.registerPlugin(CustomEase);
  CustomEase.create('menu-button-ease', '0.5, 0.05, 0.05, 0.99');

  const buttons = document.querySelectorAll<HTMLElement>('[data-menu-button-animate]');
  const cleanups: CleanupFn[] = [];

  buttons.forEach((button) => {
    const lines = button.querySelectorAll<HTMLElement>('.burger-icon__line');
    if (lines.length < 3) return;

    const [line1, line2, line3] = Array.from(lines);

    let tl = gsap.timeline({
      defaults: {
        overwrite: 'auto',
        ease: 'menu-button-ease',
        duration: 0.3,
      },
    });

    const menuOpen = () => {
      tl.clear()
        .to(line2, { scaleX: 0, opacity: 0 })
        .to(line1, { x: '-1.3em', opacity: 0 }, '<')
        .to(line3, { x: '1.3em', opacity: 0 }, '<')
        .to([line1, line3], { opacity: 0, duration: 0.1 }, '<+=0.2')
        .set(line1, { rotate: -135, y: '-1.3em', scaleX: 0.9 })
        .set(line3, { rotate: 135, y: '-1.4em', scaleX: 0.9 })
        .to(line1, { opacity: 1, x: '0em', y: '0.5em' })
        .to(line3, { opacity: 1, x: '0em', y: '-0.25em' }, '<+=0.1');
    };

    const menuClose = () => {
      tl.clear()
        .to([line1, line2, line3], {
          scaleX: 1,
          rotate: 0,
          x: '0em',
          y: '0em',
          opacity: 1,
          duration: 0.45,
          overwrite: 'auto',
        });
    };

    const handleClick = () => {
      const state = button.getAttribute('data-menu-button') || 'burger';
      if (state === 'burger') {
        menuOpen();
        button.setAttribute('data-menu-button', 'close');
      } else {
        menuClose();
        button.setAttribute('data-menu-button', 'burger');
      }
    };

    button.addEventListener('click', handleClick);

    cleanups.push(() => {
      button.removeEventListener('click', handleClick);
      tl.kill();
      gsap.set([line1, line2, line3], {
        clearProps: 'all',
      });
    });
  });

  return () => cleanups.forEach((fn) => fn());
}
