export const RenderControl = (props) => {
  return <>{props.isDownload ? <>{props.value} </> : <>{props.children}</>}</>;
};
