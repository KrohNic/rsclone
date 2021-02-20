import type Observer from '../Observer/index.Observer';
import type Router from '../Router/index.Router';
import createLayoutElements from '../Components/PageLayout/index.PageLayout';
import Game from '../Components/Game/index.Game';

export default (
  parentElem: HTMLElement,
  observer: Observer,
  router: Router
): void => {
  const state = observer.getState();
  const { main, wholeLayout } = createLayoutElements(observer, router);

  if (state.game instanceof Game) {
    state.game.updateGame(main);
  } else {
    const game = new Game(observer, main);

    game.startGame();
  }

  parentElem.append(wholeLayout);
};
