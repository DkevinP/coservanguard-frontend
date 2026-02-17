import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClienteInterface } from './cliente-interface'; // Asegúrate de que el nombre del archivo sea correcto
import { ClienteService } from '../../services/cliente';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { LiveAnnouncer } from '@angular/cdk/a11y';

describe('ClienteInterface', () => {
  let component: ClienteInterface;
  let fixture: ComponentFixture<ClienteInterface>;

  // 1. Preparamos los Espías (Mocks)
  let clienteServiceSpy: jasmine.SpyObj<ClienteService>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let announcerSpy: jasmine.SpyObj<LiveAnnouncer>;

  beforeEach(async () => {
    // Creamos objetos falsos con los métodos que usa el componente
    clienteServiceSpy = jasmine.createSpyObj('ClienteService', ['getClientes']);
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    announcerSpy = jasmine.createSpyObj('LiveAnnouncer', ['announce']);

    // Simulamos que getClientes devuelve una lista vacía por defecto
    clienteServiceSpy.getClientes.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      declarations: [ClienteInterface],
      imports: [
        // Importamos los módulos visuales que usa el HTML
        MatPaginatorModule,
        MatSortModule,
        MatTableModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        BrowserAnimationsModule
      ],
      providers: [
        // ¡Aquí está la magia!
        // Cuando el componente pida ClienteService, le damos el Spy.
        // Así NO necesitamos HttpClientModule ni internet.
        { provide: ClienteService, useValue: clienteServiceSpy },
        { provide: MatDialog, useValue: dialogSpy },
        { provide: LiveAnnouncer, useValue: announcerSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClienteInterface);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Dispara ngOnInit
  });

  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar los clientes al iniciar', () => {
    // Verificamos que se haya llamado al servicio en el ngOnInit
    expect(clienteServiceSpy.getClientes).toHaveBeenCalled();
  });
});
