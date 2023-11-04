import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';


const formattedDate = (d) => {

  
  let month = ("0" + (d.getMonth() + 1)).slice(-2);
  let day = ("0" + d.getDate()).slice(-2);
  const year = String(d.getFullYear());
  const hour = ("0" + d.getHours()).slice(-2);
  const minutes = ("0" + d.getMinutes()).slice(-2);

  return `${day}/${month}/${year}-${hour}h${minutes}`;
};

export default function NotificationHistory(Props) {


  return (
    <div>

{Props.notifications.map((item) =>   <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
                    <Typography> date : {formattedDate(item.date.toDate())}  </Typography>

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
