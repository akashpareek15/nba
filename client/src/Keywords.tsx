import {
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  styled,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { IDepartment } from "./domain/IDepartment";
import { ICriteria } from "./domain/ICriteria";
import { useId } from "react";
import { CloudUpload } from "@mui/icons-material";
import { IQuestion } from "./domain/IQuestion";
const Input = styled("input")({
  display: "none",
});
import { DataGrid, GridColDef } from "@mui/x-data-grid";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 70, hideable: true },

  { field: "word", headerName: "Word", width: 0, flex: 1 },
  {
    field: "count",
    headerName: "Count",
    type: "number",
    width: 120,
  },
];
const paginationModel = { page: 0, pageSize: 100 };

export const Keywords = () => {
  const [department, setDepartment] = useState<number>();
  const [departments, setDepartments] = useState<IDepartment[]>([]);
  const [criteria, setCriteria] = useState<number>();
  const [criteriaList, setCriteriaList] = useState<ICriteria[]>([]);
  const [questionId, setQuestionId] = useState<number>();
  const [questionList, setQuestionList] = useState<IQuestion[]>([]);
  const [parsedKeywords, setParsedKeywords] = useState<any[]>([]);
  const [selectedWordIds, setSelectedWordIds] = useState([]);

  const [fileName, setFileName] = useState("");
  useEffect(() => {
    axios.get("http://localhost:5555/departments").then((res) => {
      setDepartments(res.data);
    });
  }, []);
  const id = useId();

  useEffect(() => {
    axios.get("http://localhost:5555/criteria").then((res) => {
      setCriteriaList(res.data);
    });
  }, []);

  useEffect(() => {
    if (criteria) {
      setQuestionId(undefined);
      axios
        .get(`http://localhost:5555/criteria/${criteria}/keyword-question`)
        .then((res) => {
          setQuestionList(res.data);
        });
    }
  }, [criteria]);

  const maskedKeywords = ["the"];

  const countWords = (text): any => {
    const words = text.toLowerCase().split(/\s+/);
    const frequency = {};

    words.forEach((word) => {
      if (maskedKeywords.includes(word) || word?.length <= 2) {
        return;
      }
      if (!frequency[word]) {
        frequency[word] = 1;
      } else {
        frequency[word] = frequency[word] + 1;
      }
    });

    return Object.keys(frequency)
      .map((x, index) => ({
        count: Number(frequency[x]),
        word: x.replace(/[,;"]$/, ""),
        id: index,
      }))
      .sort((a, b) => {
        if (a.count < b.count) return 1;
        if (a.count > b.count) return -1;
        return 0;
      });
  };

  const onUpdateKeywords = () => {
    const keywords = selectedWordIds.map(
      (x) => parsedKeywords.find((y: any) => y.id === x)?.word
    );
    axios
      .put(`http://localhost:5555/criteria/update-keywords`, {
        keywords,
        departmentId: department,
        questionId,
      })
      .then((_res) => {
        setParsedKeywords([]);
        setSelectedWordIds([]);
      });
  };

  const onUploadHandler = (event) => {
    const formData = new FormData();
    formData.append("file", event.target.files[0]);
    event.target.value = "";
    axios
      .post("http://localhost:5555/document/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((response) => {
        setFileName(response.data.fileName);
        setParsedKeywords(countWords(response.data.parsedData));
      });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ display: "flex", alignItems: "baseline" }}>
        <FormControl variant="standard" fullWidth sx={{ m: 1, maxWidth: 200 }}>
          <InputLabel>Department</InputLabel>
          <Select
            displayEmpty
            size="small"
            value={department}
            onChange={(event) => {
              setDepartment(Number(event.target.value));
            }}
          >
            {departments.map((op) => (
              <MenuItem value={op.departmentId}>{op.departmentName}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl variant="standard" fullWidth sx={{ m: 1, maxWidth: 200 }}>
          <InputLabel>Criteria</InputLabel>
          <Select
            displayEmpty
            size="small"
            value={criteria}
            onChange={(event) => {
              setCriteria(Number(event.target.value));
            }}
          >
            {criteriaList.map((op) => (
              <MenuItem value={op.criteriaId}>{op.criteriaName}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl variant="standard" fullWidth sx={{ m: 1, minWidth: 120 }}>
          <InputLabel>Question</InputLabel>
          <Select
            displayEmpty
            size="small"
            value={questionId}
            onChange={(event) => {
              setQuestionId(Number(event.target.value));
            }}
          >
            {questionList.map((op) => (
              <MenuItem value={op.questionId}>{op.description}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <div style={{ display: "flex", alignItems: "center", minWidth: 300 }}>
          <label htmlFor={id}>
            <Input id={id} onChange={onUploadHandler} type="file" />
            <IconButton
              color="primary"
              aria-label="upload document"
              component="span"
            >
              <CloudUpload />
            </IconButton>
          </label>
          {fileName && (
            <div
              style={{ cursor: "pointer", textDecoration: "underline" }}
              // onClick={() =>
              //   props.onDownload(answer.documentId, answer.fileName)
              // }
            >
              {fileName}
            </div>
          )}
        </div>
        <div>
          <Button
            size="small"
            variant="contained"
            onClick={onUpdateKeywords}
            disabled={!(questionId && selectedWordIds.length)}
          >
            Save
          </Button>
        </div>
      </div>
      <div>
        <DataGrid
          density="compact"
          rows={parsedKeywords}
          onRowSelectionModelChange={(x: []) => {
            setSelectedWordIds(x);
          }}
          columns={columns}
          columnVisibilityModel={{
            id: false,
          }}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[100, 200]}
          checkboxSelection
          sx={{ border: 0 }}
        />
      </div>
    </div>
  );
};
