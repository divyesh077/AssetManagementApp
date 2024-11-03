interface AssetType {
  _id: string,
  assetType: string
}
export interface AssetTypesByCategories {
  categoryId: string,
  categoryName: string,
  assetTypes: AssetType[]
}
