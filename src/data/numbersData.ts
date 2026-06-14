export interface NumberItem {
  id: string;
  value: number;
  word: string;
  emoji: string;
  countString: string;
  gradient: [string, string];
}

export const numbersData: NumberItem[] = [
  { id: '1', value: 1, word: 'One', emoji: '🍎', countString: '🍎', gradient: ['#FF9A9E', '#FECFEF'] },
  { id: '2', value: 2, word: 'Two', emoji: '🎈', countString: '🎈 🎈', gradient: ['#A1C4FD', '#C2E9FB'] },
  { id: '3', value: 3, word: 'Three', emoji: '🐱', countString: '🐱 🐱 🐱', gradient: ['#F6D365', '#FDA085'] },
  { id: '4', value: 4, word: 'Four', emoji: '🌟', countString: '🌟 🌟 🌟 🌟', gradient: ['#84FAB0', '#8FD3F4'] },
  { id: '5', value: 5, word: 'Five', emoji: '🧁', countString: '🧁 🧁 🧁 🧁 🧁', gradient: ['#E0C3FC', '#8EC5FC'] },
  { id: '6', value: 6, word: 'Six', emoji: '🍉', countString: '🍉 🍉 🍉 🍉 🍉 🍉', gradient: ['#FFD1FF', '#FAD0C4'] },
  { id: '7', value: 7, word: 'Seven', emoji: '🚗', countString: '🚗 🚗 🚗 🚗 🚗 🚗 🚗', gradient: ['#D4FC79', '#96E6A1'] },
  { id: '8', value: 8, word: 'Eight', emoji: '🌸', countString: '🌸 🌸 🌸 🌸 🌸 🌸 🌸 🌸', gradient: ['#FFF1EB', '#ACE0F9'] },
  { id: '9', value: 9, word: 'Nine', emoji: '🍬', countString: '🍬 🍬 🍬 🍬 🍬 🍬 🍬 🍬 🍬', gradient: ['#FED6E3', '#A8B1F8'] },
  { id: '10', value: 10, word: 'Ten', emoji: '🎈', countString: '🎈 🎈 🎈 🎈 🎈 🎈 🎈 🎈 🎈 🎈', gradient: ['#FFECD2', '#FCB69F'] },
];
