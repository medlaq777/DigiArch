"use client";

import { useEffect, useState, useCallback } from "react";
import { FilesTable } from "@/components/dashboard/FilesTable";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import api from "@/lib/axios";
import { Doc } from "@/types";

export default function DashboardPage() {
  const [files, setFiles] = useState<Doc[]>([]);
  const [searchCin, setSearchCin] = useState("");
  const [searchNom, setSearchNom] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchFiles = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (searchCin) params.cin = searchCin;
      if (searchNom) params.nom = searchNom;
      
      const response = await api.get("/documents/search", { params });
      setFiles(response.data);
    } catch (error) {
      console.error("Failed to fetch files", error);
    } finally {
      setLoading(false);
    }
  }, [searchCin, searchNom]);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]); // Added fetchFiles dependency

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      </div>

      <div className="flex gap-4 items-end bg-card p-4 rounded-lg border">
        <div className="w-full max-w-sm space-y-1">
            <label className="text-sm font-medium">CIN</label>
            <Input 
                placeholder="Search by CIN..." 
                value={searchCin} 
                onChange={(e) => setSearchCin(e.target.value)}
            />
        </div>
        <div className="w-full max-w-sm space-y-1">
            <label className="text-sm font-medium">Name</label>
            <Input 
                placeholder="Search by Name..." 
                value={searchNom} 
                onChange={(e) => setSearchNom(e.target.value)}
            />
        </div>
        <Button onClick={fetchFiles} disabled={loading}>
            <Search className="mr-2 h-4 w-4" />
            Search
        </Button>
      </div>

      <FilesTable files={files} />
    </div>
  );
}
