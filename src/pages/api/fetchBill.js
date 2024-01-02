// api/getProducts.js
import supabase from './dbConnect';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    // Fetch all products from the bills table, including the user's name from existing_users
    const { data: billsData, error: billsError } = await supabase
      .from('bills')
      .select('*');

    if (billsError) {
      throw billsError;
    }

    // Extract user_ids from billsData
    const userIds = billsData.map((bill) => bill.user_id);

    // Fetch user names from existing_users based on user_ids
    const { data: usersData, error: usersError } = await supabase
      .from('existing_users')
      .select('user_id, name')
      .in('user_id', userIds);

    if (usersError) {
      throw usersError;
    }

    // Create a mapping of user_id to name
    const userIdToNameMap = {};
    usersData.forEach((user) => {
      userIdToNameMap[user.user_id] = user.name;
    });

    // Combine billsData and user names
    const billsWithUserNames = billsData.map((bill) => ({
      ...bill,
      user_name: userIdToNameMap[bill.user_id] || 'Unknown User', // 'Unknown User' if no match
    }));

    return res.status(200).json(billsWithUserNames || []); // Return an empty array if no data is found
  } catch (error) {
    console.error('Error fetching Bills with user names:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
