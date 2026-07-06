import React from 'react';
import Box from '@mui/material/Box';
import CustomNavbar from './CustomNavbar';

const UpdatedLayout = ({ children, reportLinks, currentReportNumber, onReportLinkClick }) => {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F5F5F5' }}>
      <CustomNavbar
        reportLinks={reportLinks}
        currentReportNumber={currentReportNumber}
        onReportLinkClick={onReportLinkClick}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          mt: '64px',
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default UpdatedLayout;
