// pages/api/createEmployee.js
import supabase from '../sales/dbConnect';


export default async function handler(req,res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { employee_id,access_level_names } = req.body;
 const  access_levels=[];
  try {

 

    // Create a new employee in the employees table
    for(let i=0;i<access_level_names.length;i++){
    const { data: level,error } = await supabase
      .from('access_levels')
      .select(
        

            `
           access_level_id
          `
        
      ).eq('level_name',access_level_names[i]).select();
      access_levels.push(level[0].access_level_id);
      }
    

      console.log(access_levels);
    // Fetch the created employee's ID
    //const access_key_id = newAccess[0]?.access_key_id;
    const { data, error } = await supabase
    .from('employee_access')
    .update({ access_levels: access_levels })
    .eq('employee_id', employee_id)
    .select();

   res.status(200).json({data,message: 'Access Updated successfully' });


  } catch (error) {
    console.error('Error creating employee:',error);
    res.status(500).json({ message: 'Internal Server Error',error });
  }
}
