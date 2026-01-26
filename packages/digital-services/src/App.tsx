import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import { TechnicalSupportFeedbacksManager } from "./app/pages/technical-support/technical-support-feedback-manager/technical-support-feedbacks-manager";

import { TechnicalSupportServiceLevelAgreementDetails } from "./app/pages/technical-support/service-level-agreement/technical-support-service-level-agreement-details";
import TechnicalSupportServiceLevelAgreementDetailsSla from "./app/pages/technical-support/service-level-agreement/technical-support-service-level-agreement-details-sla";

import { NewServiceRequest } from "./app/pages/technical-support/new-service-request/new-service-request";
import { CurrentServiceReport } from "./app/pages/technical-support/current-service-report/current-service-report";
import { TechnicalSupportFeedbacksEmployee } from "./app/pages/technical-support/technical-support-feedback-employee/technical-support-feedbacks-Employee";
import { TechnicalSupportFeedbacksManagerDetails } from "./app/pages/technical-support/technical-support-feedback-manager/technical-support-feedbacks-manager-details";
import { TechnicalSupportFeedbacksEmployeeDetails } from "./app/pages/technical-support/technical-support-feedback-employee/technical-support-feedbacks-employee-details";
import { TechnicalReportsSolutions } from "./app/pages/technical-support/technical-reports-solutions/technical-reports-solutions";
import AddCurrentServiceReport from "./app/pages/technical-support/current-service-report/add-current-service-report";
import { TechnicalReportsSolutionsDetails } from "./app/pages/technical-support/technical-reports-solutions/technical-reports-solutions-details";
import { AddingNewSolutionToTechnicalSupportReports } from "./app/pages/technical-support/technical-reports-solutions/technical-reports-solutions-add-new-solution";
import { EditingSolutionToTechnicalSupportReports } from "./app/pages/technical-support/technical-reports-solutions/technical-reports-solutions-edit-solution";
import { TechnicalSupportFeedbacksAdminstrationManager } from "./app/pages/technical-support/technical-support-feedback-administration-manager/technical-support-feedbacks-manager";
import { TechnicalSupportFeedbacksAdministrationEmployee } from "./app/pages/technical-support/technical-support-feedback-administration-employee/technical-support-feedbacks-administration-employee";
import { TechnicalSupportFeedbacksAdministrationEmployeeDetails } from "./app/pages/technical-support/technical-support-feedback-administration-employee/technical-support-feedbacks-administration-employee-details";
import { TechnicalSupportFeedbacksAdminstrationManagerDetails } from "./app/pages/technical-support/technical-support-feedback-administration-manager/technical-support-feedbacks-manager-details";
import { Provider } from "react-redux";
import store from "./app/redux/store/store";
import { AddTechnicalAgreement } from "./app/pages/technical-support/service-level-agreement/components/AddTechnicalAgreement";
import { EditTechnicalAgreement } from "./app/pages/technical-support/service-level-agreement/components/EditTechnicalAgreement";
import { TechnicalSupportManagerDetails } from "./app/pages/technical-support/technical-support-feedback-manager/technical-support-manager-report-details";
import { TechnicalSupportAdministrationManagerDetails } from "./app/pages/technical-support/technical-support-feedback-administration-manager/tecnical-support-administration-manger-details";
import TechnicalSupportReportsV2 from "./app/pages/technical-support/technical-support-reportsV2/technical-support-reportsV2";
import ElectronicServicesPage from "./app/pages/technical-support/electronic-services/ElectronicServicesPage";
import { TechnicalSupportSystemSetttings } from "./app/pages/technical-support/system-settings/technical-support-system-setttings";
import DigitalServicesWorkspace from "./app/pages/technical-support/work-space/digital-services-workspace";
import { AddNewServiceRequest } from "./app/pages/technical-support/new-service-request/new-service-request-add-new-request";
import { ApprovalsRequestDetailsForOutgoingHome } from "./app/pages/technical-support/approvals-requests/approvals-outgoing-requests-details";
import { ApprovalsRequestDetailsForAssignedHome } from "./app/pages/technical-support/approvals-requests/approvals-assigned-requests-details";
import { ApprovalsRequestDetailsForIncomingHome } from "./app/pages/technical-support/approvals-requests/approvals-incoming-requests-details";
import { ApprovalsRequestDetailsForSuggestingHome } from "./app/pages/technical-support/approvals-requests/approval-suggesting-requests-details";
import RequestsOutgoing from "./app/pages/technical-support/approvals-requests/approvals-requests";
import { ApprovalsRequestDetailsForArchivingHome } from "./app/pages/technical-support/approvals-requests/approvals-archiving-requests-details";
import { ApprovalsRequestDetailsForCancelingHome } from "./app/pages/technical-support/approvals-requests/approvals-canceling-requests-details";
import { DynamicWorkSpace } from "@npm-react/react-redux-routing";

