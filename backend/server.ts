import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import cors from 'cors';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const dataPath = path.join(__dirname, 'galleryData.json');

// Helper: Load all items
function loadGallery() {
  if (!fs.existsSync(dataPath)) return [];
  const raw = fs.readFileSync(dataPath, 'utf-8');
  return JSON.parse(raw);
}

// Helper: Save all items
function saveGallery(items: any[]) {
  fs.writeFileSync(dataPath, JSON.stringify(items, null, 2));
}

// ✅ GET: Fetch all gallery items
app.get('/api/gallery', (req: Request, res: Response) => {
  const data = loadGallery();
  res.json(data);
});

// ❌ DELETE: Delete gallery item by ID
app.delete('/api/gallery/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const items = loadGallery();

  const index = items.findIndex((item: any) => item.id === id);
  if (index === -1) {
    return res.status(404).json({ message: 'Item not found' });
  }

  items.splice(index, 1);
  saveGallery(items);

  res.json({ message: 'Item deleted successfully' });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
