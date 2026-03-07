import { useContext } from "react";
import { FilesContext } from "./FilesContext";

export function useFiles() {
	const ctx = useContext(FilesContext);
	if (!ctx) throw new Error("useFiles must be used within FilesProvider");
	return ctx;
}
