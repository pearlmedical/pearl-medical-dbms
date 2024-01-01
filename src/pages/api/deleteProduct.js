import supabase from './dbConnect';

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { product_id } = req.body;

  try {
    // Validate the request body here if needed

    // Delete the product from the products table
    const { data, error } = await supabase
      .from('products')
      .delete()
      .eq('product_id', product_id);
    // '*' returns all columns, you can specify the columns you want if needed

    console.log('Response Data:', data);  // Log the response data
    console.log('Error:', error);  // Log the error

    if (error) {
      throw error;
    }

    if (data && data.length > 0) {
      const deletedProduct = data[0];
      return res.status(200).json(deletedProduct);
    } else {
      return res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error('Error deleting product:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
