import { Asset } from "./asset"

export interface ApiResponse {
  status: boolean,
  message: string,
  statusCode: number,
  data: any,
  error: null
}

export interface Metadata {
  totalPage: number,
  totalCount: number,
  page: number,
  prePage: number | null,
  nextPage: number | null,
}
export interface AssetsResponse extends ApiResponse {
  data: {
    assets: Asset[],
    metadata: Metadata
  }
}