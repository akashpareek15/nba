import { CloudUpload } from "@mui/icons-material";
import {
  FormControlLabel,
  IconButton,
  Radio,
  RadioGroup,
  styled,
  TextField,
} from "@mui/material";
import { IQuestion } from "./domain/IQuestion";
import { useId } from "react";

export type ChangeType = "radio" | "text" | "calculate_marks" | "marks_change";
type QuestionProps = IQuestion & {
  onChange: (
    index: string,
    value: string,
    type: ChangeType,
    code: string
  ) => void;
  index: string;
  onUploadHandler: (event, index: string, code: string) => void;
  onDownload: (documentId: string, fileName: string) => void;
};

const Input = styled("input")({
  display: "none",
});

export const Question = (props: QuestionProps) => {
  const handleRadioChange = (event) => {
    props.onChange(props.index, event.target.value, "radio", props.code);
  };

  const isSubQuestions = !props.subQuestions?.length;
  const id = useId();

  const onChange = (event) => {
    props.onChange(props.index, event.target.value, "text", props.code);
  };
  const onUploadHandler = (event) => {
    props.onUploadHandler(event, props.index, props.code);
  };
  const onBlur = (event) => {
    props.onChange(
      props.index,
      event.target.value,
      "calculate_marks",
      props.code
    );
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          flexDirection: "row",
          gap: 10,
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            gap: 5,
            paddingLeft: isSubQuestions ? 20 : 10,
          }}
        >
          <strong>{props.question_number}.</strong>
          {isSubQuestions ? (
            <div> {props.description} </div>
          ) : (
            <strong>{props.description}</strong>
          )}
          (<span>{props.marks}</span>)
        </div>

        <div style={{ flex: 0.8 }}>
          {props.type === "radio" ? (
            <RadioGroup
              sx={{ fontSize: 8 }}
              row
              value={props.value ?? ""}
              aria-readonly={true}
              onChange={handleRadioChange}
            >
              <FormControlLabel
                sx={{ fontSize: 8 }}
                value="Y"
                control={<Radio size="small" disabled={props.disabled} />}
                label="Yes"
              />
              <FormControlLabel
                value="N"
                control={<Radio size="small" disabled={props.disabled} />}
                label="No"
              />
            </RadioGroup>
          ) : props.type === "text" ? (
            <TextField
              variant="standard"
              sx={{ fontSize: 8 }}
              onChange={onChange}
              value={props.reason}
              onBlur={onBlur}
              style={{ width: "95%" }}
              helperText={props.helperText}
              error={!!props.error}
            />
          ) : props.type === "upload" ? (
            <div style={{ display: "flex", alignItems: "center" }}>
              <label htmlFor={id}>
                <Input
                  accept="pdf"
                  id={id}
                  onChange={onUploadHandler}
                  type="file"
                />
                <IconButton
                  color="primary"
                  aria-label="upload document"
                  component="span"
                >
                  <CloudUpload />
                </IconButton>
              </label>
              {props.documentId && (
                <div
                  style={{ cursor: "pointer", textDecoration: "underline" }}
                  onClick={() =>
                    props.onDownload(props.documentId, props.fileName)
                  }
                >
                  {props.fileName}
                </div>
              )}
            </div>
          ) : (
            <></>
          )}
        </div>
        <div style={{ width: 80 }}>
          {props.type !== "text" && (
            <TextField
              variant="standard"
              sx={{ fontSize: 8 }}
              type="number"
              value={props.obtainedMarks}
              disabled={true}
              style={{ width: "90%" }}
            />
          )}
        </div>
      </div>
      <div>
        {props.subQuestions?.map((sq: IQuestion, subQuestionIndex: number) => (
          <div>
            <Question
              onDownload={props.onDownload}
              {...sq}
              index={`${props.index}_${subQuestionIndex}`}
              onUploadHandler={props.onUploadHandler}
              onChange={props.onChange}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
