const BASE_URL = 'https://deckofcardsapi.com/api/deck';

export const drawCard = async (deckId: string, count = 1): Promise<any[]> => {
  const res = await fetch(`${BASE_URL}/${deckId}/draw/?count=${count}`);
  const data = await res.json();

  // Si el mazo está vacío, ejecutamos retorno + barajado
  if (data.remaining === 0) {
    console.warn('Mazo vacío. Devolviendo cartas y barajando...');

    // Devolver cartas al mazo
    await fetch(`${BASE_URL}/${deckId}/return/`, {
      method: 'POST',
    });

    // Barajar
    await fetch(`${BASE_URL}/${deckId}/shuffle/`);

    // Volver a intentar robar carta
    const retryRes = await fetch(`${BASE_URL}/${deckId}/draw/?count=${count}`);
    const retryData = await retryRes.json();
    return retryData.cards;
  }

  return data.cards;
};
