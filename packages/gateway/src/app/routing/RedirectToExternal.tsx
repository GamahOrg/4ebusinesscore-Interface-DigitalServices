import { FC, useEffect } from "react";
const RedirectToExternal: FC<{ url: string }> = ({ url }) => {
  useEffect(() => {
    window.location.href = url;
  }, [url]);

  return null;
};
export default RedirectToExternal