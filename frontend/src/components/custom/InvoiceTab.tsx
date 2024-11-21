import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateInvoice } from '@/redux/slices/fileSlice';
import { Bill, Invoice } from '@/types';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { renderValue } from '@/lib/renderValue';

interface InvoiceTabProps {
  handleBillUpdate: () => void;
  currentBill:Bill
  isEditing: boolean;
  fileId: string;
  billId: string;
}

const InvoiceTab: React.FC<InvoiceTabProps> = ({ 
  handleBillUpdate,
  currentBill, 
  isEditing, 
  fileId, 
  billId 
}) => {
  const { invoice } = currentBill;

  const dispatch = useDispatch();
  const [editedInvoice, setEditedInvoice] = useState<Invoice>(invoice);

  const handleInputChange = (key: keyof Invoice, value: string) => {
    setEditedInvoice(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = async () => {
    try {
      // Redux update
      dispatch(updateInvoice({
        fileId: fileId, 
        billId: billId, 
        invoice: editedInvoice
      }));

      // Backend update
      await handleBillUpdate();
    } catch (error) {
      console.error('Failed to update invoice', error);
    }
  };


  return (
    <div className="grid grid-cols-2 gap-4">
      {isEditing ? (
        <>
          {Object.keys(editedInvoice).filter(key => key !== '_id').map((key) => (
            <div key={key} className="mb-4">
              <label className="block mb-2 capitalize">
                {key.replace(/_/g, ' ')}
              </label>
              {/* TODO if i get input as date, then I am getting error a snot assignable to string, number */}
              <Input
                value={editedInvoice[key as keyof Invoice] || ''}
                onChange={(e) => handleInputChange(key as keyof Invoice, e.target.value)}
              />
            </div>
          ))}
          <Button onClick={handleSave}>Save Changes</Button>
        </>
      ) : (
        <>
          {Object.entries(invoice || {}).filter(([key]) => key !== '_id').map(([key, value]) => (
            <div key={key} className="mb-2">
              <strong className="capitalize">{key.replace(/_/g, ' ')}: </strong>
              {renderValue(value)}
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default InvoiceTab;