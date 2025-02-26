
import React from 'react';
import { Box } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { uploadData, remove, list } from 'aws-amplify/storage';
import { useState, useEffect } from "react";
import Header from '../../components/header';



const Create: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);

    const downloadCSV = async (): Promise<void> => {
      try {
          const response: Response = await fetch("https://l3qz1unms6.execute-api.ap-southeast-1.amazonaws.com/prod");
          if (!response.ok) throw new Error("Download failed");
  
          const blob: Blob = await response.blob();
          const url: string = window.URL.createObjectURL(blob);
          const a: HTMLAnchorElement = document.createElement("a");
          
          a.href = url;
          a.download = "extracted_data.csv";
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
  
          // Clean up the object URL to free memory
          window.URL.revokeObjectURL(url);
      } catch (error) {
          console.error("Error downloading CSV:", error);
      }
  };
    

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
          setFile(event.target.files[0]); // ✅ Trigger re-fetch by updating the file state
        }
        };
    
      // upload file to S3
      useEffect(() => {
        if (file) {
    
          // Allowed image types (including JFIF)
          const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jfif", , "image/jpg"];
    
          // Check if file is an image
          if (!allowedTypes.includes(file.type)) {
            console.error("Invalid file type. Only images are allowed.");
            alert("Invalid file type. Please upload an image (JPG, JFIF, PNG, WebP).");
            return;
          }
    
          // Check file size before uploading (limit: 5MB)
          if (file.size > 5 * 1024 * 1024) {  
            console.error("File size exceeds 5MB limit.");
            alert("File size exceeds 5MB limit. Please upload a smaller file.");
            return;
          }
          
          const uploadFile = async () => {
            
            try {
    
              // List all objects in the user's profile picture folder
              const { items } = await list({ path: 'image-documents/', });
        
              // Ensure there are items before attempting to delete
              if (items.length > 0) {
                await Promise.all(
                  items.map(async (item) => {
                    await remove({ path: item.path }); // Correctly pass 'path'
                  })
                );
              }
        
              // Upload new file after deletion
              await uploadData({
                path: `image-documents/${file.name}`,
                data: file,
                  
              });
              console.log('File uploaded successfully');
    
    
            } catch (error) {
               console.error('Failed to upload file:', error);
            }
          };
        
          uploadFile();
        }
      }, [file]);

  return (
    
    <Box m="10px">
      <Header 
        title="Create Your Project" 
        subtitle="Upload, manage, and download your files" 
      />
      
      <button onClick={downloadCSV}>Download CSV</button>;
      
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          gap: { xs: 4, sm: 6, md: 8 },
          marginBottom: 5,
          marginTop: 3,
        }}
      >
        
        {/* Hidden file input */}
        <input
          type="file"
          id="file-upload"
          style={{ display: 'none' }}
          onChange={handleChange}
        />
        
        {/* Upload Icon as label */}
        <label htmlFor="file-upload">
          <UploadFileIcon 
            sx={{
              fontSize: { xs: 40, sm: 48, md: 56 },
              color: '#ffffff',
              cursor: 'pointer',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                color: '#646cff',
                transform: 'scale(1.1)',
              },
              '&:active': {
                transform: 'scale(0.95)',
              }
            }}
          />
        </label>

      </Box>
       
      
          

    </Box>
  );
};

export default Create;
