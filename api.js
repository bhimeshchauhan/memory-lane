const express = require("express");
const sqlite3 = require("sqlite3");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const cors = require("cors");

const app = express();
const port = 4001;
const db = new sqlite3.Database("memories.db");

app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// Initialize database
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS memories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      date TEXT NOT NULL,
      images TEXT, -- JSON array stored as a string
      favorite BOOLEAN DEFAULT 0
    )
  `);
});

// Utility function to handle errors
const handleDatabaseError = (res, err) => {
  console.error("Database Error:", err.message);
  res.status(500).json({ status: "error", message: err.message });
};

// Fetch timeline data
app.get("/timeline", (req, res) => {
  db.all("SELECT * FROM memories ORDER BY date DESC", (err, rows) => {
    if (err) {
      return handleDatabaseError(res, err);
    }

    const timelineData = rows.reduce((acc, memory) => {
      const date = new Date(memory.date);
      const month = date.toLocaleString("default", { month: "long" });
      const year = date.getFullYear();
      const monthKey = `${month} ${year}`;
      
      const event = {
        id: memory.id.toString(),
        title: memory.title,
        date: memory.date,
        description: memory.description,
        images: JSON.parse(memory.images || "[]"),
        favorite: !!memory.favorite,
      };
      
      const monthData = acc.find((m) => m.month === monthKey);
      if (monthData) {
        monthData.events.push(event);
      } else {
        acc.push({ month: monthKey, events: [event] });
      }
      
      return acc;
    }, []);
    res.json({ status: "success", data: timelineData });
  });
});

// Add a new memory
app.post("/memories", upload.array("images", 5), (req, res) => {
  const { title, description, date, favorite } = req.body;
  const uploadedFiles = req.files || [];
  const urls = req.body.urls ? JSON.parse(req.body.urls) : [];

  if (!title || !description || !date) {
    return res.status(400).json({
      status: "error",
      message: "Please provide all fields: title, description, and date.",
    });
  }

  const imagePaths = [
    ...urls,
    ...uploadedFiles.map((file) => `/uploads/${file.filename}`),
  ];

  const stmt = db.prepare(
    "INSERT INTO memories (title, description, date, images, favorite) VALUES (?, ?, ?, ?, ?)"
  );
  stmt.run(
    title,
    description,
    date,
    JSON.stringify(imagePaths),
    !!favorite,
    (err) => {
      if (err) {
        return handleDatabaseError(res, err);
      }
      res.status(201).json({ status: "success", message: "Memory created successfully" });
    }
  );
});

// Update a memory
app.put("/memories/:id", upload.array("images", 5), (req, res) => {
  const { id } = req.params;
  const { title, description, date, existingImages } = req.body;

  const uploadedFiles = req.files || [];
  let parsedExistingImages = [];

  try {
    // Parse existing images into an array and filter out blob URLs
    parsedExistingImages = existingImages
      ? JSON.parse(existingImages).filter((url) => !url.startsWith("blob:"))
      : [];
  } catch (error) {
    return res.status(400).json({
      status: "error",
      message: "Invalid format for existing images.",
    });
  }

  // Map uploaded files to their URLs
  const newImages = uploadedFiles.map((file) => `/uploads/${file.filename}`);

  // Merge existing images with new ones, avoiding duplicates
  const updatedImages = [...new Set([...parsedExistingImages, ...newImages])];

  if (!title || !description || !date) {
    return res.status(400).json({
      status: "error",
      message: "Please provide all fields: title, description, and date.",
    });
  }

  const stmt = db.prepare(
    "UPDATE memories SET title = ?, description = ?, date = ?, images = ? WHERE id = ?"
  );
  stmt.run(
    title,
    description,
    date,
    JSON.stringify(updatedImages),
    id,
    (err) => {
      if (err) {
        return res.status(500).json({ status: "error", message: err.message });
      }
      res.json({ status: "success", message: "Memory updated successfully" });
    }
  );
});

// Toggle favorite status
app.patch("/memories/:id/favorite", (req, res) => {
  const { id } = req.params;
  const { favorite } = req.body;

  const stmt = db.prepare("UPDATE memories SET favorite = ? WHERE id = ?");
  stmt.run(!!favorite, id, (err) => {
    if (err) {
      return handleDatabaseError(res, err);
    }
    res.json({ status: "success", message: "Memory favorite status updated successfully" });
  });
});

// Delete a memory
app.delete("/memories/:id", (req, res) => {
  const { id } = req.params;

  const stmt = db.prepare("DELETE FROM memories WHERE id = ?");
  stmt.run(id, (err) => {
    if (err) {
      return handleDatabaseError(res, err);
    }
    res.json({ status: "success", message: "Memory deleted successfully" });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
