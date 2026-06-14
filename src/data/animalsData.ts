export interface AnimalItem {
  id: string;
  name: string;
  emoji: string;
  sound: string;
  funFact: string;
  gradient: [string, string];
}

export const animalsData: AnimalItem[] = [
  { id: '1', name: 'Lion', emoji: '🦁', sound: 'Roar!', funFact: 'Lions are called the King of the Jungle!', gradient: ['#FFE259', '#FFA751'] },
  { id: '2', name: 'Monkey', emoji: '🐒', sound: 'Ooh Ooh Aah Aah!', funFact: 'Monkeys love to swing from trees and eat bananas!', gradient: ['#FFF0D4', '#FFD29D'] },
  { id: '3', name: 'Panda', emoji: '🐼', sound: 'Squeak!', funFact: 'Pandas spend most of their day eating tasty green bamboo!', gradient: ['#ECE9E6', '#D8D8D8'] },
  { id: '4', name: 'Elephant', emoji: '🐘', sound: 'Pawoo!', funFact: 'Elephants are the largest animals on land, with big ears!', gradient: ['#E0C3FC', '#8EC5FC'] },
  { id: '5', name: 'Giraffe', emoji: '🦒', sound: 'Hummm!', funFact: 'Giraffes have very long necks to reach high tree leaves!', gradient: ['#FFF8E1', '#FFE082'] },
  { id: '6', name: 'Frog', emoji: '🐸', sound: 'Ribbit! Ribbit!', funFact: 'Frogs can jump up to 20 times their own body length!', gradient: ['#D4FC79', '#96E6A1'] },
  { id: '7', name: 'Cat', emoji: '🐱', sound: 'Meow! Purrr...', funFact: 'Cats can jump six times their height and sleep a lot!', gradient: ['#F6D365', '#FDA085'] },
  { id: '8', name: 'Dog', emoji: '🐶', sound: 'Woof! Woof!', funFact: 'Dogs have an amazing sense of smell and love playing fetch!', gradient: ['#84FAB0', '#8FD3F4'] },
  { id: '9', name: 'Owl', emoji: '🦉', sound: 'Hoot! Hoot!', funFact: 'Owls can turn their heads almost all the way around!', gradient: ['#EDE7F6', '#B39DDB'] },
  { id: '10', name: 'Bee', emoji: '🐝', sound: 'Buzz! Buzz!', funFact: 'Bees make delicious honey and dance to talk to each other!', gradient: ['#FFF59D', '#FBC02D'] },
];
