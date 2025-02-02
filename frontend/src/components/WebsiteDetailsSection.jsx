// src/components/WebsiteDetailsSection.jsx
import React from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LinkIcon from '@mui/icons-material/Link';

const WebsiteDetailsSection = ({ websites, selectedWebsite, detailsRef }) => {
  return (
    <Box ref={detailsRef} sx={{ mt: 4 }}>
      <Typography
        variant="h5"
        gutterBottom
        sx={{ fontWeight: 'bold', color: '#333' }}
      >
        Detailed Website Information
      </Typography>
      {websites.map((website, index) => (
        <Accordion
          key={index}
          defaultExpanded={
            selectedWebsite && selectedWebsite.URL === website.URL
          }
          sx={{
            mb: 2,
            boxShadow: 3,
            borderRadius: 2,
          }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
              <LinkIcon sx={{ mr: 1 }} /> {website.URL}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              {Object.entries(website).map(([key, value]) => (
                <Grid item xs={12} sm={6} key={key}>
                  <Card variant="outlined" sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography
                        variant="subtitle2"
                        color="textSecondary"
                        gutterBottom
                      >
                        {key}
                      </Typography>
                      <Typography
                        variant="body2"
                        component="pre"
                        sx={{ whiteSpace: 'pre-wrap' }}
                      >
                        {typeof value === 'object'
                          ? JSON.stringify(value, null, 2)
                          : value.toString()}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default WebsiteDetailsSection;
