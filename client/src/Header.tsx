import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import { useNavigate } from "react-router-dom";
import { UserProfilePopup } from "./UserProfilePopup";
import * as logo from "./assets/logo.jpg";

export const Header = () => {
  const img = logo.default;
  const navigate = useNavigate();

  return (
    <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
      <img
        onClick={() => navigate("/home/dashboard")}
        src={img}
        style={{ width: "300px", height: "50px", cursor: "pointer" }}
      ></img>

      <Box sx={{ display: "flex", gap: "5px" }}>
        <UserProfilePopup />
      </Box>
    </Toolbar>
  );
};
