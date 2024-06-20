import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BarChartIcon from '@mui/icons-material/BarChart';

import { Divider, List, Toolbar } from '@mui/material';
import { SettingsSuggest } from '@mui/icons-material';
import axios from 'axios';
import * as logo from './assets/logo.jpg';
import { useNavigate } from 'react-router-dom';



export const NavigationPanel = () => {
    const [departments, setDepartments] = React.useState<{ departmentName: string, departmentId }[]>([]);
    const navigate = useNavigate();

    const [selectedItem, setSelectedItem] = React.useState<string>('dashboard');

    React.useEffect(() => {
        axios.get('http://localhost:5555/departments').then((res) => {
            setDepartments(res.data);
        });
    }, [])
    const img = logo.default;

    return <> <Toolbar
        sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            px: [1],
        }}
    >
        <img src={img} style={{ width: '100%', height: '100%' }}></img>
    </Toolbar>
        <Divider />
        <List component="nav" dense={true} style={{ backgroundColor: 'black', color: '#fff', height: '100%' }}>
            <React.Fragment>
                <ListItemButton selected={selectedItem === 'dashboard'} onClick={() => { setSelectedItem('dashboard'); navigate("/criteria/dashboard"); }}>
                    <ListItemIcon sx={{ color: '#fff' }}>
                        <DashboardIcon />
                    </ListItemIcon>
                    <ListItemText primary="Dashboard" />
                </ListItemButton>
                {departments.map((m) => (
                    <ListItemButton color='primary' selected={selectedItem === m.departmentId} onClick={() => { setSelectedItem(m.departmentId); navigate(`/criteria/${m.departmentId}`); }}>
                        <ListItemIcon>
                            <BarChartIcon sx={{ color: '#fff' }} />
                        </ListItemIcon>
                        <ListItemText primary={m.departmentName} />
                    </ListItemButton>
                ))}


                <ListItemButton>
                    <ListItemIcon sx={{ color: '#fff' }}>
                        <SettingsSuggest />
                    </ListItemIcon>
                    <ListItemText primary="Settings" />
                </ListItemButton>
            </React.Fragment>
        </List>
    </>
}
