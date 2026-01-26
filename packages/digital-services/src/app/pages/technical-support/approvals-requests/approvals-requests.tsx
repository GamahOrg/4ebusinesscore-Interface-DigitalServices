import DynamicToolbar from "@4eplatform/shared/components/DynamicToolbar";
import { FC } from "react";
import RequestsOutgoingTables from "./components/RequestsOutgoingTables";
import { useIntl } from "react-intl";

const RequestsOutgoing: FC = () => {
  const intl = useIntl();

  // Safely parse localStorage value
  const cardNameRaw = localStorage.getItem("cardName");
  let cardName: { nameAr?: string; nameEn?: string } | null = null;

  try {
    if (cardNameRaw) {
      cardName = JSON.parse(cardNameRaw);
    }
  } catch (err) {
    console.error("Invalid cardName in localStorage:", err);
    cardName = null;
  }

  // Pick correct language or fallback
  const defaultTitle =
    intl.locale === "ar"
      ? cardName?.nameAr ||
        intl.formatMessage({ id: "Incoming&OutgoingRequests" })
      : cardName?.nameEn ||
        intl.formatMessage({ id: "Incoming&OutgoingRequests" });

  const breadcrumbItems = [
    {
      path: "",
      defaultName: defaultTitle,
      name: defaultTitle,
    },
  ];

  return (
    <>
      <DynamicToolbar
        defaultTitle={defaultTitle}
        extraTitle=""
        breadcrumbItems={breadcrumbItems}
        showWorkspace={true}
        translate={false}
      />
      <RequestsOutgoingTables />
    </>
  );
};

export default RequestsOutgoing;
