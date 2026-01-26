import { object, string, InferType, number, mixed } from "yup";
export const slaSchema = object({
  slaName: string()
    .required("InputFieldIsRequried")
    .matches(/^[\u0600-\u06FF\s@\-+=]+$/, "NameMustBeInArabicLetters")
    .test("not-only-whitespace", "InputFieldIsRequried", (value) => {
      return value!.trim()?.length > 0;
    }),
  // implementDays: number().required('InputFieldIsRequried').typeError("InputFieldIsRequried"),
  // implementHours: number().required('InputFieldIsRequried').typeError("InputFieldIsRequried"),
  // implementMinutes: number().required('InputFieldIsRequried').typeError("InputFieldIsRequried"),
  // respondMinutes: number().required('InputFieldIsRequried').typeError("InputFieldIsRequried"),
  // respondHours: number().required('InputFieldIsRequried').typeError("InputFieldIsRequried"),
  // respondDays:  number().required('InputFieldIsRequried').typeError("InputFieldIsRequried"),
  slaNameEn: string()
    .required("InputFieldIsRequried")
    .matches(/^[a-zA-Z\s@\-+=]+$/, "NameMustBeInEnglishLetters")
    .test("not-only-whitespace", "InputFieldIsRequried", (value) => {
      return value!.trim()?.length > 0;
    })
    .typeError("InputFieldIsRequried"),
  mainClassificationId: string().required("InputFieldIsRequried"),
  implementDays: number()
    .typeError("YouMustEnterNumbers")
    .integer("YouMustEnterIntegerNumbers"),
  implementHours: number()
    .typeError("YouMustEnterNumbers")
    .integer("YouMustEnterIntegerNumbers"),
  implementMinutes: number()
    .typeError("YouMustEnterNumbers")
    .integer("YouMustEnterIntegerNumbers"),
  respondMinutes: number()
    .typeError("YouMustEnterNumbers")
    .integer("YouMustEnterIntegerNumbers"),
  respondHours: number()
    .typeError("YouMustEnterNumbers")
    .integer("YouMustEnterIntegerNumbers"),
  respondDays: number()
    .typeError("YouMustEnterNumbers")
    .integer("YouMustEnterIntegerNumbers"),
  description: string().nullable().notRequired(),
  descriptionEn: string().nullable().notRequired(),
  status: number()
    .min(1, "InputFieldIsRequried")
    .required("InputFieldIsRequried"),
});

export type slaProps = InferType<typeof slaSchema>;
