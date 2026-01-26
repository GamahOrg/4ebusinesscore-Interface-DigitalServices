import { object, string, InferType, number } from "yup";
export const categorySchema = object({
  name: string().required("InputFieldIsRequried"),
  status: number().positive().required("InputFieldIsRequried").typeError("InputFieldIsRequried"),
  priority: number().positive("InputFieldIsRequried").required("InputFieldIsRequried").typeError("InputFieldIsRequried"),
  description: string().required("InputFieldIsRequried"),
  serviceType: number().positive("InputFieldIsRequried").notRequired().typeError("InputFieldIsRequried"),

});

export type categoryProps = InferType<typeof categorySchema>;
