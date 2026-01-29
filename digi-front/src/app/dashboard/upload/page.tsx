"use client";

import { useState } from "react";
import { UploadZone } from "@/components/upload/UploadZone";
import { ResultPreview } from "@/components/upload/ResultPreview";
import api from "@/lib/axios";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Doc } from "@/types";

export default function UploadPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Doc | null>(null);

  const handleFileSelect = async (file: File) => {
    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await api.post("/documents/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setResult(response.data);
    } catch (error) {
      console.error("Upload failed", error);
      alert("Upload failed! See console for details.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Archiving Module</h1>
        <p className="text-muted-foreground">
          Upload documents to process them with AI and extract metadata.
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center p-12 space-y-4 border rounded-lg bg-card text-card-foreground shadow-sm h-64">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <div className="text-center space-y-1">
            <h3 className="font-semibold text-lg">Processing Document...</h3>
            <p className="text-sm text-muted-foreground">
              Please wait while we perform OCR and AI extraction.
            </p>
          </div>
        </div>
      ) : result ? (
        <div className="space-y-6">
            <ResultPreview doc={result} />
            <div className="flex justify-end">
                <Button onClick={handleReset}>Upload Another File</Button>
            </div>
        </div>
      ) : (
        <UploadZone onFileSelect={handleFileSelect} />
      )}
    </div>
  );
}
