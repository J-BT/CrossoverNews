import {
  makeObservable, observable, computed, action, runInAction,
} from 'mobx';
import { RestResource } from './restResources/RestResource';

/**
 * To Do List de base, composées de ressources REST dont l'URL paramétrique est la même.
 */
export class BasicToDoList {
  _itemUrl; // L'URL paramétrique d'un élément de la liste

  _entries = null; // Tableau de ressource REST de la liste

  _isLoading = false; // Indicateur de requête de chargement de la liste en cours

  constructor(itemUrl) {
    makeObservable(this, {
      _itemUrl: observable,
      _entries: observable,
      _isLoading: observable,
      entries: computed,
      loadEntries: action,
      addEntry: action,
      updateEntry: action,
      deleteEntry: action,
      _updateEntryData: action,
      _createEntryData: action,
      _createEntryRestResource: action,
    });
    this._itemUrl = itemUrl;
  }

  get entries() {
    return this._entries;
  }

  /**
   * Récupère les entrées de la liste.
   * @return {Promise} la promesse de récupération.
   */
  async loadEntries() {
    if (!this._isLoading) {
      runInAction(() => {
        this._isLoading = true;
      });
      try {
        const entries = await RestResource.find({ url: this._itemUrl, idField: 'id' });
        runInAction(() => {
          this._entries = entries;
        });
      } finally {
        runInAction(() => {
          this._isLoading = false;
        });
      }
    }
    return this._entries;
  }

  /**
   * Ajoute une nouvelle entrée.
   * @param  {string}  content          contenu de l'entrée
   * @param  {string}  [dueDate=null]   date de fin de l'entrée
   * @param  {object}  [extraArgs=null] informations supplémentaire. Non pris en compte dans une
   *                                    BasicToDoList
   * @return {Promise}                  La promesse de création
   */
  async addEntry(content, dueDate = null, extraArgs = null) {
    if (!content) {
      throw new Error("le contenu d'une entrée de liste ne peut pas être vide ou nul.");
    }
    const rawData = this._createEntryData(content, dueDate, extraArgs);
    return this._createEntryRestResource(rawData);
  }

  /**
   * Met à jour une entrée.
   * @param  {string}  entryId          id de l'entrée
   * @param  {string}  content          contenu de l'entrée
   * @param  {string}  [dueDate=null]   date de fin de l'entrée
   * @param  {object}  [extraArgs=null] informations supplémentaire. Non pris en compte dans une
   *                                    BasicToDoList
   * @return {Promise}                  La promesse de mise à jour
   */
  async updateEntry(entryId, content, dueDate = null, extraArgs = null) {
    const entry = this._entries.find((e) => (e.id === entryId));
    if (!entry) {
      throw new Error('Cannot update unknown entry');
    }
    this._updateEntryData(entry.data, content, dueDate, extraArgs);
    try {
      await entry.$save();
    } catch (e) {
      console.warn(e); // TODO: replace
    }
    return entry;
  }

  /**
   * Supprime une entrée.
   * @param  {RestResource}  entry entrée à supprimer
   * @return {Promise}       promesse de suppression
   */
  async deleteEntry(entry) {
    const entryIdx = this._entries.findIndex((e) => (e.id === entry.id));
    if (entryIdx !== -1) {
      await this._entries[entryIdx].$delete();
      const entryIdx2 = this._entries.findIndex((e) => (e.id === entry.id));
      runInAction(() => {
        this._entries.splice(entryIdx2, 1);
      });
    }
    return true;
  }

  // eslint-disable-next-line class-methods-use-this
  _updateEntryData(entryData, content, dueDate = null) {
    const ed = entryData;
    if (dueDate !== null) {
      ed.dueDate = dueDate;
    } else {
      delete ed.dueDate;
    }
    ed.content = content;
    return ed;
  }

  _createEntryData(content, dueDate = null) { // eslint-disable-line class-methods-use-this
    const rawData = { content: content.toString() };
    if (dueDate) {
      rawData.dueDate = dueDate instanceof Date ? dueDate : dueDate.toString();
    }
    return rawData;
  }

  async _createEntryRestResource(data) {
    const rsc = new RestResource(this._itemUrl, {}, 'id', data);
    const r = await rsc.$create();
    this._entries.unshift(r);
  }
}

export default BasicToDoList;
