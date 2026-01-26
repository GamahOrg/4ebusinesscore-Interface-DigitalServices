export enum ResponseStatus {
  FailedToSave,
  SavedSuccessfully,
  Exception,
  Success,
  Failed,
  FailedToFindTheObject,
  AlreadyExisting,
}
export enum State {
  NotDeleted,
  Deleted,
}

export enum RequestStatus {
  Pinding,
  Rejected,
  Accepted,
  Cancel,
  ExceptionApproved
}
export enum Color {
  Red,
  Green,
  Yellow,
}
export enum RequestOutgoingStatus {
  Pinding = "Pinding",
  Pending = "Pending",
  Rejected = "Rejected",
  Accepted = "Accepted",
}
export enum OutgoingStatus {
  Pending,
  Accepted,
  Rejected,
}
