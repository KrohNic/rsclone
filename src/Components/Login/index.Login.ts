import Router from '../../Router/index.Router';
import { MAIN, REGISTRATION } from '../../Constants/routes';
import Observer from '../../Observer/index.Observer';
import {
  createElement,
  createInput,
  createLangDropdown,
} from '../../Utils/index.Utils';
import {
  FORM_CN,
  FORM_ITEM_CN,
  FORM_CONTAINER_CN,
  FORM_BTN_CN,
  FORM_TITLE_CN,
  FORM_TXT_CN,
} from './constants';
import {
  PRIMARY_LINK_CLASS,
  PRIMARY_TEXT_CLASS,
  PRIMARY_BTN_CLASS,
} from '../../Constants/classNames';
import Fetcher from '../../Fetcher/index.Fetcher';

export default class Login {
  private loginForm: HTMLElement = document.createElement('form');

  private parentElement: HTMLElement;

  private login: HTMLInputElement | undefined;

  private password: HTMLInputElement | undefined;

  private loginBtn: HTMLButtonElement | undefined;

  private loginText: HTMLElement | undefined;

  private router: Router;

  observer: Observer;

  constructor(parentElement: HTMLElement, observer: Observer, router: Router) {
    this.parentElement = parentElement;
    this.observer = observer;
    this.router = router;
  }

  public start() {
    this.render();
    this.listener();
  }

  private createRegBlock() {
    const {
      CREATE_AN_ACCOUNT,
      NEW_TO_GAME,
    } = this.observer.getState().langData;

    const regLink = <HTMLLinkElement>(
      createElement('a', PRIMARY_LINK_CLASS, null, null, CREATE_AN_ACCOUNT)
    );
    regLink.href = REGISTRATION;
    regLink.addEventListener('click', (e) => {
      e.preventDefault();

      this.router.goToPage(REGISTRATION);
    });

    const regSpan = createElement(
      'span',
      PRIMARY_TEXT_CLASS,
      null,
      null,
      NEW_TO_GAME
    );
    const regContainer = createElement('div', null, null, [regSpan, regLink]);

    return regContainer;
  }

  private createLoginBtn() {
    const { LOGIN } = this.observer.getState().langData;

    this.loginBtn = document.createElement('button');
    this.loginBtn.classList.add(PRIMARY_BTN_CLASS, FORM_BTN_CN);
    this.loginBtn.setAttribute('type', 'submit');
    this.loginBtn.textContent = LOGIN;

    return this.loginBtn;
  }

  private createInputs() {
    const { ENTER_LOGIN, ENTER_PASSWORD } = this.observer.getState().langData;

    this.login = createInput(
      ['login-input', FORM_ITEM_CN],
      'text',
      ENTER_LOGIN,
      'login',
      true
    );
    this.password = createInput(
      ['password', FORM_ITEM_CN],
      'password',
      ENTER_PASSWORD,
      'password',
      true
    );
  }

  private createErrorBlock(error: string) {
    this.loginText = createElement('div', FORM_TXT_CN, null, null, error);
    this.loginText.style.display = 'none';
  }

  public render() {
    const { LOGIN, LOGIN_ERROR } = this.observer.getState().langData;

    const title = createElement(
      'h1',
      FORM_TITLE_CN,
      null,
      null,
      LOGIN.toUpperCase()
    );

    this.loginForm.classList.add(FORM_CN);

    this.createInputs();
    this.loginBtn = this.createLoginBtn();
    this.createErrorBlock(LOGIN_ERROR);

    this.loginForm.append(
      title,
      this.login!,
      this.password!,
      this.loginText!,
      this.loginBtn
    );

    const langDropdown = createLangDropdown(this.observer);
    const regBlock = this.createRegBlock();
    const loginContainer = createElement('div', FORM_CONTAINER_CN);

    loginContainer.append(langDropdown, this.loginForm, regBlock);

    this.parentElement.append(loginContainer);
  }

  private listener() {
    this.loginBtn?.addEventListener('click', async (event: MouseEvent) => {
      event.preventDefault();

      if (!this.loginBtn) return;

      this.loginBtn.disabled = true;

      if (this.checkLoginAndPassword()) {
        const response = await this.setPost();

        this.checkResponse(response);
      }

      this.loginBtn.disabled = false;
    });
  }

  private async checkResponse(response: string) {
    if (response === 'good') {
      const name = this.login?.value;
      this.observer.actions.setName(name || '');
      const res = await Fetcher.get(`stats/stat?name=${name}`);
      this.observer.actions.setUserStats(res);
      this.router.goToPage(MAIN);
    } else {
      this.loginText!.style.display = 'flex';
    }
  }

  private checkLoginAndPassword() {
    const loginInput = this.login?.value.trim();
    const passwordInput = this.password?.value.trim();
    if (loginInput !== '' && passwordInput !== '') {
      return true;
    }
    return false;
  }

  private async setPost() {
    const body = JSON.stringify({
      login: this.login?.value,
      password: this.password?.value,
    });
    const response = await Fetcher.post('users/userPass', body);
    return response;
  }
}
