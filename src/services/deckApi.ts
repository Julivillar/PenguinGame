const BASE_URL = 'https://deckofcardsapi.com/api/deck';

export const drawCard = async (deckId: string, count = 1): Promise<any[]> => {

  const tryDraw = async () => {
    const res = await fetch(`${BASE_URL}/${deckId}/draw/?count=${count}`);
    const data = await res.json();
    return data;
  };

  let data = await tryDraw();
  
  const cards = data.cards || [];

  const notEnoughCards =
    !data.success || cards.length < count || data.error?.includes('Not enough cards');

  if (notEnoughCards) {
    console.warn('⚠️ No hay suficientes cartas. Devolviendo y barajando...');

    //await fetch(`${BASE_URL}/${deckId}/return/`, { method: 'POST' });
    await fetch(`${BASE_URL}/${deckId}/shuffle/`);

    data = await tryDraw(); // intentar de nuevo
  }

  if (!data.success) {
    throw new Error(data.error || 'Error al robar carta');
  }

  return data.cards;
};
