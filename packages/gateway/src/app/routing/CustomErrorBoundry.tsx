import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary";
import Swal from "sweetalert2";
// import { useIntl } from "react-intl";

const ErrorFallback = ({ error, resetErrorBoundary }: any) => {
  //   let intl = useIntl();
  Swal.fire({
    icon: "error",
    title:
      localStorage.getItem("selectedLang")?.toLowerCase() == "ar"
        ? "حدث خطا"
        : "An error occured",
    text:
      localStorage.getItem("selectedLang")?.toLowerCase() == "ar"
        ? "يرجي الرجوع لفريق الدعم"
        : "Please refer to support.",
    confirmButtonText:
      localStorage.getItem("selectedLang")?.toLowerCase() == "ar"
        ? "حاول مجددا في وقت لاحق"
        : "Try again later",
    allowOutsideClick: false,
  }).then((result) => {
    if (result?.isConfirmed) {
      window.location.href = `${
        (window as any)._env_?.REACT_APP_Base_Url
      }/home-workspace`;
    } else {
    }
    // window.location.href="/home-workspace"
  });

  return null;
};

const CustomErrorBoundary: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <ReactErrorBoundary FallbackComponent={ErrorFallback} onReset={() => {}}>
    {children}
  </ReactErrorBoundary>
);

export default CustomErrorBoundary;
