import { makeAutoObservable } from 'mobx';

/**
 * Gestionnaire d'erreur : permet l'enregistrement d'erreurs dans une liste pour un affichage.
 */
export class ErrorManager {
  _errors = [];

  constructor() {
    makeAutoObservable(this);
  }

  get errors() {
    return this._errors;
  }

  get hasAny() {
    return this._errors.length > 0;
  }

  register(content, title = null, onDismiss = null) {
    let errorContent; let
      errorTitle;
    if (content && content instanceof Error) {
      errorContent = content.message;
      if (!title) {
        errorTitle = content.name;
      } else {
        errorTitle = title;
      }
    } else {
      errorContent = content;
      errorTitle = title;
    }
    this._errors.unshift({ content: errorContent, title: errorTitle, onDismiss });
  }

  remove(idx) {
    if (idx < 0 || idx >= this._errors.length) {
      return;
    }
    this._errors.splice(idx, 1).forEach((err) => {
      if (err.onDismiss) {
        err.onDismiss();
      }
    });
  }

  clear() {
    this._errors.forEach((err) => {
      if (err.onDismiss) {
        err.onDismiss();
      }
    });
    this._errors.length = 0;
  }
}

export default ErrorManager;
