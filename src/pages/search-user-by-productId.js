// pages/product-user.js

import React,{ useState,useEffect } from 'react';
import { Table,InputGroup,FormControl,Modal,Button } from 'react-bootstrap';
import LoadingBar from 'react-top-loading-bar';
import { BarLoader } from 'react-spinners';

const SearchProductByUserID = () => {
    const [searchTerm,setSearchTerm] = useState('');
    const [allProducts,setAllProducts] = useState([]);
    const [selectedProduct,setSelectedProduct] = useState(null);
    const [users,setUsers] = useState([]);
    const [selectedUser,setSelectedUser] = useState(null);
    const [showUserDetailsModal,setShowUserDetailsModal] = useState(false);
    const [loadingBarProgress,setLoadingBarProgress] = useState(0);
    const [userLoading,setUserLoading] = useState(false);

    // Function to fetch all products
    const fetchAllProducts = async () => {
        setLoadingBarProgress(10); // Initial progress
        try {
            const response = await fetch('/api/sales/fetchAllProducts');
            if (response.ok) {
                const data = await response.json();
                setAllProducts(data);
            } else {
                console.error('Error fetching products:',response.status,response.statusText);
            }
        } catch (error) {
            console.error('Error fetching products:',error);
        } finally {
            setLoadingBarProgress(100); // Complete progress
        }
    };

    useEffect(() => {
        fetchAllProducts();
    }, []);

    

    // Function to fetch users based on selected product
    const fetchUsers = async (productId) => {
        setUserLoading(true);
        try {
            const response = await fetch(`/api/sales/fetchUserFromProduct?productId=${productId}`);
            if (response.ok) {
                const data = await response.json();
                setUsers(data);
            } else {
                console.error('Error fetching users:',response.status,response.statusText);
            }
        } catch (error) {
            console.error('Error fetching users:',error);
        } finally {
            setUserLoading(false);
        }
    };

    // Function to handle double click on product row
    const handleProductRowDoubleClick = (product) => {
        setSelectedProduct(product);
        fetchUsers(product.product_id);
    };

    // Function to handle double click on user row
    const handleUserRowDoubleClick = (user) => {
        setSelectedUser(user);
        setShowUserDetailsModal(true);
    };

    // Function to close user details modal
    const handleCloseUserDetailsModal = () => {
        setShowUserDetailsModal(false);
    };

    return (
        <div>
            <h1>Product-Customer-Page</h1>

            {/* Loading Bar */}
            <LoadingBar progress={loadingBarProgress} height={5} color="#2f00ff" />

            {/* Search and All Products Table */}
            <div style={{ display: 'flex' }}>
                <div style={{ flex: 1 }}>
                    <InputGroup className="mb-3">
                        <FormControl
                            placeholder="Search by Product ID or Name"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </InputGroup>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Product ID</th>
                                <th>Product Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allProducts
                                .filter(
                                    (product) =>
                                        product.product_id.toString().includes(searchTerm) ||
                                        product.product_name.toLowerCase().includes(searchTerm.toLowerCase())
                                )
                                .map((product) => (
                                    <tr key={product.product_id} onDoubleClick={() => handleProductRowDoubleClick(product)}>
                                        <td>{product.product_id}</td>
                                        <td>{product.product_name}</td>
                                    </tr>
                                ))}
                        </tbody>
                    </Table>
                </div>

                {/* Users Table */}
                <div style={{ flex: 1 }}>
                    <h4>Corresponding Users</h4>
                    <InputGroup className="mb-3">
                        <FormControl placeholder="Search Users" />
                    </InputGroup>
                    {userLoading ? (
                        <div className="text-center">
                            <BarLoader color="#17a2b8" loading={userLoading} />
                        </div>
                    ) : (
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>User ID</th>
                                    <th>Name</th>
                                    <th>Phone Number</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
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
            </div>

            {/* User Details Modal */}
            <Modal show={showUserDetailsModal} onHide={handleCloseUserDetailsModal}>
                <Modal.Header closeButton>
                    <Modal.Title>User Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedUser && (
                        <div>
                            <p>User ID: {selectedUser.user_id}</p>
                            <p>Name: {selectedUser.name}</p>
                            <p>Phone Number: {selectedUser.phone_number}</p>
                            <p>Address: {selectedUser.address}</p>
                            <p>Email: {selectedUser.email}</p>
                            {/* Add other details as needed */}
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseUserDetailsModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default SearchProductByUserID;
