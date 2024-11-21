import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../redux/store';
import { setCurrentBill } from '@/redux/slices/fileSlice';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const FileBillsPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentFile = useSelector((state: RootState) => state.files.currentFile);

  const handleClick = (bill: any) => {
    dispatch(setCurrentBill(bill));
    navigate('/bill-details');
  };

  if (!currentFile) {
    return <div>No file selected</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{currentFile.name}</h1>
        <Button variant="outline" onClick={() => navigate('/your-files')}>
          Back to Files
        </Button>
      </div>
      <div className="grid grid-cols-3 gap-6">
        {currentFile.bills.map((bill, index) => (
          <Card 
            key={index} 
            onClick={() => handleClick(bill)}
            className="cursor-pointer hover:shadow-lg transition-shadow"
          >
            <CardTitle className="p-4">
              Bill {index + 1}
            </CardTitle>
            <CardDescription className="px-4 pb-2">
              {bill.invoice?.customer_name || 'Unnamed Customer'}
            </CardDescription>
            <div className="p-4 text-sm">
              <p>Total Amount: {bill.invoice?.total_amount || 'N/A'}</p>
              <p>Date: {bill.invoice?.date || 'N/A'}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FileBillsPage;