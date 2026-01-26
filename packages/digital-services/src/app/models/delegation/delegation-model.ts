import { delegationRolePermissionModel } from "./delegation-role-permission-model";

export class delegationModel {
  constructor(
    public id:string,
    public userDelegationCreator: string,
    public delegeatedUserId: string,
    public userName: string,
    public firstName: string,
    public secondName: string,
    public thirdName: string,
    public forthName: string,
    public email: string,
    public phoneNumber: string,
    public startDate: Date,
    public endDate: Date,
    public state: number,
    public isActive: boolean,
    public jobNameAr: string,
    public jobNameEn: string,
    public imageUrl: string,
    public delegationRolePermessionsDTO: delegationRolePermissionModel[],
    public isApproved:boolean,
    public approvedNotes:string

  ) { }
}
export class Delegation {
  constructor(
    public id: string,
    public startDate: Date,
    public endDate: Date,
    public isActive: boolean,
    public isApprovedTo: boolean | null,
    public approvedToNotes: string | null,
    public isApprovedFrom: boolean | null,
    public approvedFromNotes: string | null,
    public fromAdmin: boolean,
    public delegeatedToUserId: string,
    public delegeatedFromUserId: string,
    public fullNameTo: string,
    public fullNameFrom: string,
    public userNameTo: string,
    public emailTo: string,
    public phoneNumberTo: string,
    public jobNameArTo: string | null,
    public jobNameEnTo: string | null,
    public userNameFrom: string,
    public emailFrom: string,
    public phoneNumberFrom: string,
    public jobNameArFrom: string | null,
    public jobNameEnFrom: string | null,
    public imageUrlTo: string,
    public imageUrlFrom: string,
    public statusFrom:number,
    public statusTo:number
  ) {}
}

