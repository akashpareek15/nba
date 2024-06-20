import { Paper } from '@mui/material';
import Grid from '@mui/material/Grid';
import axios from 'axios';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from './useUser';

export const DepartmentHome = () => {
    const [criteriaList, setCriteriaList] = React.useState<{ criteriaName: string, criteriaId: number, total: number }[]>([]);
    const navigate = useNavigate();
    const { loggedInUser } = useUser();
    React.useEffect(() => {
        if (loggedInUser) {

            axios.get(`http://localhost:5555/criteria/${loggedInUser?.departmentId}`).then((res) => {
                setCriteriaList(res.data);
            });
        }

    }, [loggedInUser]);
    return (
        <Grid container spacing={4}>
            {
                criteriaList.map((criteria) => <Grid key={`criteria_${criteria.criteriaId}`} item xs={12} md={4} lg={3}>
                    <Paper
                        sx={{
                            p: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            width: '100%',
                            borderLeft: `5px solid  ${criteria.total > 0 ? 'green' : 'red'}`
                        }}
                    >
                        <div style={{ minHeight: 50, cursor: 'pointer' }} onClick={() => { navigate(`/home/criteria/${criteria.criteriaId}/questions`); }}>
                            <div>{criteria.criteriaName}</div>
                            <div>{criteria.total ?? 0}</div>
                        </div>
                    </Paper>
                </Grid>)
            }
        </Grid>
    );
}