import { FormControlLabel, Radio, RadioGroup, TextField } from "@mui/material";
import { IQuestion } from "./domain/IQuestion";

export type ChangeType = 'radio' | 'text' | 'calculate_marks' | 'marks_change';
type QuestionProps = IQuestion & { onChange: (index: string, value: string, type: ChangeType) => void; index: string }

export const Question = (props: QuestionProps) => {
    const handleRadioChange = (event) => {
        props.onChange(props.index, event.target.value, 'radio');
    };

    const isQuestion = !props.subQuestions?.length;

    const onChange = (event) => {
        props.onChange(props.index, event.target.value, 'text');

    };


    const onBlur = (event) => {
        props.onChange(props.index, event.target.value, 'calculate_marks');

    };

    const onMarksChange = (event) => {
        props.onChange(props.index, event.target.value, 'marks_change');

    };

    return <div style={{ display: 'flex', alignItems: isQuestion ? 'center' : 'start', flexDirection: isQuestion ? 'row' : 'column', gap: 10 }}>
        <div style={{ flex: 1, display: 'flex', gap: 5 }} >
            <strong>{props.question_number}.</strong>{isQuestion ? <div> {props.description} </div> : <strong>{props.description}</strong>}
            (<span>{props.marks}</span>)
        </div>
        {isQuestion ?
            <>
                <div style={{ width: 150 }} >
                    <RadioGroup sx={{ fontSize: 8 }} row value={props.value ?? ''} onChange={handleRadioChange} >
                        <FormControlLabel sx={{ fontSize: 8 }} value="Y" control={<Radio size="small" />} label="Yes" />
                        <FormControlLabel value="N" control={<Radio size="small" />} label="No" />
                    </RadioGroup>
                </div>
                <div style={{ flex: 0.8 }} >
                    {props.value === 'Y' && <TextField variant="standard" sx={{ fontSize: 8 }} onChange={onChange} value={props.reason} onBlur={onBlur} placeholder="Please provide the reason" style={{ width: '95%' }} error={!props.reason} />}
                </div>
                <div style={{ width: 80 }} >
                    {<TextField variant="standard" sx={{ fontSize: 8 }} type="number" value={props.obtainedMarks} onChange={onMarksChange} style={{ width: '90%' }} />}
                </div>

            </> :
            props.subQuestions.map((sq: IQuestion, subQuestionIndex: number) => (<div style={{ marginLeft: '20px', width: '98%' }}> <Question {...sq} index={`${props.index}_${subQuestionIndex}`} onChange={props.onChange} />  </div>))
        }
    </div>;
}