export class MainClassificationtTitleDetailesModel {
  id: string;
  title: string;
  titleEn: string;
  titleDescription: string;
  titleDescriptionEn: string;
  mainClassificationDescription: string;
  mainClassificationDescriptionEn: string;
  catalogDescription: string;
  catalogDescriptionEn: string;
  categoryDescription: string;
  categoryDescriptionEn: string;
  itemDescription: string;
  itemDescriptionEn: string;
  subjectDescription: string;
  subjectDescriptionEn: string;
  serviceType: number;
  mainClassificationId: string | null;

  constructor(
    id: string = "",
    title: string = "",
    titleDescription: string = "",
    mainClassificationDescription: string = "",
    catalogDescription: string = "",
    categoryDescription: string = "",
    itemDescription: string = "",
    subjectDescription: string = "",
    titleEn: string = "",
    titleDescriptionEn: string = "",
    mainClassificationDescriptionEn: string = "",
    catalogDescriptionEn: string = "",
    categoryDescriptionEn: string = "",
    itemDescriptionEn: string = "",
    subjectDescriptionEn: string = "",
    serviceType: number = 0,
    mainClassificationId: null | string = ""
  ) {
    this.id = id;
    this.title = title;
    this.titleDescription = titleDescription;
    this.mainClassificationDescription = mainClassificationDescription;
    this.catalogDescription = catalogDescription;
    this.categoryDescription = categoryDescription;
    this.itemDescription = itemDescription;
    this.subjectDescription = subjectDescription;
    this.serviceType = serviceType;
    this.mainClassificationId = mainClassificationId;
    this.titleEn = titleEn;
    this.titleDescriptionEn = titleDescriptionEn;
    this.mainClassificationDescriptionEn = mainClassificationDescriptionEn;
    this.catalogDescriptionEn = catalogDescriptionEn;
    this.categoryDescriptionEn = categoryDescriptionEn;
    this.itemDescriptionEn = itemDescriptionEn;
    this.subjectDescriptionEn = subjectDescriptionEn;
  }
}
