import type Observer from '../Observer/index.Observer';
import type Router from '../Router/index.Router';
import { APP_NAME } from '../Constants/index.Constants';
import { createElement, createLangDropdown } from '../Utils/index.Utils';
import { REGISTRATION, LOGIN } from '../Constants/routes';
import './styles/landing.scss';
import '../assets/images/crocodile.png';

const LANDING_CN = 'landing';

const createButtons = (router: Router, observer: Observer): Element => {
  const { LOGIN: LOGIN_LABEL, SIGN_UP } = observer.getState().langData;

  const loginBtn = createElement('button', [
    'primary_btn',
    `${LANDING_CN}--btn`,
  ]);
  loginBtn.textContent = LOGIN_LABEL;
  loginBtn.addEventListener('click', () => router.goToPage(LOGIN));

  const regBtn = createElement('button', ['primary_btn', `${LANDING_CN}--btn`]);
  regBtn.textContent = SIGN_UP;
  regBtn.addEventListener('click', () => router.goToPage(REGISTRATION));

  const buttons = createElement('div', [`${LANDING_CN}--buttons`], null, [
    loginBtn,
    regBtn,
  ]);

  return buttons;
};

export default (
  parent: HTMLElement,
  observer: Observer,
  router: Router
): void => {
  const { ONLINE_GAME_TEXT, LOGIN_OR_REG } = observer.getState().langData;

  const h1 = createElement('h1', [`${LANDING_CN}--title`]);
  h1.textContent = APP_NAME.toUpperCase();

  const text1 = createElement('p', [`${LANDING_CN}--text`]);
  text1.textContent = ONLINE_GAME_TEXT;
  const text2 = createElement('p', [`${LANDING_CN}--text`]);
  text2.textContent = LOGIN_OR_REG;

  const buttons = createButtons(router, observer);
  const langDropdown = createLangDropdown(observer, `${LANDING_CN}--lang_btn`);

  const column = createElement('div', [`${LANDING_CN}--column`], null, [
    text1,
    text2,
    buttons,
    langDropdown,
  ]);

  const img = createElement('div', `${LANDING_CN}--img`);

  const content = createElement('div', [`${LANDING_CN}--content`], null, [
    column,
    img,
  ]);
  const body = createElement('div', [`${LANDING_CN}--body`], null, [
    h1,
    content,
  ]);

  const container = createElement('div', [LANDING_CN], null, [body]);

  parent.append(container);
};
