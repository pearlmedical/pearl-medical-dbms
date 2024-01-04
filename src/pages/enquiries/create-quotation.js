import React,{ useState,useEffect } from 'react';
import { Form,Button,Row,Col,Alert,Table,FormControl } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const CreateQuotation = () => {
  const [customer_id,setUserId] = useState('');
  const [date,setDateOfEnquiry] = useState(new Date());
  const [remarks,setRemarks] = useState('');
  const [successMessage,setSuccessMessage] = useState('');
  const [errorMessage,setErrorMessage] = useState('');
  const [allEnquiries,setAllEnquiries] = useState([]);
  const [quotedProducts,setQuotedProducts] = useState([]);
  const [selectedEnquiryDetails,setSelectedEnquiryDetails] = useState(null);
  const [totalAmount,setTotalAmount] = useState(0);

  const fetchEnquiries = async () => {
    try {
      const response = await fetch('/api/potentialCustomers/fetch-all-enquiries');
      if (response.ok) {
        const data = await response.json();
        setAllEnquiries(data);
      } else {
        console.error('Error fetching enquiries:',response.status,response.statusText);
      }
    } catch (error) {
      console.error('Error fetching enquiries:',error);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  },[]);

  const handleRowDoubleClick = async (enquiryId) => {
    try {
      const response = await fetch(`/api/potentialCustomers/fetch-enquiry-details?enquiryId=${enquiryId}`);
      if (response.ok) {
        const data = await response.json();
        setSelectedEnquiryDetails({
          enquiry_id: data[0].enquiry_id,
          customer_name: data[0].potential_customers.name,
          customer_id: data[0].potential_customers.customer_id,
          date: data[0].date_of_enquiry,
        });
        setQuotedProducts(data);
      } else {
        console.error('Error fetching enquiry details:',response.status,response.statusText);
      }
    } catch (error) {
      console.error('Error fetching enquiry details:',error);
    }
  };

  const calculateAmount = (quotedProduct) => {
    return (quotedProduct.cost || 0) * quotedProduct.quantity;
  };

  const calculateTotalAmount = () => {
    return quotedProducts.reduce((total,quotedProduct) => total + calculateAmount(quotedProduct),0).toFixed(3);
  };

  const handleCostChange = (index,event) => {
    const newQuotedProducts = [...quotedProducts];
    const newCost = parseFloat(event.target.value);

    if (!isNaN(newCost) && newCost >= 0) {
      newQuotedProducts[index].cost = newCost;
      setQuotedProducts(newQuotedProducts);
    }
  };

  const handleClearQuotedProducts = () => {
    setQuotedProducts([]);
    setTotalAmount(0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Form validation logic...

      // Step 1: Call the add-quotation API
      const addQuotationResponse = await fetch('/api/potentialCustomers/add-quotation',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer_id: selectedEnquiryDetails.customer_id,
          date: selectedEnquiryDetails.date,
          enquiry_id: selectedEnquiryDetails.enquiry_id,
        }),
      });

      if (addQuotationResponse.ok) {
        // Step 2: Call the add-quotation-pricing API
        const addQuotationData = await addQuotationResponse.json();
     
        const addQuotationPricingResponse = await fetch('/api/potentialCustomers/add-quotation-pricing',{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            customer_id: selectedEnquiryDetails.customer_id,
            enquiry_id: addQuotationData.enquiry_id,
            products: quotedProducts.map((quotedProduct) => ({
              product_id: quotedProduct.products.product_id,
              price_tie: quotedProduct.cost,
              quantity: quotedProduct.quantity,
            })),
          }),
        });

        if (addQuotationPricingResponse.ok) {
          // Both APIs were successful
          setSuccessMessage(`Quotation created successfully with ID: ${addQuotationData.enquiry_id}`);
        } else {
          // Error in add-quotation-pricing API
          const errorData = await addQuotationPricingResponse.json();
          setSuccessMessage('');
          setErrorMessage(`Error: ${errorData.message}`);
        }
      }
    } catch (error) {
      console.error('Unexpected Error in handleSubmit:',error);
      setSuccessMessage('');
    }
    //   if (!addQuotationResponse.ok) {
    //     const errorData = await addQuotationResponse.json();
    //     setSuccessMessage('');
    //     setErrorMessage(`Error: ${errorData.message}`);
    //     return;
    //   }

    //   const addQuotationData = await addQuotationResponse.json();

    //   // Step 2: Call the add-quotation-pricing API
    //   const addQuotationPricingResponse = await fetch('/api/potentialCustomers/add-quotation-pricing',{
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({
    //       customer_id: selectedEnquiryDetails.customer_id,
    //       enquiry_id: addQuotationData.enquiry_id,
    //       products: quotedProducts.map((quotedProduct) => ({
    //         product_id: quotedProduct.products.product_id,
    //         price_tie: quotedProduct.cost,
    //         quantity: quotedProduct.quantity,
    //       })),
    //     }),
    //   });

    //   if (addQuotationPricingResponse.ok) {
    //     // Both APIs were successful
    //     setSuccessMessage(`Quotation created successfully with ID: ${addQuotationData.enquiry_id}`);
    //   } else {
    //     // Error in add-quotation-pricing API
    //     const errorData = await addQuotationPricingResponse.json();
    //     setSuccessMessage('');
    //     setErrorMessage(`Error: ${errorData.message}`);
    //   }
    // } catch (error) {
    //   console.error('Unexpected Error in handleSubmit:',error);
    //   setSuccessMessage('');
    //   setErrorMessage('Internal Server Error');
    // }
  };


  return (
    <div>
      <h2>Create Quotation</h2>

      {successMessage && <Alert variant="success">{successMessage}</Alert>}
      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <Form.Group controlId="customer_id">
              <Form.Label>Customer ID</Form.Label>
              <Form.Control
                type="number"
                value={customer_id}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="Enter 6-digit User ID"
                maxLength="6"
                minLength="6"
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="date">
              <Form.Label>Date </Form.Label>
              <DatePicker
                selected={date}
                onChange={(date) => setDateOfEnquiry(date)}
                dateFormat="MMMM d, yyyy"
                className="form-control"
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={12}>
            <h4>All Enquiries</h4>
            <Table striped bordered hover style={{ maxHeight: '250px',minHeight: '250px',overflowY: 'auto',fontSize: '0.8rem' }}>
              <thead>
                <tr>
                  <th>Enquiry ID</th>
                  <th>Remarks</th>
                  <th>Date of Enquiry</th>
                  <th>Customer Name</th>
                  <th>Customer ID</th>
                  <th>Phone Number</th>
                </tr>
              </thead>
              <tbody>
                {allEnquiries.map((enquiry) => (
                  <tr
                    key={enquiry.enquiry_id}
                    onDoubleClick={() => handleRowDoubleClick(enquiry.enquiry_id)}
                  >
                    <td>{enquiry.enquiry_id}</td>
                    <td>{enquiry.remarks}</td>
                    <td>{enquiry.date_of_enquiry}</td>
                    <td>{enquiry.potential_customers.name}</td>
                    <td>{enquiry.potential_customers.customer_id}</td>
                    <td>{enquiry.potential_customers.phone_number}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>

        <Row>
          <Col md={12}>
            <h4>Quoted Products</h4>
            {/* Display Enquiry ID, Customer Name, Customer ID, and Date */}
            {selectedEnquiryDetails && (
              <div style={{ display: 'flex',flexDirection: 'column',gap: '2px' }}>
                <div>Enquiry ID: {selectedEnquiryDetails.enquiry_id}</div>
                <div>Customer Name: {selectedEnquiryDetails.customer_name}</div>
                <div>Customer ID: {selectedEnquiryDetails.customer_id}</div>
                <div>Date: {selectedEnquiryDetails.date}</div>
              </div>
            )}

            {/* Quoted Products table */}
            <Table striped bordered hover style={{ maxHeight: '300px',minHeight: '300px',overflowY: 'auto',fontSize: '0.8rem' }}>
              <thead>
                <tr>
                  <th>Product ID</th>
                  <th>Product Name</th>
                  <th>Quantity</th>
                  <th>Cost</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {quotedProducts.map((quotedProduct,index) => (
                  <tr key={index}>
                    <td>{quotedProduct.products.product_id}</td>
                    <td>{quotedProduct.products.product_name}</td>
                    <td>{quotedProduct.quantity}</td>
                    <td>
                      <FormControl
                        type="number"
                        step="0.001"
                        value={quotedProduct.cost || 0}
                        onChange={(e) => handleCostChange(index,e)}
                        style={{ fontSize: '0.8rem' }}
                      />
                    </td>
                    <td>{calculateAmount(quotedProduct)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>

            {/* Clear Quoted Products and Total Amount */}
            <Row>
              <Col md={6}>
                <Button variant="danger" onClick={handleClearQuotedProducts}>
                  Clear Quoted Products
                </Button>
              </Col>
              <Col md={6} className="text-right">
                <strong>Total Amount: {calculateTotalAmount()}</strong>
              </Col>
            </Row>
          </Col>
        </Row>

        <Row>
          <Col md={9}>
            <Form.Group controlId="remarks">
              <Form.Label>Additional Remarks</Form.Label>
              <Form.Control as="textarea" rows={2} value={remarks} onChange={(e) => setRemarks(e.target.value)} placeholder="Enter remarks" style={{ resize: 'none' }} />
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

export default CreateQuotation;
