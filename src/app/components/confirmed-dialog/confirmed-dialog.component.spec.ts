import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmedDialogComponent } from './confirmed-dialog.component';

describe('ConfirmedDialogComponent', () => {
  let component: ConfirmedDialogComponent;
  let fixture: ComponentFixture<ConfirmedDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmedDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmedDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
