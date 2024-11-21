import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../ui/table';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '../ui/card';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '../ui/dialog';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useAppSelector, useAppDispatch } from '@/redux/store';
import { updateInvoice } from '@/redux/slices/fileSlice';

const InvoicesTab: React.FC = () => {
  const invoices = useAppSelector(state => state.invoices.invoices);
  const dispatch = useAppDispatch();
  const [editingInvoice, setEditingInvoice] = useState<number | null>(null);

  const handleEditInvoice = (index: number) => {
    setEditingInvoice(index);
  };

  const handleSaveInvoice = (index: number, updatedFields: any) => {
    dispatch(updateInvoice({ 
      index, 
      invoice: updatedFields 
    }));
    setEditingInvoice(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invoices Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Serial Number</TableHead>
              <TableHead>Customer Name</TableHead>
              <TableHead>Product Name</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Tax</TableHead>
              <TableHead>Total Amount</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((bill, index) => (
              <TableRow key={bill.invoice?.serial_number || index}>
                <TableCell>{bill.invoice?.serial_number || 'N/A'}</TableCell>
                <TableCell>{bill.invoice?.customer_name || 'N/A'}</TableCell>
                <TableCell>
                  {bill.products?.map(p => p.name).join(', ') || 'N/A'}
                </TableCell>
                <TableCell>
                  {bill.products?.map(p => p.quantity).join(', ') || 'N/A'}
                </TableCell>
                <TableCell>{bill.invoice?.tax || 'N/A'}</TableCell>
                <TableCell>{bill.invoice?.total_amount || 'N/A'}</TableCell>
                <TableCell>{bill.invoice?.date || 'N/A'}</TableCell>
                <TableCell>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleEditInvoice(index)}
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default InvoicesTab;

// import React, { useState } from 'react';
// import { useDispatch } from 'react-redux';
// import { updateInvoiceDetails } from '../../redux/fileSlice';
// import { Invoice } from '../../redux/fileSlice';
// import { Input } from '../ui/input';
// import { Button } from '../ui/button';
// import axios from 'axios';

// interface InvoiceTabProps {
//   invoice: Invoice | null;
//   isEditing: boolean;
//   fileId?: string;
//   billId?: string;
// }

// const InvoiceTab: React.FC<InvoiceTabProps> = ({ 
//   invoice, 
//   isEditing, 
//   fileId, 
//   billId 
// }) => {
//   const dispatch = useDispatch();
//   const [editedInvoice, setEditedInvoice] = useState<Invoice>(invoice || {
//     serial_number: null,
//     customer_name: null,
//     products: null,
//     shop_name: null,
//     shop_gstin: null,
//     quantity: null,
//     tax: null,
//     total_amount: null,
//     date: null
//   });

//   const handleInputChange = (key: keyof Invoice, value: string) => {
//     setEditedInvoice(prev => ({
//       ...prev,
//       [key]: value
//     }));
//   };

//   const handleSave = async () => {
//     try {
//       // Backend update
//       await axios.put(`http://localhost:3217/api/bill/${billId}/invoice`, {
//         invoice: editedInvoice
//       });

//       // Redux update
//       dispatch(updateInvoiceDetails({
//         fileId: fileId!, 
//         billId: billId!, 
//         invoiceDetails: editedInvoice
//       }));
//     } catch (error) {
//       console.error('Failed to update invoice', error);
//     }
//   };

//   const renderValue = (value: string | null) => 
//     value ? value : <span className="text-red-500">NA</span>;

//   return (
//     <div className="grid grid-cols-2 gap-4">
//       {isEditing ? (
//         <>
//           {Object.keys(editedInvoice).map((key) => (
//             <div key={key} className="mb-4">
//               <label className="block mb-2 capitalize">
//                 {key.replace(/_/g, ' ')}
//               </label>
//               <Input
//                 value={editedInvoice[key as keyof Invoice] || ''}
//                 onChange={(e) => handleInputChange(key as keyof Invoice, e.target.value)}
//               />
//             </div>
//           ))}
//           <Button onClick={handleSave}>Save Changes</Button>
//         </>
//       ) : (
//         <>
//           {Object.entries(invoice || {}).map(([key, value]) => (
//             <div key={key} className="mb-2">
//               <strong className="capitalize">{key.replace(/_/g, ' ')}: </strong>
//               {renderValue(value)}
//             </div>
//           ))}
//         </>
//       )}
//     </div>
//   );
// };

// export default InvoiceTab;