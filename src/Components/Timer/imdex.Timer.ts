import { createElement } from '../../Utils/index.Utils';
import {
  TIMER_CLASS,
  TIMER_MIN_CLASS,
  TIMER_SEC_CLASS,
} from '../../Constants/classNames';
import Observer from '../../Observer/index.Observer';
import { ROLE_PAINTER } from '../../Constants/index.Constants';

export default class Timer {
  parentElement: HTMLElement;

  minBlock!: HTMLElement;

  secBlock!: HTMLElement;

  timerId!: NodeJS.Timeout;

  min!: number;

  sec: number;

  observer: Observer;

  isStarted: boolean;

  constructor(parentElement: HTMLElement, observer: Observer) {
    this.parentElement = parentElement;
    this.sec = 0;
    this.observer = observer;
    this.isStarted = false;
  }

  start(min: number) {
    if (!this.isStarted) {
      this.isStarted = true;
      this.min = min;
      this.render(min);
      this.updateTimer();
      this.timerId = setInterval(this.updateTimer.bind(this), 1000);
    } else {
      this.render(this.min);
    }
  }

  stop() {
    this.isStarted = false;
    this.sec = 0;
    clearInterval(this.timerId);
  }

  render(min: number) {
    const mainBlock = createElement('div', TIMER_CLASS);
    this.minBlock = createElement(
      'p',
      TIMER_MIN_CLASS,
      mainBlock,
      null,
      `0${min}`
    );
    this.secBlock = createElement(
      'p',
      TIMER_SEC_CLASS,
      mainBlock,
      null,
      this.getSec()
    );
    this.parentElement.append(mainBlock);
  }

  updateTimer() {
    if (this.sec === 0 && this.min === 0) {
      this.stop();
      this.setTimeIsOver();
    } else {
      this.calculateTime();
    }
    this.minBlock.innerText = `0${this.min}`;
    this.secBlock.innerText = this.getSec();
  }

  getSec() {
    return `${this.sec < 10 ? `0${this.sec}` : this.sec}`;
  }

  setTimeIsOver() {
    const { role, wordToGuess, game } = this.observer.getState();
    if (role === ROLE_PAINTER) game.stopGame(wordToGuess);
  }

  calculateTime() {
    if (this.sec === 0) {
      this.min -= 1;
      this.sec = 60;
    }
    this.sec -= 1;
  }
}
