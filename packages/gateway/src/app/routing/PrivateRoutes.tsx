import { useState, useEffect, lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { MasterLayout } from "../../app/layout/MasterLayout";
import { Loader } from "@4eplatform/shared/src/components/loader";
import { PageNotFound } from "@4eplatform/shared/src/components/404";
import { digitalServicesLoadRoutes } from "../services/dynamicRoutes/digitalservicesLoadRoutes";
import { useIntl } from "react-intl";

const DynamicComponentsWrapper = lazy(
  () => import("./DynamicComponentsWrapper")
);

const PrivateRoutes = () => {
  const [components, setComponents] = useState<any>();
  let intl = useIntl();

  const fetchComponents = async () => {
    try {
      const loadedComponents = await digitalServicesLoadRoutes();
      setComponents(loadedComponents);
    } catch (error) {
      console.error("Error loading components:", error);
    }
  };

  useEffect(() => {
    fetchComponents();
  }, []);
  let languageData = intl.locale;
  useEffect(() => {
    document.documentElement.lang = languageData;
    document.documentElement.dir = languageData === "ar" ? "rtl" : "ltr";
  }, [languageData]);
  return (
    <Suspense
    // fallback={<Loader />}
    >
      <Routes>
        <Route element={<MasterLayout />}>
          <Route path="/loading" element={<Loader />} />
          <Route path="/404" element={<PageNotFound />} />
          {/* <Route index path="/" element={<Navigate to="/digital-services-workspace" />} /> */}
          <Route
            path="/*"
            element={<DynamicComponentsWrapper components={components} />}
          />
        </Route>
      </Routes>
    </Suspense>
  );
};

export { PrivateRoutes };
