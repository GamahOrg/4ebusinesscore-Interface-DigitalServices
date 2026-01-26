import { object, string, InferType, number } from "yup";
export const requestTemplateSchema = object({
  name: string()
    .required("InputFieldIsRequried")
    .test("not-only-whitespace", "InputFieldIsRequried", (value) => {
      return value!.trim()?.length > 0;
    }),
  actionOptions: number(),
  requestCategoryId: string()
    .typeError("InputFieldIsRequried")
    .required("InputFieldIsRequried"),
  requestTypeId: string()
    .typeError("InputFieldIsRequried")
    .required("InputFieldIsRequried"),
  parentRequestTemplateId: string().typeError("InputFieldIsRequried"),
  numOfSteps: number().moreThan(0).typeError("InputFieldIsRequried"),
});

export type requestTemplateSchemaProps = InferType<
  typeof requestTemplateSchema
>;
