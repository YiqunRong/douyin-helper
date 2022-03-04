import { isEnabled } from '../../base/functions/autoHideCursor';
import { querySelectorAll } from '../dom';

const NO_CURSOR_CLASS = 'douyinHelper_noCursorRoot';

export function start() {
  document.addEventListener('mousemove', event => {
    document.documentElement.classList.remove(NO_CURSOR_CLASS);
    autoHideCursor(event);
  }, true);
}

const autoHideCursor = debounce(async ({ clientX, clientY }: MouseEvent) => {
  if (!(await isEnabled())) {
    return;
  }
  const videos = Array.from(querySelectorAll(document, ['selectors', 'video']));
  for (const video of videos) {
    const { left, width, top, height } = video.getBoundingClientRect();
    if (
      clientX > left &&
      clientX < left + width &&
      clientY > top &&
      clientY < top + height
    ) {
      document.documentElement.classList.add(NO_CURSOR_CLASS);
      return;
    }
  }
}, 2000);

function debounce(fn: Function, timeout: number) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(null, args), timeout);
  };
}
