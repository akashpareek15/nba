import { Card, CardContent, LinearProgress, Stack, Typography } from "@mui/material";

export const Department = (props: { departmentId: number, departmentName: string, total: number, submittedCriteria: number, criteriaCount: number }) => {
  return (
    <>
      <Card sx={{ borderLeft: `5px solid  ${props.criteriaCount === props.submittedCriteria ? 'green' : props.total > 0 ? 'orange' : 'red'}` }}>
        <CardContent>
          <Stack spacing={2}>
            <Stack direction="row" sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }} spacing={3}>
              <Stack spacing={1} sx={{ width: '100%' }}>
                <Typography color="text.secondary" gutterBottom variant="overline">
                  {props.departmentName}
                </Typography>
                <Typography variant="caption" >
                  <Stack direction="row" sx={{ justifyContent: 'space-between', width: '100%' }} >
                    <div>{(props.submittedCriteria ?? 0)}/{props.criteriaCount} Criteria Submitted</div>
                    <div>{props.total ?? 0}Marks</div>
                  </Stack>
                </Typography>

              </Stack>

            </Stack>
            <div>
              <LinearProgress value={(props.submittedCriteria ?? 0) * props.criteriaCount} variant="determinate" />
            </div>
          </Stack>
        </CardContent>
      </Card >
    </>
  );
}
