import { object, string, InferType, number, mixed } from "yup";
export const itemSchema = object({
  name: string().required("InputFieldIsRequried"),
  duration: string().notRequired(),
  effect: mixed().notRequired().typeError("InputFieldIsRequried"),
  // effect: number().notRequired()
  //   .positive("InputFieldIsRequried")
  //   .required("InputFieldIsRequried")
  //   .typeError("InputFieldIsRequried"),
  priorityLevel: mixed().notRequired().typeError("InputFieldIsRequried"),
  // priorityLevel: number()
  //   .positive("InputFieldIsRequried")
  //   .required("InputFieldIsRequried")
  //   .typeError("InputFieldIsRequried"),
  description: string().required("InputFieldIsRequried"),
  slaId: string().required("InputFieldIsRequried"),
  serviceType: number()
    .positive("InputFieldIsRequried")
    .notRequired()
    .typeError("InputFieldIsRequried"),
  // categoryId: string().required("InputFieldIsRequried"),
  categoryId: string().notRequired(),
  // requestFor: number().positive("InputFieldIsRequried").notRequired().typeError("InputFieldIsRequried"),
  requestFor: number()
    .required("InputFieldIsRequried")
    .typeError("InputFieldIsRequried"),
  // technicianSelection: number().positive("InputFieldIsRequried").required("InputFieldIsRequried").typeError("InputFieldIsRequried"),
  technicianSelection: number().notRequired(),
  requestTempleteName: string().notRequired(),
  isIntegrated: string().notRequired().nullable(),
  workspaceServiceID: string().when("isIntegrated", {
    is: (value: any) => value === "yes",
    then: (schema) => schema.required("InputFieldIsRequried"),
    otherwise: (schema) => schema.notRequired().nullable(),
  }),
});
export type itemProps = InferType<typeof itemSchema>;
