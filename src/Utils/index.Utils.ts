import type Router from '../Router/index.Router';
import type Observer from '../Observer/index.Observer';
import {
  DROPDOWN_CN,
  DROPDOWN_ITEM_CN,
  DROPDOWN_MENU_CN,
  DROPDOWN_BTN_CN,
  DROPUP_MENU_CN,
  DROPDOWN_LANG_BTN_CN,
  DROPDOWN_LANG_ITEM_CN,
  DROPDOWN_LANG_ICO_CN,
  PRIMARY_TEXT_CLASS,
} from '../Constants/classNames';
import languages from '../langDictionaries/index.langDictionaries';

export const createElement = (
  tag: string,
  className?: string | Array<string> | null,
  parent?: Element | null,
  childsList?: Array<Node> | Array<Element> | null,
  textContent?: string | null
): HTMLElement => {
  const elem = document.createElement(tag);

  if (typeof className === 'string') {
    elem.classList.add(className);
  } else if (className instanceof Array) {
    elem.classList.add(...className);
  }

  if (textContent) elem.textContent = textContent;

  if (childsList) elem.append(...childsList);

  if (parent) parent.append(elem);

  return elem;
};

export const createInput = (
  className?: string | Array<string>,
  type = 'text',
  placeholder = '',
  name = '',
  required = false
): HTMLInputElement => {
  const input = <HTMLInputElement>createElement('input', className);

  input.setAttribute('type', type);
  input.setAttribute('placeholder', placeholder);
  input.setAttribute('name', name);
  input.required = required;
  return input;
};

export const createLink = (
  router: Router,
  route: string,
  cssClass?: string | Array<string> | null,
  text: string = route
) => {
  const a = <HTMLAnchorElement>createElement('a', cssClass, null, null, text);

  a.href = route;
  a.addEventListener('click', (e) => {
    e.preventDefault();

    router.goToPage(route);
  });

  return a;
};

export const createDropdown = (dropdownBtn: Element, items: Array<Element>) => {
  dropdownBtn.classList.add(...DROPDOWN_BTN_CN);

  const dropdownMenu = createElement('div', DROPDOWN_MENU_CN);
  items.forEach((item) => {
    item.classList.add(DROPDOWN_ITEM_CN);
    dropdownMenu.append(item);
  });

  const dropdown = createElement('div', DROPDOWN_CN);
  dropdown.append(dropdownBtn, dropdownMenu);

  return dropdown;
};

export const createDropup = (dropupBtn: Element, items: Array<Element>) => {
  const dropup = createDropdown(dropupBtn, items);
  const menu = dropup.querySelector(`.${DROPDOWN_MENU_CN}`);

  menu?.classList.remove(DROPDOWN_MENU_CN);
  menu?.classList.add(DROPUP_MENU_CN);

  return dropup;
};

const createLangItems = (currentLang: Object, observer: Observer) => {
  const langList = Object.values(languages);
  const dropdownItems: Array<Element> = [];

  langList.forEach((langDict) => {
    const { lang, flag } = langDict;
    if (lang === currentLang) return;

    const ico = <HTMLImageElement>createElement('img', DROPDOWN_LANG_ICO_CN);
    ico.alt = lang;
    ico.src = flag;

    const dropdownItem = createElement(
      'div',
      [PRIMARY_TEXT_CLASS, DROPDOWN_LANG_ITEM_CN],
      null,
      [ico],
      lang
    );

    dropdownItem.addEventListener('click', () => {
      observer.actions.setLang(langDict);
    });

    dropdownItems.push(dropdownItem);
  });

  return dropdownItems;
};

export const createLangDropdown = (
  observer: Observer,
  btnClassName: string = PRIMARY_TEXT_CLASS
) => {
  const { lang: currentLang, flag: currentFlag } = observer.getState().langData;

  const currentIco = <HTMLImageElement>(
    createElement('img', DROPDOWN_LANG_ICO_CN)
  );
  currentIco.alt = currentLang;
  currentIco.src = currentFlag;

  const dropdownBtn = createElement(
    'div',
    [PRIMARY_TEXT_CLASS, btnClassName, DROPDOWN_LANG_BTN_CN],
    null,
    [currentIco],
    currentLang
  );

  const dropdownItems: Array<Element> = createLangItems(currentLang, observer);
  const dropdown = createDropdown(dropdownBtn, dropdownItems);

  return dropdown;
};
