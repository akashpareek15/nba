import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { ChangeType, Question } from "./Question";
import { useNavigate, useParams } from "react-router-dom";
import { IQuestion, SubQuestion } from "./domain/IQuestion";
import { Button, Typography } from "@mui/material";
import { useUser } from "./useUser";

export const Questions = () => {
    const [questions, setQuestions] = useState<IQuestion[]>([]);
    const { criteriaId } = useParams();
    const { loggedInUser } = useUser();
    const [isChanged, setIsChanged] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (criteriaId && loggedInUser?.departmentId) {
            axios.get(`http://localhost:5555/criteria/${criteriaId}/departments/${loggedInUser?.departmentId}/questions`).then((res) => {
                setQuestions(res.data);
            });

        }
    }, [criteriaId, loggedInUser?.departmentId]);

    const findSubQuestion = (questions: IQuestion[] | SubQuestion[], questionIndexes: number[], counter = 0): IQuestion | SubQuestion => {
        if (questionIndexes.length == 1) {

            return questions[questionIndexes[0]];
        }
        if (counter < questionIndexes.length - 1) {
            return findSubQuestion(questions[questionIndexes[counter]].subQuestions, questionIndexes, counter + 1);
        }
        return questions[questionIndexes[counter]];

    }

    const allAnswered = () => !questions.flatMap(m => m.subQuestions ?? m).some((question) => !question.value || (question.value === 'Y' && !question.reason));


    const onSaveQuestion = () => {
        if (isChanged && allAnswered()) {
            axios.post(`http://localhost:5555/criteria/${criteriaId}/departments/${loggedInUser?.departmentId}`, { questions, total }).then((res) => {
                setIsChanged(false);
                console.log(res);
                navigate('/home/dashboard');
            });
        }
    }

    const total = useMemo(() => questions.flatMap(m => m.subQuestions ?? m).reduce((acc, cur) => cur.value === 'Y' ? acc + cur.marks : acc, 0), [questions]);

    const calculateMatchedKeywords = (question: IQuestion | SubQuestion) => {
        return question.keywords?.reduce((acc, curr) => {
            return question.reason?.toLowerCase().indexOf(curr?.toLowerCase()) > -1 ? acc + 1 : acc;
        }, 0)
    }

    const onChange = (index: string, value: string, type: ChangeType) => {
        setIsChanged(true);
        const question = findSubQuestion(questions, index.split('_').map(m => +m), 0);
        if (type === 'radio') {
            question.value = value;
            if (value === 'N') {
                question.reason = undefined;

            }
        } else if (type === 'text') {
            question.reason = value;
            question.marks = calculateMatchedKeywords(question);
        }

        setQuestions([...questions]);
    }


    return <Typography variant="body2" fontSize={12}  >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '50px' }}>
            {
                questions.map((question, index) => <Question key={question._id} {...question} onChange={onChange} index={`${index}`} ></Question>)
            }
            <div style={{ display: 'flex', alignItems: 'center', gap: 30 }}>

                <Button variant="contained" color="primary" onClick={onSaveQuestion}>Save</Button>

                <div>Total: {total}</div>
            </div>
        </div>
    </Typography>
}