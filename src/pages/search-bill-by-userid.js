// pages/search-bill-by-userid.js

import React,{ useState,useEffect } from 'react';
import { Table,InputGroup,FormControl,Modal,Button } from 'react-bootstrap';
import { BarLoader } from 'react-spinners';

const SearchBillByUserId = () => {
    const [searchTerm,setSearchTerm] = useState('');
    const [allUsers,setAllUsers] = useState([]);
    const [selectedUser,setSelectedUser] = useState(null);
    const [bills,setBills] = useState([]);
    const [selectedBill,setSelectedBill] = useState(null);
    const [loadingBills,setLoadingBills] = useState(false);
    const [showBillDetailsModal,setShowBillDetailsModal] = useState(false);

    // Function to fetch all users
    const fetchAllUsers = async () => {
        try {
            const response = await fetch('/api/fetchExistingUser');
            if (response.ok) {
                const data = await response.json();
                setAllUsers(data);
            } else {
                console.error('Error fetching users:',response.status,response.statusText);
            }
        } catch (error) {
            console.error('Error fetching users:',error);
        }
    };

    // Function to fetch bills based on selected user
    const fetchBills = async (userId) => {
        setLoadingBills(true);
        try {
            const response = await fetch(`/api/fetchParticularUserBills?userId=${userId}`);
            if (response.ok) {
                const data = await response.json();
                setBills(data);
            } else {
                console.error('Error fetching bills:',response.status,response.statusText);
            }
        } catch (error) {
            console.error('Error fetching bills:',error);
        } finally {
            setLoadingBills(false);
        }
    };

    // Function to fetch details of a bill
    const fetchBillDetails = async (billId) => {
        try {
            const response = await fetch(`/api/fetchBillDetailsFromBill_Id?billId=${billId}`);
            if (response.ok) {
                const data = await response.json();
                setSelectedBill(data);
            } else {
                console.error('Error fetching bill details:',response.status,response.statusText);
            }
        } catch (error) {
            console.error('Error fetching bill details:',error);
        }
    };

    // Function to handle double click on user row
    const handleUserRowDoubleClick = (user) => {
        setSelectedUser(user);
        fetchBills(user.user_id);
    };

    // Function to handle double click on bill row
    const handleBillRowDoubleClick = (bill) => {
        fetchBillDetails(bill.bill_id);
        setShowBillDetailsModal(true);
    };

    // Function to close bill details modal
    const handleCloseBillDetailsModal = () => {
        setShowBillDetailsModal(false);
    };

    // Fetch all users on component mount
    useEffect(() => {
        fetchAllUsers();
    },[]);

    return (
        <div>
            <h1>Search Bill By User ID</h1>

            {/* Search and All Users Table */}
            <div style={{ display: 'flex' }}>
                <div style={{ flex: 1 }}>
                    <InputGroup className="mb-3">
                        <FormControl
                            placeholder="Search Users"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </InputGroup>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>User ID</th>
                                <th>Name</th>
                                <th>Phone Number</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allUsers
                                .filter(
                                    (user) =>
                                        user.user_id.toString().includes(searchTerm) ||
                                        user.name.toLowerCase().includes(searchTerm.toLowerCase())
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
                </div>

                {/* Bills Table */}
                <div style={{ flex: 1 }}>
                    <h4>Corresponding Bills</h4>
                    {loadingBills ? (
                        <div className="text-center">
                            <BarLoader color="#17a2b8" loading={loadingBills} />
                        </div>
                    ) : (
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Bill ID</th>
                                    <th>Date of Sale</th>
                                    <th>Remarks</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bills.map((bill) => (
                                    <tr key={bill.bill_id} onDoubleClick={() => handleBillRowDoubleClick(bill)}>
                                        <td>{bill.bill_id}</td>
                                        <td>{bill.date_of_sale}</td>
                                        <td>{bill.remarks}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
                </div>
            </div>

            {/* Bill Details Modal */}
            <Modal show={showBillDetailsModal} onHide={handleCloseBillDetailsModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Bill Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedBill && (
                        <div>
                            <p>User ID: {selectedBill.userData.user_id}</p>
                            <p>Name: {selectedBill.userData.name}</p>
                            <p>Address: {selectedBill.userData.address}</p>
                            <p>Organization Name: {selectedBill.userData.organization_name}</p>
                            <p>Phone Number: {selectedBill.userData.phone_number}</p>
                            <p>Email ID: {selectedBill.userData.email_id}</p>

                            <h5>Product Purchases:</h5>
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>Purchase ID</th>
                                        <th>Product ID</th>
                                        <th>Quantity</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedBill.productPurchases.map((purchase) => (
                                        <tr key={purchase.purchase_id}>
                                            <td>{purchase.purchase_id}</td>
                                            <td>{purchase.product_id}</td>
                                            <td>{purchase.quantity}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>

                            <p>Total Amount: {selectedBill.totalAmount}</p>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseBillDetailsModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default SearchBillByUserId;
