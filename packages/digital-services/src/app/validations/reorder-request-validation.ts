import { object, string, InferType, number, boolean } from "yup";
export const ReOrderRequestSchema = object({
  reason: string().required("InputFieldIsRequried").test("not-only-whitespace", "InputFieldIsRequried", (value) => {
      return value!.trim()?.length > 0;
    }),
  requestTimeLineStep:string().required("InputFieldIsRequried")
});

export type ReOrderRequestProps = InferType<
  typeof ReOrderRequestSchema
>;
