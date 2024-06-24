import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';

// Styled components
const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  text-align: center;
  color: #333;
  margin-bottom: 20px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Label = styled.label`
  font-size: 14px;
  color: #555;
`;

const Select = styled.select`
  padding: 10px;
  font-size: 16px;
  border-radius: 4px;
  border: 1px solid #ccc;
  background-color: #fff;
`;

const Input = styled.input`
  padding: 10px;
  font-size: 16px;
  border-radius: 4px;
  border: 1px solid #ccc;
  background-color: #fff;
`;

const Button = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  color: #fff;
  background-color: #28a745;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #218838;
  }
`;

const BookAppointment = () => {
  const [dieticians, setDieticians] = useState([]);
  const [selectedDietician, setSelectedDietician] = useState('');
  const [date, setDate] = useState('');
  const userId = 'USER_ID'; // Replace with actual user ID

  useEffect(() => {
    const fetchDieticians = async () => {
      const response = await axios.get('/api/verified-dieticians');
      setDieticians(response.data);
    };
    fetchDieticians();
  }, []);
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await axios.post('/api/book-appointment', {
      userId,
      dieticianId: selectedDietician,
      date,
    });
    console.log('Appointment booked:', response.data);
  };

  return (
    <Container>
      <Title>Book Appointment</Title>
      <Form onSubmit={handleSubmit}>
        <div>
          <Label>Select Dietician</Label>
          <Select value={selectedDietician} onChange={(e) => setSelectedDietician(e.target.value)}>
            <option value="">Select a dietician</option>
            {dieticians.map((dietician) => (
              <option key={dietician._id} value={dietician._id}>
                {dietician.name}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label>Select Date</Label>
          <Input type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <Button type="submit">Book Appointment</Button>
      </Form>
    </Container>
  );
};

export default BookAppointment;
