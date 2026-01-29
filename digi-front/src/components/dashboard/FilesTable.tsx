"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Download, FileText } from "lucide-react";
import { format } from "date-fns";
import api from "@/lib/axios";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Doc } from "@/types";

interface FilesTableProps {
  files: Doc[];
}

export function FilesTable({ files }: FilesTableProps) {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [selectedDoc, setSelectedDoc] = useState<Doc | null>(null);

    const handleView = async (doc: Doc) => {
        // For PDF viewing, we can use an iframe source pointing to the stream endpoint
        // But the stream endpoint requires Auth header (Bearer token).
        // Standard <iframe> or window.open won't send the header.
        // We might need to fetch blob and create object URL.
        try {
            const response = await api.get(`/documents/stream/${doc._id}`, {
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([response.data], { type: doc.mimeType }));
            setPreviewUrl(url);
            setSelectedDoc(doc);
        } catch (error) {
            console.error("Error fetching document", error);
            alert("Could not load document");
        }
    };

    const handleDownload = async (doc: Doc) => {
         try {
            const response = await api.get(`/documents/stream/${doc._id}`, {
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', doc.originalName);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("Error downloading document", error);
            alert("Could not download document");
        }
    }

  return (
    <>
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>CIN (Metadata)</TableHead>
            <TableHead>Name (Metadata)</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {files.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No files found.
              </TableCell>
            </TableRow>
          ) : (
            files.map((file) => (
              <TableRow key={file._id}>
                <TableCell className="font-medium flex items-center gap-2">
                    <FileText className="h-4 w-4 text-blue-500" />
                    {file.originalName}
                </TableCell>
                <TableCell>{String(file.metadata?.cin || "-")}</TableCell>
                <TableCell>{String(file.metadata?.nom || "-")}</TableCell>
                <TableCell>{(file.size / 1024).toFixed(1)} KB</TableCell>
                <TableCell>{format(new Date(file.createdAt), "PP p")}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => handleView(file)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDownload(file)}>
                    <Download className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>

    {/* PDF/File Viewer Dialog */}
    <Dialog open={!!previewUrl} onOpenChange={(open) => !open && setPreviewUrl(null)}>
        <DialogContent className="max-w-4xl h-[80vh]">
            <DialogHeader>
                <DialogTitle>{selectedDoc?.originalName}</DialogTitle>
            </DialogHeader>
            <div className="flex-1 h-full w-full bg-slate-100 overflow-hidden relative">
                {previewUrl && (
                    <iframe 
                        src={previewUrl} 
                        className="w-full h-full" 
                        title="Document Preview"
                    />
                )}
            </div>
        </DialogContent>
    </Dialog>
    </>
  );
}
