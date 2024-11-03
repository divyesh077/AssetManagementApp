import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetFilterOptionsComponent } from './asset-filter-options.component';

describe('AssetFilterOptionsComponent', () => {
  let component: AssetFilterOptionsComponent;
  let fixture: ComponentFixture<AssetFilterOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssetFilterOptionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetFilterOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
