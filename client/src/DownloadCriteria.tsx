import React, { useEffect } from "react";
import { useUser } from "./useUser";
import axios from "axios";
import { Questions } from "./Questions";
import { usePDF } from "react-to-pdf";
import { Button } from "@mui/material";

export const DownloadCriteria = () => {
  const { loggedInUser } = useUser();
  const { toPDF, targetRef } = usePDF({
    filename: `download.pdf`,
  });
  const [criteriaList, setCriteriaList] = React.useState<
    { criteriaName: string; criteriaId: string }[]
  >([]);
  useEffect(() => {
    if (loggedInUser?.departmentId) {
      if (loggedInUser) {
        axios
          .get(
            `http://localhost:5555/criteria/departments/${loggedInUser?.departmentId}/questions`
          )
          .then((res) => {
            setCriteriaList(res.data);
          });
      }
    }
  }, [loggedInUser?.departmentId]);

  return (
    <>
      <Button variant="contained" color="primary" onClick={() => toPDF()}>
        Generate PDF
      </Button>
      <div ref={targetRef}>
        {criteriaList.map((c) => {
          return (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
                marginBottom: 10,
              }}
            >
              <div
                style={{ alignSelf: "center", fontSize: 18, fontWeight: 600 }}
              >
                {c.criteriaName}
              </div>
              <Questions criteriaId={c.criteriaId} isDownload={true} />
            </div>
          );
        })}
      </div>
    </>
  );
};
