import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateInvoice } from '@/redux/slices/fileSlice';
import { Invoice } from '@/types';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import axios from 'axios';

interface InvoiceTabProps {
  invoice: Invoice ;
  isEditing: boolean;
  fileId: string;
  billId: string;
}

const InvoiceTab: React.FC<InvoiceTabProps> = ({ 
  invoice, 
  isEditing, 
  fileId, 
  billId 
}) => {
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
      // Backend update
      await axios.put(`http://localhost:3217/api/bill/${billId}/invoice`, {
        invoice: editedInvoice
      });

      // Redux update
      dispatch(updateInvoice({
        fileId: fileId, 
        billId: billId, 
        invoice: editedInvoice
      }));
    } catch (error) {
      console.error('Failed to update invoice', error);
    }
  };

  const renderValue = (value: string | null) => 
    value ? value : <span className="text-red-500">NA</span>;

  return (
    <div className="grid grid-cols-2 gap-4">
      {isEditing ? (
        <>
          {Object.keys(editedInvoice).map((key) => (
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
          {Object.entries(invoice || {}).map(([key, value]) => (
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