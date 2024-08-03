import { CloudUpload } from "@mui/icons-material";
import {
  FormControlLabel,
  IconButton,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  styled,
  TextField,
} from "@mui/material";
import { IQuestion, SubQuestion } from "./domain/IQuestion";
import { useId } from "react";
import AddIcon from "@mui/icons-material/Add";

export type ChangeType = "radio" | "text" | "calculate_marks" | "marks_change";
type QuestionProps = {
  questionId: number;
  documentId?: string;
  subQuestions?: SubQuestion[];
  fileName?: string;
  onChange: (
    index: string,
    value: string,
    type: ChangeType,
    code: string
  ) => void;
  index: string;
  onUploadHandler: (event, index: string, code: string) => void;
  onDownload: (documentId: string, fileName: string) => void;
  addNewRow: (index: string, code: string, rowIndex: number) => void;
  questionMap: object;
  answers: object;
  obtainedMarks?: number;
  onRowValueChange: (
    index: string,
    code: string,
    rowIndex: number,
    value: string | boolean,
    type: string,
    field: string
  ) => void;
};

const Input = styled("input")({
  display: "none",
});

export const Question = (props: QuestionProps) => {
  const question: IQuestion = props.questionMap[props.questionId];
  const answer: IQuestion = props.answers[props.questionId];
  const handleRadioChange = (event) => {
    props.onChange(props.index, event.target.value, "radio", question.code);
  };

  const isSubQuestions = !props.subQuestions?.length;
  const id = useId();

  const onChange = (event) => {
    props.onChange(props.index, event.target.value, "text", question.code);
  };
  const onUploadHandler = (event) => {
    props.onUploadHandler(event, props.index, question.code);
  };
  const onBlur = (event) => {
    props.onChange(
      props.index,
      event.target.value,
      "calculate_marks",
      question.code
    );
  };

  const getLabel = (
    answerRow: object,
    questionRows: object & { index: number }[],
    index,
    field
  ) => {
    
    if (answerRow[field]) {
      return answerRow[field];
    }
    return questionRows.find((m) => m.index === index)?.[field];
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: question.type === "table" ? "start" : "center",
          flexDirection: question.type === "table" ? "column" : "row",
          gap: 10,
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            gap: 5,
            paddingLeft: isSubQuestions || question.type === "table" ? 20 : 10,
          }}
        >
          <strong>{question.question_number}.</strong>
          {isSubQuestions ? (
            <div> {question.description} </div>
          ) : (
            <strong>{question.description}</strong>
          )}
          (<span>{question.marks}</span>)
        </div>

        <div
          style={{
            flex: 0.8,
            ...question.style,
            paddingLeft: question.type === "table" ? 40 : null,
          }}
        >
          {question.type === "radio" ? (
            <RadioGroup
              sx={{ fontSize: 8 }}
              row
              value={answer.value ?? ""}
              aria-readonly={true}
              onChange={handleRadioChange}
            >
              <FormControlLabel
                sx={{ fontSize: 8 }}
                value="Y"
                control={<Radio size="small" disabled={question.disabled} />}
                label="Yes"
              />
              <FormControlLabel
                value="N"
                control={<Radio size="small" disabled={question.disabled} />}
                label="No"
              />
            </RadioGroup>
          ) : question.type === "text" ? (
            <TextField
              variant="standard"
              sx={{ fontSize: 8 }}
              onChange={onChange}
              value={answer.reason}
              onBlur={onBlur}
              maxRows={2}
              multiline
              style={{ width: "95%" }}
              helperText={question.helperText}
              error={!!answer.error}
            />
          ) : question.type === "upload" ? (
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
              {answer.documentId && (
                <div
                  style={{ cursor: "pointer", textDecoration: "underline" }}
                  onClick={() =>
                    props.onDownload(answer.documentId, answer.fileName)
                  }
                >
                  {answer.fileName}
                </div>
              )}
            </div>
          ) : question.type === "table" ? (
            <div>
              {question.headers && (
                <section>
                  <header>
                    <div
                      className="col"
                      style={{
                        width: 50,
                      }}
                    >
                      S.No.
                    </div>
                    {question.headers.map((header) => (
                      <div
                        className="col"
                        style={{
                          width: header.width,
                          flex: header.width ? null : 1,
                        }}
                      >
                        {header.label}
                      </div>
                    ))}
                    {question.showAdditionalCol && (
                      <div
                        className="col"
                        style={{
                          width: 50,
                        }}
                      ></div>
                    )}
                  </header>
                  {answer.rows?.map((row) => (
                    <div className="row">
                      <div
                        className="col"
                        style={{
                          width: 50,
                        }}
                      >
                        {row.index}
                      </div>
                      {question.headers.map((header) => {
                        const type = row.types?.[header.key] ?? header.type;
                        return (
                          <div
                            className="col"
                            style={{
                              width: header.width,
                              display: "flex",
                              flex: header.width ? null : 1,
                            }}
                          >
                            <>
                              {type === "label" ? (
                                getLabel(
                                  row,
                                  question.rows,
                                  row.index,
                                  header.key
                                )
                              ) : type === "checkbox" ? (
                                <>
                                  <input
                                    type="checkbox"
                                    checked={row[header.key]}
                                    onChange={(event) => {
                                      props.onRowValueChange(
                                        props.index,
                                        question.code,
                                        row.index,
                                        event.target.checked,
                                        "checkbox",
                                        header.key
                                      );
                                    }}
                                  />
                                </>
                              ) : type === "textbox" ? (
                                <TextField
                                  style={{
                                    width: "100%",
                                    padding: " 0px 10px 2px 0px",
                                    alignSelf: "flex-end",
                                  }}
                                  label=""
                                  value={row[header.key]}
                                  variant="standard"
                                  type={header.textBoxType ?? "text"}
                                  inputProps={{ style: { fontSize: 12 } }}
                                  maxRows={header.maxRows ?? 2}
                                  multiline={header.multiline}
                                  onChange={(event) =>
                                    props.onRowValueChange(
                                      props.index,
                                      question.code,
                                      row.index,
                                      event.target.value,
                                      "textbox",
                                      header.key
                                    )
                                  }
                                />
                              ) : type === "dropdown" ? (
                                <Select
                                  displayEmpty
                                  size="small"
                                  value={row[header.key]}
                                  style={{
                                    width: "100%",
                                    alignSelf: "center",
                                    fontSize: 12,
                                    height: 25,
                                  }}
                                  onChange={(event) =>
                                    props.onRowValueChange(
                                      props.index,
                                      question.code,
                                      row.index,
                                      event.target.value as string,
                                      "dropdown",
                                      header.key
                                    )
                                  }
                                >
                                  {header.options?.map((op) => (
                                    <MenuItem
                                      style={{ fontSize: 12 }}
                                      value={op.key}
                                    >
                                      {op.label}
                                    </MenuItem>
                                  ))}
                                </Select>
                              ) : (
                                <></>
                              )}
                            </>
                          </div>
                        );
                      })}
                      {question.showAdditionalCol && (
                        <div
                          className="col"
                          style={{
                            width: 50,
                          }}
                        >
                          {row.index === answer.rows.length && (
                            <>
                              <IconButton
                                color="primary"
                                style={{ height: 25 }}
                                onClick={() =>
                                  props.addNewRow(
                                    props.index,
                                    question.code,
                                    row.index
                                  )
                                }
                                size="small"
                                aria-label="add new"
                              >
                                <AddIcon></AddIcon>
                              </IconButton>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </section>
              )}
            </div>
          ) : (
            <></>
          )}
        </div>
        {!question.hideMarks && (
          <div style={{ width: 80, alignSelf: "end" }}>
            {question.type !== "text" && (
              <TextField
                variant="standard"
                sx={{ fontSize: 8 }}
                type="number"
                value={answer.obtainedMarks}
                disabled={true}
                style={{ width: "90%" }}
              />
            )}
          </div>
        )}
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
              addNewRow={props.addNewRow}
              onRowValueChange={props.onRowValueChange}
              questionMap={props.questionMap}
              questionId={sq.questionId}
              answers={props.answers}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
