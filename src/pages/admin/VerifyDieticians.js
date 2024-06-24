import React, { useState, useEffect } from 'react';
import axios from 'axios';

const VerifyDieticians = () => {
  const [dieticians, setDieticians] = useState([]);

  useEffect(() => {
    const fetchDieticians = async () => {
      const response = await axios.get('/api/dieticians'); // Endpoint to get all dieticians
      setDieticians(response.data);
    };
    fetchDieticians();
  }, []);

  const handleVerify = async (dieticianId) => {
    await axios.post('/api/admin/verify-dietician', { dieticianId });
    setDieticians(dieticians.map(d => d._id === dieticianId ? { ...d, verified: true } : d));
  };

  return (
    <div>
      <h1>Verify Dieticians</h1>
      <ul>
        {dieticians.map((dietician) => (
          <li key={dietician._id}>
            {dietician.name} ({dietician.verified ? 'Verified' : 'Not Verified'})
            {!dietician.verified && (
              <button onClick={() => handleVerify(dietician._id)}>Verify</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VerifyDieticians;
