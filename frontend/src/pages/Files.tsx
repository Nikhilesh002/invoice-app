import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setCurrentFile, storeFiles, removeFile } from '@/redux/slices/fileSlice';
import { Button } from '@/components/ui/button';
import { RootState } from '@/redux/store';
import axios from 'axios';
import { UserFile } from '@/types';
import { Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { renderValue } from '@/lib/renderValue';
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



const Files: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const reduxFiles = useSelector((state: RootState) => state.files.files);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<UserFile | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        toast.loading('Fetching files...');
        const response = await axios.get<UserFile[]>(`${import.meta.env.VITE_BACKEND_URL}/api/file`);
        toast.dismiss();
        if (response?.data) {
          dispatch(storeFiles(response.data));
        }
      } catch (error) {
        console.error('Error fetching files:', error);
        toast.error('Failed to fetch files');
      }
    };

    fetchFiles();
  }, [dispatch]);

  const handleFileClick = (file: UserFile | null) => {
    if (!file) return;
    dispatch(setCurrentFile(file));
    navigate(`/file/${file._id}`);
  };

  const handleDeleteClick = (e: React.MouseEvent, file: UserFile | null) => {
    e.stopPropagation();
    if (!file) return;
    setFileToDelete(file);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (fileToDelete?._id) {
      try {
        toast.loading('Deleting file...');
        await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/file/delete-file/${fileToDelete._id}`);
        toast.dismiss();
        toast.success('File deleted successfully');
        dispatch(removeFile(fileToDelete._id));
        setIsDeleteDialogOpen(false);
        setFileToDelete(null);
      } catch (error) {
        console.error('Error deleting file:', error);
        toast.error('Failed to delete file');
      }
      finally {
        toast.dismiss();
      }
    }
  };

  // Filter bills based on search term
  const filteredFiles = Array.isArray(reduxFiles) 
    ? reduxFiles.filter(file => file?.name?.toLowerCase().includes(searchTerm.toLowerCase())) 
    : [];


  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Your Files</h1>
      <Input type='text' value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search Files" className="mb-6"
        />
      <div className="w-full">
        {Array.isArray(reduxFiles) && reduxFiles.length > 0 ? (
          <Table className='text-center'>
          <TableCaption>A list of bills in the file.</TableCaption>
          <TableHeader>
            <TableRow className='text-center'>
              <TableHead>S.No</TableHead>
              <TableHead className="text-center">File Name</TableHead>
              <TableHead className="text-center">No of bills</TableHead>
              <TableHead className="text-center">Upload Date</TableHead>
              <TableHead className="text-center">Upload Time</TableHead>
              <TableHead className='w-20 text-center'>Delete</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {
              filteredFiles && filteredFiles.map((file,ind) => (
                <TableRow key={ind} onClick={() => handleFileClick(file)} >
                  <TableCell >{ind+1}</TableCell>
                  <TableCell>{renderValue(file.name)}</TableCell>
                  <TableCell>{renderValue(file?.bills?.length)}</TableCell>
                  <TableCell className="">{renderValue(new Date(file.createdAt), { type: "date"})}</TableCell>
                  <TableCell className="">{renderValue(new Date(file.createdAt), { type: "time"})}</TableCell>
                  <TableCell className='w-20'>
                    <Button variant="destructive" onClick={(e) => handleDeleteClick(e, reduxFiles[0])}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            }
          </TableBody>
        </Table>
        ) : (
          <p className="text-center text-gray-500">No files found.</p>
        )}
      </div>

      {isDeleteDialogOpen && (
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure you want to delete this file?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the file
                and all its associated bills.
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

export default Files;
