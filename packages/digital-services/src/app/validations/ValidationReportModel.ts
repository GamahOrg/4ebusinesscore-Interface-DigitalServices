import { object, string, InferType, array, mixed, number } from "yup";
let arabicRegex =
  /^[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF0-9\s.,;:!?@#$%^&*()_\-+=\[\]{}<>"'`~?/\\|٪]+$/;
let englishRegex = /^[A-Za-z0-9\s.,;:!?@#$%^&*()_\-+=\[\]{}<>"'`~?/\\|]+$/;
export const validationReportModelSchema = object({
  ReportTitle: string()
    .required("InputFieldIsRequried")
    // .matches(arabicRegex, "NameMustBeInArabicLetters")
    .test("not-only-whitespace", "InputFieldIsRequried", (value) => {
      return value!.trim()?.length > 0;
    })
    .typeError("InputFieldIsRequried"),
  // ReportTitleEn: string()
  //   .test("not-only-whitespace", "InputFieldIsRequried", (value) => {
  //     return value!.trim()?.length > 0;
  //   })
  //   .required("InputFieldIsRequried")
  //   .matches(englishRegex, "NameMustBeInEnglishLetters")
  //   .typeError("InputFieldIsRequried"),
  CategoryId: string().required("InputFieldIsRequried"),
  // ItemId: mixed()
  // .test(
  //     "is-valid-id",
  //     "YouMustSelectOption",
  //     (value) =>
  //         (typeof value === "number" && value > -1) ||
  //         /^[0-9a-fA-F-]{36}$/.test(value)
  // )
  ItemId: string().required("InputFieldIsRequired"),
  ReportSubCategory: string(),
  requestUsers: mixed().typeError("InputFieldIsRequried"),
  SourceReports: array() || string() || null,
  MainClassificationId: string(),
  ServiceCatalogId: string(),
  TechnicianId: string(),
  RequesterForm: string(),
  ReportSubject: string()
    .required("InputFieldIsRequried")
    .test("not-only-whitespace", "InputFieldIsRequried", (value) => {
      return value!.trim()?.length > 0;
    })
    .typeError("InputFieldIsRequried"),
  integretedId: string(),
  serviceIntegration: number(),
});

export type reportModelProps = InferType<typeof validationReportModelSchema>;
