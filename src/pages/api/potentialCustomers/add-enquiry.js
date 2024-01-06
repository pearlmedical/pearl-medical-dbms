// api/makeBill.js
import supabase from '../sales/dbConnect';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { customer_id, date_of_enquiry, remarks,follow_up_date } = req.body;
 const is_open= true;
  try {
    // Validate the request body here if needed

    // Insert a new bill into the bills table
    const { data: newEnquiry, error } = await supabase
      .from('enquiries')
      .insert([
        {
        customer_id,
          date_of_enquiry,
          remarks,
       follow_up_date,
       is_open
        },
      ])
      .select();

    if (error) {
      throw error;
    }

    return res.status(201).json(newEnquiry[0]);
  } catch (error) {
    console.error('Error creating enquiry:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
