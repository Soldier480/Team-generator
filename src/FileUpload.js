
import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
let devSheet={};
let baSheet={};
let daSheet={};
const FileUpload = () => {
  const [teams, setTeams] = useState([]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });

       devSheet = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
       baSheet = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[1]]);
       daSheet = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[2]]);

      generateTeams(devSheet, baSheet, daSheet);
    };
    reader.readAsArrayBuffer(file);
  };
  
  const generateTeams = (devs, bas, das) => {
    const teams = [];
    const numberOfTeams = Math.min(Math.floor(devs.length / 3), bas.length, das.length);

    for (let i = 0; i < numberOfTeams; i++) {
      teams.push({
        devs: devs.slice(i * 3, i * 3 + 3),
        ba: bas[i],
        da: das[i],
      });
    }

    setTeams(teams);
  };
  const message = (devs,bas,das) => {
    const teams = [];
    const numberOfTeams = Math.min(Math.floor(devs.length / 3), bas.length, das.length);

    for (let i = 0; i < numberOfTeams; i++) {
      teams.push({
        devs: devs.slice(i * 3, i * 3 + 3),
        ba: bas[i],
        da: das[i],
      });
    }
     setTeams(teams);
     alert("Teams generated successfully");
  }
  const generatePDF = () => {
    if (teams.length === 0) {
        console.error("No teams to generate PDF.");
        return;
      }
    const doc = new jsPDF();
    
    const verticalSpacing = 10; // Vertical space between lines
    let currentY = 10; // Starting vertical position
    const pageHeight = doc.internal.pageSize.height; // Get the height of the page
    const margin = 10; // Margin from the bottom of the page
  
    teams.forEach((team, index) => {
      // Check if there's enough space left on the page
      if (currentY + 60 > pageHeight - margin) { // Adjust 60 to approximate height of the content for a team
        doc.addPage(); // Add a new page
        currentY = 10; // Reset Y position for the new page
      }
  
      // Add team title
      doc.text(`Team ${index + 1}`, 10, currentY);
      currentY += verticalSpacing; // Move down for the next line
  
      // Add "Developers" label
      doc.text(`Developers:`, 10, currentY);
      currentY += verticalSpacing; // Move down for the next line
  
      // Add developer names
      team.devs.forEach((dev, i) => {
        doc.text(`${dev.Name}`, 20, currentY);
        currentY += verticalSpacing; // Move down for each developer
      });
  
      // Add Business Analyst
      doc.text(`Business Analyst: ${team.ba.Name}`, 10, currentY);
      currentY += verticalSpacing; // Move down for the next line
  
      // Add Data Analyst
      doc.text(`Data Analyst: ${team.da.Name}`, 10, currentY);
      currentY += verticalSpacing; // Move down for the next line
  
      // Add extra spacing between teams
      currentY += 20; // Adjust this if needed to ensure enough space between teams
    });
  
    doc.save('teams.pdf');
  };
  
  

  return (
    <div>
      <input type="file" onChange={handleFileUpload} />
      <button onClick={() => message(devSheet,baSheet,daSheet)}>Generate Teams</button> 
      <button style={{marginLeft: '10px'}}  onClick={generatePDF}>Print PDF</button>
    </div>
  );
};

export default FileUpload;
