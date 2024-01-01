// api/addProduct.js
import supabase from './dbConnect';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const {
    product_name,
    cost,
    remarks,
    // Add other product details as needed
  } = req.body;

  try {
    // Validate the request body here if needed

    // Insert the new product into the products table
    const { data, error } = await supabase
      .from('products')
      .upsert([{ product_name, cost, remarks }], { returning: 'representation' });

    if (error) {
      console.error('Error adding product:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }

    // Check if data is not null
    if (data) {
      return res.status(201).json({ message: 'Product added successfully' });
    } else {
      return res.status(500).json({ message: 'Failed to add product' });
    }
  } catch (error) {
    console.error('Error adding product:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
