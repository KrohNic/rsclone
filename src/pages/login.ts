import type Observer from '../Observer/index.Observer';
import type Router from '../Router/index.Router';
import Login from '../Components/Login/index.Login';
import Game from '../Components/Game/index.Game';

export default (
  parent: HTMLElement,
  observer: Observer,
  router: Router
): void => {
  const { game } = observer.getState();

  if (game instanceof Game) {
    game.disconnect();
    observer.setDefaultState();
  }

  const login = new Login(parent, observer, router);
  login.start();
};
