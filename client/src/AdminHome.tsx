import Grid from '@mui/material/Grid';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Department } from './Department';

export const AdminHome = () => {
    const [departments, setDepartments] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5555/departments/count').then((res) => {
            setDepartments(res.data);
        });
    }, []);
    return (
        <Grid container spacing={4}>
            {
                departments.map((department) => <Grid key={department.departmentId} item xs={12} md={4} lg={3}>
                    <Department  {...department} totalCriteria={departments.length} />
                </Grid>)
            }

        </Grid>
    );
}
