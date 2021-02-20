import type Observer from './index.Observer';
import type Game from '../Components/Game/index.Game';
import {
  DRAW,
  DRAW_COLOR,
  DRAW_THICKNESS,
  LANG,
  LOADING,
  NAME,
  USERS,
  ROLE,
  CLEAR_BOARD,
  GAME,
  WORDS_TO_SELECT,
  WORD_TO_GUESS,
  GAME_STATUS,
  GAME_END_INFO,
  USER_STATS,
} from './actionTypes';
import langItem from '../langDictionaries/en';
import IDraw from './Interfaces/IDraw';
import IGameEndInfo from './Interfaces/IGameEndInfo';
import IUserStats from './Interfaces/IUserStats';

export default class ActionCreator {
  private observer: Observer;

  constructor(observer: Observer) {
    this.observer = observer;
  }

  setGame(game: Game): void {
    this.observer.dispatch({
      type: GAME,
      payload: game,
    });
  }

  setLoading = (isLoading: boolean = true): void => {
    if (this.observer.getState().loading === isLoading) return;

    this.observer.dispatch({
      type: LOADING,
      payload: isLoading,
    });
  };

  setLang(lang: typeof langItem): void {
    this.observer.dispatch({
      type: LANG,
      payload: lang,
    });
  }

  setRole(role: string): void {
    this.observer.dispatch({
      type: ROLE,
      payload: role,
    });
  }

  setName(name: string): void {
    this.observer.dispatch({
      type: NAME,
      payload: name,
    });
  }

  setUsers(users: object): void {
    this.observer.dispatch({
      type: USERS,
      payload: users,
    });
  }

  setDraw(draw: IDraw): void {
    if (this.observer.getState().loading === true) return;
    this.observer.dispatch({
      type: DRAW,
      payload: draw,
    });
  }

  setDrawThickness(thickness: number): void {
    if (this.observer.getState().loading === true) return;
    this.observer.dispatch({
      type: DRAW_THICKNESS,
      payload: thickness,
    });
  }

  setDrawColor(color: string): void {
    if (this.observer.getState().loading === true) return;
    this.observer.dispatch({
      type: DRAW_COLOR,
      payload: color,
    });
  }

  clearBoard(): void {
    if (this.observer.getState().loading === true) return;
    this.observer.dispatch({
      type: CLEAR_BOARD,
      payload: null,
    });
  }

  wordsToSelect(words: Array<string>) {
    this.observer.dispatch({
      type: WORDS_TO_SELECT,
      payload: words,
    });
  }

  wordToGuess(word: string) {
    this.observer.dispatch({
      type: WORD_TO_GUESS,
      payload: word,
    });
  }

  setGameStatus(status: string) {
    this.observer.dispatch({
      type: GAME_STATUS,
      payload: status,
    });
  }

  setGameEndInfo(info: IGameEndInfo) {
    this.observer.dispatch({
      type: GAME_END_INFO,
      payload: info,
    });
  }

  setUserStats(stats: IUserStats) {
    this.observer.dispatch({
      type: USER_STATS,
      payload: stats,
    });
  }
}
