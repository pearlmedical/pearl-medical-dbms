// pages/search-bill-by-userid.js

import React,{ useState,useEffect } from 'react';
import { Table,InputGroup,FormControl,Modal,Button } from 'react-bootstrap';
import { BarLoader } from 'react-spinners';

const SearchBillByUserId = () => {
    const [searchTerm,setSearchTerm] = useState('');
    const [allBills,setAllBills] = useState([]);
    const [selectedBill,setSelectedBill] = useState(null);
    const [billDetails,setBillDetails] = useState([]);
    const [loadingBills,setLoadingBills] = useState(false);
    const [loadingBillDetails,setLoadingBillDetails] = useState(false);
    const [showBillDetailsModal,setShowBillDetailsModal] = useState(false);

    useEffect(() => {
        fetchAllBills();
    },[]);

    // Function to fetch all bills
    const fetchAllBills = async () => {
        setLoadingBills(true);
        try {
            const response = await fetch('/api/fetchAllBills');
            if (response.ok) {
                const data = await response.json();
                setAllBills(data);
            } else {
                console.error('Error fetching bills:',response.status,response.statusText);
            }
        } catch (error) {
            console.error('Error fetching bills:',error);
        } finally {
            setLoadingBills(false);
        }
    };

    // Function to fetch bill details based on selected bill
    const fetchBillDetails = async (billId) => {
        setLoadingBillDetails(true);
        try {
            const response = await fetch(`/api/fetchBillDetailsFromBill_Id?billId=${billId}`);
            if (response.ok) {
                const data = await response.json();
                setBillDetails(data);
            } else {
                console.error('Error fetching bill details:',response.status,response.statusText);
            }
        } catch (error) {
            console.error('Error fetching bill details:',error);
        } finally {
            setLoadingBillDetails(false);
        }
    };

    // Function to handle double click on bill row
    const handleBillRowDoubleClick = (bill) => {
        setSelectedBill(bill);
        fetchBillDetails(bill.bill_id);
        setShowBillDetailsModal(true);
    };

    // Function to close bill details modal
    const handleCloseBillDetailsModal = () => {
        setShowBillDetailsModal(false);
    };

    return (
        <div>
            <h1>Search Bill by User ID</h1>

            {/* Search and All Bills Table */}
            <div style={{ display: 'flex' }}>
                <div style={{ flex: 1 }}>
                    <InputGroup className="mb-3">
                        <FormControl
                            placeholder="Search by User ID"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </InputGroup>
                    {loadingBills ? (
                        <div className="text-center">
                            <BarLoader color="#17a2b8" loading={loadingBills} />
                        </div>
                    ) : (
                        <Table striped bordered hover style={{ height: '300px',overflowY: 'auto' }}>
                            <thead>
                                <tr>
                                    <th>Bill ID</th>
                                    <th>User ID</th>
                                    <th>Date of Sale</th>
                                    <th>Total Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allBills
                                    .filter((bill) => String(bill.user_id).includes(searchTerm))
                                    .map((bill) => (
                                        <tr key={bill.bill_id} onDoubleClick={() => handleBillRowDoubleClick(bill)}>
                                            <td>{bill.bill_id}</td>
                                            <td>{bill.user_id}</td>
                                            <td>{bill.date_of_sale}</td>
                                            <td>{bill.total_amount}</td>
                                        </tr>
                                    ))}
                            </tbody>
                        </Table>
                    )}
                </div>

                {/* Bill Details Table */}
                <div style={{ flex: 1 }}>
                    <h4>Bill Details</h4>
                    {loadingBillDetails ? (
                        <div className="text-center">
                            <BarLoader color="#17a2b8" loading={loadingBillDetails} />
                        </div>
                    ) : (
                        <Table striped bordered hover style={{ height: '350px',overflowY: 'auto' }}>
                            <thead>
                                <tr>
                                    <th>Product ID</th>
                                    <th>Product Name</th>
                                    <th>Quantity</th>
                                    <th>Cost</th>
                                </tr>
                            </thead>
                            <tbody>
                                {billDetails.map((billDetail) => (
                                    <tr key={billDetail.product_id}>
                                        <td>{billDetail.product_id}</td>
                                        <td>{billDetail.product_name}</td>
                                        <td>{billDetail.quantity}</td>
                                        <td>{billDetail.cost}</td>
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
                    <p>Bill ID: {selectedBill?.bill_id}</p>
                    <p>User ID: {selectedBill?.user_id}</p>
                    <p>Date of Sale: {selectedBill?.date_of_sale}</p>
                    <p>Total Amount: {selectedBill?.total_amount}</p>
                    {/* Add other details as needed */}
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
