import MuiAppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { ThemeProvider, createTheme, styled } from '@mui/material/styles';


import { Header } from './Header';
import { NavigationPanel } from './NavigationPanel';
import { AppRoutes } from './AppRoutes';

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
const App = () => {



  return (
    <ThemeProvider theme={defaultTheme}>
      <AppRoutes></AppRoutes>

    </ThemeProvider>
  );

}

export default App
