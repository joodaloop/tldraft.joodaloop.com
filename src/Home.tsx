import { useState } from "react";
import { Link } from "wouter";
import { useFiles } from "./useFiles";

export function Home() {
  const { files, createFile, deleteFile } = useFiles();
  const [newName, setNewName] = useState("");

  async function handleCreate() {
    const name = newName.trim() || "untitled";
    setNewName("");
    try {
      await createFile(name);
    } catch (e) {
      console.error("Failed to create file:", e);
    }
  }

  return (
    <div className="max-w-lg m-auto mt-32 p-4">
      <h1>Boards</h1>
      <div style={{ marginBottom: 16, display: "flex", gap: 8 }}>
        <input
          type="text"
          placeholder="New board name..."
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleCreate()}
          style={{ padding: "6px 10px", fontSize: 14 }}
        />
        <button onClick={handleCreate} style={{ padding: "6px 14px", fontSize: 14 }}>
          + New Board
        </button>
      </div>
      <p style={{ color: "#999", fontSize: 13, marginBottom: 12 }}>
        Press <kbd>Cmd+K</kbd> to open the command menu
      </p>
      {files.length === 0 && <p>No boards yet.</p>}
      <ul>
        {files.map((file) => (
          <li key={file.slug} className="flex gap-8 justify-between">
            <Link href={`/board/${encodeURIComponent(file.slug)}`}>{file.name}</Link>
            {file.meta.shapeCount}
            <button
              onClick={() => {
                if (confirm(`Delete "${file.name}"?`)) {
                  deleteFile(file.slug).catch((e) => console.error("Failed to delete:", e));
                }
              }}
              style={{ padding: "2px 8px", fontSize: 12, cursor: "pointer" }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
