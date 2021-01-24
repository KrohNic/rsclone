import io from 'socket.io-client';
import { createElement } from '../Utils/index.Utils';
import { SOCKET_SERVER, ROLE_PAINTER } from '../Constants/index.Constants';
import {
  EVENT_BROADCAST,
  EVENT_CONNECT,
  EVENT_DRAW,
  EVENT_USER_INFO,
  EVENT_GAME,
  START_GAME,
  STOP_GAME,
  ANSWER_INPUT,
  BROADCAST_MSG,
  BROADCAST_LIKE,
} from './constants';
import {
  DRAW,
  DRAW_COLOR,
  DRAW_THICKNESS,
  CLEAR_BOARD,
  NAME,
  ROLE,
  USERS,
  WORDS_TO_SELECT,
  WORD_TO_GUESS,
} from '../Observer/actionTypes';
import {
  FORM_CLASS,
  FORM_BTN_CLASS,
  FORM_INPUT_CLASS,
  CHAT_CLASS,
  CHAT_MSG_BLOCK_CLASS,
  CHAT_MSG_BLOCK_INFO_CLASS,
  CHAT_MSG_CLASS,
  CHAT_SENDER_CLASS,
  CHAT_LIKE_CLASS,
  CHAT_DISLIKE_CLASS,
  CHAT_LIKE_ALL_CLASS,
  CHAT_LIKE_ACTIVE_CLASS,
} from '../Constants/classNames';
import type Observer from '../Observer/index.Observer';
import IState from '../Observer/Interfaces/IState';
import {
  GAME_END,
  GAME_IN_PROGRESS,
  LOADING_GAME,
  READY_TO_GAME,
} from '../Components/Game/statuses';

export default class SocketIoClient {
  parentElement: HTMLElement;

  socket: SocketIOClient.Socket;

  chat: HTMLElement;

  form: HTMLElement;

  observer: Observer;

  chatMsgCounter: number;

  constructor(parentElement: HTMLElement, observer: Observer) {
    this.parentElement = parentElement;
    this.socket = io(SOCKET_SERVER);
    this.observer = observer;
    this.listenSocketEvents();
    this.chat = SocketIoClient.createChat();
    this.chatMsgCounter = 0;
    this.form = this.createForm();
  }

  public start() {
    this.sendName();
  }

  public displayForm(parentElement: HTMLElement) {
    parentElement.append(this.form);
  }

  public displayChat(parentElement: HTMLElement) {
    parentElement.append(this.chat);
  }

  public sendDrowInfoToClients(actionType: string, state: IState) {
    if (actionType === DRAW) this.socket.emit(EVENT_DRAW, state.draw, DRAW);
    if (actionType === DRAW_THICKNESS)
      this.socket.emit(EVENT_DRAW, state.drawThickness, DRAW_THICKNESS);
    if (actionType === DRAW_COLOR)
      this.socket.emit(EVENT_DRAW, state.drawColor, DRAW_COLOR);
    if (actionType === CLEAR_BOARD) {
      this.socket.emit(EVENT_DRAW, null, CLEAR_BOARD);
    }
  }

  private sendName() {
    const { name } = this.observer.getState();
    this.socket.emit(EVENT_USER_INFO, name, NAME);
  }

  public sendReadyToGame() {
    this.socket.emit(EVENT_GAME, true, READY_TO_GAME);
  }

