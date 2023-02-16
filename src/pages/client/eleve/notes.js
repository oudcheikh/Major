import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import formattedDate from "../../../utils"

export default function NotesHistory(Props) {

  return (


    
    <div>

{Props.notes.map((item) =>   <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography> Chapitre : {item.chapitre} | Note Globale : {item.note_globale} </Typography>
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
          
        </AccordionDetails>
      </Accordion>
      )}
    

      
    </div>
  );
}
