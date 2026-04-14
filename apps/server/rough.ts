const columns = [
  { id: "col1", card: ["carda", "cardb"] },
  { id: "col2", card: ["cardC"] },
  { id: "col3", card: ["cardD", "cardE"] },
];

const res = columns.map((col) => col.card);
console.log(res);

const res1 = columns.flatMap((col) => col.card);
console.log(res1);

const a = [1, 2, 3];
const b = [3, 4];

const result1 = [...new Set([...a, ...b])];

const cards = [
  {
    id: 1,
    title: "Todo",
  },
  { id: 2, title: "In Progress" },
];

console.log("old card");
console.log(cards);
const updatedCard = { id: 2, title: "Done" };

console.log("Updatedcard");
const merged = [
  ...cards.filter((card) => card.id !== updatedCard.id),
  updatedCard,
];
console.log(merged);

const merged2 = cards.map((card) =>
  card.id === updatedCard.id ? updatedCard : card
);

console.log(merged2);
