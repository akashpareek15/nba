import axios from "axios";
import { useEffect, useState } from "react";
import { Question } from "./Question";

export const Questions = () => {
    const [questions, setQuestions] = useState<{ description: string }[]>([]);

    useEffect(() => {
        axios.get('http://localhost:5555/questions').then((res) => {
            setQuestions(res.data.data);
        });
    }, [])

    return <>
        {
            questions.map((q, index) => <Question key={index} description={q.description} index={index} ></Question>)
        }
        <div>Total:</div>
    </>

}