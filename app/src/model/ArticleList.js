import { makeObservable, observable, computed, action, runInAction } from 'mobx';
import { RestResource } from './restResources/RestResource';

export class ArticleList {
    _entries = null;
    _isLoading = false;
    _itemUrl;

    constructor(itemUrl) {
        makeObservable(this, {
            _entries: observable,
            _isLoading: observable,
            entries: computed,
            loadEntries: action,
        });
        this._itemUrl = itemUrl;
    }

    get entries() {
        return this._entries;
    }

    async loadEntries() {
        if (!this._isLoading) {
            runInAction(() => {
                this._isLoading = true;
            });
            try {
                const entries = await RestResource.find({
                    url: this._itemUrl,
                    parameters: {},
                    idField: null
                });
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
}
