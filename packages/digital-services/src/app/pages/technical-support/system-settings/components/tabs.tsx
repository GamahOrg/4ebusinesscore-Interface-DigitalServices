import { Nav, Row, Tab } from "react-bootstrap/";
import { useIntl } from "react-intl";
import { SystemNotifications } from "./SystemNotifications";

export const Tabs = () => {
  const intl = useIntl();

  return (
    <>
      <div
        className="d-flex flex-column-fluid align-items-start container-xxl p-0"
      >
        <div className="content flex-row-fluid" id="kt_content">
          <div
            className="flex-lg-row-fluid"
            data-select2-id="select2-data-129-tmo1"
          >
            <div className="card mb-5 mb-xl-8 position-relative">
              <div className="card-body pb-3 pt-6">
                <Tab.Container
                  id="left-tabs-example"
                  defaultActiveKey="NotificationsSettings"
                >
                  <Row>
                    <Nav variant="underline" className="standard">
                      <p className="fw-bolder fs-4">
                        {intl.formatMessage({ id: "NotificationsSettings" })}
                      </p>
                    </Nav>
                    <Tab.Content>
                      <Tab.Pane eventKey="NotificationsSettings">
                        <SystemNotifications />
                      </Tab.Pane>
                    </Tab.Content>
                  </Row>
                </Tab.Container>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
