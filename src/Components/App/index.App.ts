import langDictionaries from '../../langDictionaries/index.langDictionaries';
import Observer from '../../Observer/index.Observer';
import { DEFAULT_LANGUAGE } from '../../Constants/index.Constants';
import pagesRenders from '../../pages/index.pages';
import Router from '../../Router/index.Router';
import * as routes from '../../Constants/routes';
import * as pagesTitles from '../../Constants/pages';

export default class App {
  private readonly observer: Observer;

  private readonly parentElem: HTMLElement = document.body;

  private readonly router: Router;

  constructor() {
    const langData = langDictionaries[DEFAULT_LANGUAGE];
    this.observer = new Observer({ langData });
    this.router = new Router(this.parentElem, this.observer);
    this.router.addRoutes(routes, pagesTitles, pagesRenders);
  }

  public start() {
    this.router.renderCurrentRoute();
  }
}
