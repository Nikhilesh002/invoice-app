import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateCustomer } from '@/redux/slices/fileSlice';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Bill, Customer } from '@/types';
import { renderValue } from '@/lib/renderValue';

interface CustomerTabProps {
  handleBillUpdate: () => void;
  currentBill:Bill
  isEditing: boolean;
  fileId: string;
  billId: string;
}

const CustomerTab: React.FC<CustomerTabProps> = ({ 
  handleBillUpdate,
  currentBill,
  isEditing, 
  fileId, 
  billId 
}) => {
  const { customer } = currentBill;
  const dispatch = useDispatch();
  const [editedCustomer, setEditedCustomer] = useState<Customer>(customer);

  const handleInputChange = (key: keyof Customer, value: string) => {
    setEditedCustomer(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = async () => {
    try {
      console.log(editedCustomer)
      // Redux update
      dispatch(updateCustomer({
        fileId: fileId, 
        billId: billId, 
        customer: editedCustomer
      }));

      // Backend update
      await handleBillUpdate();

    } catch (error) {
      console.error('Failed to update customer', error);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      {isEditing ? (
        <>
          {Object.keys(editedCustomer).filter((key) => key !== '_id').map((key) => (
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
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </>
      ) : (
        <>
          {Object.entries(customer || {}).filter(([key]) => key !== '_id').map(([key, value]) => (
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