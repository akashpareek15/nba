import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { ChangeType, Question } from "./Question";
import { useNavigate, useParams } from "react-router-dom";
import { IQuestion, SubQuestion } from "./domain/IQuestion";
import { Button, Typography } from "@mui/material";
import { useUser } from "./useUser";
import { saveAs } from "file-saver";

export const Questions = () => {
  const [questions, setQuestions] = useState<IQuestion[]>([]);
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
          setQuestions(res.data);
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
    if (isChanged && allAnswered()) {
      axios
        .post(
          `http://localhost:5555/criteria/${criteriaId}/departments/${loggedInUser?.departmentId}`,
          { questions, total }
        )
        .then(() => {
          setIsChanged(false);
          navigate("/home/dashboard");
        });
    }
  };

  const total = useMemo(
    () =>
      questions
        .flatMap((m) => m.subQuestions ?? m)
        .reduce((acc, cur) => {
          const marks = isNaN(Number(cur.obtainedMarks))
            ? 0
            : Number(cur.obtainedMarks);
          return acc + marks;
        }, 0),
    [questions]
  );

  const findMatchedKeywords = (keywords: string[], reason?: string) => {
    return keywords?.reduce((acc, curr) => {
      return reason?.toLowerCase().indexOf(curr?.toLowerCase()) > -1
        ? acc + 1
        : acc;
    }, 0);
  };

  const calculateMarks = (question: IQuestion | SubQuestion) => {
    const matched = question.keywords?.reduce((acc, curr) => {
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
    if (type === "radio") {
      question.value = value;
      if (value === "N") {
        question.reason = undefined;
        question.obtainedMarks = 0;
      } else if (value === "Y" && !question.keywords?.length) {
        question.obtainedMarks = question.marks;
      }
    } else if (type === "text") {
      question.reason = value;
    } else if (type === "calculate_marks") {
      console.log(question);
      if (
        [
          "VISION_MISSION_HEADING",
          "CONSISTENCY_PEO",
          "PROCESS_VISION_MISSION",
        ].includes(question.code)
      ) {
        calculateVision(question);
      } else if (question.code === "PROGRAM_OBJECTIVE_HEADING") {
        calculatePEO(question);
      } else {
        question.obtainedMarks = calculateMarks(question);
      }
    } else if (type === "marks_change") {
      question.obtainedMarks = question.reason
        ? isNaN(Number(value))
          ? 0
          : Number(value) ?? 0
        : undefined;
    }
    setQuestions([...questions]);
  };

  const onUploadHandler = async (e, index: string, _code: string) => {
    setIsChanged(true);
    const question = findSubQuestion(
      questions,
      index.split("_").map((m) => +m),
      0
    );
    const formData = new FormData();
    formData.append("file", e.target.files[0]);
    try {
      const response = await axios.post(
        "http://localhost:5555/document/upload",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      calculateIndicate(question, response.data);
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
      console.log(response);
      const blob = await response.blob();
      saveAs(blob, fileName);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  const calculateVision = (question: IQuestion | SubQuestion) => {
    question.subQuestions?.forEach((sq) => {
      if (sq.type === "radio") {
        const isAnswered = !!question.reason?.toString().trim();
        sq.value = isAnswered ? "Y" : "N";
        sq.obtainedMarks = isAnswered ? 1 : 0;
      } else if (sq.type === "keyword") {
        sq.obtainedMarks = sq.keywords?.reduce((prev, curr) => {
          const matchedKeywords = findMatchedKeywords(
            curr as string[],
            question.reason
          );
          return matchedKeywords > 0 ? prev + 1 : prev;
        }, 0);
      }
    });
  };

  const calculateIndicate = (
    question: IQuestion | SubQuestion,
    { parsedData, documentId, fileName }
  ) => {
    question.documentId = documentId;
    question.fileName = fileName;
    question.subQuestions?.forEach((sq) => {
      if (sq.type === "keyword") {
        sq.obtainedMarks = sq.keywords?.reduce((prev, curr) => {
          const matchedKeywords = findMatchedKeywords(
            curr as string[],
            parsedData
          );
          return matchedKeywords > 0 ? prev + 1 : prev;
        }, 0);
      }
    });
  };

  const calculatePEO = (question: IQuestion | SubQuestion) => {
    const min3Sentences = question.reason?.split(".").length >= 3;
    question.error = !min3Sentences ? "Error" : "";
    question.subQuestions?.forEach((sq) => {
      if (sq.type === "keyword") {
        sq.obtainedMarks = min3Sentences
          ? sq.keywords?.reduce((prev, curr) => {
            const matchedKeywords = findMatchedKeywords(
              curr as string[],
              question.reason
            );
            return matchedKeywords > 0 ? prev + 1 : prev;
          }, 0)
          : 0;
      }
    });
  };

  return (
    <Typography variant="body2" fontSize={12}>
      <div style={{ display: "flex", flexDirection: "column", gap: "50px" }}>
        {questions.map((question, index) => (
          <Question
            key={question._id}
            {...question}
            onChange={onChange}
            onDownload={onDownload}
            onUploadHandler={onUploadHandler}
            index={`${index}`}
          ></Question>
        ))}
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
