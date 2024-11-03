export interface Category {
  _id: string,
  category: string
}
export interface AssetType {
  _id: string,
  name: string
}

export interface AssetTypesByCategory {
  categoryId: string,
  categoryName: string,
  assetTypes: AssetType[]
}

interface User {
  _id: string,
  userNumber: number,
  username: string
}

interface WarrantyInfo {
  provider?: string;
  start?: Date;
  end?: Date;
}

export interface MaintenanceLog {
  description: string;
  cost: number;
  date: Date;
}

export interface Asset {
  _id?: string,
  assetTag: string;
  category: Category;
  assetType?: AssetType
  description: string;
  location: 'Baroda Office' | 'Abingdon Office' | 'other';
  status: 'active' | 'inactive' | 'maintenance' | 'disposed';
  acquisitionDate: Date;
  purchaseCost: number;
  currentValue: number;
  depreciationRate: number;
  serialNumber?: string;
  model?: string;
  manufacturer?: string;
  assignedTo?: User | null;
  assignedDate?: Date | null;
  warrantyInfo?: WarrantyInfo
  purchaseOrderNumber?: string;
  serviceTag?: string;
  notes?: string;
  createdBy: User;
  updatedBy: User;
  maintenanceLogs: MaintenanceLog[];
}

export interface FilterOptions {
  [key: string]: string
}