// api/getAccessLevels.js
import supabase from '../sales/dbConnect';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    // Fetch all access levels from the access_levels table
    const { data: accessLevelsData, error: accessLevelsError } = await supabase
      .from('access_levels')
      .select('*');

    if (accessLevelsError) {
      throw accessLevelsError;
    }

    return res.status(200).json(accessLevelsData || []); // Return an empty array if no data is found
  } catch (error) {
    console.error('Error fetching Access Levels:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}


