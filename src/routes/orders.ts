import { Router } from 'express';
import fs from 'fs';
import path from 'path';

const router = Router();
const ordersPath = path.join(__dirname, '../data/orders.json');

// List all orders with Edit and Delete buttons
router.get('/', (req, res) => {
  let orders = [];
  if (fs.existsSync(ordersPath)) {
    const data = fs.readFileSync(ordersPath, 'utf-8');
    orders = data ? JSON.parse(data) : [];
  }

  let html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>All Cake Orders</title>
    </head>
    <body>
      <h1>All Cake Orders</h1>
      <ul>
        ${orders.map((order: any, idx: number) =>
          `<li>
            <strong>${order.name}</strong>: ${order.cakeOption.replace(/-/g, ' ')}
            ${order.flavour ? `| Flavour: ${order.flavour}` : ''}
            ${order.filling ? `| Filling: ${order.filling}` : ''}
            <form method="POST" action="/orders/delete" style="display:inline;">
              <input type="hidden" name="index" value="${idx}">
              <button type="submit">Delete</button>
            </form>
            <form method="GET" action="/orders/edit" style="display:inline;">
              <input type="hidden" name="index" value="${idx}">
              <button type="submit">Edit</button>
            </form>
          </li>`
        ).join('')}
      </ul>
      <a href="/">Back to Order Form</a>
    </body>
    </html>
  `;
  res.send(html);
});

// Handle delete
router.post('/delete', (req, res) => {
  let orders = [];
  if (fs.existsSync(ordersPath)) {
    const data = fs.readFileSync(ordersPath, 'utf-8');
    orders = data ? JSON.parse(data) : [];
  }
  const index = parseInt(req.body.index, 10);
  if (!isNaN(index)) {
    orders.splice(index, 1);
    fs.writeFileSync(ordersPath, JSON.stringify(orders, null, 2));
  }
  res.redirect('/orders');
});

// (Optional) Edit handler placeholder
router.get('/edit', (req, res) => {
  res.send('<p>Edit functionality coming soon!</p><a href="/orders">Back</a>');
});

export default router;