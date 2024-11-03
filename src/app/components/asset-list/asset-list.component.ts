import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

import { BehaviorSubject, map, merge, startWith, switchMap } from 'rxjs';

import { MatTableModule, MatTable } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

import { Asset, FilterOptions } from '../../interfaces/asset';
import { AssetAssignToEmployeeData, ConfirmedDialogData } from '../../interfaces/dialog';
import { ApiResponse, Metadata } from '../../interfaces/api-response';

import { AssetsService } from '../../services/assets.service';
import { SnackBarService } from '../../services/snack-bar.service';
import { DialogService } from '../../services/dialog.service';
import { FormsModule } from '@angular/forms';
import { AssetFilterOptionsComponent } from '../asset-filter-options/asset-filter-options.component';


@Component({
  selector: 'app-asset-list',
  templateUrl: './asset-list.component.html',
  styleUrl: './asset-list.component.scss',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    RouterLinkActive,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatDialogModule,
    MatButtonToggleModule,
    AssetFilterOptionsComponent
  ]
})
export class AssetListComponent implements OnInit, AfterViewInit {
  // ViewChild decorators for Angular Material components
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // State variables
  assets: Asset[] = [];
  totalAssetsCount: number = 0;
  pageSizeOptions: number[] = [10, 20, 50];
  isLoading: boolean = true;
  isAssigningToEmployee: boolean = false;
  isRateLimitExceeded: boolean = false;
  filterStatus: string = '';
  filterOptions$: BehaviorSubject<FilterOptions> = new BehaviorSubject<FilterOptions>({});

  private router: Router = inject(Router);
  private dialogService: DialogService = inject(DialogService);
  private snackBarService: SnackBarService = inject(SnackBarService);
  private assetsService: AssetsService = inject(AssetsService);

  /** Columns displayed in the table. */
  displayedColumns: string[] = [
    'assetTag',
    'serialNumber',
    'category',
    'assetType',
    'model',
    'status',
    'assignTo',
    'info',
    'actions'
  ];

  ngOnInit(): void {
    // Initialization logic can be added here if needed
  }

  ngAfterViewInit(): void {
    this.initializeDataSource();
  }

