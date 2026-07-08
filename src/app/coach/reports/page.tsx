"use client";

import { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { FileDown, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
import * as XLSX from "xlsx";

export default function ReportsPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [athletes, setAthletes] = useState<any[]>([]);

  useEffect(() => {
    const fetchAthletes = async () => {
      const usersSnap = await getDocs(collection(db, "athletes"));
      setAthletes(usersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchAthletes();
  }, []);

  const generatePDFReport = async () => {
    setIsGenerating(true);
    try {
      const doc = new jsPDF();
      doc.setFontSize(20);
      doc.text("AMS Team Roster Report", 14, 22);
      
      doc.setFontSize(11);
      doc.setTextColor(100);
      doc.text(`Generated on ${new Date().toLocaleDateString()}`, 14, 30);

      const tableData = athletes.map(a => [
        a.firstName,
        a.lastName,
        a.email,
      ]);

      autoTable(doc, {
        startY: 40,
        head: [['First Name', 'Last Name', 'Email']],
        body: tableData,
        theme: 'grid',
        headStyles: { fillColor: [41, 128, 185] },
      });

      doc.save("AMS_Athlete_Report.pdf");
      toast.success("PDF generated successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate PDF");
    } finally {
      setIsGenerating(false);
    }
  };

  const generateExcelReport = () => {
    try {
      const ws = XLSX.utils.json_to_sheet(athletes.map(a => ({
        FirstName: a.firstName,
        LastName: a.lastName,
        Email: a.email
      })));
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Athletes");
      XLSX.writeFile(wb, "AMS_Athlete_Report.xlsx");
      toast.success("Excel downloaded successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate Excel");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
        <p className="text-muted-foreground mt-1">Export team data for external analysis.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* PDF Export */}
        <Card glass>
          <CardHeader>
            <CardTitle>Team Roster (PDF)</CardTitle>
            <CardDescription>A clean, printable list of all athletes in the system.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={generatePDFReport} disabled={isGenerating || athletes.length === 0} className="w-full">
              {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileDown className="mr-2 h-4 w-4" />}
              Download PDF
            </Button>
          </CardContent>
        </Card>

        {/* Excel Export */}
        <Card glass>
          <CardHeader>
            <CardTitle>Raw Data Export (Excel)</CardTitle>
            <CardDescription>Export athlete data to Excel for custom manipulation.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" onClick={generateExcelReport} disabled={athletes.length === 0} className="w-full">
              <FileDown className="mr-2 h-4 w-4" />
              Download Excel
            </Button>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
