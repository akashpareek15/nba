import { useState } from "react";

import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import Popover from "@mui/material/Popover";
import { alpha } from "@mui/material/styles";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import { useNavigate } from "react-router-dom";
import { useUser } from "./useUser";

export const UserProfilePopup = () => {
  const [open, setOpen] = useState(null);
  const navigate = useNavigate();
  const { isAdmin } = useUser();

  const { loggedInUser } = useUser();
  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const openKeywordsUpdate = () => {
    navigate("/home/keywords");
  };

  const openDownloadPage = () => {
    navigate("/home/download");
  };

  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          width: 40,
          height: 40,
          color: "red",
          background: (theme) => alpha(theme.palette.grey[500], 0.08),
          ...(open && {
            background: (theme) =>
              `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
          }),
        }}
      >
        <Avatar
          src={""}
          sx={{
            width: 36,
            height: 36,
            fontSize: 14,
            color: (theme) => `${theme.palette.primary.main}`,
            border: (theme) => `solid 2px ${theme.palette.background.default}`,
          }}
        >
          {loggedInUser?.userName?.substring(0, 2)}
        </Avatar>
      </IconButton>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: {
            p: 0,
            mt: 1,
            ml: 0.75,
            width: 200,
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2 }}>
          <Typography variant="body2" sx={{ color: "text.secondary" }} noWrap>
            {loggedInUser?.userName}
          </Typography>
        </Box>
        <Divider sx={{ borderStyle: "dashed" }} />
        {isAdmin && (
          <MenuItem onClick={openKeywordsUpdate}>Update keywords</MenuItem>
        )}

        <MenuItem onClick={openDownloadPage}>Download</MenuItem>
        <MenuItem onClick={handleClose}>Profile</MenuItem>
        <Divider sx={{ borderStyle: "dashed", m: 0 }} />
        <MenuItem
          disableRipple
          disableTouchRipple
          onClick={() => {
            sessionStorage.removeItem("user");
            localStorage.removeItem("user");
            navigate("/login");
          }}
          sx={{ typography: "body2", color: "error.main", py: 1.5 }}
        >
          Logout
        </MenuItem>
      </Popover>
    </>
  );
};
