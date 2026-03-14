import { useState, useEffect } from "react";
import { Command } from "cmdk";
import { useLocation } from "wouter";
import { useFiles } from "./useFiles";

export function CommandMenu() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const { files, createFile } = useFiles();
  const [, navigate] = useLocation();

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") {
        setOpen(false);
        setSearch("");
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  function handleSelect(slug: string) {
    navigate(`/board/${encodeURIComponent(slug)}`);
  }

  async function handleCreateFile() {
    const name = search.trim() || "untitled";
    try {
      await createFile(name);
    } catch (e) {
      console.error("Failed to create file:", e);
    }
  }

  function resetBar(run: () => void) {
    setOpen(false);
    setSearch("");
    run();
  }

  if (!open) return null;

  return (
    <div className="cmdk-overlay" onClick={() => setOpen(false)}>
      <div className="cmdk-container" onClick={(e) => e.stopPropagation()}>
        <Command loop shouldFilter={true}>
          <Command.Input
            autoFocus
            value={search}
            onValueChange={setSearch}
            placeholder="Search boards or type a name to create..."
          />
          <Command.List>
            <Command.Empty>No boards found.</Command.Empty>
            <Command.Group heading="Boards">
              {files.map((file) => (
                <Command.Item
                  key={file.slug}
                  value={file.slug}
                  keywords={[file.name]}
                  onSelect={() => resetBar(() => handleSelect(file.slug))}
                >
                  {file.name}
                </Command.Item>
              ))}
            </Command.Group>
            <Command.Separator />
            <Command.Group heading="Actions">
              <Command.Item onSelect={() => resetBar(handleCreateFile)}>
                + New board{search.trim() ? `: ${search.trim()}` : ""}
              </Command.Item>
              <Command.Item onSelect={() => resetBar(() => navigate("/"))}>Home</Command.Item>
            </Command.Group>
          </Command.List>
        </Command>
      </div>
    </div>
  );
}
