// pages/api/createEmployee.js
import supabase from '../sales/dbConnect';
const bcrypt = require('bcrypt');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { name, address, phone_number, email_id, password, access_level_id } = req.body;

  try {
    // Hash the password using bcrypt and a random salt
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password,salt);
    const hashedPassword = hash;
  

    // Create a new employee in the employees table
    const { data: newEmployee, error } = await supabase
      .from('employees')
      .insert([
        {
          name,
          address,
          phone_number,
          email_id,
            
          password: hashedPassword,
        },
      ]).select();

    if (error) {
      throw error;
    }

    // Fetch the created employee's ID
    const employeeId = newEmployee[0]?.employee_id;

    // Assign access level to the employee
    const { data: newEmployeeAcces, accesserror }= await supabase.from('employee_access').insert([
      {
        employee_id: employeeId,
        access_level_id: access_level_id,
      },
    ]).select();

    const access_key_id = newEmployee[0]?.access_key_id;
    res.status(200).json({ employee_id: employeeId, access_level_id: access_level_id,message: 'Employee created successfully' });
  } catch (error) {
    console.error('Error creating employee:', error);
    res.status(500).json({ message: 'Internal Server Error', error });
  }
}
