// pages/api/addProductPurchased.js
import supabase from './dbConnect';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { user_id, bill_id, products } = req.body;

  try {
    // Validate the request body here if needed

    // Create an array of objects to be inserted
    const rowsToInsert = products.map(({ product_id, quantity }) => ({
        user_id,
      bill_id,
      product_id,
      quantity,
    }));

    console.log('Rows to Insert:', rowsToInsert);

    // Insert all rows into the products_purchased table
    const { data, error } = await supabase
      .from('products_purchased')
      .insert(rowsToInsert)
      .select();

    console.log('Response Data:', data);
    console.log('Error:', error);

    if (error) {
      throw error;
    }
  

    return res.status(201).json(data);
  } catch (error) {
    console.error('Error adding product purchases:', error);
    return res.status(500).json({ message: 'Internal Server Error', error });
  }
}