  listenSocketEvents(): void {
    this.socket.on(EVENT_CONNECT, () => {
      // событи будет сробатывать при подключении к сокету
    });

    this.socket.on(EVENT_GAME, (info: any, actionType: string) => {
      switch (actionType) {
        case START_GAME:
          this.observer.actions.setGameStatus(GAME_IN_PROGRESS);
          break;
        case WORDS_TO_SELECT:
          this.observer.actions.wordsToSelect(info);
          break;
        case STOP_GAME:
          if (info.loading) this.observer.actions.setGameStatus(LOADING_GAME);
          else {
            const {
              winnerName,
              guessWord,
            }: { winnerName: string; guessWord: string } = info;

            this.observer.actions.setGameEndInfo({ winnerName, guessWord });
          }
          break;
        default:
          break;
      }
    });

    this.socket.on(EVENT_USER_INFO, (info: any, actionType: string) => {
      switch (actionType) {
        case ROLE:
          this.observer.actions.setRole(info);
          break;
        case USERS:
          this.observer.actions.setUsers(info);
          break;
        default:
          break;
      }
    });

    this.socket.on(EVENT_DRAW, (info: any, actionType: string) => {
      switch (actionType) {
        case DRAW_THICKNESS:
          this.observer.actions.setDrawThickness(info);
          break;
        case DRAW_COLOR:
          this.observer.actions.setDrawColor(info);
          break;
        case CLEAR_BOARD:
          this.observer.actions.clearBoard();
          break;
        default:
          this.observer.actions.setDraw(info);
          break;
      }
    });

    this.socket.on(
      EVENT_BROADCAST,
      (nikName: string, message: Array<string>, actionType: string) => {
        if (actionType === BROADCAST_MSG) this.printMessage(nikName, message);
        // if (actionType === BROADCAST_LIKE) this.addLike(nikName, message);
      }
    );
  }

  printMessage(nikname: string, data: Array<string>): void {
    const msg = data[0];
    const msgBlock = createElement('div', CHAT_MSG_BLOCK_CLASS);
    const infoBlock = createElement('div', CHAT_MSG_BLOCK_INFO_CLASS, msgBlock);
    createElement('p', CHAT_SENDER_CLASS, infoBlock, null, nikname);
    createElement('p', CHAT_MSG_CLASS, infoBlock, null, msg);

    this.renderLikeBlock(msgBlock);
    this.chat?.prepend(msgBlock);
  }

  renderLikeBlock(parentElement: HTMLElement) {
    const { role } = this.observer.getState();
    const likeImg = createElement('div', [
      CHAT_LIKE_CLASS,
      CHAT_LIKE_ALL_CLASS,
    ]);
    const disLikeImg = createElement('div', [
      CHAT_DISLIKE_CLASS,
      CHAT_LIKE_ALL_CLASS,
    ]);
    parentElement.prepend(disLikeImg, likeImg);
    if (role === ROLE_PAINTER) {
      likeImg.classList.add(CHAT_LIKE_ACTIVE_CLASS);
      disLikeImg.classList.add(CHAT_LIKE_ACTIVE_CLASS);
      parentElement.addEventListener('click', (e) => {
        if (e.target.closest(`.${CHAT_LIKE_ALL_CLASS}`)) {
          console.log(parentElement);
          // this.socket.emit(EVENT_BROADCAST);
        }
      });
    }
  }

  static createChat(): HTMLElement {
    return createElement('div', CHAT_CLASS);
  }

  clearChat(): void {
    this.chat.textContent = '';
  }

  createForm(): HTMLElement {
    const input = createElement('input', FORM_INPUT_CLASS);
    input.setAttribute('name', ANSWER_INPUT);

    const btn = createElement('button', FORM_BTN_CLASS, null, null, 'send');
    btn.setAttribute('type', 'submit');

    const form = createElement('form', FORM_CLASS, null, [input, btn]);
    form.addEventListener('submit', this.sendMessage);

    return form;
  }

  sendMessage = (event: Event) => {
    event.preventDefault();

    const formElement = <HTMLFormElement>event.target;
    const input = <HTMLInputElement>formElement[ANSWER_INPUT];

    if (!input.value) return;

    this.socket.emit(
      EVENT_BROADCAST,
      input.value.trim().toLowerCase(),
      BROADCAST_MSG
    );
    input.value = '';
  };

  sendGuessedWord(word: string) {
    this.socket.emit(EVENT_GAME, word, WORD_TO_GUESS);
  }
}
