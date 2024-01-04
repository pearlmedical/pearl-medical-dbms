// pages/api/getProductsInterestedIn.js
import supabase from '../sales/dbConnect';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    // Fetch all records from products_interested_in along with the product name
    const { data: interestsData, error: interestsError } = await supabase
      .from('products_interested_in')
      .select(
        
        `
        intrest_id,
        product_id,
        products(product_name),
        potential_customers (
          customer_id,name,phone_number
        )
      `

        // Add other fields as needed
      );

    if (interestsError) {
      throw interestsError;
    }
//console.log(interestsData);
    // Extract product_id from the fetched interests data
  
    return res.status(200).json(interestsData || []); // Return an empty array if no data is found
  } catch (error) {
    console.error('Error fetching products_interested_in:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
