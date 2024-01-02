// pages/create-bill.js

import React,{ useState,useEffect } from 'react';
import { Form,Button,Row,Col,Alert,Table,InputGroup,FormControl } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const CreateBill = () => {
    const [user_id,setUserId] = useState('');
    const [date_of_sale,setDateOfSale] = useState(new Date());
    const [remarks,setRemarks] = useState('');
    const [total_amount,setTotalAmount] = useState(0);
    const [successMessage,setSuccessMessage] = useState('');
    const [errorMessage,setErrorMessage] = useState('');

    // State for product search and selection
    const [allProducts,setAllProducts] = useState([]); // Assuming you have an API to fetch products
    const [selectedProducts,setSelectedProducts] = useState([]);
    const [searchTerm,setSearchTerm] = useState('');

    const handleTotalAmountChange = (e) => {
        setTotalAmount(e.target.value);
    };

    // Function to update total amount
    const updateTotalAmount = () => {
        const totalAmount = calculateTotalAmount();
        setTotalAmount(totalAmount);
        console.log("updated");
    };

    // Function to handle product selection and removal
    const handleProductAction = (product,quantity = 1) => {
        const isProductSelected = selectedProducts.find((selected) => selected.product_id === product.product_id);

        setSelectedProducts([...selectedProducts,{ ...product,quantity }]);

        if (isProductSelected) {
            // If selected, remove from the list
            const updatedSelectedProducts = selectedProducts.filter((selected) => selected.product_id !== product.product_id);
            setSelectedProducts(updatedSelectedProducts);
        } else {
            // If not selected, add to the list with the specified quantity
            setSelectedProducts([...selectedProducts,{ ...product,quantity }]);
        }
    };

    // Function to handle clearing the selected products
    const handleClearSelected = () => {
        setSelectedProducts([]);
    };

    // Calculate the total amount based on selected products
    const calculateTotalAmount = () => {
        return selectedProducts.reduce((total,product) => total + product.cost * product.quantity,0);
    };

    // Fetch all products on component mount
    useEffect(() => {
        const fetchProducts = async () => {
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
            }
        };

        fetchProducts();
    },[]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate user_id format (6 digits)
        const userIdRegex = /^\d{6}$/;
        if (!userIdRegex.test(user_id)) {
            setSuccessMessage('');
            setErrorMessage('User ID must be exactly 6 digits.');
            return;
        }
        
        // console.log(JSON.stringify({ user_id,date_of_sale,remarks,total_amount }));

        try {
            // Make API call to addBill endpoint
            const response = await fetch('/api/sales/addBill',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user_id,date_of_sale,remarks,total_amount }),
            });

            if (response.ok) {

                const data = await response.json();
                console.log(data);


                // Make API call to another endpoint
                const postData = {
                    user_id: user_id,
                    bill_id: data.bill_id,
                    products: selectedProducts
                };

                console.log(postData);

                try {
                    const postResponse = await fetch('/api/sales/addProductPurchased',{
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(postData),
                    });

                    if (postResponse.ok) {
                        // Handle success
                        setTimeout(() => {
                            setSuccessMessage(`Bill created successfully with ID: ${data.bill_id}`);
                        }, 3000);
                    } else {
                        const errorData = await postResponse.json();
                        // Handle error
                    }
                } catch (error) {
                    console.error('Error:',error);
                    // Handle error
                }

            } else {
                const errorData = await response.json();
                setSuccessMessage('');
                setErrorMessage(`Error: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error creating bill:',error);
            setSuccessMessage('');
            setErrorMessage('Internal Server Error');
        }
    };

    // Function to handle increasing quantity in the selected products
    const handleIncreaseQuantity = (product) => {
        const updatedSelectedProducts = selectedProducts.map((selected) =>
            selected.product_id === product.product_id ? { ...selected,quantity: selected.quantity + 1 } : selected
        );
        setSelectedProducts(updatedSelectedProducts);
    };

    // Function to handle decreasing quantity in the selected products
    const handleDecreaseQuantity = (product) => {
        const updatedSelectedProducts = selectedProducts.map((selected) =>
            selected.product_id === product.product_id && selected.quantity > 0
                ? { ...selected,quantity: selected.quantity - 1 }
                : selected
        );
        setSelectedProducts(updatedSelectedProducts);
    };

    const handleQuantityChange = (index,event) => {
        const newSelectedProducts = [...selectedProducts];
        const newQuantity = parseInt(event.target.value,10);

        if (!isNaN(newQuantity) && newQuantity >= 0) {
            newSelectedProducts[index].quantity = newQuantity;
            setSelectedProducts(newSelectedProducts);
            updateTotalAmount();
        }
    };

    const handleCostChange = (index,event) => {
        const newSelectedProducts = [...selectedProducts];
        const newCost = parseFloat(event.target.value);

        if (!isNaN(newCost) && newCost >= 0) {
            newSelectedProducts[index].cost = newCost;
            setSelectedProducts(newSelectedProducts);
            updateTotalAmount();
        }
    };


    const handleRemoveProduct = (product) => {
        // Remove the product from the list
        const updatedSelectedProducts = selectedProducts.filter(
            (selected) => selected.product_id !== product.product_id
        );
        setSelectedProducts(updatedSelectedProducts);
    };

    const handleRowClick = (clickedProduct) => {
        // Increase quantity if the product is already selected, otherwise add it with quantity 1
        const isProductSelected = selectedProducts.some((product) => product.product_id === clickedProduct.product_id);

        if (isProductSelected) {
            handleIncreaseQuantity(clickedProduct);
        } else {
            handleProductAction(clickedProduct,1);
        }
    };

    return (
        <div>
            <h2>Create Bill</h2>

            {successMessage && <Alert variant="success">{successMessage}</Alert>}
            {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

            <Form onSubmit={handleSubmit}>
                <Row>
                    <Col md={6}>
                        <Form.Group controlId="user_id">
                            <Form.Label>User ID</Form.Label>
                            <Form.Control
                                type="number"
                                value={user_id}
                                onChange={(e) => setUserId(e.target.value)}
                                placeholder="Enter 6-digit User ID"
                                maxLength="6"
                                minLength="6"
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group controlId="date_of_sale">
                            <Form.Label>Date of Sale</Form.Label>
                            <div className="input-group">
                                <DatePicker
                                    selected={date_of_sale}
                                    onChange={(date) => setDateOfSale(date)}
                                    dateFormat="MMMM d, yyyy"
                                    className="form-control"
                                    required
                                />
                            </div>
                        </Form.Group>
                    </Col>
                </Row>

                {/* Billing Section */}
                <Row>
                    {/* Selected Products Table */}
                    <Col md={6}>
                        <h4>Selected Products</h4>
                        <Table striped bordered hover style={{ maxHeight: '300px',minHeight: '300px',overflowY: 'auto', fontSize:'0.8rem' }}>
                            <thead>
                                <tr>
                                    <th style={{ width: '15%' }}>Prod. ID</th>
                                    <th style={{ width: '25%' }}>Prod. Name</th>
                                    <th style={{ minWidth: '20%' }}>Quantity</th>
                                    <th style={{ minWidth: '20%' }}>Cost /-</th>
                                    <th style={{ minWidth: '12%' }}>Total Price</th>
                                    <th style={{ minWidth: '1%' }}></th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedProducts.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="text-center">
                                            Table is empty
                                        </td>
                                    </tr>
                                ) : (
                                    selectedProducts.map((selectedProduct,index) => (
                                        <tr key={selectedProduct.product_id}>
                                            <td>{selectedProduct.product_id}</td>
                                            <td>{selectedProduct.product_name}</td>
                                            <td>
                                                <FormControl
                                                    type="number"
                                                    step="1"
                                                    value={selectedProduct.quantity}
                                                    onChange={(e) => handleQuantityChange(index,e)}
                                                    style={{ fontSize: '0.8rem' }}
                                                />
                                            </td>
                                            <td>
                                                <FormControl
                                                    type="number"
                                                    step="0.01"
                                                    value={selectedProduct.cost}
                                                    onChange={(e) => handleCostChange(index,e)}
                                                    style={{ fontSize: '0.8rem' }}
                                                />
                                            </td>
                                            <td>{(selectedProduct.cost * selectedProduct.quantity).toFixed(3)}</td>
                                            <td>
                                                <Button variant='light' size="sm" style={{ fontSize: '0.8rem',margin: '0',padding: '0' }} onClick={() => handleRemoveProduct(selectedProduct)}>
                                                    ❌
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </Table>
                        <Button variant="danger" onClick={handleClearSelected}>
                            Clear Selected
                        </Button>
                    </Col>


                    {/* All Products Table */}
                    <Col md={6}>
                        <h4>All Products</h4>
                        <InputGroup className="mb-3">
                            <FormControl
                                placeholder="Search by Product ID or Name"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </InputGroup>
                        <Table striped bordered hover style={{ maxHeight: '250px',minHeight: '250px',overflowY: 'auto', fontSize:'0.8rem' }}>
                            <thead>
                                <tr>
                                    <th>Product ID</th>
                                    <th>Product Name</th>
                                    <th>Quantity</th>
                                    <th>Cost</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allProducts
                                    .filter(
                                        (product) =>
                                            product.product_id.toString().includes(searchTerm) || product.product_name.includes(searchTerm)
                                    )
                                    .map((product) => (
                                        <tr key={product.product_id}
                                            onClick={() => {
                                                handleRowClick(product);
                                                updateTotalAmount();
                                            }}
                                            >
                                            <td>{product.product_id}</td>
                                            <td>{product.product_name}</td>
                                            <td>{product.quantity || 0}</td>
                                            <td>{product.cost}</td>
                                        </tr>
                                    ))}
                            </tbody>
                        </Table>
                    </Col>
                </Row>

                {/* Total Amount Display */}
                <Row>
                    <Col md={12} className="text-center">
                        <h4>Total Amount</h4>
                        <p onChange={handleTotalAmountChange}>{calculateTotalAmount()} INR</p>
                    </Col>
                </Row>

                <Row>
                    <Col md={9}>
                        <Form.Group controlId="remarks">
                            <Form.Label>Additional Remarks</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={2}
                                value={remarks}
                                onChange={(e) => setRemarks(e.target.value)}
                                placeholder="Enter remarks"
                                style={{ resize: 'none' }}
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <p></p>

                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
        </div>
    );
};

export default CreateBill;
