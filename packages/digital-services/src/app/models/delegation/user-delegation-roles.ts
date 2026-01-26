export class userDelegationRolesModel {
   rolePermissionId: string
   roleId: string
   roleNameAr: string
   roleNameEn: string
   permissionId: string
   permissionNameAr: string
   permissionNameEn: string
   isChecked:boolean
  constructor(
     rolePermissionId: string,
     roleId: string,
     roleNameAr: string,
     roleNameEn: string,
     permissionId: string,
     permissionNameAr: string,
     permissionNameEn: string,
     isChecked:boolean
  ) { 
   this.rolePermissionId=rolePermissionId
   this.roleId=roleId
   this.roleNameAr=roleNameAr
   this.roleNameEn=roleNameEn
   this.permissionId=permissionId
   this.permissionNameAr=permissionNameAr
   this.permissionNameEn=permissionNameEn
   this.isChecked = isChecked
  }
}