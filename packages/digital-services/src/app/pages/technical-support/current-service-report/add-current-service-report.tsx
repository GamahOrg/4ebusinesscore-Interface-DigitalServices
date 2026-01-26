import { Fragment, useState } from "react";
import AddCurrentReport from "./components/AddCurrentReport";
import { useLocation, useParams } from "react-router-dom";
import DynamicToolbar from "@4eplatform/shared/components/DynamicToolbar";
import { useIntl } from "react-intl";

function AddCurrentServiceReport() {
  const intl = useIntl();
  let location = useLocation();
  let params = useParams();
  let id = location?.state?.mainClassificationId || "";
  const filtered = location?.hash;
  const cardName = JSON.parse(localStorage.getItem("cardName") as string);
  const addLabel = intl.formatMessage({ id: "Add" });
  const fallback = intl.formatMessage({ id: "CurrentServiceReportt" });

  const titleName =
    intl.locale === "ar"
      ? cardName?.nameAr || fallback
      : cardName?.nameEn || fallback;

  const [pageTitle, setPageTitle] = useState(`${addLabel} ${titleName}`);

  const breadcrumbItems = id
    ? [
        {
          path: `/main-categories/${id}`,
          defaultName: "MainCategories",
          name: "",
        },
        {
          path: `/current-service-report/${params?.id && filtered ? id : ""}`,
          defaultName: "",
          name: intl.formatMessage({ id: "CurrentServiceReportt" }),
        },
        { path: "", defaultName: "AddCurrentReport", name: "" },
      ]
    : [
        {
          path: `/current-service-report/${id && filtered ? id : ""}`,
          defaultName: intl.formatMessage({ id: "CurrentServiceReportt" }),
          name: "",
        },
        { path: "", defaultName: "", name: `${pageTitle}` },
      ];
  return (
    <Fragment>
      <DynamicToolbar
        defaultTitle={intl.formatMessage({ id: "AddCurrentReport" })}
        extraTitle={pageTitle}
        breadcrumbItems={breadcrumbItems}
        showWorkspace={id ? false : true}
        translate={false}
      />
      <AddCurrentReport setPageTitle={setPageTitle} />
    </Fragment>
  );
}

export default AddCurrentServiceReport;