  onChange() {
    this.paginator.pageIndex = 0;
    this.filterOptions$.next({ status: this.filterStatus });
  }
  /** 
 * Initializes the data source for the table and handles observable subscriptions.
 */
  private initializeDataSource() {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    // Merge filter options, sort changes, and paginator page changes into a single observable
    merge(this.filterOptions$, this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => this.fetchAssets()),
        map((result: { assets: Asset[], paginator: Metadata }) => {
          this.isLoading = false;
          this.totalAssetsCount = result.paginator.totalCount;
          return result.assets;
        })
      )
      .subscribe({
        next: (assets: Asset[]) => this.assets = assets,
        error: () => this.isLoading = false
      }
      )
  }

  /**
  * Fetches the assets from the service.
  * @returns An observable of the assets response.
  */
  private fetchAssets() {
    this.isLoading = true;
    return this.assetsService.getAllAssets(
      this.filterOptions$.value,
      this.sort.active,
      this.paginator.pageIndex + 1,
      this.paginator.pageSize
    );
  }

  /** 
   * Updates the filter options and resets the page index.
   */
  onFilterChange(): void {
    this.paginator.pageIndex = 0;
    this.filterOptions$.next({ status: this.filterStatus });
  }

  /**
   * Opens a dialog to assign an asset to an employee.
   * @param assetId The ID of the asset to assign.
   */
  onAssignTo(assetId: string): void {
    const dialogData: AssetAssignToEmployeeData = { assetId };
    const dialogRef = this.dialogService.openAssetAssignToEmployeeComponent(dialogData);

    dialogRef.beforeClosed().subscribe((employeeId: string) => {
      this.isAssigningToEmployee = !!employeeId;
    });

    dialogRef.afterClosed().subscribe((employeeId: string) => {
      if (employeeId) {
        this.assignAssetToEmployee(assetId, employeeId);
      } else {
        this.isAssigningToEmployee = false;
      }
    });
  }

  /**
   * Assigns an asset to an employee.
   * @param assetId The ID of the asset to assign.
   * @param employeeId The ID of the employee to assign the asset to.
   */
  private assignAssetToEmployee(assetId: string, employeeId: string): void {
    this.isAssigningToEmployee = true;
    this.assetsService.assignAssetToEmployee(assetId, employeeId)
      .subscribe({
        next: (response: ApiResponse) => {
          this.isAssigningToEmployee = false;
          this.snackBarService.openSuccessSnackBar(response.message);
        },
        error: () => this.isAssigningToEmployee = false // Handle error and stop assigning state
      });
  }

  /**
   * Navigates to the asset details view.
   * @param assetId The ID of the asset to view.
   */
  onViewAsset(assetId: string): void {
    this.router.navigate(['dashboard', 'assets', assetId]);
  }

  /**
   * Navigates to the asset edit view.
   * @param assetId The ID of the asset to edit.
   */
  onEditAsset(assetId: string): void {
    this.router.navigate(['dashboard', 'edit-asset', assetId]);
  }

  /**
   * Opens a confirmation dialog to delete an asset.
   * @param assetId The ID of the asset to delete.
   */
  onDeleteAsset(assetId: string): void {
    const dialogData: ConfirmedDialogData = {
      message: `Are you sure you want to delete the asset with ID ${assetId}?`
    };
    const dialogRef = this.dialogService.openConfirmedDialog(dialogData);

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.deleteAsset(assetId);
      }
    });
  }

  /**
   * Deletes an asset by its ID.
   * @param assetId The ID of the asset to delete.
   */
  private deleteAsset(assetId: string): void {
    this.assetsService.deleteAssetById(assetId)
      .subscribe({
        next: (response: ApiResponse) => this.snackBarService.openSuccessSnackBar(response.message),
      });
  }


  // onAssignTo(assetId: string) {
  //   const data: AssetAssignToEmployeeData = { assetId }
  //   const dialogRef = this.dialogService.openAssetAssignToEmployeeComponent(data);

  //   dialogRef.beforeClosed().subscribe((employeeId: string) => this.isAssigningToEmployee = employeeId ? true : false)
  //   dialogRef.afterClosed().subscribe((employeeId: string) => {
  //     if (employeeId) {
  //       this.isAssigningToEmployee = true;
  //       this.assetsService.assignAssetToEmployee(assetId, employeeId)
  //         .subscribe({
  //           next: (result: ApiResponse) => {
  //             this.isAssigningToEmployee = false;
  //             this.snackBarService.openSuccessSnackBar(result.message)
  //           },
  //           error: (() => this.isAssigningToEmployee = false)
  //         });
  //     }
  //     else {
  //       this.isAssigningToEmployee = false;
  //     }
  //   })
  // }

  // onViewAsset(assetId: string) {
  //   this.router.navigate(['dashboard', 'assets', assetId]);
  // }

  // onEditAsset(assetId: string) {
  //   this.router.navigate(['dashboard', 'edit-asset', assetId]);
  // }

  // onDeleteAsset(assetId: string) {
  //   const data: ConfirmedDialogData = {
  //     message: `Are you sure, you want delete the asset with assetId ${assetId}`
  //   }
  //   const dialogRef = this.dialogService.openConfirmedDialog(data);
  //   dialogRef.afterClosed()
  //     .subscribe((result: boolean) => {
  //       if (result === true) {
  //         this.assetsService.deleteAssetById(assetId)
  //           .subscribe({
  //             next: ((result: ApiResponse) => {
  //               this.snackBarService.openSuccessSnackBar(result.message);
  //             })
  //           });
  //       }
  //     })
  // }
}
