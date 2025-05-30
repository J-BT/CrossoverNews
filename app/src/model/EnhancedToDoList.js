import { makeObservable, observable, override } from 'mobx';
import { BasicToDoList } from './BasicToDoList';

/**
 * Retourne un tableau des noms d'infos supplémentaires d'une entrée.
 * @param  {object} entryData        informations supplémentaire
 * @return {array<string>}           tableau de nom des information
 */
export function getEntryExtraArgsKeys(entryData) {
  return entryData.extraArgs ? Object.keys(entryData.extraArgs) : [];
}

/**
 * Retourne un tableau de couples [nom, valeur] d'infos supplémentaires d'une entrée.
 * @param  {object} entryData        informations supplémentaires
 * @return {array<string>}           tableau de couples [nom, valeur]
 */
export function getEntryExtraArgs(entryData) {
  return getEntryExtraArgsKeys(entryData).map((k) => [k, entryData.extraArgs[k]]);
}

/**
 * Retourne un dictionnaire d'informations supplémentaires d'une entrée à partir
 * d'un tableau de couples [nom, valeur].
 * @param  {array<string>} extraArgs tableau de couples [nom, valeur]
 * @return {object}                  informations supplémentaire
 */
function extraArgsToDict(extraArgs) {
  // eslint-disable-next-line no-param-reassign
  return extraArgs.reduce((o, [k, v]) => { o[k] = v; return o; }, {});
}

/**
 * ToDoList permettant la manipulation d'entrée "etendue".
 * (i.e. : possedant des informations supplémentaires)
 */
export class EnhancedToDoList extends BasicToDoList {
  constructor(itemUrl) {
    super(itemUrl);
    makeObservable(this, {
      _createEntryData: override,
      _updateEntryData: override,
    });
  }

  _createEntryData(content, dueDate = null, extraArgs = null) {
    const data = super._createEntryData(content, dueDate);
    if (extraArgs) {
      data.extraArgs = extraArgsToDict(extraArgs);
    }
    return data;
  }

  // eslint-disable-next-line class-methods-use-this
  _updateEntryData(entryData, content, dueDate = null, extraArgs = null) {
    const ed = super._updateEntryData(entryData, content, dueDate);
    if (extraArgs) {
      ed.extraArgs = extraArgsToDict(extraArgs);
    } else if (ed.extraArgs) {
      delete ed.extraArgs;
    }
    return ed;
  }
}

export default EnhancedToDoList;
