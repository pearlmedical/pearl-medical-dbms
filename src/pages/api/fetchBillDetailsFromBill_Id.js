// pages/api/getProductPurchasesByBill.js
import supabase from './dbConnect';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { billId } = req.query;

  try {
    // Validate the billId here if needed

    // Fetch product purchases for the given bill
    const { data: productPurchases, error: purchasesError } = await supabase
      .from('products_purchased')
      .select(`
        purchase_id,
        product_id,
        quantity
      `)
      .eq('bill_id', billId);

    if (purchasesError) {
      throw purchasesError;
    }

    // Fetch total_amount from the bills table
    const { data: billData, error: billError } = await supabase
      .from('bills')
      .select('total_amount')
      .eq('bill_id', billId)
      .single();

    if (billError) {
      throw billError;
    }

    const totalAmount = billData ? billData.total_amount : null;

    return res.status(200).json({ productPurchases, totalAmount });
  } catch (error) {
    console.error('Error fetching product purchases and total amount by bill:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
