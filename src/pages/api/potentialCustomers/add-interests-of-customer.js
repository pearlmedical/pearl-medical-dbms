// pages/api/addProductPurchased.js
import supabase from '../sales/dbConnect';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { customer_id,enquiry_id,  products } = req.body;

  try {
    // Validate the request body here if needed

    // Create an array of objects to be inserted
    const rowsToInsert = products.map(({ product_id,quantity}) => ({
        customer_id,
    enquiry_id,
      product_id,
      quantity,

    
    }));

    console.log('Rows to Insert:', rowsToInsert);

    // Insert all rows into the products_interested_in table
    const { data, error } = await supabase
      .from('products_interested_in')
      .insert(rowsToInsert)
      .select();

    console.log('Response Data:', data);
    console.log('Error:', error);

    if (error) {
      throw error;
    }
  

    return res.status(201).json(data);
  } catch (error) {
    console.error('Error adding product interests', error);
    return res.status(500).json({ message: 'Internal Server Error', error });
  }
}
