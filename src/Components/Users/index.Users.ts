import type Observer from '../../Observer/index.Observer';
import { createElement } from '../../Utils/index.Utils';
import {
  USERS_CLASS,
  USERS_WRAPPER_CLASS,
  PAINTER_CLASS,
  USER_PAINTER_CLASS,
  PAINTER_AVATAR_CLASS,
  PAINTER_INFO_CLASS,
  PAINTER_NICKNAME_CLASS,
  GUESSER_CLASS,
  USER_GUESSER_CLASS,
  GUESSER_INFO_CLASS,
  GUESSER_AVATAR_CLASS,
  GUESSER_NICKNAME_CLASS,
} from '../../Constants/classNames';
import IState from '../../Observer/Interfaces/IState';
import IGuessers from './Interfaces/IGuessers';
import IPainter from './Interfaces/IPainter';

export default class Users {
  observer: Observer;

  parentElement: HTMLElement;

  guessers!: Array<IGuessers>;

  painter!: IPainter;

  painterBlock!: Element;

  guesserBlock!: Element;

  userBlock: HTMLElement | undefined;

  constructor(parentElement: HTMLElement, observer: Observer) {
    this.parentElement = parentElement;
    this.observer = observer;
  }

  public displayUsers(parentElement: HTMLElement = this.parentElement) {
    this.userBlock = this.createUsersBlock();
    this.renderUsers(this.guessers, this.painter);
    parentElement.append(this.userBlock);
  }

  setUsers(state: IState) {
    const newGuessers = state.users.guessers;
    const newPainter = state.users.painter;
    this.painter = newPainter;
    this.guessers = newGuessers;

    if (this.userBlock) this.renderUsers(newGuessers, newPainter);
  }

  static removeUsers(...usersParams: any) {
    usersParams.forEach((param: any[]) => {
      if (param[0])
        param[0]
          .querySelectorAll(`.${param[1]}`)
          .forEach((node: { remove: () => any }) => node.remove());
    });
  }

  renderUsers(guessers: Array<IGuessers>, painter: IPainter) {
    if (!painter && !guessers) return;
    Users.removeUsers(
      [this.guesserBlock, USER_GUESSER_CLASS],
      [this.painterBlock, USER_PAINTER_CLASS]
    );
    const guesserClasses = {
      main: USER_GUESSER_CLASS,
      avatar: GUESSER_AVATAR_CLASS,
      nickName: GUESSER_NICKNAME_CLASS,
    };
    const painterClasses = {
      main: USER_PAINTER_CLASS,
      avatar: PAINTER_AVATAR_CLASS,
      nickName: PAINTER_NICKNAME_CLASS,
    };
    this.createUser(painter.name, painterClasses, true);
    guessers.forEach((guesser: { name: string }) => {
      this.createUser(guesser.name, guesserClasses);
    });
  }

  createUser(
    nickName: string,
    classes: { main: string; avatar: string; nickName: string },
    painterFlag: boolean = false
  ): void {
    const mainBlock = painterFlag ? this.painterBlock : this.guesserBlock;
    const guesserDiv = createElement('div', classes.main, mainBlock);
    createElement('div', classes.avatar, guesserDiv);
    createElement('div', classes.nickName, guesserDiv, null, nickName);
  }

  createUsersBlock(): HTMLElement {
    const { GUESSER, PAINTER } = this.observer.getState().langData;

    this.painterBlock = createElement('div', PAINTER_CLASS, null, [
      createElement('p', PAINTER_INFO_CLASS, null, null, `${PAINTER}:`),
    ]);
    this.guesserBlock = createElement('div', GUESSER_CLASS, null, [
      createElement('p', GUESSER_INFO_CLASS, null, null, `${GUESSER}:`),
    ]);
    const usersWrapper = createElement('div', USERS_WRAPPER_CLASS, null, [
      this.painterBlock,
      this.guesserBlock,
    ]);
    return createElement('div', USERS_CLASS, null, [usersWrapper]);
  }
}
