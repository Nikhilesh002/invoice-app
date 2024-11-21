import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import InvoiceTab from '@/components/custom/InvoiceTab';
import ProductsTab from '@/components/custom/ProductsTab';
import CustomerTab from '@/components/custom/CustomerTab';
import { Button } from '@/components/ui/button';

const BillDetailsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('invoice');
  const [isEditing, setIsEditing] = useState(false);
  
  const currentBill = useSelector((state: RootState) => state.files.currentBill);
  const currentFile = useSelector((state: RootState) => state.files.currentFile);

  if (!currentBill || !currentFile) {
    return <div>No bill selected</div>;
  }

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
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
          <TabsTrigger value="invoice">Invoice</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="customer">Customer</TabsTrigger>
        </TabsList>
        
        <TabsContent value="invoice">
          <InvoiceTab 
            invoice={currentBill.invoice} 
            isEditing={isEditing}
            fileId={currentFile.id}
            billId={currentBill.id}
          />
        </TabsContent>
        
        <TabsContent value="products">
          <ProductsTab 
            products={currentBill.products} 
            isEditing={isEditing}
            fileId={currentFile.id}
            billId={currentBill.id}
          />
        </TabsContent>
        
        <TabsContent value="customer">
          <CustomerTab 
            customer={currentBill.customer} 
            isEditing={isEditing}
            fileId={currentFile.id}
            billId={currentBill.id}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BillDetailsPage;