export default class Fetcher {
  static async post(route: URL | string, body: string) {
    const url = `https://rsclone-node-js.herokuapp.com/${route}`;
    const response = await fetch(url, {
      method: 'post',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
      body,
    })
      .then((res) => res.json())
      .then((res) => res);
    return response;
  }

  static async get(route: URL | string) {
    const response = await fetch(
      `https://rsclone-node-js.herokuapp.com/${route}`
    )
      .then((res) => res.json())
      .then((res) => res);
    return response;
  }

  static async put(route: URL | string, body: string) {
    const url = `https://rsclone-node-js.herokuapp.com/${route}`;
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
      body,
    })
      .then((res) => res.json())
      .then((res) => res);
    return response;
  }
}
