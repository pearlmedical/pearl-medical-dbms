// pages/update-employee-access.js
import React,{ useState,useEffect } from 'react';
import { Table,Form,Modal,Button } from 'react-bootstrap';
import { useAuth } from '@/context/AuthContext';

const UpdateEmployeesAccess = () => {

  // State variables
  const [employees,setEmployees] = useState([]);
  const [selectedEmployee,setSelectedEmployee] = useState(null);
  const [modalShow,setModalShow] = useState(false);
  const [allAccessLevels,setAllAccessLevels] = useState([]);
  const [employeeAccess,setEmployeeAccess] = useState([]);
  const [loading,setLoading] = useState(false);
  const [searchTerm,setSearchTerm] = useState('');
  const [sortedField,setSortedField] = useState('employee_id');
  const [sortOrder,setSortOrder] = useState('asc');
  const { login } = useAuth();


  // Fetch employees from the API
  const fetchAllEmployees = async () => {
    try {
      const response = await fetch('/api/employee/fetch-all-employees');
      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      console.error('Error fetching employees:',error);
    }
  };

  useEffect(() => {
    fetchAllEmployees();
  },[]);

  const handleSort = (field) => {
    setSortedField(field);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const filteredEmployees = employees?.filter(
    (employee) =>
      employee.employee_id.toString().includes(searchTerm) ||
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.phone_number.toString().includes(searchTerm) ||
      employee.email_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Fetch all possible access levels
  const fetchAllAccessLevels = async () => {
    try {
      const response = await fetch('/api/employee/fetch-all-levels-possible');
      const data = await response.json();
      setAllAccessLevels(data);
    } catch (error) {
      console.error('Error fetching access levels:',error);
    }
  };

  useEffect(() => {
    fetchAllAccessLevels();
  },[]);

  // Fetch current access levels of the employee
  const fetchEmployeeAccess = async () => {
    if (selectedEmployee) {
      try {
        const response = await fetch(`/api/employee/fetch-access-level-of-employee?employee_id=${selectedEmployee.employee_id}`);
        const data = await response.json();
        setEmployeeAccess(data.access_allowed || []);
      } catch (error) {
        console.error('Error fetching employee access levels:',error);
      }
    }
  };

  useEffect(() => {
    if (modalShow) {
      fetchEmployeeAccess();
    }
  },[modalShow]);

  // Handle double click to open the modal
  const handleRowDoubleClick = (employee) => {
    setSelectedEmployee(employee);
    setModalShow(true);
  };

  // Handle checkbox change
  const handleCheckboxChange = (levelName) => {
    const updatedAccess = employeeAccess.includes(levelName)
      ? employeeAccess.filter((level) => level !== levelName)
      : [...employeeAccess,levelName];
    setEmployeeAccess(updatedAccess);
  };

  // Handle update button click
  const handleUpdateAccess = async () => {
    if (selectedEmployee) {
      try {
        setLoading(true);
        console.log({
          employee_id: selectedEmployee.employee_id,
          access_level_names: employeeAccess,
        });
        const response = await fetch('/api/employee/update-employee-access',{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            employee_id: selectedEmployee.employee_id,
            access_level_names: employeeAccess,
          }),
        });

        if (response.ok) {
          // Access levels updated successfully
          setModalShow(false);
          const successMessage = `Updated access for employee: ${selectedEmployee.employee_id}`;
          // Display success message (you can use any toast/notification library here)
          alert(successMessage);

          // // Update access levels in the context
          // login(selectedEmployee.employee_id);
        } else {
          const errorData = await response.json();
          console.error('Error updating employee access:',errorData.message);
        }
      } catch (error) {
        console.error('Error updating employee access:',error);
      } finally {
        setLoading(false);
      }
    }
  };


  return (
    <div>
      <h2>Search Employees</h2>
      <Form.Group controlId="searchForm">
        <Form.Control
          type="text"
          placeholder="Search by Employee ID, Name, Phone Number, or Email ID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Form.Group>
      <hr />
      {filteredEmployees.length > 0 ? (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th onClick={() => handleSort('employee_id')}>Employee ID</th>
              <th onClick={() => handleSort('name')}>Name</th>
              <th onClick={() => handleSort('phone_number')}>Phone Number</th>
              <th onClick={() => handleSort('email_id')}>Email ID</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees?.map((employee,index) => (
              <tr
                key={employee.employee_id}
                style={{ backgroundColor: index % 2 === 0 ? '#c7f49d' : '#ffffff' }}
                onDoubleClick={() => handleRowDoubleClick(employee)}  // <-- Add this line
              >
                <td>{employee.employee_id}</td>
                <td>{employee.name}</td>
                <td>{employee.phone_number}</td>
                <td>{employee.email_id}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <p>No records found in the table.</p>
      )}

      {/* Access Level Modal */}
      {selectedEmployee && (
        <Modal show={modalShow} onHide={() => setModalShow(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Update Access Levels</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {/* Display access level checkboxes */}
            <Form>
              {allAccessLevels.map((level) => (
                <Form.Check
                  key={level.access_level_id}
                  type="checkbox"
                  label={level.level_name}
                  checked={employeeAccess.includes(level.level_name)}
                  onChange={() => handleCheckboxChange(level.level_name)}
                />
              ))}
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={handleUpdateAccess} disabled={loading}>
              {loading ? 'Updating...' : 'Update'}
            </Button>
            <Button variant="secondary" onClick={() => setModalShow(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default UpdateEmployeesAccess;
