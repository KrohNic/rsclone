import { LOADING, INIT, LANG } from './actionTypes';
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

    default:
      return state;
  }
};
