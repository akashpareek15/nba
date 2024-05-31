import Grid from '@mui/material/Grid';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Department } from './Department';

export const Dashboard = (props: { clickable?: boolean }) => {
    const [departments, setDepartments] = useState<{ departmentId: number, departmentName: string }[]>([]);

    useEffect(() => {
        axios.get('http://localhost:5555/departments').then((res) => {
            setDepartments(res.data);
        });
    }, [])
    return (
        <Grid container spacing={4}>
            {
                departments.map((department) => <Grid item xs={12} md={4} lg={3}> 
                    <Department  {...department} clickable={props.clickable} />
               </Grid>)
            }
        </Grid>
    );
}
