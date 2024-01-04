// pages/search-product.js

import React,{ useState,useEffect } from 'react';
import Layout from '@/components/Layout';
import { Table,Form } from 'react-bootstrap';

const SearchProduct = () => {
    const [products,setProducts] = useState([{ product_id: 1,product_name: 'Product 1',cost: 100,remarks: 'Remarks 1'}]);
    const [searchTerm,setSearchTerm] = useState('');
    const [sortedField,setSortedField] = useState('product_id');
    const [sortOrder,setSortOrder] = useState('asc');

    // Dummy API response (replace this with your actual API call)
    const fetchAllProducts = async () => {
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

    useEffect(() => {
        fetchAllProducts();
    },[]);

    const handleSort = (field) => {
        setSortedField(field);
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    };

    const filteredProducts = products?.filter(
        (product) =>
            product.product_id.toString().includes(searchTerm) ||
            product.product_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <h2>Search Product</h2>
            <Form.Group controlId="searchForm">
                <Form.Control
                    type="text"
                    placeholder="Search by Product ID or Product Name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </Form.Group>
            <hr/>
            {filteredProducts.length > 0 ? (
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
                        {filteredProducts?.map((product,index) => (
                            <tr key={product.product_id} style={{ backgroundColor: index % 2 === 0 ? '#c7f49d' : '#ffffff' }}>
                                <td>{product.product_id}</td>
                                <td>{product.product_name}</td>
                                {/* <td>{product.cost}</td> */}
                                <td>{product.remarks}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            ) : (
                <p>No records found in the table.</p>
            )}
        </div>
    );
};

export default SearchProduct;
