import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Upload, Download, FileSpreadsheet, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const CollegeImport: React.FC = () => {
  const [isImporting, setIsImporting] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      toast({
        title: "Invalid file format",
        description: "Please upload a CSV file",
        variant: "destructive"
      });
      return;
    }

    setIsImporting(true);

    try {
      const text = await file.text();
      const lines = text.split('\n');
      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
      
      console.log('CSV Headers:', headers);
      
      // Expected headers mapping
      const headerMap = {
        'S. No.': 'serial_no',
        'College Name': 'college_name', 
        'Type': 'ownership',
        'District': 'district',
        'Urban/Rural Status': 'area_type',
        'Courses Offered (Categorized Streams)': 'streams_offered',
        'Approximate Annual Fee Range (UG)': 'fee_range_ug',
        'Working College Link': 'website'
      };

      const colleges = [];
      
      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        
        const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
        
        if (values.length < headers.length) continue;
        
        const college = {
          serial_no: parseInt(values[0]) || i,
          college_name: values[1] || 'Unknown College',
          ownership: values[2] || 'Government',
          district: values[3] || 'Srinagar',
          area_type: values[4] || 'Urban',
          streams_offered: values[5] ? values[5].split(';').map(s => s.trim()) : ['Arts'],
          fee_range_ug: values[6] || 'Fee not specified',
          website: values[7] || null
        };
        
        colleges.push(college);
      }

      console.log(`Parsed ${colleges.length} colleges`);

      // Insert colleges in batches
      const batchSize = 10;
      let inserted = 0;
      
      for (let i = 0; i < colleges.length; i += batchSize) {
        const batch = colleges.slice(i, i + batchSize);
        
        const { error } = await supabase
          .from('colleges')
          .insert(batch);
          
        if (error) {
          console.error('Batch insert error:', error);
          toast({
            title: "Import warning",
            description: `Some records may have failed to import: ${error.message}`,
            variant: "destructive"
          });
        } else {
          inserted += batch.length;
        }
      }

      toast({
        title: "Import successful",
        description: `Imported ${inserted} colleges successfully`,
      });

    } catch (error) {
      console.error('Import error:', error);
      toast({
        title: "Import failed",
        description: "Failed to parse or import CSV file. Please check the format.",
        variant: "destructive"
      });
    } finally {
      setIsImporting(false);
      // Clear the input
      if (event.target) {
        event.target.value = '';
      }
    }
  };

  const downloadSampleCSV = () => {
    const sampleData = [
      ['S. No.', 'College Name', 'Type', 'District', 'Urban/Rural Status', 'Courses Offered (Categorized Streams)', 'Approximate Annual Fee Range (UG)', 'Working College Link'],
      ['1', 'Government Degree College Example', 'Government', 'Srinagar', 'Urban', 'Science;Commerce;Arts', 'Rs. 5,000-15,000', 'https://example.edu'],
      ['2', 'Private College Example', 'Private', 'Jammu', 'Urban', 'Science;Engineering', 'Rs. 50,000-100,000', 'https://private.edu']
    ];

    const csvContent = sampleData.map(row => row.map(field => `"${field}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'college_import_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileSpreadsheet className="h-6 w-6" />
            <span>College Data Import</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Import college data from CSV files. Make sure your CSV follows the expected format with these columns:
              S. No., College Name, Type, District, Urban/Rural Status, Courses Offered, Fee Range, Website Link
            </AlertDescription>
          </Alert>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <Label htmlFor="csv-file">Upload CSV File</Label>
              <Input
                id="csv-file"
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                disabled={isImporting}
              />
              <Button 
                onClick={() => document.getElementById('csv-file')?.click()}
                disabled={isImporting}
                className="w-full"
              >
                <Upload className="h-4 w-4 mr-2" />
                {isImporting ? 'Importing...' : 'Upload & Import CSV'}
              </Button>
            </div>

            <div className="space-y-4">
              <Label>Download Template</Label>
              <p className="text-sm text-muted-foreground">
                Download a sample CSV template with the correct format
              </p>
              <Button 
                onClick={downloadSampleCSV}
                variant="outline"
                className="w-full"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Sample CSV
              </Button>
            </div>
          </div>

          <div className="text-sm text-muted-foreground space-y-2">
            <p><strong>CSV Format Guidelines:</strong></p>
            <ul className="list-disc list-inside space-y-1">
              <li>First row should contain headers exactly as shown above</li>
              <li>Separate multiple courses with semicolons (;)</li>
              <li>Type should be "Government" or "Private"</li>
              <li>Area type should be "Urban" or "Rural"</li>
              <li>Districts should match J&K district names</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CollegeImport;