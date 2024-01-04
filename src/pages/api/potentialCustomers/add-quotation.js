// api/makeBill.js
import supabase from '../sales/dbConnect';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

//   const { customer_id, employee_id,date, enquiry_id } = req.body;
const { customer_id, date, enquiry_id,remarks } = req.body;
  try {
    // Validate the request body here if needed
const employee_id=100000;
    // Insert a new bill into the bills table
    const { data: newEnquiry, error } = await supabase
      .from('quotation')
      .insert([
        {
            employee_id,
        customer_id,
          date,
          enquiry_id,
       remarks
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
