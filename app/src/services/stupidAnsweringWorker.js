/* eslint no-restricted-globals: ["error", "document"] */
/**
 * Worker de traitement asynchrone de requêtes idiotes
 * @type {Worker}
 */

/**
 * Retourne un nombre de millisecondes aléatoire entre 500 (inclus) et 2000 (inclus)
 * @return {[Number]} nombre aléatoire
 */
function getRandomWaitingTime() {
  return Math.floor(Math.random() * 1501) + 500;
}

// Ici self désigne la "racine" du contexte. Dans un script exécuté dans le DOM,
// self point sur document.
// Dans un worker, self pointe sur le contexte racine du worker.

self.onmessage = ({ data: { question } }) => {
  // Vérifie que l'on ait bien une question
  if (!question) {
    return;
  }
  let correctedQuestion = question;
  if (!correctedQuestion.endsWith('?')) {
    correctedQuestion += ' ?';
  }
  // Prépare la réponse à renvoyer
  const answer = {
    question: correctedQuestion,
    answer: `la réponse à cette question est ${question.length}!`,
  };
  // Attend aléatoirement avant de renvoyer la réponse
  self.setTimeout(() => {
    // Renvoie la réponse
    self.postMessage({ answer });
  }, getRandomWaitingTime());
};
