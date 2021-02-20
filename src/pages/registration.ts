import Registration from '../Components/Registration/index.Registration';
import Observer from '../Observer/index.Observer';
import Router from '../Router/index.Router';

export default (
  parent: HTMLElement,
  observer: Observer,
  router: Router
): void => {
  const registration = new Registration(parent, router, observer);
  registration.start();
};
