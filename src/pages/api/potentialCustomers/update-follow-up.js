import supabase from '../sales/dbConnect';

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { enquiry_id,follow_up_date,is_open,closed_by } = req.body;

  try {
    // Validate the request body here if needed

    const { data, error } = await supabase
    .from('enquiries')
    .update({ follow_up_date: follow_up_date,is_open:is_open,closed_by:closed_by})
    .eq('enquiry_id', enquiry_id)
    .select()
  
    // Update the product attributes in the products table
 
   

    if (error) {
      throw error;
    }

    if (data && data.length > 0) {
      const updatedEnquiry = data[0];
      return res.status(200).json(updatedEnquiry);
    } else {
      return res.status(404).json({ message: 'Enquiry not found' });
    }
  } catch (error) {
    console.error('Error updating Enquiry:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
