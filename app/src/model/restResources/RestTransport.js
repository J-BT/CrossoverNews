/**
 * Forge une URL à partir d'une URL paramétrique (":...") et de ses paramètres.
 * Si un paramètre en fin d'URL n'a pas de valeur, il est enlevé de l'URL.
 * @param  {String} parametricUrl  l'URL paramétrique
 * @param  {Object} parameters     les paramètres de l'URL
 * @param  {Object} queryParams    les paramètres de la requêtes
 * @return {String}                l'URL forgée
 */
export function forgeParametricUrl(parametricUrl, parameters, queryParams = null) {
  const url = parametricUrl
    .replace(
      /:[^/]+/g,
      (m) => {
        const prefix = m.substring(1);
        return prefix in parameters ? parameters[prefix] : m;
      },
    ).replace(/\/:[^/]+\/?$/, '');
  if (queryParams && queryParams.length > 0) {
    const strParams = Object.keys(queryParams)
      .map((k) => `${k}=${queryParams[k].toString()}`).join('&');
    return `${url}?${strParams}`;
  }
  return url;
}

/**
 * Créer un objet de paramètres commun pour l'ensemble des requêtes fetch.
 * @return {object} les paramètre communs.
 */
export function forgeBaseInitRequest() {
  return {
    mode: 'cors',
    headers: new Headers({ 'Content-Type': 'application/json' }),
    redirect: 'follow',
  };
}

/**
 * Lève une exception fondé sur un retour de requête http ayant échouée.
 * @param  {object} res Une réponse de requête HTTP.
 * @return {void}     Ne retourne rien. Lève une exception.
 */
export async function raiseRestError(res) {
  try {
    const textRep = await res.text();
    throw new Error(`Erreur HTTP ${res.status} : ${res.statusText} (${textRep})`);
  } catch (e) {
    throw new Error(`Erreur HTTP ${res.status} : ${res.statusText}`);
  }
}
