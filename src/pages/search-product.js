// pages/search-product.js

import React,{ useState,useEffect } from 'react';
import Layout from '@/components/Layout';
import { Table,Form } from 'react-bootstrap';

const SearchProduct = () => {
    const [products,setProducts] = useState([]);
    const [searchTerm,setSearchTerm] = useState('');
    const [sortedField,setSortedField] = useState('product_id');
    const [sortOrder,setSortOrder] = useState('asc');

    // Dummy API response (replace this with your actual API call)
    const fetchAllProducts = async () => {
        try {
            // Your actual API call to fetch products
            const response = await fetch('api/fetchAllProducts');
            const data = await response.json();
            setProducts(data);
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

    const filteredProducts = products.filter((product) =>
        product.product_id.toString().includes(searchTerm) || product.product_name.toLowerCase().includes(searchTerm.toLowerCase())
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
            {filteredProducts.length > 0 ? (
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th onClick={() => handleSort('product_id')}>Product ID</th>
                            <th onClick={() => handleSort('product_name')}>Product Name</th>
                            <th onClick={() => handleSort('cost')}>Cost</th>
                            <th onClick={() => handleSort('remarks')}>Remarks</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.map((product) => (
                            <tr key={product.product_id}>
                                <td>{product.product_id}</td>
                                <td>{product.product_name}</td>
                                <td>{product.cost}</td>
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
