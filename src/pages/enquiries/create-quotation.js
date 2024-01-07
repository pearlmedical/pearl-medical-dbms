import React,{ useState,useEffect,useRef } from 'react';
import { Form,Button,Row,Col,Alert,Table,FormControl,Card } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import 'jspdf-autotable';


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
  const [searchTerm,setSearchTerm] = useState('');
  const [quotationID,setQuotationID] = useState(null);
  const pdfRef = useRef();

  const handleGeneratePDF = async () => {
    try {
      // Initialize jspdf with the 'p' (portrait) orientation
      const pdf = new jsPDF('p','mm','a4');

      // Fetch the logo (replace 'your-logo-url' with the actual URL)
      const logoUrl = '/Graphic2.png';
      const logoResponse = await fetch(logoUrl);
      const logoBlob = await logoResponse.blob();
      const logoDataUrl = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(logoBlob);
      });

      // Add a page border
      pdf.rect(5,5,pdf.internal.pageSize.width - 10,pdf.internal.pageSize.height - 10);

      // Add logo
      pdf.addImage(logoDataUrl,'JPEG',15,0,30,30);

      // Logo and Company Name
      // pdf.setFontSize(20);
      // pdf.text('Pearl Medical System',40,25);

      pdf.setFont('normal');
      // Products Quotation
      pdf.setFontSize(20);
      pdf.text('Products Quotation',pdf.internal.pageSize.width / 2,18,{ align: 'center' });

      // Date
      pdf.setFontSize(12);
      pdf.text(`Date: ${date.toLocaleDateString()}`,15,27);

      // Customer Details
      pdf.setFontSize(16);
      pdf.text('Customer Details',15,35);
      const textWidth = 50;//pdf.getStringUnitWidth('Customer Details') * pdf.internal.getFontSize();
      const textHeight = pdf.internal.getLineHeight();
      pdf.setLineWidth(0.25);
      pdf.line(15,17.5 + textHeight,15 + textWidth,17.5 + textHeight);

      pdf.setFontSize(12);
      const customerDetailsHeads = [
        `Customer Name`,
        `Customer ID`,
        `Enquiry ID`,

      ];
      const customerDetails = [
        `${selectedEnquiryDetails.customer_name}`,
        `${selectedEnquiryDetails.customer_id}`,
        `${selectedEnquiryDetails.enquiry_id}`,

      ];
      pdf.text(customerDetailsHeads,15,40);
      pdf.text(customerDetails,50,40);

      // Quoted Products
      pdf.setFontSize(16);
      pdf.text('Quoted Products',pdf.internal.pageSize.width / 2,55,{ align: 'center' });

      // Quoted Products table
      const tableData = quotedProducts.map((quotedProduct) => [
        quotedProduct.products.product_id.toString(),
        quotedProduct.products.product_name,
        quotedProduct.quantity.toString(),
        quotedProduct.cost ? quotedProduct.cost.toFixed(3) : '0',
        calculateAmount(quotedProduct).toFixed(3),
      ]);

      pdf.autoTable({
        head: [['Product ID','Product Name','Quantity','Cost','Amount']],
        body: tableData,
        startY: 60,
      });

      // Amount
      pdf.setFont('bold');
      pdf.text(`Amount:    INR ${calculateTotalAmount()}`,15,pdf.autoTable.previous.finalY + 10,{
        align: 'left',
      });
      pdf.setFont('normal');

      // Additional Remarks
      pdf.setFontSize(14);
      pdf.text(`Additional Remarks`,15,pdf.autoTable.previous.finalY + 20);
      pdf.setFontSize(12);
      pdf.text(`${remarks}`,15,pdf.autoTable.previous.finalY + 25);

      // Page Ending Line
      pdf.text('--xx--',pdf.internal.pageSize.width / 2,pdf.internal.pageSize.height - 15,{ align: 'center' });

      // Save or open the PDF
      pdf.save(`Quotation_${quotationID}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:',error);
    }
  };



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
          enquiry_id: data.enquiryDetails[0]?.enquiry_id || '',
          customer_name: data.enquiryDetails[0]?.potential_customers?.name || '',
          customer_id: data.enquiryDetails[0]?.potential_customers?.customer_id || '',
        });
  
        // Extracting quoted products from the response
        const quotedProducts = data.enquiryDetails.map((enquiryDetail) => ({
          quantity: enquiryDetail.quantity || 0,
          products: {
            product_id: enquiryDetail.products?.product_id || '',
            product_name: enquiryDetail.products?.product_name || '',
          },
          cost: 0, // Assuming the cost is not provided in the API response
        }));
  
        setQuotedProducts(quotedProducts);
      } else {
        console.error('Error fetching enquiry details:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error fetching enquiry details:', error);
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
          date: date,
          enquiry_id: selectedEnquiryDetails.enquiry_id,
          remarks: remarks,
        }),
      });

      if (addQuotationResponse.ok) {
        // Step 2: Call the add-quotation-pricing API
        const addQuotationData = await addQuotationResponse.json();
        // console.log(quotedProducts.map((quotedProduct) => ({
        //   product_id: quotedProduct.products.product_id,
        //   price_tie: quotedProduct.cost,
        //   quantity: quotedProduct.quantity,
        // })));
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
            quotation_id: addQuotationData.quotation_id,
          }),
        });

        if (addQuotationPricingResponse.ok) {
          // Both APIs were successful
          setSuccessMessage(`Quotation created successfully with ID: ${addQuotationData.quotation_id}`);
          setQuotationID(addQuotationData.quotation_id);
          setTimeout(() => {
            setSuccessMessage('');
          },3000);
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
  };

  const filteredEnquiries = allEnquiries?.filter(
    (enquiry) =>
      enquiry.enquiry_id.toString().includes(searchTerm) ||
      enquiry.remarks.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enquiry.date_of_enquiry.toString().includes(searchTerm) ||
      enquiry.potential_customers.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h2><center>Create Quotation</center></h2>

      {successMessage && <Alert variant="success">{successMessage}</Alert>}
      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="searchForm">
          <Form.Control
            title="Search enquiry by Enquiry ID, Remarks, Date of Enquiry, or Customer Name"
            type="text"
            placeholder="Search for an enquiry to quote."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Form.Group>

        {filteredEnquiries.length > 0 ? (
          <Table striped bordered hover>
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
              {filteredEnquiries?.map((enquiry,index) => (
                <tr
                  key={enquiry.enquiry_id}
                  style={{ backgroundColor: index % 2 === 0 ? '#c7f49d' : '#ffffff' }}
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
        ) : (
          <p>No records found in the table.</p>
        )}

        <hr />
        <Row>
          <Col md={6}>
            <Form.Group controlId="date">
              <Form.Label><strong>Date of Quotation </strong> </Form.Label>
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

        <Card ref={pdfRef} className="my-4 p-4">
          <Row>
            <Col md={12}>
              <h4>Quotation</h4>
              {/* Display Enquiry ID, Customer Name, Customer ID, and Date */}
              {selectedEnquiryDetails && (
                <div style={{ display: 'flex',flexDirection: 'column',gap: '2px' }}>
                  <div>Enquiry ID: {selectedEnquiryDetails.enquiry_id}</div>
                  <div>Customer Name: {selectedEnquiryDetails.customer_name}</div>
                  <div>Customer ID: {selectedEnquiryDetails.customer_id}</div>
                  <div>Date: {date.toLocaleDateString()}</div>
                </div>
              )}

              {/* Quoted Products table */}
              <Table striped bordered hover style={{ maxHeight: '300px',overflowY: 'auto',fontSize: '0.8rem' }}>
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
                <Col md={6} className="text-right">
                  <strong>Total Amount: {calculateTotalAmount()}</strong>
                </Col>
                <Col md={6}>
                  {quotedProducts.length > 0 && <Button variant="danger" onClick={handleClearQuotedProducts}>
                    Clear Selection
                  </Button>}
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
        </Card>
        <Row>
          <Col md={2}>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Col>
          <Col md={3}>
            <Button variant="success" onClick={handleGeneratePDF}>
              Generate PDF
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default CreateQuotation;