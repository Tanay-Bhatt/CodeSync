import { useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import socket from "../socket";
import { FaMoon, FaSun, FaCode, FaCopy } from "react-icons/fa";
import CustomToast from "./Toast";

interface CodePayload {
  room: string;
  code: string;
  language: string;
}

const languages = [
  { value: "javascript", label: "JavaScript" },
  { value: "python", label: "Python" },
  { value: "cpp", label: "C++" },
  { value: "java", label: "Java" },
  { value: "typescript", label: "TypeScript" },
  { value: "html", label: "HTML" },
  { value: "css", label: "CSS" },
];

const CodeEditor = ({ roomId }: { roomId: string }) => {
  const [code, setCode] = useState<string>("");
  const [language, setLanguage] = useState<string>("javascript");
  const [theme, setTheme] = useState<"vs-dark" | "light">("vs-dark");
  const [toast, setToast] = useState<string | null>(null);
  const editorRef = useRef<any>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);


  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    socket.emit("join", { room: roomId });

    const handleUpdate = ({ code, language }: CodePayload) => {
      setCode(code);
      setLanguage(language);
    };

    socket.on("code_update", handleUpdate);
    socket.on("code_sync", handleUpdate);

    return () => {
      socket.off("code_update", handleUpdate);
      socket.off("code_sync", handleUpdate);
    };
  }, [roomId]);

  const handleChange = (value: string | undefined) => {
    const updated = value || "";
    setCode(updated);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      socket.emit("code_change", { room: roomId, code: updated, language });
    }, 300);
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    socket.emit("code_change", { room: roomId, code, language: newLang });
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === "vs-dark" ? "light" : "vs-dark"));
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setToast("✅ Code copied to clipboard!");
    } catch {
      setToast("❌ Failed to copy code.");
    }
  };

  return (
    <div className="code-editor-container">
      {toast && <CustomToast message={toast} onClose={() => setToast(null)} />}

      <div className="editor-toolbar">
        <div className="toolbar-left" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <FaCode className="code-icon" />
          <select
            value={language}
            onChange={handleLanguageChange}
            className="language-select"
          >
            {languages.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>

        <button onClick={handleCopy} className="copy-button">
          <FaCopy /> Copy
        </button>

        <button onClick={toggleTheme} className="theme-toggle">
          {theme === "vs-dark" ? (
            <>
              <FaSun className="theme-icon" /> Light
            </>
          ) : (
            <>
              <FaMoon className="theme-icon" /> Dark
            </>
          )}
        </button>
      </div>

      <Editor
        height="100%"
        language={language}
        value={code}
        onChange={handleChange}
        theme={theme}
        onMount={(editor) => (editorRef.current = editor)}
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          renderLineHighlight: 'all',
          cursorBlinking: 'phase',
          wordWrap: 'on',
        }}
      />
    </div>
  );
};

export default CodeEditor;
