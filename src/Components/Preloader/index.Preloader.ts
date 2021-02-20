import { createElement } from '../../Utils/index.Utils';
import '../../assets/images/giphy.gif';

export default (parentElement: HTMLElement, text: string) => {
  const preloader = createElement('div', 'preloader');
  const preloaderText = createElement('h3', null, null, null, text);
  const container = createElement('div', 'preloader-container');

  const containerImg = document.createElement('img');
  containerImg.src = './giphy.gif';
  containerImg.alt = 'preloader';
  container.append(containerImg);

  preloader.append(container, preloaderText);
  parentElement.append(preloader);
};
