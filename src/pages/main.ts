import type Observer from '../Observer/index.Observer';
import type Router from '../Router/index.Router';
import createLayoutElements from '../Components/PageLayout/index.PageLayout';
import MainPage from '../Components/MainPage/index.MainPage';

export default (
  parent: HTMLElement,
  observer: Observer,
  router: Router
): void => {
  const { main, wholeLayout } = createLayoutElements(observer, router);
  parent.append(wholeLayout);
  const mainPage = new MainPage(main, observer, router);
  mainPage.listener();
};
