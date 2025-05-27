import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

interface InstructionModalProps {
  open: boolean;
  onClose: () => void;
}

const InstructionModal: React.FC<InstructionModalProps> = ({ open, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>📘 Инструкция по использованию сервиса</DialogTitle>
      <DialogContent dividers>
        <Typography gutterBottom>
          Сервис помогает автоматически собрать структуру курсовой или дипломной работы и получить готовый файл в формате <b>.docx</b>.
        </Typography>

        <Typography variant="subtitle1" gutterBottom>🔹 1. Название файла</Typography>
        <Typography paragraph>
          Введите имя итогового файла (без расширения). Например: <i>kursovaya_po_ekonomike</i>
        </Typography>

        <Typography variant="subtitle1" gutterBottom>🔹 2. Введение, Заключение и Источники</Typography>
        <Typography paragraph>
          Каждый абзац вводите с новой строки. Пример:
        </Typography>
        <Typography sx={{ fontFamily: "monospace", whiteSpace: "pre-line", mb: 2 }}>
          Актуальность темы заключается в...{"\n"}Целью работы является...
        </Typography>
        <Typography paragraph>
          В поле <b>Источники</b> — каждый источник с новой строки. ГОСТ структура делается вручную. Пример:
        </Typography>
        <Typography sx={{ fontFamily: "monospace", whiteSpace: "pre-line", mb: 2 }}>
        Борисова, М. «Зарплаты по $30, продажа за $15 000…» — краткая история «Яндекса» 
        // Texterra (блог компании). — 21.10.2021. 
        — URL: https://texterra.ru/blog/kratkaya-istoriya-yandeksa.html (дата обращения: 14.04.2025).

        {/* {"\n"}{"\n"}Федулова, Е. Льготы под «Сколково» могут получить другие проекты // Ведомости. — 01.07.2010. — URL: https://www.vedomosti.ru/library/news/2010/07/01/lgoty-pod-skolkovo-mogut-poluchit-drugie-proekty (дата обращения: 14.04.2025). */}
        </Typography>

        <Typography variant="subtitle1" gutterBottom>🔹 3. Добавление разделов и подразделов</Typography>
        <Typography paragraph>
          Для каждого раздела:
        </Typography>
        <ul>
          <li>Укажите название раздела (например: 1. Теоретические основы)</li>
          <li>Вводите название и текст подраздела</li>
          <li>Абзацы — через Enter</li>
          <li>Нажмите <b>➕ Добавить подраздел</b>, затем <b>📚 Сохранить раздел</b></li>
        </ul>
        <Typography paragraph>
          Можно редактировать ✏️ и удалять 🗑️ разделы и подразделы.
        </Typography>

        <Typography variant="subtitle1" gutterBottom>🔹 4. Приложения (по желанию)</Typography>
        <ul>
          <li>Введите название группы (например: Приложение A)</li>
          <li>Нажмите <b>➕ Добавить приложение</b></li>
          <li>Укажите название файла (необязательно)</li>
          <li>Загрузите изображения — можно сразу несколько</li>
          <li>После загрузки можно изменить названия или удалить ненужные</li>
        </ul>

        <Typography variant="subtitle1" gutterBottom>🔹 5. Сгенерировать документ</Typography>
        <Typography paragraph>
          Нажмите кнопку <b>✅ Создать оформление</b> — после генерации начнётся загрузка готового .docx-файла.
        </Typography>

        <Typography variant="subtitle1" gutterBottom>ℹ️ Полезно знать:</Typography>
        <ul>
          <li>Все абзацы отделяются переносами строки (Enter)</li>
          <li>Изображения добавляются как приложения</li>
          <li>Формирование документа занимает 13–16 секунд</li>
        </ul>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="contained" color="primary">
          Понятно
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InstructionModal;
