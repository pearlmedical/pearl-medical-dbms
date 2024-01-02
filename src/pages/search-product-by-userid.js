// pages/product-user.js

import React, { useState, useEffect } from 'react';
import { Table, InputGroup, FormControl, Modal, Button } from 'react-bootstrap';
import LoadingBar from 'react-top-loading-bar';
import { BarLoader } from 'react-spinners';

const SearchProductByUser = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [productDetails, setProductDetails] = useState([]);
  const [loadingBarProgress, setLoadingBarProgress] = useState(0);
  const [userLoading, setUserLoading] = useState(false);

  // Function to fetch users
  const fetchUsers = async () => {
    setLoadingBarProgress(10);
    try {
      const response = await fetch('/api/sales/fetchExistingUser');
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        console.error('Error fetching users:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoadingBarProgress(100);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Function to fetch product details based on selected user
  const fetchProductDetails = async (userId) => {
    setLoadingBarProgress(10); // Reset loading bar for product details
    setUserLoading(true);
    try {
      const response = await fetch(`/api/sales/fetchProductByUser?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setProductDetails(data);
      } else {
        console.error('Error fetching product details:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error fetching product details:', error);
    } finally {
      setLoadingBarProgress(100); // Complete loading bar for product details
      setUserLoading(false);
    }
  };

  // Function to handle double click on user row
  const handleUserRowDoubleClick = (user) => {
    setSelectedUser(user);
    fetchProductDetails(user.user_id);
  };

  return (
    <div>
      <h1>Product-User Page</h1>

      {/* Search Bar for Users */}
      <InputGroup className="mb-3">
        <FormControl
          placeholder="Search by User ID, Name, or Phone Number"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </InputGroup>

      {/* Users Table */}
      <div>
        <h4>All Users</h4>
        { (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>User ID</th>
                <th>Name</th>
                <th>Phone Number</th>
              </tr>
            </thead>
            <tbody>
              {users
                .filter(
                  (user) =>
                    user.user_id.toString().includes(searchTerm) ||
                    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    user.phone_number.includes(searchTerm)
                )
                .map((user) => (
                  <tr key={user.user_id} onDoubleClick={() => handleUserRowDoubleClick(user)}>
                    <td>{user.user_id}</td>
                    <td>{user.name}</td>
                    <td>{user.phone_number}</td>
                  </tr>
                ))}
            </tbody>
          </Table>
        )}
      </div>

      {/* Product Details */}
      <div style={{ marginTop: '20px' }}>
        <h4>Product Details</h4>
       {userLoading ? (
          <div className="text-center">
            <BarLoader color="#17a2b8" loading={userLoading} />
          </div>
        ) :
      (  <Table striped bordered hover>
          <thead>
            <tr>
              <th>Product ID</th>
              <th>Product Name</th>
              <th>Total Quantity</th>
              <th>Cost</th>
              <th>Remarks</th>
            </tr>
          </thead>
          <tbody>
            {productDetails.map((product) => (
              <tr key={product.product_id}>
                <td>{product.product_id}</td>
                <td>{product.product_name}</td>
                <td>{product.total_quantity}</td>
                <td>{product.cost}</td>
                <td>{product.remarks}</td>
              </tr>
            ))}
          </tbody>
        </Table>)
        }
      </div>
    </div>
  );
};

export default SearchProductByUser;
