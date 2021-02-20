import type Observer from '../../Observer/index.Observer';
import type Router from '../../Router/index.Router';
import { APP_NAME } from '../../Constants/index.Constants';
import {
  createDropdown,
  createDropup,
  createLangDropdown,
  createElement,
  createLink,
} from '../../Utils/index.Utils';
import {
  HEADER_CN,
  HEADER_TITLE_CN,
  FOOTER_CN,
  MAIN_CN,
  HEADER_NAV_CN,
  HEADER_LANG_BTN_CN,
  HEADER_PAGES_BTN_CN,
  HEADER_PAGES_SPAN_CN,
  FOOTER_RS_LOGO_CN,
  FOOTER_YEAR_CN,
  FOOTER_AUTHORS_CN,
} from './constants.PageLayout';
import { LOGIN, RATING, MAIN, GAME } from '../../Constants/routes';
import { PRIMARY_TEXT_CLASS, WRAPPER_CLASS } from '../../Constants/classNames';
import '../../assets/images/rs_logo.svg';

const createPagesDropdown = (observer: Observer, router: Router) => {
  const {
    LOGOUT,
    PAGES,
    MAIN: mainTitle,
    RATING: ratingTitle,
    GAME: gameTitle,
  } = observer.getState().langData;
  const dropdownItems: Array<Element> = [];
  const itemsData = [
    { route: GAME, title: gameTitle },
    { route: RATING, title: ratingTitle },
    { route: MAIN, title: mainTitle },
    { route: LOGIN, title: LOGOUT },
  ];

  itemsData.forEach(({ route, title }) => {
    if (route === window.location.pathname) return;

    const dropdownItem = createLink(router, route, PRIMARY_TEXT_CLASS, title);

    dropdownItems.push(dropdownItem);
  });

  const pagesDropdownBtn = createElement(
    'div',
    [PRIMARY_TEXT_CLASS, HEADER_PAGES_BTN_CN],
    null,
    null,
    PAGES
  );

  const pagesDropdown = createDropdown(pagesDropdownBtn, dropdownItems);

  return pagesDropdown;
};

const createHeader = (observer: Observer, router: Router) => {
  const wrapper = createElement('div', WRAPPER_CLASS);

  const gameLink = createLink(
    router,
    GAME,
    HEADER_TITLE_CN,
    APP_NAME.toUpperCase()
  );
  wrapper.append(gameLink);

  const menuContainer = createElement('nav', HEADER_NAV_CN);

  const langDropdown = createLangDropdown(observer, HEADER_LANG_BTN_CN);
  menuContainer.append(langDropdown);

  const pagesDropdown = createPagesDropdown(observer, router);
  menuContainer.append(pagesDropdown);

  wrapper.append(menuContainer);

  const header = createElement('header', HEADER_CN);
  header.append(wrapper);

  return header;
};

const createAuthors = (observer: Observer) => {
  const { AUTHORS } = observer.getState().langData;

  const authorsBtn = createElement(
    'div',
    [PRIMARY_TEXT_CLASS, FOOTER_AUTHORS_CN],
    null,
    null,
    AUTHORS
  );

  const dosenk = <HTMLLinkElement>(
    createElement('a', PRIMARY_TEXT_CLASS, null, null, 'dosenk')
  );
  dosenk.href = 'https://github.com/dosenk/';
  const vladislavgribkov = <HTMLLinkElement>(
    createElement('a', PRIMARY_TEXT_CLASS, null, null, 'vladislavgribkov')
  );
  vladislavgribkov.href = 'https://github.com/vladislavgribkov';
  const krohnic = <HTMLLinkElement>(
    createElement('a', PRIMARY_TEXT_CLASS, null, null, 'KrohNic')
  );
  krohnic.href = 'https://github.com/KrohNic';

  const authorsMenu = createDropup(authorsBtn, [
    dosenk,
    vladislavgribkov,
    krohnic,
  ]);

  return authorsMenu;
};

const createFooter = (observer: Observer) => {
  const wrapper = createElement('div', WRAPPER_CLASS);

  const authorsMenu = createAuthors(observer);
  wrapper.append(authorsMenu);

  const year = createElement(
    'div',
    [PRIMARY_TEXT_CLASS, FOOTER_YEAR_CN],
    null,
    null,
    '2021'
  );
  wrapper.append(year);

  const rsLogo = <HTMLImageElement>createElement('img', FOOTER_RS_LOGO_CN);
  rsLogo.alt = 'Rolling Scopes';
  rsLogo.src = './rs_logo.svg';

  const rsLink = <HTMLLinkElement>createElement('a', null, null, [rsLogo]);
  rsLink.href = 'https://rs.school/';
  wrapper.append(rsLink);

  const footer = createElement('footer', FOOTER_CN);
  footer.append(wrapper);

  return footer;
};

const createLayout = (observer: Observer, router: Router) => {
  const header = createHeader(observer, router);
  const main = createElement('main', MAIN_CN);
  const footer = createFooter(observer);
  const wholeLayout = new DocumentFragment();

  wholeLayout.append(header, main, footer);

  return {
    wholeLayout,
    main,
  };
};

export default createLayout;
