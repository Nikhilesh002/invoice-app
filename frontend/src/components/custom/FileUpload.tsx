import React, { useState } from 'react';
import { Button } from '../ui/button';
import axios from 'axios';
import { Input } from '../ui/input';
import { useDispatch } from 'react-redux';
import { addFile } from '../../redux/slices/fileSlice';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/hooks/use-toast';

function FileUpload() {
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();
  const dispatch = useDispatch();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    } else {
      toast({
        title: "Please select a file",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (file) {
      try {
        const formData = new FormData();
        formData.append("fileUpload", file);

        const response = await axios.post('http://localhost:3217/api/file/upload', formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          }
        });

        // Generate a unique filename if needed
        const fileName = response.data.fileName || file.name;
        const uniqueFileName = response.data.bills.length > 0 
          ? fileName + (Math.floor(Math.random() * 900) + 100).toString() 
          : fileName;

        // Dispatch the file with bills to Redux
        dispatch(addFile({
          id: uuidv4(),
          name: uniqueFileName,
          bills: response.data.bills.map((bill: any) => ({
            id: uuidv4(),
            invoice: bill.invoice || null,
            products: bill.products || null,
            customer: bill.customer || null
          }))
        }));

        toast({
          title: "File Uploaded Successfully",
          description: `Processed ${response.data.bills.length} bills`
        });

        // Reset file input
        setFile(null);
        event.currentTarget.reset();

      } catch (error) {
        console.error("File upload error:", error);
        toast({
          title: "Upload Failed",
          description: "Unable to process the file",
          variant: "destructive"
        });
      }
    } else {
      toast({
        title: "Please select a file",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="w-1/3 mx-auto mt-20">
      <Card>
        <CardHeader>
          <CardTitle>Upload Invoice</CardTitle>
          <CardDescription>Extract bill details from file</CardDescription>
        </CardHeader>
        <CardContent>
          <form 
            onSubmit={handleSubmit} 
            className='flex flex-col space-y-3' 
            method="post" 
            encType="multipart/form-data"
          >
            <Input 
              type="file" 
              accept=".pdf,.jpg,.png,.xlsx,.xls,.csv,webp,.heic,.jpeg,.heif" 
              name="fileUpload" 
              id="fileUpload" 
              onChange={handleChange} 
            />
            <Button type='submit' disabled={!file}>
              {file ? 'Upload File' : 'Select a File'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default FileUpload;