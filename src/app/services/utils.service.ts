import { Injectable } from '@angular/core';
import { FilterOptions } from '../interfaces/asset';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }

  createURLOptions(filterOptions: FilterOptions = {}, sort?: string, page?: number, limit?: number) {
    let url: string = '';
    const isFilterOptions = this.isEmptyObject(filterOptions);
    if (isFilterOptions) {
      Object.keys(filterOptions).forEach((key: string, index: number) => {
        const joinSymbol = (index === 0) ? '?' : '&';
        url = `${url}${joinSymbol}${key}=${filterOptions[key]}`;
      })
    }
    if (sort) {
      const joinSymbol = (isFilterOptions) ? '&' : '?';
      url = `${url}${joinSymbol}sort=${sort}`
    }
    if (page && limit) {
      const joinSymbol = (isFilterOptions) ? '&' : '?';
      url = `${url}${joinSymbol}page=${page}&limit=${limit}`;
    }
    return url;
  }

  isEmptyObject = (object: Object | undefined | null) => {
    return (
      object &&
      Object.keys(object).length !== 0 &&
      object.constructor === Object
    );
  }
}
