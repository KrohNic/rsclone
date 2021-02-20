import { createElement } from '../../../../Utils/index.Utils';
import {
  GAME_GUESS_WORD_CLASS,
  GAME_GUESS_WORD_TEXT_CLASS,
} from '../../../../Constants/classNames';

export default (word: string, parentElement: HTMLElement) => {
  const wordBlock = createElement('div', GAME_GUESS_WORD_CLASS);
  createElement('p', GAME_GUESS_WORD_TEXT_CLASS, wordBlock, null, word);
  parentElement.prepend(wordBlock);
};
