import { makeAutoObservable, runInAction } from 'mobx';
import { forgeParametricUrl, forgeBaseInitRequest, raiseRestError } from './RestTransport';
import { mgmtFetch } from '../NetworkManager';

/**
 * Modélise une ressource REST : ensemble de données associées à une URL particulière et dotées
 * de base des opération CRUD.
 */
export class RestResource {
  _url; // URL de la ressource, possiblement paramétriques

  _urlParameters; // valeurs des paramètres de l'URL

  _idField; // nom du champ des données représentant l'id de l'URL (le cas échéant)

  _data; // données de la ressource

  constructor(url = null, urlParameters = {}, idField = null, data = {}) {
    makeAutoObservable(this);
    this._url = url;
    this._urlParameters = { ...urlParameters };
    this._idField = idField;
    this._data = data;
  }

  get data() {
    return this._data;
  }

  get id() {
    return this._idField && this._idField in this._data ? this._data[this._idField] : '<UKN>';
  }

  get url() {
    if (!this._url) {
      return '<unknown url>';
    }
    return forgeParametricUrl(this._url, this._idField in this._data
      ? { ...this._urlParameters, [this._idField]: this._data[this._idField] }
      : this._urlParameters);
  }

  /**
   * Créer la ressource par un appel POST à l'URL.
   * Met à jour la ressource si la requête réussi et que des données sont retournées.
   * @return {Promise} Promesse de la requête. Retourne l'objet courant en cas de succès,
   * une exception sinon.
   */
  async $create() {
    if (!this._url) {
      throw new Error("Impossible de créer l'entité : url manquante");
    }
    const res = await mgmtFetch(this.url, {
      ...forgeBaseInitRequest(),
      method: 'POST',
      body: JSON.stringify(this._data),
    });
    if (!res.ok) {
      await raiseRestError(res);
    }
    const data = await res.json();
    runInAction(() => {
      this._data = data;
      if (this._idField && this._idField in this._data && !this._url.endsWith(`:${this._idField}`)) {
        this._url += `/:${this._idField}`;
      }
    });
    return this;
  }

  /**
   * Met à jour la ressource par un appel PUT à l'URL.
   * Met à jour la ressource si la requête réussi et que des données sont retournées.
   * @return {Promise} Promesse de la requête. Retourne l'objet courant en cas de succès,
   * une exception sinon.
   */
  async $save() {
    if (!this._url) {
      throw new Error("Impossible de créer l'entité : url manquante");
    }
    const res = await mgmtFetch(this.url, {
      ...forgeBaseInitRequest(),
      method: 'PUT',
      body: JSON.stringify(this._data),
    });
    if (!res.ok) {
      await raiseRestError(res);
    }
    const data = await res.json();
    runInAction(() => {
      this._data = data;
    });
    return this;
  }

  /**
   * Suprimme la ressource par un appel DELETE à l'URL.
   * Efface l'url de la ressource si la requête réussi.
   * @return {Promise} Promesse de la requête. Ne retourne rien en cas de succès,
   * une exception sinon.
   */
  async $delete() {
    if (!this._url) {
      throw new Error("Impossible de créer l'entité : url manquante");
    }
    const res = await mgmtFetch(this.url, {
      ...forgeBaseInitRequest(),
      method: 'DELETE',
    });
    if (!res.ok) {
      await raiseRestError(res);
    }
    runInAction(() => {
      this._url = null;
    });
  }

  /**
   * Récupère une ressource ou une collection (selon le résultat du serveur).
   * @return {Promise} Promesse de la requête. Retourne la ressource ou le tableau de ressources
   * en cas de succès, une exception sinon.
   */
  static async find({
    url, parameters = {}, idField = null, queryParams = {},
  }) {
    const res = await mgmtFetch(forgeParametricUrl(url, parameters, queryParams), {
      ...forgeBaseInitRequest(),
      method: 'GET',
    });
    if (!res.ok) {
      await raiseRestError(res);
    }
    const entriesData = await res.json();
    return Array.isArray(entriesData) ? entriesData.map((rscData) => new RestResource(
      url,
      parameters,
      idField,
      rscData,
    )) : new RestResource(
      this.url,
      parameters,
      idField,
      entriesData,
    );
  }
}

export default RestResource;
