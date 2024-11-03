import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetAssignToEmployeeComponent } from './asset-assign-to-employee.component';

describe('AssetAssignToEmployeeComponent', () => {
  let component: AssetAssignToEmployeeComponent;
  let fixture: ComponentFixture<AssetAssignToEmployeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssetAssignToEmployeeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetAssignToEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
