import IDraw from './IDraw';
import type Game from '../../Components/Game/index.Game';
import IGameEndInfo from './IGameEndInfo';
import IUserStats from './IUserStats';
import IGuessers from '../../Components/Users/Interfaces/IGuessers';
import IPainter from '../../Components/Users/Interfaces/IPainter';

interface IState {
  game: Game;
  loading: boolean;
  langData: { [key: string]: string };
  role: string;
  name: string;
  users: { painter: IPainter; guessers: Array<IGuessers> };
  draw: IDraw | null;
  drawThickness: number;
  drawColor: string;
  wordsToSelect: Array<string>;
  wordToGuess: string;
  gameStatus: string;
  gameEndInfo: IGameEndInfo | null;
  stats: IUserStats;
}

export default IState;
