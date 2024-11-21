import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Card } from "@/components/ui/card";
import FileUpload from './FileUpload';
import InvoicesTab from './InvoicesTab';
import ProductsTab from './ProductsTab';
import CustomersTab from './CustomersTab';
import { useAppSelector } from '@/redux/store';
import { Loader2 } from 'lucide-react';

const HomePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('invoices');
  const { bills, loading, error } = useAppSelector(state => state.bills);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin" size={48} />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-4 text-red-500">
        Error: {error}
      </Card>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <FileUpload />
      
      {bills.length > 0 && (
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab} 
          className="mt-4"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
          </TabsList>
          
          <TabsContent value="invoices">
            <InvoicesTab />
          </TabsContent>
          
          <TabsContent value="products">
            <ProductsTab />
          </TabsContent>
          
          <TabsContent value="customers">
            <CustomersTab />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default HomePage;