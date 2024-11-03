import { Component, inject, OnInit } from '@angular/core';
import { AsyncPipe, NgFor, NgForOf } from '@angular/common';

import { ReactiveFormsModule, FormBuilder, Validators, FormGroup, FormControl, FormArray } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';


import { Asset, AssetType, Category, MaintenanceLog } from '../../interfaces/asset';

import { AssetsService } from '../../services/assets.service';
import { SelectOptions } from '../../interfaces/select-options';
import { ActivatedRoute, ParamMap, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-add-edit-asset',
  templateUrl: './add-edit-asset.component.html',
  styleUrl: './add-edit-asset.component.scss',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    AsyncPipe,
    RouterLink,
    RouterLinkActive,
    NgFor,
    NgForOf,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatRadioModule,
    MatCardModule,
    MatIconModule,
    MatDatepickerModule,
    MatProgressSpinnerModule,
    MatProgressBarModule
  ]
})
export class AddEditAssetComponent implements OnInit {
  private mode: 'new' | 'edit' = 'new';
  private selectedAssetId: string | null = null;
  private selectedAsset: Asset | null = null;

  assetForm!: FormGroup;

  isLoadingResults: boolean = true;
  assetCategories: Category[] = [];
  assetTypes: AssetType[] = [];
  statuses: SelectOptions[] = [];
  locations: SelectOptions[] = [];

  //Services initlization.
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private assetsService: AssetsService = inject(AssetsService);

  constructor() {
    this.initLoadingData();
  };

