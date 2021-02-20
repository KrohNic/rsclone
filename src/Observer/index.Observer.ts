import ISubscriber from './Interfaces/ISubscriber';
import IAction from './Interfaces/IAction';
import IState from './Interfaces/IState';
import ActionCreator from './ActionCreator';
import { INIT } from './actionTypes';
import reducer from './reducer';
import { LOADING_GAME } from '../Components/Game/statuses';

export default class Observer {
  private state!: IState;

  private subscribers: Array<ISubscriber> = [];

  public readonly actions: ActionCreator;

  initState: IState;

  constructor(initialState: Partial<IState> = {}) {
    this.initState = {
      game: {},
      loading: true,
      langData: {},
      role: '',
      name: 'name',
      users: {},
      draw: null,
      drawThickness: 1,
      drawColor: 'black',
      wordsToSelect: [],
      wordToGuess: '',
      gameStatus: LOADING_GAME,
      gameEndInfo: null,
      ...initialState,
    };
    this.setDefaultState();
    this.actions = new ActionCreator(this);
  }

  public setDefaultState() {
    this.state = reducer(this.initState, { type: INIT });
  }

  dispatch(action: IAction): void {
    this.state = reducer(this.state, action);
    this.subscribers.forEach((subscriber) => {
      subscriber.update(this.state, action.type);
    });
  }

  subscribe(...subscribers: Array<ISubscriber>): void {
    this.subscribers.push(...subscribers);
  }

  unsubscribe(...subscribers: Array<ISubscriber>): void {
    subscribers.forEach((subscriber) => {
      this.subscribers = this.subscribers.filter((sub) => sub !== subscriber);
    });
  }

  getState(): IState {
    return this.state;
  }
}
