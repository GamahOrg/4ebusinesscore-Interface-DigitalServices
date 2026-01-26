import { object, string, InferType, number } from "yup";
export const serviceCatalogSchema = object({
  name: string().required("InputFieldIsRequried"),
  priority: number().positive("InputFieldIsRequried").required("InputFieldIsRequried").typeError("InputFieldIsRequried"),
  // icon: string().required("InputFieldIsRequried"),
  icon: string().required("InputFieldIsRequried").matches(/^(<svg\b[^>]*>(.*?)<\/svg>|<.*\b(class|className)\b.*>)$/, "InvalidIconFormat").typeError("InputFieldIsRequried"),
  color: string().required("InputFieldIsRequried").typeError("InputFieldIsRequried"),
  description: string().required("InputFieldIsRequried"),
  mainClassificationId: string().notRequired(),
  serviceType: number().positive("InputFieldIsRequried").notRequired().typeError("InputFieldIsRequried"),
  teamName: string().notRequired(),
});

export type serviceCatalogProps = InferType<typeof serviceCatalogSchema>;
