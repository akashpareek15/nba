import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { ChangeType, Question } from "./Question";
import { useNavigate, useParams } from "react-router-dom";
import {
  IQuestion,
  KeywordsMarksCalculation,
  Option,
  SubQuestion,
} from "./domain/IQuestion";
import { Button, Typography } from "@mui/material";
import { useUser } from "./useUser";
import { saveAs } from "file-saver";

export const Questions = () => {
  const [questions, setQuestions] = useState<IQuestion[]>([]);
  const [answers, setAnswers] = useState<object>({});
  const [questionMap, setQuestionMap] = useState<object>({});
  const [keywords, setKeywords] = useState<object>({});

  const { criteriaId } = useParams();
  const { loggedInUser } = useUser();
  const [isChanged, setIsChanged] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (criteriaId && loggedInUser?.departmentId) {
      axios
        .get(
          `http://localhost:5555/criteria/${criteriaId}/departments/${loggedInUser?.departmentId}/questions`
        )
        .then((res) => {
          setQuestions(res.data.criteriaQuestions);
          const questions = {};
          const keywordMap = res.data.keywords.reduce((prev, curr) => {
            prev[curr.questionId] = curr.keywords;
            return prev;
          }, {});
          setKeywords(keywordMap);
          const answers = {};
          res.data.questions.forEach((question: IQuestion) => {
            const answer = (res.data.savedAnswers?.answers?.[
              question.questionId
            ] ?? {}) as IQuestion;
            const rows = [];
            if (question.type === "table") {
              const fieldsToCopy = question.headers
                ?.filter((f) => f.type !== "label")
                .map((m) => m.key);
              question.rows?.forEach((r) => {
                const ansRow = answer.rows?.find((ar) => ar.index === r.index);

                const rowToCopy = fieldsToCopy.reduce((prev, curr) => {
                  prev[curr] = r[curr];
                  return prev;
                }, {});
                rows.push(ansRow ?? { ...rowToCopy, index: r.index });
              });
              const manualRows = answer.rows?.filter((x) => x.isManual) ?? [];
              answers[question.questionId] = {
                ...answer,
                rows: [...rows, ...manualRows],
              };
            } else {
              answers[question.questionId] = answer;
            }
            questions[question.questionId] = question;
          });

          setAnswers(answers);
          setQuestionMap(questions);
        });
    }
  }, [criteriaId, loggedInUser?.departmentId]);

  const findSubQuestion = (
    questions: IQuestion[] | SubQuestion[],
    questionIndexes: number[],
    counter = 0
  ): IQuestion | SubQuestion => {
    if (questionIndexes.length == 1) {
      return questions[questionIndexes[0]];
    }
    if (counter < questionIndexes.length - 1) {
      return findSubQuestion(
        questions[questionIndexes[counter]].subQuestions,
        questionIndexes,
        counter + 1
      );
    }
    return questions[questionIndexes[counter]];
  };

  const isValidAnswer = (
    type: string,
    reason?: string,
    error?: string
  ): boolean => {
    return type === "text" ? !!reason && !error : true;
  };

  const allAnswered = () => {
    return questions.every((m) => {
      const { reason, error, type } = m;
      const isValid = isValidAnswer(type, reason, error);
      return isValid;
    });
  };

  const onSaveQuestion = () => {
    if (allAnswered()) {
      const answersToSave = Object.keys(answers).reduce((prev, curr) => {
        const key = Number(curr);
        if (answers[key] && answers[key].toString() !== "{}") {
          prev[key] = answers[key];
        }
        return prev;
      }, {});
      axios
        .post(
          `http://localhost:5555/criteria/${criteriaId}/departments/${loggedInUser?.departmentId}`,
          { answers: answersToSave, total }
        )
        .then(() => {
          setIsChanged(false);
          navigate("/home/dashboard");
        });
    }
  };

  const total = useMemo(
    () =>
      Object.values(answers).reduce((acc, cur) => {
        const marks = isNaN(Number(cur.obtainedMarks))
          ? 0
          : Number(cur.obtainedMarks);
        return acc + marks;
      }, 0),
    [answers]
  );

  const findMatchedKeywords = (keywords: string[], reason?: string) => {
    return keywords?.reduce((acc, curr) => {
      return reason?.toLowerCase().indexOf(curr?.toLowerCase()) > -1
        ? acc + 1
        : acc;
    }, 0);
  };

  const calculateMarks = (question: IQuestion | SubQuestion) => {
    const matched = keywords[question.questionId]?.reduce((acc, curr) => {
      return question.reason
        ?.toLowerCase()
        .indexOf((curr as string)?.toLowerCase()) > -1
        ? acc + 1
        : acc;
    }, 0);
    return matched >= 3 ? 2 : matched >= 2 ? 1.5 : 1;
  };

  const onChange = (index: string, value: string, type: ChangeType) => {
    setIsChanged(true);
    const question = findSubQuestion(
      questions,
      index.split("_").map((m) => +m),
      0
    );
    const questionMetadata = questionMap[question.questionId];
    const answer = answers[question.questionId];
    if (type === "text") {
      answer.reason = value;
    } else if (type === "calculate_marks") {
      if (["MISSION_TEXT", "VISION_TEXT"].includes(questionMetadata.code)) {
        calculateVision(findSubQuestion(questions, [0], 0));
      } else if (
        ["CONSISTENCY_PEO", "PROCESS_VISION_MISSION"].includes(
          questionMetadata.code
        )
      ) {
        calculateSubQuestion(question);
      } else if (questionMetadata.code === "PROGRAM_OBJECTIVE_HEADING") {
        calculatePEO(question);
      } else {
        question.obtainedMarks = getKeywordsMarks(
          findMatchedKeywords(keywords?.[question.questionId], question.reason),
          questionMetadata.keywordsMarksCalculation
        );
      }
    } else if (type === "marks_change") {
      question.obtainedMarks = question.reason
        ? isNaN(Number(value))
          ? 0
          : Number(value) ?? 0
        : undefined;
    }
    setQuestions([...questions]);
    setAnswers({ ...answers });
  };

  const onUpload = (event) => {
    const formData = new FormData();
    formData.append("file", event.target.files[0]);
    return axios.post("http://localhost:5555/document/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  };

  const onUploadHandler = async (event, index: string, _code: string) => {
    setIsChanged(true);
    const question = findSubQuestion(
      questions,
      index.split("_").map((m) => +m),
      0
    );

    try {
      const response = await onUpload(event);
      calculateUploadMarks(question, response.data);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
    setQuestions([...questions]);
  };

  const onDownload = async (documentId: string, fileName: string) => {
    try {
      const response = await fetch(
        `http://localhost:5555/document/${documentId}/download`
      );
      const blob = await response.blob();
      saveAs(blob, fileName);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  const getQuestionIdByCode = (code) => {
    return (Object.values(questionMap) as (IQuestion | SubQuestion)[]).find(
      (x) => x.code === code
    )?.questionId;
  };

  const getKeywordsMarks = (
    matchedKeywords: number = 0,
    keywordsMarksCalculation: KeywordsMarksCalculation[] = []
  ) => {
    let marks = 0;
    keywordsMarksCalculation.forEach((criteria) => {
      if (
        matchedKeywords >= criteria.min &&
        (!criteria.max || matchedKeywords <= criteria.max)
      ) {
        marks = criteria.marks;
      }
    });
    return marks;
  };

  const calculateVision = (question: IQuestion | SubQuestion) => {
    const mission = answers[getQuestionIdByCode("MISSION_TEXT")]?.reason;
    const vision = answers[getQuestionIdByCode("VISION_TEXT")]?.reason;
    const isAnswered = vision && mission;
    const reason = `${vision ?? ""} ${mission ?? ""}`;
    question.subQuestions?.forEach((sq) => {
      const questionMetadata = questionMap[sq.questionId];
      const answer = answers[sq.questionId];
      if (questionMetadata.type === "radio") {
        answer.value = isAnswered ? "Y" : "N";
        answer.obtainedMarks = isAnswered ? 1 : 0;
      } else if (questionMetadata.type === "keyword") {
        if (isAnswered) {
          answer.obtainedMarks = getKeywordsMarks(
            findMatchedKeywords(keywords?.[sq.questionId], reason),
            questionMetadata.keywordsMarksCalculation
          );
        }
      }
    });
  };

  const calculateSubQuestion = (question: IQuestion | SubQuestion) => {
    const reason = answers[question.questionId]?.reason;
    question.subQuestions?.forEach((sq) => {
      const questionMetadata = questionMap[sq.questionId];
      const answer = answers[sq.questionId];
      if (questionMetadata.type === "radio") {
        const isAnswered = !!reason?.toString().trim();
        answer.value = isAnswered ? "Y" : "N";
        answer.obtainedMarks = isAnswered ? 1 : 0;
      } else if (questionMetadata.type === "keyword") {
        answer.obtainedMarks = keywords?.[sq.questionId]?.reduce(
          (prev, curr) => {
            const matchedKeywords = findMatchedKeywords(
              curr as string[],
              reason
            );
            return matchedKeywords > 0 ? prev + 1 : prev;
          },
          0
        );
      }
    });
  };

  const calculatePEO = (question: IQuestion | SubQuestion) => {
    const answerMain = answers[question.questionId];
    const min3Sentences = answerMain?.reason?.split(".").length >= 3;
    answerMain.error = !min3Sentences ? "Error" : "";
    question.subQuestions?.forEach((sq) => {
      const questionMetadata = questionMap[sq.questionId];
      const answer = answers[sq.questionId];
      if (questionMetadata.type === "keyword") {
        answer.obtainedMarks = min3Sentences
          ? getKeywordsMarks(
              findMatchedKeywords(keywords?.[sq.questionId], answerMain.reason),
              questionMetadata.keywordsMarksCalculation
            )
          : 0;
      }
    });
  };

  const calculateUploadMarks = (
    question: IQuestion | SubQuestion,
    { parsedData, documentId, fileName }
  ) => {
    const answerMain = answers[question.questionId];
    answerMain.documentId = documentId;
    answerMain.fileName = fileName;
    const questionMetadataMain = questionMap[question.questionId];

    if (
      keywords?.[question.questionId]?.length &&
      !question.subQuestions?.length
    ) {
      answerMain.obtainedMarks = checkKeywords(
        questionMetadataMain,
        parsedData
      );
    }

    question.subQuestions?.forEach((sq) => {
      const questionMetadata = questionMap[sq.questionId];
      const answer = answers[sq.questionId];
      if (questionMetadata.type === "keyword") {
        answer.obtainedMarks = checkKeywords(questionMetadata, parsedData);
      }
    });
  };

  const checkKeywords = (sq: IQuestion | SubQuestion, parsedData) => {
    return getKeywordsMarks(
      findMatchedKeywords(keywords[sq.questionId], parsedData),
      sq.keywordsMarksCalculation
    );
  };

  const addNewRow = (index: string, code: string, rowIndex: number) => {
    const question = findSubQuestion(
      questions,
      index.split("_").map((m) => +m),
      0
    );
    const answer = answers[question.questionId];
    if (code === "INDICATE_VISION_MISSION_ADEQUACY") {
      answer.rows.push({
        isManual: true,
        types: {
          location: "textbox",
        },
        index: rowIndex + 1,
      });
    }
    if (code === "INDICATE_VISION_MISSION_EXTENT") {
      answer.rows.push({
        isManual: true,
        index: rowIndex + 1,
        types: {
          stakeholderType: "dropdown",
          stakeholder: "textbox",
        },
      });
    }

    setAnswers({ ...answers });
  };

  const sanitizeText = (text) => text?.replace(/(\r\n|\n|\r|\s+|\s+)/gm, "");

  const onRowValueChange = async (
    index: string,
    code: string,
    rowIndex: number,
    value: string,
    type: string,
    field: string,
    multiCheckboxField?: string
  ) => {
    const question = findSubQuestion(
      questions,
      index.split("_").map((m) => +m),
      0
    );
    const answer = answers[question.questionId];
    const questionMetadata = questionMap[question.questionId];
    if (type === "upload") {
      try {
        const response = await onUpload(value);
        const {
          documentId,
          fileName,
          parsedData,
        }: { documentId: string; fileName: string; parsedData: string } =
          response.data;
        if (multiCheckboxField) {
          answer.rows[rowIndex - 1][field] =
            answer.rows[rowIndex - 1][field] ?? {};
          answer.rows[rowIndex - 1][field][multiCheckboxField] = {
            ...answer.rows[rowIndex - 1][field][multiCheckboxField],
            document: { documentId, fileName },
          };
        } else {
          answer.rows[rowIndex - 1][field] = { documentId, fileName };
        }
        if (
          code === "INDICATE_VISION_MISSION_ADEQUACY" ||
          code === "INDICATE_VISION_MISSION_EXTENT"
        ) {
          const visionExists = sanitizeText(parsedData)
            ?.toLowerCase()
            .includes(
              sanitizeText(
                answers[getQuestionIdByCode("VISION_TEXT")]?.reason
              )?.toLowerCase()
            );

          const missionExists = sanitizeText(parsedData)
            ?.toLowerCase()
            .includes(
              sanitizeText(
                answers[getQuestionIdByCode("MISSION_TEXT")]?.reason
              )?.toLowerCase()
            );
          const peo = answers[5]?.reason;

          const peoExist = sanitizeText(parsedData)
            ?.toLowerCase()
            .includes(sanitizeText(peo)?.toLowerCase());
          if (code === "INDICATE_VISION_MISSION_ADEQUACY") {
            answer.rows[rowIndex - 1]["peo"] = peoExist;
            answer.rows[rowIndex - 1]["vision"] = visionExists;
            answer.rows[rowIndex - 1]["mission"] = missionExists;
          } else if (code === "INDICATE_VISION_MISSION_EXTENT") {
            answer.rows[rowIndex - 1][field][multiCheckboxField].checked =
              peoExist && visionExists && missionExists;
          }
        }

        if (code === "INDICATE_VISION_MISSION_ADEQUACY") {
          answer.obtainedMarks = questionMetadata.headers
            .filter((h) => h.type === "checkbox")
            .reduce((acc, curr) => {
              return answer.rows.filter((r) => r[curr.key] === true).length > 4
                ? acc + 1
                : acc;
            }, 0);
        }
      } catch (error) {
        console.log(error);
      }
    } else if (type === "multiline-checkboxes") {
      answer.rows[rowIndex - 1][field] = answer.rows[rowIndex - 1][field] ?? {};
      answer.rows[rowIndex - 1][field][multiCheckboxField] = {
        ...answer.rows[rowIndex - 1][field][multiCheckboxField],
        checked: value,
      };
    } else {
      answer.rows[rowIndex - 1][field] = value;
    }
    if (code === "INDICATE_VISION_MISSION_EXTENT") {
      const obtainedMarksArray: number[] = (answer.rows as any[]).reduce(
        (acc, curr) => {
          const checkboxes: Option[] =
            questionMetadata.headers.find((x) => x.key === field)?.checkboxes ??
            [];
          const marksPerCheckbox = 1 / checkboxes.length;
          acc.push(
            checkboxes.reduce((prev, currCheck) => {
              const marks = curr[field]?.[currCheck.key]?.checked
                ? marksPerCheckbox
                : 0;
              return prev + marks;
            }, 0)
          );

          return acc;
        },
        []
      );
      answer.obtainedMarks =
        Math.round(
          obtainedMarksArray
            .sort((a, b) => b - a)
            .reduce((acc, curr, ind) => {
              return ind <= 8 ? acc + curr : acc;
            }, 0) * 100
        ) / 100;
    }
    setAnswers({ ...answers });
  };
  return (
    <Typography variant="body2" fontSize={12}>
      <div style={{ display: "flex", flexDirection: "column", gap: "50px" }}>
        {questions.map((question, index) => {
          return (
            <Question
              key={question._id}
              {...question}
              questionId={question.questionId}
              onChange={onChange}
              onDownload={onDownload}
              onUploadHandler={onUploadHandler}
              index={`${index}`}
              addNewRow={addNewRow}
              questionMap={questionMap}
              onRowValueChange={onRowValueChange}
              answers={answers}
            ></Question>
          );
        })}
        <div style={{ display: "flex", alignItems: "center", gap: 30 }}>
          <Button variant="contained" color="primary" onClick={onSaveQuestion}>
            Save
          </Button>

          <div>Total: {total}</div>
        </div>
      </div>
    </Typography>
  );
};
