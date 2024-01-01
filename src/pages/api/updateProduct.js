import supabase from './dbConnect';

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { product_id,   product_name,
    cost,
    remarks, } = req.body;

  try {
    // Validate the request body here if needed

    // Update the product attributes in the products table
    const { data, error } = await supabase
      .from('products')
      .update(product_name,cost,remarks)
      .eq('product_id', product_id)
      .select();

    console.log('Response Data:', data);  // Log the response data
    console.log('Error:', error);  // Log the error

    if (error) {
      throw error;
    }

    if (data && data.length > 0) {
      const updatedProduct = data[0];
      return res.status(200).json(updatedProduct);
    } else {
      return res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error('Error updating product:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
