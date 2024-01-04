// pages/api/login.js
import supabase from '../sales/dbConnect';
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { employee_id, password } = req.body;

  try {
    const { data: userData, error } = await supabase
      .from('employees')
      .select('employee_id, password')
      .eq('employee_id', employee_id)
      .single();

    if (error) {
      throw error;
    }

    if (!userData) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Now 'employee_id' is defined in userData
    const { employee_id: userId, password: hashedPassword } = userData;

    // Compare the provided password with the hashed password
    const passwordMatch = await bcrypt.compareSync(password, hashedPassword);
 
    
    if (passwordMatch) {
      res.status(200).json({ employee_id: userId, message: 'Login successful' });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal Server Error', error });
  }
}
