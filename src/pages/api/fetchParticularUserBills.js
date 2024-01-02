// pages/api/getUserBills.js
import supabase from './dbConnect';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { userId } = req.query;

  try {
    // Validate the userId here if needed

    // Fetch all bills for the given user
    const { data: bills, error: billsError } = await supabase
      .from('bills')
      .select('bill_id, user_id, date_of_sale, remarks')
      .eq('user_id', userId);

    if (billsError) {
      throw billsError;
    }

    return res.status(200).json(bills || []);
  } catch (error) {
    console.error('Error fetching user bills:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
