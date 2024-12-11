const sqlite3 = require("sqlite3");
const db = new sqlite3.Database("memories.db");

function getRandomDate(start, end) {
  const date = new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
  return date.toISOString().split("T")[0];
}

function getRandomFavorite() {
  return Math.random() > 0.5;
}

const seedData = [
  {
    title: "Family Picnic",
    description: "A relaxing day at the park with the whole family.",
    date: getRandomDate(new Date("2022-01-01"), new Date()),
    images: [
      "https://images.unsplash.com/photo-1506784365847-bbad939e9335?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
      "https://images.unsplash.com/photo-1560807707-8cc77767d783?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    ],
    favorite: getRandomFavorite(),
  },
  {
    title: "Beach Day",
    description: "A sunny day spent building sandcastles and swimming.",
    date: getRandomDate(new Date("2022-01-01"), new Date()),
    images: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
      "https://images.unsplash.com/photo-1506784365847-bbad939e9335?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    ],
    favorite: getRandomFavorite(),
  },
  {
    title: "John's First Steps",
    description: "John took his first steps today, a huge milestone!",
    date: getRandomDate(new Date("2022-01-01"), new Date()),
    images: [
      "https://images.unsplash.com/photo-1504151932400-72d4384f04b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
      "https://images.unsplash.com/photo-1519455953755-af066f52f1ea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    ],
    favorite: getRandomFavorite(),
  },
  {
    title: "Mountain Hike",
    description: "An adventurous hike to the peak of Mount Eagle.",
    date: getRandomDate(new Date("2022-01-01"), new Date()),
    images: [
      "https://images.unsplash.com/photo-1486915309851-b0cc1f8a0089?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
      "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    ],
    favorite: getRandomFavorite(),
  },
  {
    title: "Mountain Bike",
    description: "An adventurous bike to the peak of Mount Doom.",
    date: getRandomDate(new Date("2022-01-01"), new Date()),
    images: [
      "https://images.unsplash.com/photo-1486915309851-b0cc1f8a0089?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
      "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    ],
    favorite: getRandomFavorite(),
  },
  {
    title: "Winter Skiing Adventure",
    description: "Hit the slopes for an exciting day of skiing.",
    date: getRandomDate(new Date("2022-01-01"), new Date()),
    images: [
      "https://images.unsplash.com/photo-1519817914152-22f0c05bc5b9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
      "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    ],
    favorite: getRandomFavorite(),
  },
  {
    title: "Graduation Day Celebration",
    description: "Celebrated a milestone achievement with family and friends.",
    date: getRandomDate(new Date("2022-01-01"), new Date()),
    images: [
      "https://images.unsplash.com/photo-1559494003-ecfbc529c7a1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    ],
    favorite: getRandomFavorite(),
  },
  {
    title: "Camping in the Woods",
    description: "A serene weekend camping under the stars with family.",
    date: getRandomDate(new Date("2022-01-01"), new Date()),
    images: [
      "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
      "https://images.unsplash.com/photo-1506702315536-dd8b83e2dcf9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    ],
    favorite: getRandomFavorite(),
  },
  {
    title: "Hot Air Balloon Ride",
    description:
      "Soared high above the landscape in a colorful hot air balloon.",
    date: getRandomDate(new Date("2022-01-01"), new Date()),
    images: [
      "https://images.unsplash.com/photo-1519377209673-470db620ee9f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
      "https://images.unsplash.com/photo-1517697471339-4aa320d295fc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    ],
    favorite: getRandomFavorite(),
  },
];

db.serialize(() => {
  db.run("DELETE FROM memories", (err) => {
    if (err) {
      console.error("Error clearing memories table:", err.message);
      return;
    }
    console.log("All existing data in the memories table cleared.");

    const stmt = db.prepare(
      "INSERT INTO memories (title, description, date, images, favorite) VALUES (?, ?, ?, ?, ?)"
    );

    seedData.forEach((memory) => {
      stmt.run(
        memory.title,
        memory.description,
        memory.date,
        JSON.stringify(memory.images),
        memory.favorite
      );
    });

    stmt.finalize(() => {
      console.log("Seed data inserted successfully!");
      db.close();
    });
  });
});
