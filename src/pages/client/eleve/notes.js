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

export default function NotesHistory(Props) {

  return (
    <div>{Props.notes.map((item) =>   <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography> Chapitre : {item.chapitre} | Note Globale : {item.note_globale} | Date : {formattedDate(item.date.toDate())}
           </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
          comprehension : {item.comprehension} 
          </Typography>
          <Typography>
          effort : {item.effort} 
          </Typography>
          <Typography>
          environment : {item.environment} 
          </Typography>
          <Typography>
          ponctualite : {item.ponctualite} 
          </Typography>
          <Typography>
          remarque : {item.remarque}   
          </Typography>

          <Typography>
          num_client  : {item.num_client ? item.num_client : " "} 
          </Typography>
          
          <Typography>
           date du course : {formattedDate(item.course_date.toDate())} 
          </Typography>
        </AccordionDetails>
      </Accordion>
      )}
    </div>
  );
}
