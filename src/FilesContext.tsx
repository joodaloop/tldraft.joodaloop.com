import { createContext, useState, useEffect, useCallback, ReactNode } from "react";
import { useLocation } from "wouter";

const API_BASE = `http://${import.meta.env.VITE_SERVER_URL}`;

export interface BoardFile {
  slug: string;
  name: string;
  meta: {
    shapeCount: string;
  };
}

interface FilesContextValue {
  files: BoardFile[];
  refreshFiles: () => Promise<void>;
  createFile: (name: string) => Promise<void>;
  deleteFile: (slug: string) => Promise<void>;
}

export const FilesContext = createContext<FilesContextValue | null>(null);

export function FilesProvider({ children }: { children: ReactNode }) {
  const [files, setFiles] = useState<BoardFile[]>([]);
  const [, navigate] = useLocation();

  const refreshFiles = useCallback(async () => {
    try {
      const r = await fetch(`${API_BASE}/api/files`);
      const data = await r.json();
      setFiles(data);
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    refreshFiles();
  }, [refreshFiles]);

  const createFile = useCallback(
    async (name: string) => {
      const res = await fetch(`${API_BASE}/api/files`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) {
        const err = await res.text();
        throw new Error(err);
      }
      const { slug } = await res.json();
      await refreshFiles();
      navigate(`/board/${encodeURIComponent(slug)}`);
    },
    [refreshFiles, navigate],
  );

  const deleteFile = useCallback(
    async (slug: string) => {
      const res = await fetch(`${API_BASE}/api/files/${encodeURIComponent(slug)}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const err = await res.text();
        throw new Error(err);
      }
      await refreshFiles();
    },
    [refreshFiles],
  );

  return (
    <FilesContext.Provider value={{ files, refreshFiles, createFile, deleteFile }}>{children}</FilesContext.Provider>
  );
}
