import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CargoInterface } from './cargo-interface';

// Imports de Material y Angular
import { MatDialog } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LiveAnnouncer } from '@angular/cdk/a11y';

// Servicios y RxJS
import { CargoService } from '../../services/cargo';
import { of } from 'rxjs';

describe('CargoInterface', () => {
  let component: CargoInterface;
  let fixture: ComponentFixture<CargoInterface>;

  // 1. Espías
  let cargoServiceSpy: jasmine.SpyObj<CargoService>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let announcerSpy: jasmine.SpyObj<LiveAnnouncer>;

  // 2. Datos Falsos
  const mockCargos = [
    { id: 1, nombre_cargo: 'Administrador' },
    { id: 2, nombre_cargo: 'Supervisor' }
  ];

  beforeEach(async () => {
    // 3. Crear los espías
    cargoServiceSpy = jasmine.createSpyObj('CargoService', ['getCargo']);
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    announcerSpy = jasmine.createSpyObj('LiveAnnouncer', ['announce']);

    // 4. Configurar respuestas
    cargoServiceSpy.getCargo.and.returnValue(of(mockCargos));

    await TestBed.configureTestingModule({
      declarations: [CargoInterface],
      imports: [
        MatPaginatorModule,
        MatSortModule,
        MatTableModule,
        MatFormFieldModule,
        MatInputModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: CargoService, useValue: cargoServiceSpy },
        { provide: MatDialog, useValue: dialogSpy },
        { provide: LiveAnnouncer, useValue: announcerSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CargoInterface);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Dispara ngOnInit
  });

  // --- PRUEBA 1: Creación ---
  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  // --- PRUEBA 2: Carga de Datos ---
  it('debería cargar la lista de cargos al iniciar', () => {
    expect(cargoServiceSpy.getCargo).toHaveBeenCalled();
    expect(component.cargosDataSource.data.length).toBe(2);
    expect(component.cargosDataSource.data[0].nombre_cargo).toBe('Administrador');
  });

  // --- PRUEBA 3: Filtro ---
  it('debería filtrar la tabla por nombre de cargo', () => {
    // Simulamos escribir "Super"
    const event = { target: { value: 'Super' } } as unknown as Event;
    component.filtrar(event);

    expect(component.cargosDataSource.filter).toBe('super');
  });

  // --- PRUEBA 4: Abrir Modal ---
  it('debería abrir el diálogo para crear cargo', () => {
    // Simulamos que el diálogo devuelve algo al cerrarse (o null)
    const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of(true), close: null });
    dialogSpy.open.and.returnValue(dialogRefSpyObj);

    component.openCreatecargo();

    expect(dialogSpy.open).toHaveBeenCalled();
  });
});
