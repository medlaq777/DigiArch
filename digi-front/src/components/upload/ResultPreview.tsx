import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CheckCircle2 } from "lucide-react";
import { Doc } from "@/types";

interface ResultPreviewProps {
  doc: Doc; // The document object returned by backend
}

export function ResultPreview({ doc }: ResultPreviewProps) {
  const metadata = doc.metadata || {};

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-green-600">
        <CheckCircle2 className="h-6 w-6" />
        <h2 className="text-xl font-semibold">Document Processed Successfully!</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>File Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label>Original Name</Label>
              <Input value={doc.originalName} readOnly />
            </div>
            <div className="grid gap-2">
              <Label>Size</Label>
              <Input value={`${(doc.size / 1024).toFixed(2)} KB`} readOnly />
            </div>
            <div className="grid gap-2">
              <Label>MIME Type</Label>
              <Input value={doc.mimeType} readOnly />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Extracted Metadata (AI)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.keys(metadata).length === 0 ? (
                <p className="text-muted-foreground italic">No metadata extracted.</p>
            ) : (
                Object.entries(metadata).map(([key, value]) => (
                    <div key={key} className="grid gap-2">
                        <Label className="capitalize">{key}</Label>
                        <Input value={String(value)} readOnly />
                    </div>
                ))
            )}
            
            {/* Fallback specific fields if metadata is unstructured */}
            {!metadata.cin && !metadata.nom && (
                <p className="text-xs text-muted-foreground">
                    Note: If specific fields like CIN/Name are missing, the AI might have failed to identify them clearly.
                </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
