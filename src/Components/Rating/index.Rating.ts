import Observer from '../../Observer/index.Observer';
import Router from '../../Router/index.Router';
import Fetcher from '../../Fetcher/index.Fetcher';
import { createElement } from '../../Utils/index.Utils';
import IRatingUser from '../../Observer/Interfaces/IRatingUser';
import {
  RATING,
  RATING_AVATAR,
  RATING_ITEM,
  RATING_NAME,
  RATING_RATE,
} from './constants';

export default class Rating {
  parentElement: HTMLElement;

  router: Router;

  observer: Observer;

  rating!: Array<IRatingUser>;

  ratingBlock!: HTMLElement;

  constructor(parentElement: HTMLElement, router: Router, observer: Observer) {
    this.parentElement = parentElement;
    this.router = router;
    this.observer = observer;
  }

  private async getRating() {
    this.rating = await Fetcher.get('stats/rating');
  }

  public async start() {
    await this.getRating();
    this.render();
  }

  private render() {
    this.ratingBlock = createElement(
      'div',
      RATING,
      this.parentElement,
      null,
      null
    );
    this.rating.forEach((person) => {
      this.createRatingItem(person.name, person.sex, person.rating);
    });
  }

  private createRatingItem(name: string, sex: string, rating: string) {
    const ratingItem = createElement(
      'div',
      RATING_ITEM,
      this.ratingBlock,
      null,
      null
    );
    const avatar = createElement('img', RATING_AVATAR, ratingItem, null, null);
    if (sex === 'male') {
      avatar.setAttribute('src', './src/assets/images/man.png');
    } else {
      avatar.setAttribute('src', './src/assets/images/woman.png');
    }
    avatar.setAttribute('alt', 'avatar');
    createElement('h2', RATING_NAME, ratingItem, null, name);
    createElement('span', RATING_RATE, ratingItem, null, rating);
  }
}
