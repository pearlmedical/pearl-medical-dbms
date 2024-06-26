// pages/api/addProductPurchased.js
import supabase from '../sales/dbConnect';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { customer_id,enquiry_id,  products,quotation_id } = req.body;

  try {
    // Validate the request body here if needed

    // Create an array of objects to be inserted
    const rowsToInsert = products.map(({ product_id,price_tie,quantity}) => ({
        customer_id,
    enquiry_id,
      product_id,
      price_tie,
      quantity,
      quotation_id
    
    }));



    // Insert all rows into the quotation pricing  table
    const { data, error } = await supabase
      .from('quotation-pricing')
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