function App() {
  return (
    <Provider store={store}>
      <Routes>
        <Route path="/" element={<DynamicWorkSpace />} />
        <Route
          path="/technical-support-feedbacks"
          element={<TechnicalSupportFeedbacksManager />}
        />
        <Route
          path="/technical-support-feedbacks-manager/:id/details"
          element={<TechnicalSupportManagerDetails />}
        />
        <Route
          path="/technical-support-feedbacks-adminstration-manager/:id/details"
          element={<TechnicalSupportAdministrationManagerDetails />}
        />

        <Route
          path="/technical-support-service-level-agreement-details"
          element={<TechnicalSupportServiceLevelAgreementDetails />}
        />
        <Route
          path="/technical-support-service-level-agreement-details/technical-support-service-level-agreement-details-sla/:id"
          element={<TechnicalSupportServiceLevelAgreementDetailsSla />}
        />
        <Route
          path="/technical-support-service-level-agreement-details/addNewTechnicalAgreement"
          element={<AddTechnicalAgreement />}
        />
        <Route
          path="/technical-support-service-level-agreement-details/editTechnicalAgreement/:id"
          element={<EditTechnicalAgreement />}
        />
        <Route
          path="/technical-support-feedbacks-manager"
          element={<TechnicalSupportFeedbacksManager />}
        />
        <Route
          path="/technical-support-feedbacks-manager/:id/details"
          element={<TechnicalSupportFeedbacksManagerDetails />}
        />
        <Route
          path="/technical-support-feedbacks-Employee"
          element={<TechnicalSupportFeedbacksEmployee />}
        />
        <Route
          path="/technical-support-system-settings/:workspaceName"
          element={<TechnicalSupportSystemSetttings />}
        />
        <Route
          path="/technical-support-feedbacks-employee/:id/details"
          element={<TechnicalSupportFeedbacksEmployeeDetails />}
        />

        <Route
          path="/new-service-request/:id?"
          element={<NewServiceRequest />}
        />
        <Route
          path="/new-service-request/add-new-service/:id"
          element={<AddNewServiceRequest />}
        />

        <Route
          path="/current-service-report/:id?"
          element={<CurrentServiceReport />}
        />

        <Route
          path="/technical-reports-solutions/:classificationId?"
          element={<TechnicalReportsSolutions />}
        />
        <Route
          path="/current-service-report/add-current-service"
          element={<AddCurrentServiceReport />}
        />
        <Route
          path="/current-service-report/add-current-service/:id"
          element={<AddCurrentServiceReport />}
        />
        <Route
          path="/technical-reports-solutions/:id/details/:classificationId?"
          element={<TechnicalReportsSolutionsDetails />}
        />
        <Route
          path="/technical-reports-solutions/add-new-solution/:classificationId?"
          element={<AddingNewSolutionToTechnicalSupportReports />}
        />
        <Route
          path="technical-reports-solutions/:id/edit-solution/:classificationId?"
          element={<EditingSolutionToTechnicalSupportReports />}
        />
        <Route
          path="/technical-support-feedbacks-adminstration-manager"
          element={<TechnicalSupportFeedbacksAdminstrationManager />}
        />
        <Route
          path="/technical-support-feedbacks-administration-employee/:id?"
          element={<TechnicalSupportFeedbacksAdministrationEmployee />}
        />
        <Route
          path="/technical-support-feedbacks-administration-employee/:id/details"
          element={<TechnicalSupportFeedbacksAdministrationEmployeeDetails />}
        />
        <Route
          path="/technical-support-feedbacks-adminstration-manager/:id/details"
          element={<TechnicalSupportFeedbacksAdminstrationManagerDetails />}
        />
        <Route
          path="/technical-support-reportsv2"
          element={<TechnicalSupportReportsV2 />}
        />
        <Route
          path="/electronic-services-classifications"
          element={<ElectronicServicesPage />}
        />
        <Route
          path="/digital-services-workspace"
          element={<Navigate to={"/"} />}
        />
        {/* approval requests routes */}
        <Route
          path="/approvals-requests/:systemId?"
          element={<RequestsOutgoing />}
        />
        <Route
          path="/approvals-requests/:id/details-for-outgoing/:systemId?"
          element={<ApprovalsRequestDetailsForOutgoingHome />}
        />
        <Route
          path="/approvals-requests/:id/details-for-suggesting/:systemId?"
          element={<ApprovalsRequestDetailsForSuggestingHome />}
        />
        <Route
          path="/approvals-requests/:id/details-for-incoming/:systemId?"
          element={<ApprovalsRequestDetailsForIncomingHome />}
        />
        <Route
          path="/approvals-requests/:id/details-for-assign/:systemId?"
          element={<ApprovalsRequestDetailsForAssignedHome />}
        />
        <Route
          path="/approvals-requests/:id/details-for-archive/:systemId?"
          element={<ApprovalsRequestDetailsForArchivingHome />}
        />
        <Route
          path="/approvals-requests/:id/details-for-cancel/:systemId?"
          element={<ApprovalsRequestDetailsForCancelingHome />}
        />
      </Routes>
    </Provider>
  );
}

export default App;
