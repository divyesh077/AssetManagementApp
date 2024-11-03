import { Component, inject, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { AssetsService } from '../../services/assets.service';
import { Asset } from '../../interfaces/asset';
import { ActivatedRoute, ParamMap, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatExpansionModule } from '@angular/material/expansion';
import { CurrencyPipe, DatePipe } from '@angular/common';
@Component({
  selector: 'app-asset-details',
  standalone: true,
  imports: [
    DatePipe,
    CurrencyPipe,
    RouterLink,
    MatButtonModule,
    MatProgressSpinner,
    MatIconModule,
    MatCardModule,
    MatGridListModule,
    MatExpansionModule
  ],
  templateUrl: './asset-details.component.html',
  styleUrl: './asset-details.component.scss'
})
export class AssetDetailsComponent implements OnInit {
  asset!: Asset;
  assetInfo: { label: string, value: string | number | Date | undefined }[] = [];
  isLoadingResults: boolean = true;
  private route: ActivatedRoute = inject(ActivatedRoute);
  private assetService: AssetsService = inject(AssetsService);
  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const assetId = params.get("assetId");
      if (assetId) {
        this.isLoadingResults = true;
        this.assetService.getAssetById(assetId)
          .subscribe((asset: Asset) => {
            this.isLoadingResults = false;
            this.asset = asset;
            this.setAssetInfo();
            console.log(this.assetInfo);
          });
      }
    })
  }

  private setAssetInfo(): void {
    if (this.asset) {
      this.assetInfo = [
        { label: 'Asset Tag', value: this.asset.assetTag },
        { label: 'Category', value: this.asset.category?.category },
        { label: 'Asset Type', value: this.asset.assetType?.name || 'N/A' },
        { label: 'Description', value: this.asset.description },
        { label: 'Location', value: this.asset.location },
        { label: 'Status', value: this.asset.status },
        { label: 'Acquisition Date', value: this.asset.acquisitionDate ? (this.asset.acquisitionDate) : 'N/A' },
        { label: 'Purchase Cost', value: this.asset.purchaseCost ? (this.asset.purchaseCost) : 'N/A' },
        { label: 'Current Value', value: this.asset.currentValue ? (this.asset.currentValue) : 'N/A' },
        { label: 'Depreciation Rate', value: this.asset.depreciationRate ? `${this.asset.depreciationRate}%` : 'N/A' },
        { label: 'Serial Number', value: this.asset.serialNumber || 'N/A' },
        { label: 'Model', value: this.asset.model || 'N/A' },
        { label: 'Manufacturer', value: this.asset.manufacturer || 'N/A' },
        { label: 'Assigned To', value: this.asset.assignedTo?.username || 'Unassigned' },
        { label: 'Assigned Date', value: this.asset.assignedDate ? (this.asset.assignedDate) : 'N/A' },
        { label: 'Purchase Order Number', value: this.asset.purchaseOrderNumber || 'N/A' },
        { label: 'Service Tag', value: this.asset.serviceTag || 'N/A' },
        { label: 'Notes', value: this.asset.notes || 'N/A' }
      ];
    };
  }
}
