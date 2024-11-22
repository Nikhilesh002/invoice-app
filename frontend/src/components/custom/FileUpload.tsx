import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import { useDispatch } from 'react-redux';
import { addFile } from '@/redux/slices/fileSlice';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { useToast } from '@/hooks/use-toast';

const FileUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();
  const dispatch = useDispatch();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      const validExtensions = ['pdf', 'jpg', 'png', 'xlsx', 'xls', 'csv', 'webp', 'heic', 'jpeg', 'heif'];
      const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase();

      if (validExtensions.includes(fileExtension || '')) {
        setFile(selectedFile);
      } else {
        toast({
          title: "Invalid File Type",
          description: `Allowed formats: ${validExtensions.join(', ')}`,
          variant: "destructive",
        });
        setFile(null);
      }
    } else {
      toast({
        title: "No file selected",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!file) {
      toast({
        title: "No file selected",
        variant: "destructive",
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("fileUpload", file);

      const response = await axios.post(`${window.location.origin}/api/file/get-ai-data`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        const billsCount = response.data?.length || 0;
        toast({
          title: "File Uploaded Successfully",
          description: `Processed ${billsCount} bill${billsCount !== 1 ? 's' : ''} from the file.`,
        });

        dispatch(addFile(response.data));

        // Reset file input
        setFile(null);
        (document.getElementById('fileUpload') as HTMLInputElement).value = '';
      } else {
        throw new Error("Unexpected response status");
      }
    } catch (error) {
      console.error("File upload error:", error);
      toast({
        title: "Upload Failed",
        description: "Unable to process the file",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-1/3 mx-auto mt-20">
      <Card>
        <CardHeader>
          <CardTitle>Upload File</CardTitle>
          <CardDescription>Extract bill details from the uploaded file</CardDescription>
        </CardHeader>
        <CardContent>
          <form 
            onSubmit={handleSubmit} 
            className="flex flex-col space-y-3" 
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
            <Button type="submit" disabled={!file}>
              {file ? `Upload: ${file.name}` : 'Select a File'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default FileUpload;
