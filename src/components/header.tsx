import React from 'react';
import { Box, Typography } from '@mui/material';

interface HeaderProps {
  title?: string;
  subtitle?: string;
}

const Header: React.FC<HeaderProps> = ({ 
  title = "Welcome", 
  subtitle = "Start your journey here" 
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '100%',
        textAlign: 'center',
        padding: { xs: '2rem 1rem', sm: '3rem 2rem' },
        marginTop: '5vh',
      }}
    >
      <Typography
        variant="h1"
        sx={{
          fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
          fontWeight: 700,
          color: '#ffffff',
          marginBottom: '1rem',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        {title}
      </Typography>
      
      <Typography
        variant="h2"
        sx={{
          fontSize: { xs: '1.2rem', sm: '1.5rem', md: '2rem' },
          fontWeight: 400,
          color: 'rgba(255, 255, 255, 0.8)',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        {subtitle}
      </Typography>
    </Box>
  );
};

export default Header;