import express, { Request, Response } from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = 5000;

// Path to gallery.json
const GALLERY_PATH = path.join(__dirname, 'gallery.json');

app.use(cors());
app.use(express.json());

// Helper to read JSON file
const readGallery = (): any[] => {
  const data = fs.readFileSync(GALLERY_PATH, 'utf-8');
  return JSON.parse(data);
};

// Helper to write JSON file
const writeGallery = (data: any[]) => {
  fs.writeFileSync(GALLERY_PATH, JSON.stringify(data, null, 2), 'utf-8');
};

// GET all gallery items
app.get('/api/gallery', (req: Request, res: Response) => {
  const items = readGallery();
  res.json(items);
});

// DELETE gallery item by id
app.delete('/api/gallery/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  let items = readGallery();

  const itemIndex = items.findIndex(item => item.id === id);
  if (itemIndex === -1) {
    return res.status(404).json({ message: 'Item not found' });
  }

  items.splice(itemIndex, 1); // Remove the item
  writeGallery(items);

  res.json({ message: 'Item deleted successfully' });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
