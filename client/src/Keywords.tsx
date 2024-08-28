import { IconButton, MenuItem, Select, styled } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { IDepartment } from "./domain/IDepartment";
import { ICriteria } from "./domain/ICriteria";
import { useId } from "react";
import { CloudUpload } from "@mui/icons-material";
const Input = styled("input")({
  display: "none",
});

export const Keywords = () => {
  const [department, setDepartment] = useState<number>();
  const [departments, setDepartments] = useState<IDepartment[]>([]);
  useEffect(() => {
    axios.get("http://localhost:5555/departments").then((res) => {
      setDepartments(res.data);
    });
  }, []);
  const id = useId();
  const [criteria, setCriteria] = useState<number>();
  const [criteriaList, setCriteriaList] = useState<ICriteria[]>([]);
  useEffect(() => {
    axios.get("http://localhost:5555/criteria").then((res) => {
      setCriteriaList(res.data);
    });
  }, []);
  const onUploadHandler = (event) => {};
  return (
    <div>
      <div>
        <Select
          displayEmpty
          size="small"
          value={department}
          style={{
            width: "100%",
            alignSelf: "center",
            fontSize: 12,
            height: 25,
          }}
          onChange={(event) => {
            setDepartment(Number(event.target.value));
          }}
        >
          {departments.map((op) => (
            <MenuItem style={{ fontSize: 12 }} value={op.departmentId}>
              {op.departmentName}
            </MenuItem>
          ))}
        </Select>
      </div>
      <div>
        <Select
          displayEmpty
          size="small"
          value={criteria}
          style={{
            width: "100%",
            alignSelf: "center",
            fontSize: 12,
            height: 25,
          }}
          onChange={(event) => {
            setCriteria(Number(event.target.value));
          }}
        >
          {criteriaList.map((op) => (
            <MenuItem style={{ fontSize: 12 }} value={op.criteriaId}>
              {op.criteriaName}
            </MenuItem>
          ))}
        </Select>
      </div>

      <div style={{ display: "flex", alignItems: "center" }}>
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
        {/* {answer.documentId && (
          <div
            style={{ cursor: "pointer", textDecoration: "underline" }}
            onClick={() => props.onDownload(answer.documentId, answer.fileName)}
          >
            {answer.fileName}
          </div>
        )} */}
      </div>
    </div>
  );
};
