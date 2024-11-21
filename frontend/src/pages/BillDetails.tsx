import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import InvoiceTab from '@/components/custom/InvoiceTab';
import ProductsTab from '@/components/custom/ProductsTab';
import CustomerTab from '@/components/custom/CustomerTab';
import { Button } from '@/components/ui/button';
import { useParams } from 'react-router-dom';
import { setCurrentBill, setCurrentFile } from '@/redux/slices/fileSlice';
import axios from 'axios';
import { toast } from '@/hooks/use-toast';


const BillDetailsPage: React.FC = () => {

  const { fileId, billId } = useParams();
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState('invoice');
  const [isEditing, setIsEditing] = useState(false);

  const allFiles = useSelector((state: RootState) => state.files.files);

  if (!fileId || !billId) {
    return <div>No bill selected</div>;
  }

  const currentFile = allFiles.find(file => file._id === fileId);
  const currentBill = currentFile?.bills.find(bill => bill._id === billId);

  if (!currentBill || !currentFile) {
    return <div>No bill selected</div>;
  }

  dispatch(setCurrentFile(currentFile));
  dispatch(setCurrentBill(currentBill));


  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleBillUpdate = async() => {
    try{

      await axios.put(`http://localhost:3217/api/file/update-bill/${currentBill._id}`,currentBill);
      toast({
        title: 'Bill Updated',
        description: 'Bill details updated successfully'
      })
    }
    catch(error){
      console.error('Error deleting bill:', error);
      toast({
        title: 'Error',
        description: 'Error updating bill'
      })
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Bill Details</h1>
        <div className="space-x-2">
          <Button variant="outline" onClick={() => window.history.back()}>
            Back to Bills
          </Button>
          <Button onClick={handleEditToggle}>
            {isEditing ? 'Cancel Edit' : 'Edit Bill'}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="invoice">Invoice Details</TabsTrigger>
          <TabsTrigger value="products">Products Details</TabsTrigger>
          <TabsTrigger value="customer">Customer Details</TabsTrigger>
        </TabsList>
        
        <TabsContent value="invoice">
          <InvoiceTab 
            handleBillUpdate={handleBillUpdate}
            currentBill={currentBill}
            isEditing={isEditing}
            fileId={fileId}
            billId={billId}
          />
        </TabsContent>
        
        <TabsContent value="products">
          <ProductsTab 
            currentBill={currentBill}
            handleBillUpdate={handleBillUpdate}
            isEditing={isEditing}
            fileId={fileId}
            billId={billId}
          />
        </TabsContent>
        
        <TabsContent value="customer">
          <CustomerTab 
            handleBillUpdate={handleBillUpdate}
            currentBill={currentBill}
            isEditing={isEditing}
            fileId={fileId}
            billId={billId}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BillDetailsPage;