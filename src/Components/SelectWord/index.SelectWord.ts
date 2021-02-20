import {
  PRIMARY_BTN_CLASS,
  PRIMARY_TEXT_CLASS,
} from '../../Constants/classNames';
import type Observer from '../../Observer/index.Observer';
import { createElement } from '../../Utils/index.Utils';
import {
  SELECT_CN,
  SELECT_BTN_CN,
  SELECT_CONTENT_CN,
  SELECT_TITLE_CN,
} from './constants';

const createWordBtn = (word: string) =>
  createElement('button', [PRIMARY_BTN_CLASS, SELECT_BTN_CN], null, null, word);

export default (
  parentElem: Element,
  observer: Observer,
  onWordSelectedCb: Function
) => {
  const { langData, wordsToSelect } = observer.getState();
  const btnList = wordsToSelect.map(createWordBtn);
  const container = createElement('div', SELECT_CN);
  const content = createElement('div', SELECT_CONTENT_CN);

  content.addEventListener('click', (event: MouseEvent) => {
    const elem = <HTMLElement>event.target;

    if (elem.tagName !== 'BUTTON') return;

    onWordSelectedCb(elem.textContent);
  });

  const { SELECT_A_WORD } = langData;
  const title = createElement(
    'h3',
    [PRIMARY_TEXT_CLASS, SELECT_TITLE_CN],
    null,
    null,
    SELECT_A_WORD
  );

  content.append(title, ...btnList);
  container.append(content);
  parentElem.append(container);
};
