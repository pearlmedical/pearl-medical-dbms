// pages/api/getProductsInterestedIn.js
import supabase from '../dbConnect';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { customer_id } = req.query;

  if (!customer_id) {
    return res.status(400).json({ message: 'Missing customer_id parameter' });
  }

  try {
    // Fetch products_interested_in based on customer_id
    const { data, error } = await supabase
      .from('products_interested_in')
      .select('*')
      .eq('customer_id', parseInt(customer_id, 10));

    if (error) {
      throw error;
    }

    return res.status(200).json(data || []); // Return an empty array if no data is found
  } catch (error) {
    console.error('Error fetching products_interested_in:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
