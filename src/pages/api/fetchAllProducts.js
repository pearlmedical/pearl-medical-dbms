// api/getProducts.js
import supabase from './dbConnect';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    // Fetch all products from the products table
    const { data, error } = await supabase
      .from('products')
      .select('*');

    if (error) {
      throw error;
    }

    return res.status(200).json(data || []); // Return an empty array if no data is found
  } catch (error) {
    console.error('Error fetching products:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
