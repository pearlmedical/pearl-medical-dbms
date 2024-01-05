import supabase from '../sales/dbConnect';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { employee_id } = req.query;

  try {
    // Validate the billId here if needed

    // Fetch product purchases for the given bill
    const { data: employee_access, error: employee_access_Error } = await supabase
      .from('employee_access')
      .select(`
        access_levels
      `)
      .eq('employee_id', employee_id);

    if (employee_access_Error) {
      throw employee_access_Error;
    }
console.log(employee_access[0].access_levels[0]);
const access_allowed=[];

for(let i=0;i<employee_access[0].access_levels.length;i++){
    const { data:  levels, error: levels_Error } = await supabase
    .from('access_levels')
    .select('level_name')
    .eq('access_level_id', employee_access[0].access_levels[i])
    .single();
    access_allowed.push(levels.level_name);
}
   

   




  


    return res.status(200).json({ access_allowed });
   // return res.status(200).json({ userData,productPurchases, totalAmount });
  } catch (levels_Error) {
   // console.error('Error fetching levels', levels_Error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
