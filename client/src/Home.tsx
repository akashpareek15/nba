import MuiAppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { ThemeProvider, createTheme, styled } from '@mui/material/styles';


import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { NavigationPanel } from './NavigationPanel';

const Copyright = () => {
    return (
        <Typography variant="body2" sx={{ pt: 4 }} color="text.secondary" align="center" >
            {'Copyright © '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const drawerWidth: number = 240;

const AppBar = styled(MuiAppBar)(({ theme }) => ({
    zIndex: theme.zIndex.drawer + 1,
    ...({
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
    }),
}));

const Drawer = styled(MuiDrawer)(
    () => ({
        '& .MuiDrawer-paper': {
            position: 'relative',
            whiteSpace: 'nowrap',
            width: drawerWidth,
            boxSizing: 'border-box',
        },
    }),
);

const defaultTheme = createTheme();
export const Home = () => {
    return (
        <ThemeProvider theme={defaultTheme}>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <AppBar position="absolute" sx={{ backgroundColor: '#fff', color: '#000' }} >
                    <Header></Header>
                </AppBar>
                <Drawer variant="permanent" style={{ backgroundColor: 'black', color: '#fff' }}>
                    <NavigationPanel />
                </Drawer>
                <Box sx={{
                    display: 'flex', flexDirection: 'column', height: '100vh', width: '100%', backgroundColor: (theme) =>
                        theme.palette.mode === 'light'
                            ? theme.palette.grey[100]
                            : theme.palette.grey[900],
                }}>
                    <Toolbar />
                    <Box
                        component="main"
                        sx={{
                            backgroundColor: (theme) =>
                                theme.palette.mode === 'light'
                                    ? theme.palette.grey[100]
                                    : theme.palette.grey[900],
                            flexGrow: 1,

                            overflow: 'auto',
                        }}
                    >


                        <Container sx={{ mt: 4, mb: 4, ml: 0 }} maxWidth={false}>
                            <Outlet></Outlet>
                        </Container>


                    </Box>
                    <Copyright />
                </Box>
            </Box>

        </ThemeProvider>
    );

}

