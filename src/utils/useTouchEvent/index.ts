
interface TouchEventHandlerConfig {
  'touchstart': (e: TouchEvent) => any;
  'touchmove': (e: TouchEvent) => any;
  'touchend': (e: TouchEvent) => any;
}

// touch 事件
export const useTouchEvent = (el: HTMLElement, handlerConfig: TouchEventHandlerConfig) => {
  const { touchstart, touchmove, touchend } = handlerConfig;

  const onTouchStart = (e: TouchEvent) => {
    touchstart && touchstart(e)
  }

  const onTouchMove = (e: TouchEvent) => {
    touchmove && touchmove(e);
  }

  const onTouchEnd = (e: TouchEvent) => {
    touchend && touchend(e);
  }

  el.addEventListener('touchstart', onTouchStart, { passive: true });
  el.addEventListener('touchmove', onTouchMove, { passive: true })
  el.addEventListener('touchend', onTouchEnd, { passive: true });

  return () => {
    el.removeEventListener('touchstart', onTouchStart);
    el.removeEventListener('touchmove', onTouchMove);
    el.removeEventListener('touchend', onTouchEnd);
  }
}
