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
      .insert([{ product_name:product_name, cost:cost,remarks: remarks }]).select();

    if (error) {
      throw error;
    }

    // Check if data is not null before accessing its elements
    const newProduct = data && data.length > 0 ? data[0] : null;

    return res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error adding product:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
