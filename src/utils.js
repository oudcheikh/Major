

const formattedDate = (d) => {
    let month = ("0" +(d.getMonth()+1)).slice(-2);
    let day = ("0" + d.getDate()).slice(-2);
    const year = String(d.getFullYear());
  
    return `${day}/${month}/${year}`;
  };
  