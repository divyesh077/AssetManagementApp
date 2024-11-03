import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardAnalysisCardComponent } from './dashboard-analysis-card.component';

describe('DashboardAnalysisCardComponent', () => {
  let component: DashboardAnalysisCardComponent;
  let fixture: ComponentFixture<DashboardAnalysisCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardAnalysisCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardAnalysisCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
