import { object, string, InferType, number } from "yup";
export const RejectRequestSchema = object({
  comment: string()
    .required("InputFieldIsRequried")
    .test("not-only-whitespace", "InputFieldIsRequried", (value) => {
      return value!.trim()?.length > 0;
    }),
});

export type RejectRequestSchema = InferType<typeof RejectRequestSchema>;
