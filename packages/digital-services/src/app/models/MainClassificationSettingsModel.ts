export class MainClassificationSettingsModel {
  catalogDescription: string;
  categoryDescription: string;
  id: string;
  itemDescription: string;
  mainClassificationDescription: string;
  mainClassificationId: string;
  serviceType: number;
  subjectDescription: string;
  title: string;
  titleDescription: string;

  constructor(
    catalogDescription: string = "",
    categoryDescription: string = "",
    id: string = "",
    itemDescription: string = "",
    mainClassificationDescription: string = "",
    mainClassificationId: string = "",
    serviceType: number = 0,
    subjectDescription: string = "",
    title: string = "",
    titleDescription: string = ""
  ) {
    this.catalogDescription = catalogDescription;
    this.categoryDescription = categoryDescription;
    this.id = id;
    this.itemDescription = itemDescription;
    this.mainClassificationDescription = mainClassificationDescription;
    this.mainClassificationId = mainClassificationId;
    this.serviceType = serviceType;
    this.subjectDescription = subjectDescription;
    this.title = title;
    this.titleDescription = titleDescription;
  }
}
