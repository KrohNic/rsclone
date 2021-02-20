import {
  GAME_IN_PROGRESS,
  WORD_SELECTION,
  GAME_END,
} from '../Components/Game/statuses';
import {
  LOADING,
  INIT,
  LANG,
  ROLE,
  NAME,
  DRAW,
  DRAW_THICKNESS,
  DRAW_COLOR,
  USERS,
  GAME,
  WORDS_TO_SELECT,
  WORD_TO_GUESS,
  GAME_STATUS,
  GAME_END_INFO,
  USER_STATS,
} from './actionTypes';
import IAction from './Interfaces/IAction';
import IState from './Interfaces/IState';

export default (state: IState, action: IAction): IState => {
  switch (action.type) {
    case INIT:
      return {
        ...state,
      };
    case LOADING:
      return { ...state, loading: action.payload };
    case LANG:
      return { ...state, langData: action.payload };
    case ROLE:
      return { ...state, role: action.payload };
    case NAME:
      return { ...state, name: action.payload };
    case USERS:
      return { ...state, users: action.payload };
    case DRAW:
      return { ...state, draw: action.payload };
    case DRAW_THICKNESS:
      return { ...state, drawThickness: action.payload };
    case DRAW_COLOR:
      return { ...state, drawColor: action.payload };
    case GAME:
      return { ...state, game: action.payload };
    case WORDS_TO_SELECT:
      return {
        ...state,
        wordsToSelect: action.payload,
        gameStatus: WORD_SELECTION,
      };
    case WORD_TO_GUESS:
      return {
        ...state,
        wordToGuess: action.payload,
        gameStatus: GAME_IN_PROGRESS,
      };
    case GAME_STATUS:
      return { ...state, gameStatus: action.payload };
    case GAME_END_INFO:
      return { ...state, gameEndInfo: action.payload, gameStatus: GAME_END };
    case USER_STATS:
      return { ...state, stats: action.payload };
    default:
      return state;
  }
};
