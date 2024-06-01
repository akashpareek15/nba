import { Paper } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

export const Department = (props: { departmentId: number, departmentName: string, clickable?: boolean }) => {

  const params = useParams();
  const navigate = useNavigate();
  return (<Paper
    sx={{
      p: 2,
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      borderLeft: `5px solid  #${Math.random().toString(16).substring(10,6)}`
    }}
  >
    <div style={{ minHeight: 50, cursor: props.clickable ? 'pointer' : null }} onClick={() => { props.clickable && navigate(`/criteria/${params.criteriaId}/departments/${props.departmentId}/questions`); }}>
      <div>{props.departmentName}</div>
      <div>0</div>
    </div>
  </Paper>
  );
}
