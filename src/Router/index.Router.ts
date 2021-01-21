import Observer from '../Observer/index.Observer';
import { createElement } from '../Utils/index.Utils';
import { APP_NAME } from '../Constants/index.Constants';

export default class Router {
  private readonly routes: Array<{
    route: string;
    title: string;
    renderCb: RenderPageCallback;
  }> = [];

  private readonly pagesContainer: HTMLElement;

  private readonly observer: Observer;

  private curPageDestroyer: Destroyer | void = null;

  constructor(pagesContainer: HTMLElement, observer: Observer) {
    this.pagesContainer = pagesContainer;
    this.observer = observer;

    this.setListeners();
  }

  private setListeners() {
    window.addEventListener('popstate', (e) => {
      e.preventDefault();
      this.renderCurrentRoute();
    });
  }

  private renderRoute = (route: string) => {
    const routeObj = this.routes.find((routeData) => routeData.route === route);

    if (!routeObj) return;

    if (this.curPageDestroyer) {
      this.curPageDestroyer();
      this.curPageDestroyer = null;
    }

    document.title = `${APP_NAME.toUpperCase()} | ${routeObj.title}`;
    this.pagesContainer.textContent = '';
    this.curPageDestroyer = routeObj.renderCb(
      this.pagesContainer,
      this.observer,
      this
    );
  };

  public goToPage(route: string) {
    const { pathname } = window.location;

    if (pathname === route) return;

    this.renderRoute(route);
    window.history.pushState(null, '', route);
  }

  public renderCurrentRoute = () => {
    const { pathname } = window.location;

    this.renderRoute(pathname);
  };

  public addRoutes(
    routes: { [key: string]: string },
    pagesTitles: { [key: string]: string },
    pagesRenders: { [key: string]: RenderPageCallback }
  ) {
    const rendersList = Object.values(pagesRenders);
    const titlesList = Object.values(pagesTitles);
    const routesList = Object.values(routes);

    rendersList.forEach((renderCb, index) => {
      const title = titlesList[index];
      const route = routesList[index];

      this.routes.push({ route, renderCb, title });
    });
  }
}
