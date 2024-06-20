
import { BellOutlined } from '@ant-design/icons';
import { AccountCircleOutlined, MailOutlineOutlined } from '@mui/icons-material';
import SearchIcon from '@mui/icons-material/Search';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import Toolbar from '@mui/material/Toolbar';
import { alpha, styled } from '@mui/material/styles';
import { UserProfilePopup } from './UserProfilePopup';
import * as logo from './assets/logo.jpg';
import { useNavigate } from 'react-router-dom';

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
    },
}));
export const Header = () => {
    const img = logo.default;
    const navigate = useNavigate();

    return (
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <img onClick={() => navigate('/home/dashboard')} src={img} style={{ width: '300px', height: '50px', cursor: 'pointer' }}></img>
            {/* <Search sx={{ flexGrow: 1 }}>
                <SearchIconWrapper sx={{ flexGrow: 1 }}>
                    <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                    sx={{ flexGrow: 1 }}
                    inputProps={{ 'aria-label': 'search' }}
                />
            </Search> */}
            <Box sx={{ display: 'flex', gap: '5px' }}>
                {/* <IconButton size="medium" aria-label="show 4 new mails" color="inherit">
                    <Badge badgeContent={4} color="error">
                        <MailOutlineOutlined />
                    </Badge>
                </IconButton>
                <IconButton
                    size="medium"
                    color="inherit"
                >
                    <Badge badgeContent={17} color="primary">
                        <BellOutlined />
                    </Badge>
                </IconButton> */}

                {/* <IconButton
                    size="medium"
                    edge="end"
                    aria-label="account of current user"
                    aria-haspopup="true"
                    color="inherit"
                >
                    <AccountCircleOutlined />
                </IconButton> */}
                <UserProfilePopup></UserProfilePopup>
            </Box>
        </Toolbar>


    );
}
