// pages/api/getProductsPurchasedByUser.js
import supabase from './dbConnect';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { userId } = req.query;

  try {
    // Validate the userId here if needed

    // Fetch all product purchases for the given user
    const { data: userPurchases, error: purchasesError } = await supabase
      .from('products_purchased')
      .select('product_id, quantity')
      .eq('user_id', userId);

    if (purchasesError) {
      throw purchasesError;
    }

    // Get unique product_ids
    const uniqueProductIds = [...new Set(userPurchases.map((purchase) => purchase.product_id))];

    // Calculate total quantity for each product
    const productsDetails = uniqueProductIds.map((productId) => {
      const totalQuantity = userPurchases
        .filter((purchase) => purchase.product_id === productId)
        .reduce((sum, purchase) => sum + purchase.quantity, 0);

      return {
        product_id: productId,
        total_quantity: totalQuantity,
      };
    });

    // Fetch product details for each product_id
    const productsWithData = await Promise.all(productsDetails.map(async (product) => {
      const { data: productData, error: productError } = await supabase
        .from('products')
        .select('product_name, cost, remarks')
        .eq('product_id', product.product_id)
        .single();

      if (productError) {
        throw productError;
      }

      return {
        ...product,
        ...productData,
      };
    }));

    return res.status(200).json(productsWithData || []);
  } catch (error) {
    console.error('Error fetching products purchased by user:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
