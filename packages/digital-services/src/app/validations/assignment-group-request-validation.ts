import { object, string, InferType, number, boolean } from "yup";
export const AssignmentGroupRequestSchema = object({
  requestType: boolean(),
  manager: string().when("requestType", {
    is: false,
    then: string().required("InputFieldIsRequried"),
  }),
  startDate: string().when("requestType", {
    is: false,
    then: string().required("InputFieldIsRequried"),
  }),
  endDate:string().notRequired(),
  // endDate: string().when("requestType", {
  //   is: false,
  //   then: string().required("InputFieldIsRequried").typeError("InputFieldIsRequried")
  //   .test({
  //     name: "endDate",
  //     message: "EndDateMustBeEqualToOrGreaterThanStartDate",
  //     test: function (value: any) {
  //       const startDate: any = this.parent.startDate;
  //       return new Date(value) >= new Date();
  //     },
  //   }),
  // }),
  description: string().when("requestType", {
    is: false,
    then: string().required("InputFieldIsRequried"),
  }),
});

export type AssignmentGroupRequestProps = InferType<
  typeof AssignmentGroupRequestSchema
>;
