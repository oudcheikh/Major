import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function ListChildren(Props) {


  return (



    <div>

      {Props.enfents.map((item) => <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography> firstname : {item.firstname} | lastname : {item.lastname}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          
          <Typography>
          school : {item.school}
          </Typography>
          <Typography>
          classroom : {item.classroom}
          </Typography>
           
        </AccordionDetails>
      </Accordion>
      )}



    </div>
  );
}
