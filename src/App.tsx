// Объединённый компонент генератора структуры с загрузкой фото, форматированием и скачиванием итогового файла
import React, { useState, useRef } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  IconButton,
  Tooltip,
  Input,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

interface Subsection {
  title: string;
  content: string[];
}

interface Section {
  title: string;
  content: Subsection[];
}

interface AdditionUnit {
  title: string;
  file: string;
  blob?: File;
}

interface AdditionGroup {
  title: string;
  units: AdditionUnit[];
  fileTitle?: string;
}

function splitToParagraphs(text: string): string[] {
  return text
    .split(/\n/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);
}

function App() {
  const fileInputRefs = useRef<HTMLInputElement[]>([]);

  const [filename, setFilename] = useState("my_course_work");
  const [introText, setIntroText] = useState("");
  const [summaryText, setSummaryText] = useState("");
  const [literatureText, setLiteratureText] = useState("");

  const [sections, setSections] = useState<Section[]>([]);
  const [currentSectionTitle, setCurrentSectionTitle] = useState("");
  const [currentSubsections, setCurrentSubsections] = useState<Subsection[]>([]);
  const [subTitle, setSubTitle] = useState("");
  const [subText, setSubText] = useState("");
  const [editingSubIndex, setEditingSubIndex] = useState<number | null>(null);
  const [editingSectionIndex, setEditingSectionIndex] = useState<number | null>(null);

  const [additions, setAdditions] = useState<AdditionGroup[]>([]);
  const [additionTitle, setAdditionTitle] = useState("");

  const [jsonResult, setJsonResult] = useState("");

  const handleAddOrUpdateSubsection = () => {
    const newSub: Subsection = {
      title: subTitle.trim(),
      content: splitToParagraphs(subText),
    };
    if (editingSubIndex !== null) {
      const updated = [...currentSubsections];
      updated[editingSubIndex] = newSub;
      setCurrentSubsections(updated);
      setEditingSubIndex(null);
    } else {
      setCurrentSubsections([...currentSubsections, newSub]);
    }
    setSubTitle("");
    setSubText("");
  };

  const handleEditSubsection = (index: number) => {
    const sub = currentSubsections[index];
    setSubTitle(sub.title);
    setSubText(sub.content.join("\n"));
    setEditingSubIndex(index);
  };

  const handleDeleteSubsection = (index: number) => {
    setCurrentSubsections(currentSubsections.filter((_, i) => i !== index));
  };

  const handleSaveSection = () => {
    const newSection: Section = {
      title: currentSectionTitle,
      content: currentSubsections,
    };
    if (editingSectionIndex !== null) {
      const updated = [...sections];
      updated[editingSectionIndex] = newSection;
      setSections(updated);
      setEditingSectionIndex(null);
    } else {
      setSections([...sections, newSection]);
    }
    setCurrentSectionTitle("");
    setCurrentSubsections([]);
    setSubTitle("");
    setSubText("");
  };

  const handleEditSection = (index: number) => {
    const sec = sections[index];
    setCurrentSectionTitle(sec.title);
    setCurrentSubsections(sec.content);
    setEditingSectionIndex(index);
  };

  const handleDeleteSection = (index: number) => {
    setSections(sections.filter((_, i) => i !== index));
  };

  const handleDeleteUnit = (groupIdx: number, unitIdx: number) => {
    const updated = [...additions];
    updated[groupIdx].units.splice(unitIdx, 1);
    setAdditions(updated);
  };

  const handleEditUnitTitle = (groupIdx: number, unitIdx: number, newTitle: string) => {
    const updated = [...additions];
    updated[groupIdx].units[unitIdx].title = newTitle;
    setAdditions(updated);
  };

  const handleDeleteAddition = (groupIdx: number) => {
    setAdditions(additions.filter((_, i) => i !== groupIdx));
  };

  const handleGenerate = async () => {
    try {
      const result = {
        intro: {
          content: splitToParagraphs(introText),
        },
        content: sections.map((sec) => ({
          title: sec.title,
          content: sec.content.map((sub) => ({
            title: sub.title,
            content: sub.content,
          })),
        })),
        summary: {
          content: splitToParagraphs(summaryText),
        },
        literature: {
          content: splitToParagraphs(literatureText),
        },
        addition: additions,
      };

      setJsonResult(JSON.stringify(result, null, 2));

      const formatResponse = await fetch("https://fc07-60-122-90-45.ngrok-free.app/do_format/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result),
      });

      const formatData = await formatResponse.json();
      const filePath = typeof formatData === 'string' ? formatData : formatData.filename;

      if (!filePath || !filePath.endsWith(".docx")) {
        throw new Error("❌ Сервер вернул некорректный путь к файлу");
      }

      const decodedPath = filePath.replace(/__/g, "/");
      const downloadResponse = await fetch(`https://fc07-60-122-90-45.ngrok-free.app/get_file/${decodedPath}`);
      const blob = await downloadResponse.blob();

      if (!blob.type.includes("application/vnd.openxmlformats-officedocument.wordprocessingml.document")) {
        throw new Error("❌ Полученный файл не является DOCX-документом");
      }

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename + ".docx";
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      console.error("❌ Ошибка при генерации файла:", error);
    }
  };
  
  

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4">Оформление курсовых/дипломов</Typography>
      <TextField fullWidth label="Название файла" value={filename} onChange={(e) => setFilename(e.target.value)} margin="normal" />
      <TextField fullWidth multiline rows={5} label="Введение (абзацы — по строкам)" value={introText} onChange={(e) => setIntroText(e.target.value)} margin="normal" />

      <Typography variant="h6" sx={{ mt: 4 }}>Раздел</Typography>
      <TextField fullWidth label="Название раздела" value={currentSectionTitle} onChange={(e) => setCurrentSectionTitle(e.target.value)} margin="normal" />
      <TextField fullWidth label="Название подраздела" value={subTitle} onChange={(e) => setSubTitle(e.target.value)} margin="normal" />
      <TextField fullWidth label="Текст подраздела (абзацы = строки)" value={subText} onChange={(e) => setSubText(e.target.value)} multiline rows={5} margin="normal" />
      <Button onClick={handleAddOrUpdateSubsection} variant="outlined" sx={{ mt: 1 }}>{editingSubIndex !== null ? "💾 Сохранить изменения" : "➕ Добавить подраздел"}</Button>

      <Box sx={{ mt: 2 }}>
        {currentSubsections.map((sub, idx) => (
          <Box key={idx} sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Typography variant="body2" sx={{ flexGrow: 1 }}>— {sub.title}</Typography>
            <Tooltip title="Изменить"><IconButton size="small" onClick={() => handleEditSubsection(idx)}><EditIcon fontSize="small" /></IconButton></Tooltip>
            <Tooltip title="Удалить"><IconButton size="small" onClick={() => handleDeleteSubsection(idx)}><DeleteIcon fontSize="small" /></IconButton></Tooltip>
          </Box>
        ))}
      </Box>

      <Button onClick={handleSaveSection} variant="contained" sx={{ mt: 2 }}>📚 Сохранить раздел</Button>

      {sections.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle1">Добавленные разделы:</Typography>
          {sections.map((sec, idx) => (
            <Box key={idx} sx={{ mb: 2, borderBottom: "1px solid #ccc", pb: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography variant="body1" sx={{ flexGrow: 1 }}>🔹 {sec.title}</Typography>
                <Tooltip title="Изменить"><IconButton size="small" onClick={() => handleEditSection(idx)}><EditIcon fontSize="small" /></IconButton></Tooltip>
                <Tooltip title="Удалить"><IconButton size="small" onClick={() => handleDeleteSection(idx)}><DeleteIcon fontSize="small" /></IconButton></Tooltip>
              </Box>
              {sec.content.map((sub, subIdx) => (
                <Typography key={subIdx} variant="body2">— {sub.title}</Typography>
              ))}
            </Box>
          ))}
        </Box>
      )}

      <TextField fullWidth multiline rows={5} label="Заключение (абзацы — по строкам)" value={summaryText} onChange={(e) => setSummaryText(e.target.value)} margin="normal" />
      <TextField fullWidth multiline rows={5} label="Источники (каждая строка — новый источник)" value={literatureText} onChange={(e) => setLiteratureText(e.target.value)} margin="normal" />
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6">Приложения</Typography>
        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <TextField
            fullWidth
            label="Название новой группы приложений"
            value={additionTitle}
            onChange={(e) => setAdditionTitle(e.target.value)}
          />
          <Button
            variant="outlined"
            onClick={() => {
              if (!additionTitle.trim()) return;
              if (!additions.some((g) => g.title === additionTitle.trim())) {
                setAdditions((prev) => [...prev, { title: additionTitle.trim(), units: [] }]);
                setAdditionTitle("");
              }
            }}
          >
            ➕ Добавить приложение
          </Button>
        </Box>

        {additions.map((group, groupIdx) => (
          <Box key={groupIdx} sx={{ mb: 4, mt: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Typography variant="h6">📂 {group.title}</Typography>
              <Tooltip title="Удалить группу">
                <IconButton onClick={() => handleDeleteAddition(groupIdx)}>
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </Box>

            <TextField
              fullWidth
              label="Название файла (опционально)"
              value={group.fileTitle || ""}
              onChange={(e) => {
                const updated = [...additions];
                updated[groupIdx].fileTitle = e.target.value;
                setAdditions(updated);
              }}
              sx={{ mt: 2 }}
            />



<input
  ref={(el) => {
    if (el) fileInputRefs.current[groupIdx] = el;
  }}
  type="file"
  multiple
  onChange={async (e) => {
    const input = e.target as HTMLInputElement;
    const files = input.files;
    if (files) {
      const newUnits: AdditionUnit[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append("file", file);
        try {
          const response = await fetch("https://fc07-60-122-90-45.ngrok-free.app/upload-image/", {
            method: "POST",
            body: formData,
          });
          const data = await response.json();
          newUnits.push({
            title: additions[groupIdx].fileTitle || file.name,
            file: data.filename,
          });
        } catch (err) {
          console.error("Ошибка загрузки файла:", err);
        }
      }

      setAdditions((prev) => {
        const updated = [...prev];
        updated[groupIdx].units.push(...newUnits);
        updated[groupIdx].fileTitle = ""; // ✅ очищаем текстовое поле
        return updated;
      });

      if (fileInputRefs.current[groupIdx]) {
        fileInputRefs.current[groupIdx].value = ""; // ✅ очищаем input
      }
    }
  }}
/>




            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 2 }}>
              {group.units.map((unit, i) => (
                <Box key={i} sx={{ width: { xs: "100%", sm: "48%", md: "23%" } }}>
                  <Paper sx={{ p: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <TextField
                        fullWidth
                        value={unit.title}
                        onChange={(e) => handleEditUnitTitle(groupIdx, i, e.target.value)}
                        size="small"
                        variant="standard"
                      />
                      <Tooltip title="Удалить фото">
                        <IconButton onClick={() => handleDeleteUnit(groupIdx, i)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Paper>
                </Box>
              ))}
            </Box>
          </Box>
        ))}
      </Box>
      <Button onClick={handleGenerate} variant="contained" sx={{ mt: 4 }}>✅ Сгенерировать структуру</Button>

      {/* {jsonResult && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6">📦 JSON результат:</Typography>
          <Paper sx={{ p: 2, whiteSpace: "pre-wrap", fontFamily: "monospace" }}>{jsonResult}</Paper>
        </Box>
      )} */}
    </Container>
  );
}

export default App;