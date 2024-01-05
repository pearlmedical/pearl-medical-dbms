
import supabase from '../sales/dbConnect';

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { name, address, phone_number, email_id ,employee_id} = req.body;

  try {
    // Validate the request body here if needed

    const { data, error } = await supabase
      .from('employees')
      .update({ name, address, phone_number, email_id })
      .eq('employee_id', employee_id)
      .select();

    // Update the employee attributes in the existing_users table



    if (error) {
      throw error;
    }

    if (data && data.length > 0) {
      const updatedEmployee = data[0];
      return res.status(200).json(updatedEmployee);
    } else {
      return res.status(404).json({ message: 'Employee not found' });
    }
  } catch (error) {
    console.error('Error updating employee:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