  ngOnInit(): void {
    this.assetForm = this.initAssetForm();
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.selectedAssetId = params.get('assetId');
      if (this.selectedAssetId) {
        this.mode = 'edit';
        this.isLoadingResults = true;
        this.assetsService.getAssetById(this.selectedAssetId).subscribe((asset: Asset) => {
          this.isLoadingResults = false;
          this.selectedAsset = asset;
          this.assetForm = this.initAssetForm();
          this.setAssetTypesByCategoryId(this.getAssetFormControl('category').value)
        })
      }
      else {
        this.isLoadingResults = false;
        this.mode = 'new';
        this.selectedAsset = null;
      }
    })
    this.getAssetFormControl('category').valueChanges
      .subscribe((selectedCategoryId: string) => {
        this.setAssetTypesByCategoryId(selectedCategoryId)
      })
  }

  private initLoadingData() {
    this.statuses = this.assetsService.getAssetStatuses();
    this.locations = this.assetsService.getLocations();
    this.setAssetCategories();
  }
  onSubmit(): void {
    console.log(this.assetForm)
  }

  private initAssetForm() {
    if (this.mode === 'edit') {
      return this.fb.group({
        assetTag: [this.selectedAsset?.assetTag, Validators.required],
        category: [this.selectedAsset?.category, Validators.required],
        assetType: [this.selectedAsset?.assetType, Validators.required],
        description: [this.selectedAsset?.description, Validators.required],
        serialNumber: [this.selectedAsset?.serialNumber, Validators.required],
        location: [this.selectedAsset?.location, Validators.required],
        status: [this.selectedAsset?.status, Validators.required],
        purchaseOrderNumber: [this.selectedAsset?.purchaseOrderNumber, Validators.required],
        purchaseCost: [this.selectedAsset?.purchaseCost, Validators.required],
        currentValue: [this.selectedAsset?.currentValue],
        acquisitionDate: [this.selectedAsset?.acquisitionDate],
        depreciationRate: [this.selectedAsset?.depreciationRate, Validators.required],
        model: [this.selectedAsset?.model, Validators.required],
        manufacturer: [this.selectedAsset?.manufacturer, Validators.required],
        warrantyInfo: this.fb.group({
          provider: [this.selectedAsset?.warrantyInfo?.provider, Validators.required],
          start: [this.selectedAsset?.warrantyInfo?.start],
          end: [this.selectedAsset?.warrantyInfo?.end]
        }),
        serviceTag: [this.selectedAsset?.serviceTag, Validators.required],
        notes: [this.selectedAsset?.notes, Validators.required],
        assignedTo: [this.selectedAsset?.assignedTo],
        assignedDate: [this.selectedAsset?.assignedDate],
        maintenanceLogs: this.fb.array(this.selectedAsset?.maintenanceLogs.map((maintenanceLog: MaintenanceLog) => {
          return this.fb.group({
            description: [maintenanceLog.description],
            cost: [maintenanceLog.cost],
            date: [maintenanceLog.date]
          })
        }) || [])
      });
    }
    else {
      return this.fb.group({
        assetTag: [null, Validators.required],
        category: [null, Validators.required],
        assetType: [null, Validators.required],
        description: [null, Validators.required],
        serialNumber: [null, Validators.required],
        location: [null, Validators.required],
        status: [null, Validators.required],
        acquisitionDate: [null, Validators.required],
        purchaseCost: [null, Validators.required],
        purchaseOrderNumber: [null, Validators.required],
        currentValue: [null],
        depreciationRate: [null, Validators.required],
        model: [null, Validators.required],
        manufacturer: [null, Validators.required],
        assignedTo: [null],
        assignedDate: [null, Validators.required],
        warrantyInfo: this.fb.group({
          provider: [null, Validators.required],
          start: [null],
          end: [null]
        }),
        serviceTag: [null, Validators.required],
        notes: [null, Validators.required],
        maintenanceLogs: this.fb.array([])
      });
    }
  }

  // private createFormGroup(): FormGroup {
  //   if (this.mode === 'edit' && this.selectedAsset) {
  //     return this.fb.group({
  //       assetTag: [this.selectedAsset.assetTag, Validators.required],
  //       category: [this.selectedAsset.category, Validators.required],
  //       assetType: [this.selectedAsset.assetType, Validators.required],
  //       description: [this.selectedAsset.description, Validators.required],
  //       serialNumber: [this.selectedAsset.serialNumber, Validators.required],
  //       location: [this.selectedAsset.location, Validators.required],
  //       status: [this.selectedAsset.status, Validators.required],
  //       purchaseOrderNumber: [this.selectedAsset.purchaseOrderNumber, Validators.required],
  //       purchaseCost: [this.selectedAsset.purchaseCost, Validators.required],
  //       currentValue: [this.selectedAsset.currentValue],
  //       acquisitionDate: [this.selectedAsset.acquisitionDate],
  //       depreciationRate: [this.selectedAsset.depreciationRate, Validators.required],
  //       model: [this.selectedAsset.model, Validators.required],
  //       manufacturer: [this.selectedAsset.manufacturer, Validators.required],
  //       warrantyInfo: this.fb.group({
  //         provider: [this.selectedAsset.warrantyInfo?.provider, Validators.required],
  //         start: [this.selectedAsset.warrantyInfo?.start],
  //         end: [this.selectedAsset.warrantyInfo?.end]
  //       }),
  //       serviceTag: [this.selectedAsset.serviceTag, Validators.required],
  //       notes: [this.selectedAsset.notes, Validators.required],
  //       assignedTo: [this.selectedAsset.assignedTo],
  //       assignedDate: [this.selectedAsset.assignedDate],
  //       maintenanceLogs: this.fb.array(this.selectedAsset.maintenanceLogs.map(log => this.fb.group({
  //         description: [log.description],
  //         cost: [log.cost],
  //         date: [log.date]
  //       })) || [])
  //     });
  //   } else {
  //     return this.fb.group({
  //       assetTag: [null, Validators.required],
  //       category: [null, Validators.required],
  //       assetType: [null, Validators.required],
  //       description: [null, Validators.required],
  //       serialNumber: [null, Validators.required],
  //       location: [null, Validators.required],
  //       status: [null, Validators.required],
  //       acquisitionDate: [null, Validators.required],
  //       purchaseCost: [null, Validators.required],
  //       purchaseOrderNumber: [null, Validators.required],
  //       currentValue: [null],
  //       depreciationRate: [null, Validators.required],
  //       model: [null, Validators.required],
  //       manufacturer: [null, Validators.required],
  //       assignedTo: [null],
  //       assignedDate: [null],
  //       warrantyInfo: this.fb.group({
  //         provider: [null, Validators.required],
  //         start: [null],
  //         end: [null]
  //       }),
  //       serviceTag: [null, Validators.required],
  //       notes: [null, Validators.required],
  //       maintenanceLogs: this.fb.array([])
  //     });
  //   }
  // }

  getAssetFormControl(controlName: string): FormControl {
    return this.assetForm.get(controlName) as FormControl;
  }

  get maintenanceLogs() {
    return this.assetForm.get('maintenanceLogs') as FormArray;
  }

  onAddMaintenanceLogs() {
    const maintenanceLogToAdd = this.fb.group({
      description: [null, Validators.required],
      cost: [0, Validators.required],
      date: []
    });

    this.maintenanceLogs.push(maintenanceLogToAdd);
  }

  onRemoveMaintenanceLog(index: number) {
    this.maintenanceLogs.removeAt(index);
  }

  private setAssetCategories() {
    this.assetsService.getAllAssetCategory()
      .subscribe((assetCategories: Category[]) => {
        this.assetCategories = assetCategories;
      });
  }

  private setAssetTypesByCategoryId(categoryId: string): void {
    if (categoryId) {
      this.assetsService.getAssetTypesByCategoryId(categoryId).subscribe((types: AssetType[]) => {
        this.assetTypes = types;

        const assetTypeControl = this.getAssetFormControl('assetType');

        // Ensure assetType is reset if the current value is not valid
        if (!types.some(type => type._id === assetTypeControl.value)) {
          assetTypeControl.reset();
        }
      });
    } else {
      this.assetTypes = [];
      this.getAssetFormControl('assetType').reset();
    }
  }

}
