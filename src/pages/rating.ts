import type Observer from '../Observer/index.Observer';
import type Router from '../Router/index.Router';
import createLayoutElements from '../Components/PageLayout/index.PageLayout';
import Rating from '../Components/Rating/index.Rating';

export default (
  parent: HTMLElement,
  observer: Observer,
  router: Router
): void => {
  const { main, wholeLayout } = createLayoutElements(observer, router);
  const rating = new Rating(main, router, observer);
  rating.start();
  parent.append(wholeLayout);
};
