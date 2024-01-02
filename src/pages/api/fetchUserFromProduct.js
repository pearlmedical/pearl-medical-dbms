// pages/api/getProductDetails.js
import supabase from './dbConnect';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { productId } = req.query;

  try {
    // Validate the productId here if needed

    // Fetch product details
    const { data: productDetails, error: productDetailsError } = await supabase
      .from('products')
      .select('product_id, product_name')
      .eq('product_id', productId)
      .single();

    if (productDetailsError) {
      throw productDetailsError;
    }

    // Fetch all purchases for the given product
    const { data: productPurchases, error: productPurchasesError } = await supabase
      .from('products_purchased')
      .select('bill_id, product_id, user_id, quantity')
      .eq('product_id', productId);

    if (productPurchasesError) {
      throw productPurchasesError;
    }

    // Create a map to store aggregated quantities for each user
    const userQuantitiesMap = new Map();

    // Iterate through product purchases to aggregate quantities for each user
    for (const purchase of productPurchases) {
      const { user_id, quantity } = purchase;
      const totalQuantity = userQuantitiesMap.has(user_id)
        ? userQuantitiesMap.get(user_id) + quantity
        : quantity;
      userQuantitiesMap.set(user_id, totalQuantity);
    }

    // Fetch user details for each user_id
    const userDetails = [];

    for (const [user_id, totalQuantity] of userQuantitiesMap) {
      const { data: user, error: userError } = await supabase
        .from('existing_users')
        .select('user_id, name, address, organization_name, phone_number, email_id')
        .eq('user_id', user_id)
        .single();

      if (userError) {
        throw userError;
      }

      userDetails.push({
        user_id: user.user_id,
        name: user.name,
        address: user.address,
        organization_name: user.organization_name,
        phone_number: user.phone_number,
        email_id: user.email_id,
        total_quantity: totalQuantity,
        product_id: productDetails.product_id,
        product_name: productDetails.product_name,
      });
    }

    return res.status(200).json(userDetails);
  } catch (error) {
    console.error('Error fetching product details:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
