import { makeAutoObservable, runInAction } from 'mobx';

const FETCH_START_EVT = 'fetch-started';
const FETCH_STOP_EVT = 'fetch-stopped';

/**
 * Wrapper de fetch permettant l'emission d'évènement alertant de l'envoie d'une requete et de
 * sa réponse.
 * @return {promise} Promesse retournée par fetch.
 */
export function mgmtFetch(...args) {
  const p = fetch(...args)
    .finally(() => document.body.dispatchEvent(new Event(FETCH_STOP_EVT)));
  document.body.dispatchEvent(new Event(FETCH_START_EVT));
  return p;
}

/**
 * Ecouteur d'accès réseau : permet de savoir combien de requêtes sont en attente de réponse.
 */
export class NetworkManager {
  _nbCurrentFetchs;

  constructor() {
    makeAutoObservable(this);
    this._nbCurrentFetchs = 0;
    document.body.addEventListener(FETCH_START_EVT, () => {
      runInAction(() => {
        this._nbCurrentFetchs += 1;
      });
    }, false);
    document.body.addEventListener(FETCH_STOP_EVT, () => {
      runInAction(() => {
        this._nbCurrentFetchs -= 1;
      });
    }, false);
  }

  get hasFetchInProgess() {
    return this._nbCurrentFetchs > 0;
  }
}

export default { mgmtFetch, NetworkManager };
