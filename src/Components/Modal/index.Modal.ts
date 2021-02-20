import { createElement } from '../../Utils/index.Utils';
import { MODAL_BG_CN, MODAL_WINDOW_CN } from './constants.Modal';
import './styles.Modal.scss';

export default (
  parentElem: Element,
  content: Element | Array<Element>,
  closeListeners: Array<Function>
) => {
  const bg = createElement('div', MODAL_BG_CN);
  const window = createElement('div', MODAL_WINDOW_CN);
  const closeModal = () => {
    bg.remove();

    if (closeListeners.length > 0) {
      closeListeners.forEach((listener) => listener());
    }
  };

  bg.addEventListener('click', ({ target }) => {
    if (target === bg) closeModal();
  });

  if (content instanceof Array) {
    window.append(...content);
  } else {
    window.append(content);
  }

  bg.append(window);
  parentElem.append(bg);

  return closeModal;
};
