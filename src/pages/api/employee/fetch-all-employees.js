// pages/api/getProductsInterestedIn.js
import supabase from '../sales/dbConnect';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    // Fetch all records from products_interested_in along with the product name
    const { data: employeeData, error: employeeError } = await supabase
      .from('employees')
      .select(
        
        `
        employee_id,
        name,
        phone_number,
        email_id
      `

        // Add other fields as needed
      );

    if (employeeError) {
      throw employeeError;
    }
//console.log(interestsData);
    // Extract product_id from the fetched interests data
  
    return res.status(200).json(employeeData || []); // Return an empty array if no data is found
  } catch (error) {
    console.error('Error fetching employees Data', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
