import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraficasMarcaciones } from './graficas-marcaciones';

describe('GraficasMarcaciones', () => {
  let component: GraficasMarcaciones;
  let fixture: ComponentFixture<GraficasMarcaciones>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GraficasMarcaciones]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GraficasMarcaciones);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
