const BASE_URL = 'https://deckofcardsapi.com/api/deck';

export const drawCard = async (deckId: string, count = 1) => {
  const response = await fetch(`${BASE_URL}/${deckId}/draw/?count=${count}`);
  const data = await response.json();
  return data.cards; 
};
