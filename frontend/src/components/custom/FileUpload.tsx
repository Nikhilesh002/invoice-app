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
import { toast } from 'react-hot-toast';

const FileUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const dispatch = useDispatch();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      const validExtensions = ['pdf', 'jpg', 'png', 'xlsx', 'xls', 'csv', 'webp', 'heic', 'jpeg', 'heif'];
      const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase();

      if (validExtensions.includes(fileExtension || '')) {
        setFile(selectedFile);
      } else {
        toast.error(`Invalid File Type. Allowed formats: ${validExtensions.join(', ')}`);
        setFile(null);
      }
    } else {
      toast.error("No file selected");
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!file) {
      toast.error("No file selected");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("fileUpload", file);

      toast.dismiss();

      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/file/get-ai-data`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = progressEvent.total ? Math.round((progressEvent.loaded * 100) / progressEvent.total) : 0;
          toast.loading(`Uploading file... ${percentCompleted}%`, { id: 'upload-progress' });
          if(percentCompleted === 100){
            toast.dismiss('upload-progress');
            toast.loading(`Processing file...`, { id: 'processing-progress' });
          }
        }
      });

      toast.dismiss('upload-progress');
      toast.dismiss('processing-progress');


      if (response.status === 200) {
        const billsCount = response.data?.length || 0;
        toast.success(`File Uploaded Successfully. Processed ${billsCount} bill${billsCount > 1 ? 's' : ''} from the file.`);
        dispatch(addFile(response.data));

        // Reset file input
        setFile(null);
        (document.getElementById('fileUpload') as HTMLInputElement).value = '';
      } else {
        throw new Error("Unexpected response status");
      }
    } catch (error) {
      console.error("File upload error:", error);
      toast.error("Upload Failed. Unable to process the file.");
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
