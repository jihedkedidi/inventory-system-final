import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VariantDetailsComponent } from './variant-details.component';

describe('VariantDetailsComponent', () => {
  let component: VariantDetailsComponent;
  let fixture: ComponentFixture<VariantDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VariantDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VariantDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
