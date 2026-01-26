import { object, string, InferType, number, boolean } from "yup";
export const AssignmentUserRequestSchema = object({
  requestType: boolean(),
  assignTo: string().when("requestType", {
    is: true,
    then: string().required("InputFieldIsRequried"),
  }),
  startDate: string().when("requestType", {
    is: true,
    then: string().required("InputFieldIsRequried"),
  }),
  // endDate: string().when("requestType", {
  //   is: true,
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
  endDate:string().notRequired(),
  description: string().when("requestType", {
    is: true,
    then: string().required("InputFieldIsRequried"),
  }),
});

export type AssignmentUserRequestProps = InferType<
  typeof AssignmentUserRequestSchema
>;
