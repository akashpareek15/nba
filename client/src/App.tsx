import { ThemeProvider, createTheme } from '@mui/material/styles';
import { AppRoutes } from './AppRoutes';
import { Outlet } from 'react-router-dom';

const defaultTheme = createTheme();
const App = () => {



  return (
    <ThemeProvider theme={defaultTheme}>
      <AppRoutes></AppRoutes>

    </ThemeProvider>
  );

}

export default App
