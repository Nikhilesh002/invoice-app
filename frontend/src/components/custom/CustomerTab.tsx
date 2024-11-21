import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateCustomer } from '@/redux/slices/fileSlice';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import axios from 'axios';
import { Customer } from '@/types';

interface CustomerTabProps {
  customer: Customer | null;
  isEditing: boolean;
  fileId?: string;
  billId?: string;
}

const CustomerTab: React.FC<CustomerTabProps> = ({ 
  customer, 
  isEditing, 
  fileId, 
  billId 
}) => {
  const dispatch = useDispatch();
  const [editedCustomer, setEditedCustomer] = useState<Customer>(customer || {
    customer_name: null,
    customer_company: null,
    phone_number: null,
    customer_gstin: null,
    total_purchase_amount: null,
    email_address: null,
    shipping_address: null
  });

  const handleInputChange = (key: keyof Customer, value: string) => {
    setEditedCustomer(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = async () => {
    try {
      // Backend update
      await axios.put(`http://localhost:3217/api/bill/${billId}/customer`, {
        customer: editedCustomer
      });

      // Redux update
      dispatch(updateCustomer({
        fileId: fileId!, 
        billId: billId!, 
        customer: editedCustomer
      }));
    } catch (error) {
      console.error('Failed to update customer', error);
    }
  };

  const renderValue = (value: string | null) => 
    value ? value : <span className="text-red-500">NA</span>;

  return (
    <div className="grid grid-cols-2 gap-4">
      {isEditing ? (
        <>
          {Object.keys(editedCustomer).map((key) => (
            <div key={key} className="mb-4">
              <label className="block mb-2 capitalize">
                {key.replace(/_/g, ' ')}
              </label>
              <Input
                value={editedCustomer[key as keyof Customer] || ''}
                onChange={(e) => handleInputChange(key as keyof Customer, e.target.value)}
              />
            </div>
          ))}
          <Button onClick={handleSave} className="col-span-2">
            Save Changes
          </Button>
        </>
      ) : (
        <>
          {Object.entries(customer || {}).map(([key, value]) => (
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

export default CustomerTab;