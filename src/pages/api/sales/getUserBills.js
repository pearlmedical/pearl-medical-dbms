// api/getUserBills.js
import supabase from './dbConnect';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { user_id } = req.query;

  try {
    // Validate user_id here if needed

    // Fetch all bills for the specified user_id
    const { data, error } = await supabase
      .from('bills')
      .select('*')
      .eq('user_id', user_id);

    if (error) {
      throw error;
    }

    return res.status(200).json(data || []); // Return an empty array if no data is found
  } catch (error) {
    console.error('Error fetching user bills:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
