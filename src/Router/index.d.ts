type Destroyer = null | (() => void);

type RenderPageCallback = (
  parentElem: HTMLElement,
  observer: Observer,
  router: Router
) => Destroyer | undefined | void;
