// api/makeBill.js
import supabase from './dbConnect';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { user_id, date_of_sale, remarks, total_amount } = req.body;

  try {
    // Validate the request body here if needed

    // Insert a new bill into the bills table
    const { data: newBill, error } = await supabase
      .from('bills')
      .insert([
        {
          user_id,
          date_of_sale,
          remarks,
          total_amount,
        },
      ])
      .select();

    if (error) {
      throw error;
    }

    return res.status(201).json(newBill[0]);
  } catch (error) {
    console.error('Error creating bill:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
