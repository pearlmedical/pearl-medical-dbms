// pages/search-products.js

import React,{ useState,useEffect } from 'react';
import { Table,Form,Modal,Button } from 'react-bootstrap';

const EditProduct = () => {
  const [products,setProducts] = useState([
    { product_id: 1,product_name: 'Product 1',cost: 10.99,remarks: 'Sample remarks' }
  ]);
  const [searchTerm,setSearchTerm] = useState('');
  const [sortedField,setSortedField] = useState('product_id');
  const [sortOrder,setSortOrder] = useState('asc');
  const [editingProduct,setEditingProduct] = useState(null);
  const [showModal,setShowModal] = useState(false);

  useEffect(() => {
    // Fetch products from the API or your database here
    const fetchData = async () => {
      try {
        const response = await fetch('/api/sales/fetchAllProducts');
        if (response.ok) {
            const data = await response.json();
            setProducts(data);
        } else {
            console.error('Error fetching products:',response.status,response.statusText);
        }
    } catch (error) {
        console.error('Error fetching products:',error);
    }
};
    fetchData();
  },[]);

  const handleSort = (field) => {
    setSortedField(field);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const handleDoubleClick = (product) => {
    setEditingProduct(product);
    setShowModal(true);
  };

  const handleUpdate = async (updatedProduct) => {
    try {
      const response = await fetch('/api/sales/updateProduct',{
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProduct),
      });

      if (response.ok) {
        const data = await response.json();
        const updatedProducts = products.map((product) => (product.product_id === data.product_id ? data : product));
        setProducts(updatedProducts);
        setEditingProduct(null);
        setShowModal(false);
      } else {
        const errorData = await response.json();
        console.error('Error updating product:',errorData);
        // Handle error scenarios as needed
      }
    } catch (error) {
      console.error('Error updating product:',error);
      // Handle error scenarios as needed
    }
  };

  const handleCloseModal = () => {
    setEditingProduct(null);
    setShowModal(false);
  };

  return (
    <div>
      <h2>Edit Product Details</h2>
      <Form.Group controlId="searchForm">
        <Form.Control
          type="text"
          placeholder="Search by Product ID, Product Name, Cost, or Remarks"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Form.Group>
      <hr />
      <Table striped bordered hover>
        <thead>
          <tr>
            <th onClick={() => handleSort('product_id')}>Product ID</th>
            <th onClick={() => handleSort('product_name')}>Product Name</th>
            {/* <th onClick={() => handleSort('cost')}>Cost</th> */}
            <th onClick={() => handleSort('remarks')}>Remarks</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product,index) => (
            <tr
              key={product.product_id}
              style={{ backgroundColor: index % 2 === 0 ? '#c7f49d' : '#ffffff' }}
              onDoubleClick={() => handleDoubleClick(product)}
            >
              <td>{product.product_id}</td>
              <td>{product.product_name}</td>
              {/* <td>{product.cost}</td> */}
              <td>{product.remarks}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal for Editing Product Details */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Product Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formProductName">
              <Form.Label>Product Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter product name"
                value={editingProduct?.product_name || ''}
                onChange={(e) => setEditingProduct({ ...editingProduct,product_name: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formCost">
              <Form.Label>Cost</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter cost"
                value={editingProduct?.cost || ''}
                onChange={(e) => setEditingProduct({ ...editingProduct,cost: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formRemarks">
              <Form.Label>Remarks</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter remarks"
                value={editingProduct?.remarks || ''}
                onChange={(e) => setEditingProduct({ ...editingProduct,remarks: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={() => handleUpdate(editingProduct)}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default EditProduct;
