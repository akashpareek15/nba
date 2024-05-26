import { FormControlLabel, Radio, RadioGroup, TextField } from "@mui/material";
import { useState } from "react";


export const Question = (props) => {
    const [value, setValue] = useState();

    const handleChange = (event) => {
        setValue(event.target.value);
    };
    return <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <div style={{ flex: 0.5, }}  >
            {props.index + 1}. {props.description}

        </div>
        <div style={{ width: 150 }} >
            <RadioGroup row value={value} onChange={handleChange} >
                <FormControlLabel value="Y" control={<Radio />} label="Yes" />
                <FormControlLabel value="N" control={<Radio />} label="No" />
            </RadioGroup>
        </div>
        <div style={{ flex: 1 }} >
            {value === 'Y' && <TextField variant="standard" placeholder="Please provide the reason" style={{ width: '80%' }} />}
        </div>
    </div>;
}