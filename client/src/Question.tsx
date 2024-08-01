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
import { IQuestion } from "./domain/IQuestion";
import { useId } from "react";
import AddIcon from "@mui/icons-material/Add";
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
  addNewRow: (index: string, code: string) => void;
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
          alignItems: props.type === "table" ? "start" : "center",
          flexDirection: props.type === "table" ? "column" : "row",
          gap: 10,
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            gap: 5,
            paddingLeft: isSubQuestions || props.type === "table" ? 20 : 10,
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

        <div
          style={{
            flex: 0.8,
            ...props.style,
            paddingLeft: props.type === "table" ? 40 : null,
          }}
        >
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
              maxRows={2}
              multiline
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
          ) : props.type === "table" ? (
            <div>
              {props.headers && (
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
                    {props.headers.map((header) => (
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
                    {props.showAdditionalCol && (
                      <div
                        className="col"
                        style={{
                          width: 50,
                        }}
                      ></div>
                    )}
                  </header>
                  {props.rows?.map((row, index) => (
                    <div className="row">
                      <div
                        className="col"
                        style={{
                          width: 50,
                        }}
                      >
                        {index + 1}
                      </div>
                      {props.headers.map((header) => {
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
                                row[header.key]
                              ) : type === "checkbox" ? (
                                <>
                                  <input
                                    type="checkbox"
                                    checked={row[header.key]}
                                    onChange={(event) => {
                                      props.onRowValueChange(
                                        props.index,
                                        props.code,
                                        index,
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
                                      props.code,
                                      index,
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
                                      props.code,
                                      index,
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
                      {props.showAdditionalCol && (
                        <div
                          className="col"
                          style={{
                            width: 50,
                          }}
                        >
                          {index + 1 === props.rows.length && (
                            <>
                              <IconButton
                                color="primary"
                                style={{ height: 25 }}
                                onClick={() =>
                                  props.addNewRow(props.index, props.code)
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
        {!props.hideMarks && (
          <div style={{ width: 80, alignSelf: "end" }}>
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
            />
          </div>
        ))}
      </div>
    </div>
  );
};
