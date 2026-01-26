export class OrgModel {
  id: string;
  nameAr: string;
  nameEn: string;
  description: string;
  parentId: string;
  managerId: string | null;
  organizationMembers: string[];
  categoryId: string;
  categoryNameAr: string;
  categoryNameEn: string;
  children: OrgModel[];
  categoryColor: string | null;
  constructor(
    id: string,
    nameAr: string,
    nameEn: string,
    description: string,
    parentId: string,
    managerId: string,
    organizationMembers: string[],
    categoryId: string,
    categoryNameAr: string,
    categoryNameEn: string,
    children: OrgModel[],
    categoryColor: string | null
  ) {
    this.id = id;
    this.nameAr = nameAr;
    this.nameEn = nameEn;
    this.description = description;
    this.parentId = parentId;
    this.managerId = managerId;
    this.organizationMembers = organizationMembers;
    this.categoryId = categoryId;
    this.categoryNameAr = categoryNameAr;
    this.categoryNameEn = categoryNameEn;
    this.children = children;
    this.categoryColor = categoryColor;
  }
}
