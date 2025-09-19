import jsPDF from 'jspdf';
import { QuizResult } from '../types';

export const generatePDFReport = (result: QuizResult, studentName: string = 'Student') => {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 20;

  // Header
  pdf.setFontSize(20);
  pdf.setTextColor(0, 120, 150); // Primary color
  pdf.text('Disha - Career Guidance Report', margin, 30);
  
  pdf.setFontSize(12);
  pdf.setTextColor(100, 100, 100);
  pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, margin, 40);

  // Student Information
  pdf.setFontSize(16);
  pdf.setTextColor(0, 0, 0);
  pdf.text('Student Report', margin, 60);
  
  pdf.setFontSize(12);
  pdf.text(`Name: ${studentName}`, margin, 75);
  // Removed score display per requirements

  // Recommended Stream
  pdf.setFontSize(16);
  pdf.setTextColor(0, 120, 150);
  pdf.text('Recommended Stream', margin, 110);
  
  pdf.setFontSize(14);
  pdf.setTextColor(0, 0, 0);
  pdf.text(result.stream, margin, 125);

  // Course Recommendations
  let currentY = 145;
  pdf.setFontSize(16);
  pdf.setTextColor(0, 120, 150);
  pdf.text('Recommended Courses', margin, currentY);

  result.recommendations.forEach((course, index) => {
    currentY += 20;
    
    // Check if we need a new page
    if (currentY > 250) {
      pdf.addPage();
      currentY = 30;
    }

    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);
    pdf.text(`${index + 1}. ${course.name}`, margin, currentY);
    
    currentY += 10;
    pdf.setFontSize(10);
    pdf.setTextColor(80, 80, 80);
    
    // Split long text into multiple lines
    const descriptionLines = pdf.splitTextToSize(course.description, pageWidth - 2 * margin);
    pdf.text(descriptionLines, margin + 5, currentY);
    currentY += descriptionLines.length * 5;
    
    currentY += 5;
    pdf.text(`Duration: ${course.duration}`, margin + 5, currentY);
    
    currentY += 8;
    const rationaleLines = pdf.splitTextToSize(`Why this suits you: ${course.rationale}`, pageWidth - 2 * margin);
    pdf.text(rationaleLines, margin + 5, currentY);
    currentY += rationaleLines.length * 5 + 5;
  });

  // College Recommendations
  currentY += 15;
  if (currentY > 250) {
    pdf.addPage();
    currentY = 30;
  }

  pdf.setFontSize(16);
  pdf.setTextColor(0, 120, 150);
  pdf.text('Recommended Colleges', margin, currentY);

  result.colleges.slice(0, 5).forEach((college, index) => {
    currentY += 15;
    
    if (currentY > 250) {
      pdf.addPage();
      currentY = 30;
    }

    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);
    pdf.text(`${index + 1}. ${college.name}`, margin, currentY);
    
    currentY += 8;
    pdf.setFontSize(10);
    pdf.setTextColor(80, 80, 80);
    pdf.text(`Location: ${college.location}, ${college.district}`, margin + 5, currentY);
    
    currentY += 6;
    pdf.text(`Type: ${college.type} College`, margin + 5, currentY);
    
    if (college.contact) {
      currentY += 6;
      pdf.text(`Contact: ${college.contact}`, margin + 5, currentY);
    }
  });

  // Footer
  const totalPages = pdf.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    pdf.setFontSize(8);
    pdf.setTextColor(150, 150, 150);
    pdf.text(
      `Disha Career Guidance Platform - Page ${i} of ${totalPages}`,
      margin,
      pdf.internal.pageSize.getHeight() - 10
    );
  }

  // Save the PDF
  pdf.save(`${studentName}_Career_Report.pdf`);
};