export const cardValueToNumber = (value: string): number => {
    const valueMap: Record<string, number> = {
      JACK: 11,
      QUEEN: 12,
      KING: 13,
      ACE: 1,
    };
    return valueMap[value] ?? parseInt(value, 10);
  };
  