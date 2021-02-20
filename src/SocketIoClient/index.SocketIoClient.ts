import io from 'socket.io-client';
import { createElement } from '../Utils/index.Utils';
import {
  SOCKET_SERVER,
  ROLE_PAINTER,
  CHAT_COUNT_MSG,
} from '../Constants/index.Constants';
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
  BROADCAST_DISLIKE,
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
  FORM_WRAPPER_CLASS,
  FORM_BTN_CLASS,
  FORM_INPUT_CLASS,
  CHAT_CLASS,
  CHAT_MSG_BLOCK_CLASS,
  CHAT_MSG_BLOCK_INFO_CLASS,
  CHAT_MSG_CLASS,
  CHAT_SENDER_CLASS,
  CHAT_LIKE_CLASS,
  CHAT_LIKE_ACTIVE_CLASS,
  CHAT_DISLIKE_CLASS,
  CHAT_DISLIKE_ACTIVE_CLASS,
  CHAT_LIKE_ALL_CLASS,
  CHAT_NO_ACTIVE_CLASS,
} from '../Constants/classNames';
import type Observer from '../Observer/index.Observer';
import IState from '../Observer/Interfaces/IState';
import {
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

  public stop() {
    this.socket.disconnect();
  }

  public displayForm(parentElement: HTMLElement) {
    parentElement.append(this.form);
  }

  public displayChat(parentElement: HTMLElement = this.parentElement) {
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

  public sendStopGame(data: string) {
    this.socket.emit(EVENT_GAME, data, STOP_GAME);
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

            this.observer.actions.setGameEndInfo({
              winnerName,
              guessWord,
            });
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
        if (actionType === BROADCAST_LIKE)
          this.addLikeGuessers(message, CHAT_LIKE_ACTIVE_CLASS);
        if (actionType === BROADCAST_DISLIKE)
          this.addLikeGuessers(message, CHAT_DISLIKE_ACTIVE_CLASS);
      }
    );
  }

  printMessage(nikname: string, data: Array<string>): void {
    const msg = data[0];
    const msgId = data[1];
    const msgBlock = createElement('div', CHAT_MSG_BLOCK_CLASS);
    msgBlock.setAttribute('id', `msg_${msgId}`);
    const infoBlock = createElement('div', CHAT_MSG_BLOCK_INFO_CLASS, msgBlock);
    createElement('p', CHAT_SENDER_CLASS, infoBlock, null, nikname);
    createElement('p', CHAT_MSG_CLASS, infoBlock, null, msg);

    this.renderLikeBlock(msgBlock, msgId);
    this.chat?.prepend(msgBlock);
    if (this.chat.childNodes.length > CHAT_COUNT_MSG)
      this.chat.childNodes[CHAT_COUNT_MSG].remove();
  }

  renderLikeBlock(parentElement: HTMLElement, msgId: string) {
    const { role } = this.observer.getState();
    const likeImgPainter = createElement('div', [
      CHAT_LIKE_CLASS,
      CHAT_LIKE_ALL_CLASS,
    ]);
    const disLikeImgPainter = createElement('div', [
      CHAT_DISLIKE_CLASS,
      CHAT_LIKE_ALL_CLASS,
    ]);
    const likeImgGuesser = createElement('div', [
      CHAT_LIKE_ACTIVE_CLASS,
      CHAT_LIKE_ALL_CLASS,
      CHAT_NO_ACTIVE_CLASS,
    ]);
    const disLikeImgGuesser = createElement('div', [
      CHAT_DISLIKE_ACTIVE_CLASS,
      CHAT_LIKE_ALL_CLASS,
      CHAT_NO_ACTIVE_CLASS,
    ]);
    if (role === ROLE_PAINTER) {
      parentElement.prepend(disLikeImgPainter, likeImgPainter);
      parentElement.addEventListener('click', (event) =>
        this.addLikePainter(event, likeImgPainter, disLikeImgPainter, msgId)
      );
    } else {
      parentElement.prepend(disLikeImgGuesser, likeImgGuesser);
    }
  }

  addLikeGuessers(data: Array<string>, className: string) {
    const msgId = data[0];
    const allLikeBlocks = this.chat.querySelectorAll(
      `#msg_${msgId} .${CHAT_LIKE_ALL_CLASS}`
    );
    allLikeBlocks.forEach((likeBlock) => {
      likeBlock.classList.add(CHAT_NO_ACTIVE_CLASS);
      if (likeBlock.classList.contains(className)) {
        likeBlock.classList.remove(CHAT_NO_ACTIVE_CLASS);
      }
    });
  }

  addLikePainter(
    event: Event,
    likeImgPainter: HTMLElement,
    disLikeImgPainter: HTMLElement,
    msgId: string
  ) {
    if (event.target?.closest(`.${CHAT_LIKE_CLASS}`)) {
      disLikeImgPainter.classList.remove(CHAT_DISLIKE_ACTIVE_CLASS);
      disLikeImgPainter.classList.add(CHAT_DISLIKE_CLASS);
      likeImgPainter.classList.remove(CHAT_LIKE_CLASS);
      likeImgPainter.classList.add(CHAT_LIKE_ACTIVE_CLASS);
      this.socket.emit(EVENT_BROADCAST, [msgId], BROADCAST_LIKE);
    }
    if (event.target?.closest(`.${CHAT_DISLIKE_CLASS}`)) {
      likeImgPainter.classList.remove(CHAT_LIKE_ACTIVE_CLASS);
      likeImgPainter.classList.add(CHAT_LIKE_CLASS);
      disLikeImgPainter.classList.remove(CHAT_DISLIKE_CLASS);
      disLikeImgPainter.classList.add(CHAT_DISLIKE_ACTIVE_CLASS);
      this.socket.emit(EVENT_BROADCAST, [msgId], BROADCAST_DISLIKE);
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

    const wrapper = createElement('div', FORM_WRAPPER_CLASS, null, [
      input,
      btn,
    ]);
    const form = createElement('form', FORM_CLASS);
    form.addEventListener('submit', this.sendMessage);

    form.append(wrapper);
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
