
import React from 'react';
import { Box } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { uploadData, remove, list } from 'aws-amplify/storage';
import { useState, useEffect } from "react";
import Header from '../../components/header';
import { fetchAuthSession } from "aws-amplify/auth";
import { useAuthenticator } from "@aws-amplify/ui-react";



const Create: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [identityId, setIdentityId] = useState<string | null>(null);
    const { user } = useAuthenticator((context) => [context.user]); // Get user info

    useEffect(() => {
      const getIdentityId = async () => {
        try {
          const session = await fetchAuthSession(); // Get session details
          const identityId = session.identityId; // Get identity ID
          console.log("Identity ID:", identityId);
          if (identityId) {
            setIdentityId(identityId);
          }
          
        } catch (error) {
          console.error("Error fetching identity ID:", error);
        }
      };
  
      getIdentityId();
    }, [user]);


  // WebSocket useEffect - Connects WebSocket & listens for messages
  useEffect(() => {
    
    if (!identityId) return; // Ensure identityId is available

    console.log("Authenticated user ID:", identityId);
    const socket = new WebSocket(`wss://z8rnb7qh00.execute-api.ap-southeast-1.amazonaws.com/production?user_id=${identityId}`);

    socket.onopen = () => console.log("Connected to WebSocket ✅");

    socket.onmessage = (event) => {
        console.log("WebSocket message received:", event.data);
        try {
            const data = JSON.parse(event.data);
            if (data.status === "ready" && data.url) {
                window.location.href = data.url; // Auto-download CSV when ready
            }
        } catch (error) {
            console.error("Error processing WebSocket message:", error);
        }
    };

    socket.onclose = () => console.log("WebSocket disconnected ❌");

    return () => socket.close(); // Cleanup WebSocket on component unmount
}, [identityId]);
    

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
              const { items } = await list({ path: ({identityId}) => `image-documents/${identityId}/`, });
        
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
                path: ({identityId}) => `image-documents/${identityId}/${file.name}`,
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
