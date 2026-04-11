import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandProdComponent } from './brand-prod.component';

describe('BrandProdComponent', () => {
  let component: BrandProdComponent;
  let fixture: ComponentFixture<BrandProdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrandProdComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrandProdComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
