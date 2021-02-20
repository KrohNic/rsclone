import Observer from '../../Observer/index.Observer';
import { createElement } from '../../Utils/index.Utils';
import { PRIMARY_BTN_CLASS } from '../../Constants/classNames';
import Router from '../../Router/index.Router';
import { GAME } from '../../Constants/routes';
import Fetcher from '../../Fetcher/index.Fetcher';

export default class MainPage {
  private statisticsBlock!: HTMLElement;

  private observer!: Observer;

  private startGameBtn!: HTMLElement;

  private router: Router;

  private name!: string;

  constructor(parentElement: HTMLElement, observer: Observer, router: Router) {
    this.router = router;
    this.observer = observer;
    this.render(parentElement);
  }

  private render(parentElement: HTMLElement) {
    this.statisticsBlock = createElement(
      'div',
      'statistics',
      parentElement,
      null,
      null
    );
    this.renderStatisticsProfileBlock();
    this.renderStatisticsGamesBlock();
  }

  public listener() {
    this.startGameBtn.addEventListener('click', () => {
      this.router.goToPage(GAME);
    });
  }

  private renderStatisticsGamesBlock() {
    const statisticsGame = createElement(
      'div',
      'statistics--game',
      this.statisticsBlock,
      null,
      null
    );

    const statisticsGameItem = createElement(
      'div',
      'statistics--game-item',
      statisticsGame,
      null,
      null
    );

    createElement(
      'h1',
      'statistics--game-item-title',
      statisticsGameItem,
      null,
      this.observer.getState().langData.ONLINE_GAME
    );

    const gameItemContent = createElement(
      'div',
      'statistics--game-item-content',
      statisticsGameItem,
      null,
      null
    );

    const gameItemImg = createElement('img', null, gameItemContent, null, null);
    gameItemImg.setAttribute('src', './src/assets/images/people.png');
    gameItemImg.setAttribute('alt', 'people');

    createElement(
      'div',
      'statistics--game-item-content-text',
      gameItemContent,
      null,
      this.observer.getState().langData.ONLINE_GAME_TEXT
    );

    this.startGameBtn = createElement(
      'button',
      PRIMARY_BTN_CLASS,
      gameItemContent,
      null,
      this.observer.getState().langData.START_GAME
    );
  }

  private async renderStatisticsProfileBlock() {
    const statisticsProfile = createElement(
      'div',
      'statistics--profile',
      this.statisticsBlock,
      null,
      null
    );

    const statisticsAvatar = createElement(
      'img',
      'statistics--profile-avatar',
      statisticsProfile,
      null,
      null
    );
    const sex = await Fetcher.get(
      `users/user/${this.observer.getState().name}`
    );
    if (sex.sex === 'male') {
      statisticsAvatar.setAttribute('src', './src/assets/images/man.png');
    } else {
      statisticsAvatar.setAttribute('src', './src/assets/images/woman.png');
    }
    statisticsAvatar.setAttribute('alt', 'avatar');

    const statisticsProfileStat = createElement(
      'div',
      'statistics--profile-stat',
      statisticsProfile,
      null,
      null
    );

    this.renderStatisticsProfileStatItem(statisticsProfileStat);
  }

  private async renderStatisticsProfileStatItem(parentElement: HTMLElement) {
    const { stats } = this.observer.getState();
    const statisticsObjectValues = Object.values(stats);
    const lang = this.observer.getState().langData.STATISTIC.split('/');
    lang.forEach((word: string, index: number) => {
      const statItem = createElement(
        'div',
        'statistics--profile-stat-item',
        parentElement,
        null,
        null
      );
      createElement('span', null, statItem, null, `${word}:`);
      createElement(
        'span',
        null,
        statItem,
        null,
        `${statisticsObjectValues[index]}`
      );
    });
  }
}
