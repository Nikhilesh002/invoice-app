import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { RootState } from '../redux/store';
import { setCurrentBill, setCurrentFile, removeBill } from '@/redux/slices/fileSlice';
import { Button } from '@/components/ui/button';
import { Trash2, Search } from 'lucide-react';
import axios from 'axios';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Bill } from '@/types';
import toast from 'react-hot-toast';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { renderValue } from '@/lib/renderValue';



const Bills: React.FC = () => {
  const { fileId } = useParams<{ fileId: string }>();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const allFiles = useSelector((state: RootState) => state.files.files);
  const currentFile = allFiles?.find((file) => file?._id === fileId);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [billToDelete, setBillToDelete] = useState<Bill | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  if (!currentFile) {
    return (
      <div className="p-6">
        <h1 className="text-xl text-red-500">No file selected or file not found.</h1>
        <Button variant="outline" onClick={() => navigate('/files')}>
          Back to Files
        </Button>
      </div>
    );
  }

  dispatch(setCurrentFile(currentFile));

  const handleClick = (bill: Bill) => {
    if (!bill || !fileId) return;
    dispatch(setCurrentBill(bill));
    navigate(`/file/${fileId}/${bill._id}`);
  };

  const handleDeleteClick = (e: React.MouseEvent, bill: Bill) => {
    e.stopPropagation();
    if (!bill) return;
    setBillToDelete(bill);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (billToDelete && currentFile) {
      try {
        toast.loading('Deleting bill...');
        await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/file/delete-bill/${billToDelete._id}`);
        toast.dismiss();
        toast.success('Bill deleted successfully');
        dispatch(removeBill({ fileId: currentFile._id, billId: billToDelete._id }));
        setIsDeleteDialogOpen(false);
        setBillToDelete(null);
      } catch (error) {
        console.error('Error deleting bill:', error);
        toast.error('Failed to delete bill');
      }
      finally {
        toast.dismiss();
      }
    }
  };

  // Filter bills based on search term
  const filteredBills = Array.isArray(currentFile.bills) 
    ? currentFile.bills.filter((bill) => 
        bill && (
          bill?.invoice?.customer_name?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    : [];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{currentFile?.name || 'Unnamed File'}</h1>
        <Button variant="outline" onClick={() => navigate('/files')}>
          Back to Files
        </Button>
      </div>

      {/* Search Input */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          type="text"
          placeholder="Search bills..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 w-full"
        />
      </div>

      {filteredBills.length > 0 ? (
        <div className="overflow-x-auto">
          <Table className="w-full text-center">
            <TableCaption>Bills </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className='text-center'>Bill No</TableHead>
                <TableHead className='text-center'>Customer Name</TableHead>
                <TableHead className='text-center'>Total Amount</TableHead>
                <TableHead className='text-center'>Date</TableHead>
                <TableHead className='text-center'>Time</TableHead>
                <TableHead className='text-center'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBills.map((bill, index) => (
                bill && (
                  <TableRow 
                    key={bill._id} 
                    onClick={() => handleClick(bill)}
                   
                  >
                    <TableCell className=" text-center">{index + 1}</TableCell>
                    <TableCell>{renderValue(bill?.invoice?.customer_name)}</TableCell>
                    <TableCell>{renderValue(bill?.invoice?.total_amount,{type:"money"})}</TableCell>
                    <TableCell>{renderValue(bill?.invoice?.date,{type:"date"})}</TableCell>
                    <TableCell>{renderValue(bill?.invoice?.date,{type:"time"})}</TableCell>
                    <TableCell className=" text-center">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={(e) => handleDeleteClick(e, bill)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <p className="text-center text-gray-500">No bills available for this file.</p>
      )}

      {isDeleteDialogOpen && (
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure you want to delete this bill?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the bill
                and all its associated data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteConfirm}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
};

export default Bills;