import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { RootState } from '../redux/store';
import { setCurrentBill, setCurrentFile, removeBill } from '@/redux/slices/fileSlice';
import { Card, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
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

const Bills: React.FC = () => {
  const { fileId } = useParams<{ fileId: string }>();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const allFiles = useSelector((state: RootState) => state.files.files);
  const currentFile = allFiles?.find((file) => file?._id === fileId);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [billToDelete, setBillToDelete] = useState<Bill | null>(null);

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
        await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/file/delete-bill/${billToDelete._id}`);
        toast.success('Bill deleted successfully');
        dispatch(removeBill({ fileId: currentFile._id, billId: billToDelete._id }));
        setIsDeleteDialogOpen(false);
        setBillToDelete(null);
      } catch (error) {
        console.error('Error deleting bill:', error);
        toast.error('Failed to delete bill');
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{currentFile?.name || 'Unnamed File'}</h1>
        <Button variant="outline" onClick={() => navigate('/files')}>
          Back to Files
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.isArray(currentFile.bills) && currentFile.bills.length > 0 ? (
          currentFile.bills.map((bill, index) => (
            bill && (
              <Card
                key={bill._id}
                onClick={() => handleClick(bill)}
                className="cursor-pointer hover:shadow-lg transition-shadow"
              >
                <CardTitle className="p-4">Bill {index + 1}</CardTitle>
                <CardDescription className="px-4 pb-2">
                  {bill?.invoice?.customer_name || 'Unnamed Customer'}
                </CardDescription>
                <CardContent className="text-sm">
                  <p>Total Amount: {bill?.invoice?.total_amount || 'N/A'}</p>
                  <p>Date: {bill?.invoice?.date || 'N/A'}</p>
                </CardContent>
                <CardFooter className="justify-end">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={(e) => handleDeleteClick(e, bill)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            )
          ))
        ) : (
          <p className="text-center text-gray-500">No bills available for this file.</p>
        )}
      </div>

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
