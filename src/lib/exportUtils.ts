import { toast } from "sonner";
import { jsPDF } from "jspdf";

export const exportToCSV = (data: any[], filename: string, headers: string[]) => {
  try {
    const rows = data.map(row => headers.map(h => row[h] || ''));
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('CSV downloaded successfully');
  } catch (error) {
    console.error('CSV export error:', error);
    toast.error('Failed to export CSV');
  }
};

export const exportToPDF = (content: string, filename: string) => {
  try {
    const doc = new jsPDF();
    const lines = doc.splitTextToSize(content, 180);
    doc.text(lines, 10, 10);
    doc.save(`${filename}_${Date.now()}.pdf`);
    toast.success('PDF downloaded successfully');
  } catch (error) {
    console.error('PDF export error:', error);
    toast.error('Failed to export PDF');
  }
};

export const exportResponsesToCSV = (responses: any[]) => {
  try {
    const headers = ['Response ID', 'Respondent Name', 'Contact', 'Submitted', 'Question ID', 'Answer'];
    const flatData = responses.flatMap(r => 
      r.responses.map((a: any) => ({
        'Response ID': r.id,
        'Respondent Name': r.respondentName,
        'Contact': r.respondentContact,
        'Submitted': new Date(r.createdAt).toLocaleString(),
        'Question ID': a.questionId,
        'Answer': a.answer
      }))
    );
    exportToCSV(flatData, 'responses', headers);
  } catch (error) {
    console.error('Response CSV export error:', error);
    toast.error('Failed to export responses to CSV');
  }
};

export const exportResponsesToPDF = (responses: any[]) => {
  try {
    const doc = new jsPDF();
    let yPos = 20;
    
    responses.forEach((r, idx) => {
      if (idx > 0) {
        doc.addPage();
        yPos = 20;
      }
      
      doc.setFontSize(16);
      doc.text('Survey Response', 10, yPos);
      yPos += 10;
      
      doc.setFontSize(12);
      doc.text(`Respondent: ${r.respondentName}`, 10, yPos);
      yPos += 7;
      doc.text(`Contact: ${r.respondentContact}`, 10, yPos);
      yPos += 7;
      doc.text(`Submitted: ${new Date(r.createdAt).toLocaleString()}`, 10, yPos);
      yPos += 10;
      
      doc.setFontSize(14);
      doc.text('Answers:', 10, yPos);
      yPos += 7;
      
      doc.setFontSize(10);
      r.responses.forEach((a: any, i: number) => {
        if (yPos > 270) {
          doc.addPage();
          yPos = 20;
        }
        doc.text(`${i + 1}. Question ID: ${a.questionId}`, 10, yPos);
        yPos += 5;
        const answerLines = doc.splitTextToSize(`   Answer: ${a.answer}`, 180);
        doc.text(answerLines, 10, yPos);
        yPos += answerLines.length * 5 + 3;
      });
    });
    
    doc.save(`responses_${Date.now()}.pdf`);
    toast.success('PDF downloaded successfully');
  } catch (error) {
    console.error('Response PDF export error:', error);
    toast.error('Failed to export responses to PDF');
  }
};
