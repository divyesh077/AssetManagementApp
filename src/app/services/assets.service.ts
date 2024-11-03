import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { ApiResponse, AssetsResponse, Metadata } from '../interfaces/api-response';
import { ApiErrorResponse } from '../interfaces/api-error-response';

import { Asset, AssetType, Category } from '../interfaces/asset';
import { SelectOptions } from '../interfaces/select-options';
import { UtilsService } from './utils.service';
import { SnackBarService } from './snack-bar.service';

const BASE_URL: string = `http://localhost:8080/api/v1`;

interface filterOptions {
  [key: string]: string
}

@Injectable({
  providedIn: 'root'
})
export class AssetsService {
  private http: HttpClient = inject(HttpClient);
  private statuses: SelectOptions[] = [
    {
      text: 'active',
      value: 'active'
    },
    {
      text: 'inactive',
      value: 'inactive'
    },
    {
      text: 'maintenance',
      value: 'maintenance'
    },
    {
      text: 'disposed',
      value: 'disposed'
    }
  ]
  private locations: SelectOptions[] = [
    {
      text: 'Baroda Office',
      value: 'Baroda Office'
    },
    {
      text: 'Abingdon Office',
      value: 'Abingdon Office'
    },
    {
      text: 'other',
      value: 'other'
    }
  ]

  private utilsService: UtilsService = inject(UtilsService);

  constructor() { }

  getAssetStatuses() {
    return this.statuses;
  }

  getLocations() {
    return this.locations;
  }

  getAllAssets(filterOptions: filterOptions, sort?: string, page?: number, limit?: number) {
    const urlOptions = this.utilsService.createURLOptions(filterOptions, sort, page, limit);
    const url = `${BASE_URL}/assets${urlOptions}`;

    return this.http.get<AssetsResponse>(url)
      .pipe(
        map((response: AssetsResponse) => {
          const assets: Asset[] = response.data.assets;
          const paginator: Metadata = response.data.metadata;
          return { assets, paginator };
        })
      )
  }

  getAssetById(assetId: string): Observable<Asset> {
    const url = `${BASE_URL}/assets/${assetId}`
    return this.http.get<ApiResponse>(url)
      .pipe(
        map((response: ApiResponse) => {
          return response.data?.asset as Asset
        })
      )
  }

  updateAssetById(assetId: string, assetDataToUpdate: Asset): Observable<ApiResponse | ApiErrorResponse> {
    const url = `${BASE_URL}/assets/${assetId}`
    const body = { ...assetDataToUpdate };
    const options = {};

    return this.http.put<ApiResponse | ApiErrorResponse>(url, body, options);
  }

  deleteAssetById(assetId: string): Observable<ApiResponse | ApiErrorResponse> {
    const url = `${BASE_URL}/assets/${assetId}`
    return this.http.delete<ApiResponse | ApiErrorResponse>(url);
  }

  getAllAssetCategory() {
    return this.http.get<ApiResponse>(`${BASE_URL}/asset-category`)
      .pipe(
        map((response: ApiResponse) => response.data?.assetCategory as Category[])
      )
  }

  getAssetTypesByCategoryId(categoryId: string) {
    return this.http
      .get<ApiResponse>(`${BASE_URL}/asset-types/by-categoryId/${categoryId}`)
      .pipe(
        map((response: ApiResponse) => response.data?.assetTypes as AssetType[])
      )
  }

  assignAssetToEmployee(assetId: string, employeeId: string | null): Observable<ApiResponse | ApiErrorResponse> {
    const url = `${BASE_URL}/assets/${assetId}`;
    return this.http.put<ApiResponse | ApiErrorResponse>(url, { assignedTo: employeeId })
  }

}
