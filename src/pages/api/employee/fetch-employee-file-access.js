import supabase from '../sales/dbConnect';

export default async function handler(req,res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { employee_id,access_level_file } = req.query;

  try {
    // Create a new employee in the employees table
    const { data: level,error: levelError } = await supabase
      .from('access_levels')
      .select('access_level_id')
      .eq('level_name',access_level_file)
      .select();

    if (levelError) {
      throw levelError;
    }

    const { data,error } = await supabase
      .from('employee_access')
      .select('access_levels')
      .eq('employee_id',employee_id)
      .select();

    // Check if there is data and access_levels in the response
    if (data && data.length > 0 && data[0].access_levels) {
      if (data[0].access_levels.includes('a1')) {
        res.status(200).json({ access: true });
      } else if (level && level.length > 0 && data[0].access_levels.includes(level[0].access_level_id)) {
        res.status(200).json({ access: true });
      } else {
        res.status(200).json({ access: false });
      }
    } else {
      // If there is no data or access_levels, assume no access
      res.status(200).json({ access: false });
    }
  } catch (error) {
    console.error('Error checking file access:',error);
    res.status(500).json({ message: 'Internal Server Error',error });
  }
}
