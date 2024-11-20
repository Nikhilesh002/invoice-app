import React from 'react'
import { Button } from '../ui/button'
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';

function FileUpload() {

  const [file, setFile] = React.useState<File | null>(null);

  const { toast } = useToast()

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
    else {
      toast({
        title: "Please select a file",
        variant: "destructive"
      })
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (file) {
      toast({
        title: "File Uploaded",
      })

      const formData = new FormData();
      formData.append("fileUpload", file);
      // const res = await axios.post(`${import.meta.env.BACKEND_URL}/api/file/get-data`, formData,{
      //   headers: {
      //     "Content-Type": "multipart/form-data",
      //   }
      // });
      // console.log(res);
    }
    else{
      toast({
        title: "Please select a file",
        variant: "destructive"
      })
    }
  };



  return (
    <div>
      <div className="w-1/3 mx-auto mt-20">
        <form onSubmit={handleSubmit} action="/api/file/get-data" className='flex flex-col space-y-3' method="post" encType="multipart/form-data" >
          <input type="file" accept="" name="fileUpload" id="fileUpload" onChange={handleChange} />
          <Button type='submit'>Upload file</Button>
        </form>
      </div>
    </div>
  )
}

export default FileUpload