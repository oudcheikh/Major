import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import formattedDate from "../../../utils"

export default function NotificationHistory(Props) {

  return (


    
    <div>

{Props.notifications.map((item) =>   <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography> Date : {item.body} </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
          {item.body}
          </Typography>
        </AccordionDetails>
      </Accordion>
      )}
    

      
    </div>
  );
}
