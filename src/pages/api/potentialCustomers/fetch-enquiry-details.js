// api/enquiryDetails.js
import supabase from '../sales/dbConnect';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { enquiryId } = req.query;

  try {
    // Validate the request parameters here if needed

    // Fetch details for the specified enquiry ID

    const { data: enquiryDetails, error } = await supabase
      .from('products_interested_in')
      .select(`
      enquiry_id,
      products(product_id,product_name),
      quantity,
      potential_customers (
        customer_id,name,phone_number
      )
    `).eq('enquiry_id', enquiryId)
     


     


    if (error) {
      throw error;
    }

    if (!enquiryDetails) {
      return res.status(404).json({ message: 'Enquiry not found' });
    }

    return res.status(200).json(enquiryDetails);
  } catch (error) {
    console.error('Error fetching enquiry details:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
