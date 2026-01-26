import { Category } from "./CategoryModel";

export interface  ServiceCatalog{
    serviceCatalogId:string,
    serviceCatalogName:string,
    serviceCatalogNameEn:string,
    categoryInfo:[Category]
}


export interface  MainClassificationServiceCatalog{
    mainClassificationId:string,
    mainClassificationName:string,
    mainClassificationNameEn:string;
    serviceCatalogInfo:[ServiceCatalog]
}