import type Router from '../../Router/index.Router';
import type Observer from '../../Observer/index.Observer';
import { LANDING, LOGIN } from '../../Constants/routes';
import {
  createElement,
  createInput,
  createLangDropdown,
} from '../../Utils/index.Utils';
import {
  REG_FORM_CN,
  REG_ITEM_CN,
  REG_CONTAINER_CN,
  REG_BTN_CN,
  REG_TEXT_CN,
  REG_GENDER_CN,
  REG_TITLE_CN,
} from './constants';
import {
  PRIMARY_BTN_CLASS,
  PRIMARY_LINK_CLASS,
  PRIMARY_TEXT_CLASS,
} from '../../Constants/classNames';
import Fetcher from '../../Fetcher/index.Fetcher';

export default class Registration {
  private registration: HTMLFormElement | undefined;

  private readonly parentElement: HTMLElement;

  private login: HTMLInputElement | undefined;

  private password: HTMLInputElement | undefined;

  private passwordRepeat: HTMLInputElement | undefined;

  private registrationBtn: HTMLButtonElement | undefined;

  private regErrorElem: HTMLElement | undefined;

  private man: HTMLInputElement | undefined;

  private women: HTMLInputElement | undefined;

  private readonly router: Router;

  private readonly observer: Observer;

  constructor(parentElement: HTMLElement, router: Router, observer: Observer) {
    this.parentElement = parentElement;
    this.router = router;
    this.observer = observer;
  }

  public start() {
    this.render();
    this.listener();
  }

  private createInputs() {
    const fragment = new DocumentFragment();

    const {
      ENTER_LOGIN,
      ENTER_PASSWORD,
      REPEAT_PASSWORD,
    } = this.observer.getState().langData;

    this.login = createInput(
      ['login', REG_ITEM_CN],
      'text',
      ENTER_LOGIN,
      'login',
      true
    );
    fragment.append(this.login);

    this.password = createInput(
      ['password', REG_ITEM_CN],
      'password',
      ENTER_PASSWORD,
      'password',
      true
    );
    fragment.append(this.password);

    this.passwordRepeat = createInput(
      ['password', REG_ITEM_CN],
      'password',
      REPEAT_PASSWORD,
      'password-repeat',
      true
    );
    fragment.append(this.passwordRepeat);
    this.appendGenderBlock(fragment);
    return fragment;
  }

  private appendGenderBlock(fragment: DocumentFragment) {
    const genderArray = this.observer.getState().langData.GENDER.split('/');
    const genderBlock = createElement(
      'div',
      ['gender', REG_GENDER_CN],
      null,
      null,
      null
    );
    fragment.append(genderBlock);
    const labelForMan = createElement(
      'label',
      null,
      genderBlock,
      null,
      genderArray[0]
    );
    this.man = createInput('man', 'radio', '', 'gender', true);
    this.man.checked = true;
    labelForMan.append(this.man);

    this.women = createInput('women', 'radio', '', 'gender', false);
    this.women.checked = false;
    const labelForWoman = createElement(
      'label',
      null,
      genderBlock,
      null,
      genderArray[1]
    );
    labelForWoman.append(this.women);
  }

  private checkedGender() {
    return this.man?.checked ? 'male' : 'female';
  }

  private createLoginBlock() {
    const {
      ALREADY_HAVE_AN_ACCOUNT,
      SIGN_IN,
    } = this.observer.getState().langData;

    const regLink = <HTMLLinkElement>(
      createElement('a', PRIMARY_LINK_CLASS, null, null, SIGN_IN)
    );
    regLink.href = LOGIN;
    regLink.addEventListener('click', (e) => {
      e.preventDefault();

      this.router.goToPage(LOGIN);
    });

    const regSpan = createElement(
      'span',
      PRIMARY_TEXT_CLASS,
      null,
      null,
      ALREADY_HAVE_AN_ACCOUNT
    );
    const container = createElement('div', null, null, [regSpan, regLink]);

    return container;
  }

  private render() {
    const { REGISTER, REGISTRATION } = this.observer.getState().langData;

    const title = createElement(
      'h1',
      REG_TITLE_CN,
      null,
      null,
      REGISTRATION.toUpperCase()
    );

    const inputs = this.createInputs();

    this.regErrorElem = createElement('h1', REG_TEXT_CN);

    this.registrationBtn = <HTMLButtonElement>document.createElement('button');
    this.registrationBtn.classList.add(PRIMARY_BTN_CLASS, REG_BTN_CN);
    this.registrationBtn.setAttribute('type', 'submit');
    this.registrationBtn.textContent = REGISTER;

    this.registration = <HTMLFormElement>createElement('form', REG_FORM_CN);
    this.registration.append(
      title,
      inputs,
      this.regErrorElem,
      this.registrationBtn
    );

    const registrationContainer = createElement('div', REG_CONTAINER_CN);
    const loginBlock = this.createLoginBlock();

    const langDropdown = createLangDropdown(this.observer);

    registrationContainer.append(langDropdown, this.registration, loginBlock);
    this.parentElement.append(registrationContainer);
  }

  private listener() {
    if (!this.registrationBtn) return;

    const { PASSWORDS_NOT_EQUAL } = this.observer.getState().langData;

    this.registrationBtn.addEventListener('click', async (event) => {
      event.preventDefault();

      if (!this.registrationBtn) return;

      this.registrationBtn.disabled = true;

      if (this.checkPassword()) {
        const response = await this.setPost();
        this.checkResponse(response);
      } else if (this.regErrorElem) {
        this.regErrorElem.textContent = PASSWORDS_NOT_EQUAL;
      }

      this.registrationBtn.disabled = false;
    });
  }

  private checkResponse(response: string) {
    if (!this.regErrorElem) return;

    const { SUCCESS, LOGIN_EXISTS, ERROR } = this.observer.getState().langData;

    if (response === 'success') {
      this.regErrorElem.textContent = SUCCESS;
      this.goToLandingPage();
    } else if (response === 'login_exists') {
      this.regErrorElem.textContent = LOGIN_EXISTS;
    } else {
      this.regErrorElem.textContent = ERROR;
    }
  }

  private goToLandingPage() {
    setTimeout(() => {
      this.router.goToPage(LANDING);
    }, 1000);
  }

  private async setPost() {
    const sex = this.checkedGender();
    const body = JSON.stringify({
      login: this.login?.value,
      password: this.password?.value,
      sex,
    });
    const response = await Fetcher.post('users/user', body);
    return response;
  }

  private checkPassword() {
    const password1 = this.password?.value;
    const password2 = this.passwordRepeat?.value;
    if (password1 === password2) {
      return password1;
    }
    return false;
  }
}
