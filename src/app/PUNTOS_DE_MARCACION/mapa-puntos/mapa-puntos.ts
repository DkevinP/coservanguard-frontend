// src/app/PUNTOS_DE_MARCACION/mapa-puntos/mapa-puntos.component.ts
import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { forkJoin, of, Subscription } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import * as L from 'leaflet'; // Importamos todo Leaflet

// Importamos los servicios existentes
import { ClienteService, Cliente } from '../../services/cliente';
import { SedeClienteService, SedeCliente } from '../../services/sede-cliente';
import { PuestoService, Puesto } from '../../services/puesto';
// Asumimos que tienes un CodigoQrService que ya extrae la localización, como mencionaste.
import { CodigoQrService, CodigoQR } from '../../services/codigosqr'; // Reemplaza por tu servicio real

@Component({
  selector: 'app-mapa-puntos',
  standalone: false,
  templateUrl: './mapa-puntos.html',
  styleUrls: ['./mapa-puntos.scss']
})
export class MapaPuntosComponent implements OnInit, AfterViewInit, OnDestroy {

  public filterForm: FormGroup;
  public clientes: Cliente[] = [];
  public sedesFiltradas: SedeCliente[] = [];
  public isLoadingMap = false;

  private map: L.Map | undefined;
  private markersLayer = new L.LayerGroup();
  private subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private clienteService: ClienteService,
    private sedeService: SedeClienteService,
    private puestoService: PuestoService,
    private qrService: CodigoQrService
  ) {
    this.filterForm = this.fb.group({
      idCliente: [null],
      idSede: [null]
    });
  }

  ngOnInit(): void {
    // 1. Cargar clientes inicialmente
    this.clienteService.getClientes().subscribe(data => this.clientes = data);

    // 2. Configurar el filtro dinámico de Sedes
    this.subscription.add(
      this.filterForm.get('idCliente')?.valueChanges.subscribe(idCliente => {
        this.filterForm.get('idSede')?.reset(); // Resetear sede al cambiar cliente
        this.clearMapMarkers();
        if (idCliente) {
          this.sedeService.getSedeClientes().subscribe(sedes => {
            this.sedesFiltradas = sedes.filter(s => s.id_cliente === idCliente);
          });
        } else {
          this.sedesFiltradas = [];
        }
      })
    );

    // 3. Reaccionar al cambio de Sede para cargar puntos
    this.subscription.add(
      this.filterForm.get('idSede')?.valueChanges.subscribe(idSede => {
        if (idSede) {
          this.cargarPuntosDeSede(idSede);
        } else {
          this.clearMapMarkers();
        }
      })
    );
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    if (this.map) {
      this.map.remove();
    }
  }

  private initMap(): void {
    // Coordenadas por defecto (ej. Centro de Bogotá o Colombia)
    const lat = 4.6097;
    const lng = -74.0817;
    const zoom = 12;

    this.map = L.map('map-container').setView([lat, lng], zoom);

    // Elegimos un estilo de mapa satelital que se parezca al de tu imagen (Esri Satellite)
    // No requiere claves de API.
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-E ink, and the GIS User Community'
    }).addTo(this.map);

    this.markersLayer.addTo(this.map);
  }

  private cargarPuntosDeSede(idSede: number): void {
    this.isLoadingMap = true;
    this.clearMapMarkers();

    // Cruzamos datos eficientemente (puestos de la sede -> codigos qr de esos puestos con localización)
    forkJoin({
      puestos: this.puestoService.getPuesto(),
      qrs: this.qrService.getCodigoQr() // Asumimos que este servicio trae las coordenadas lat/lng
    }).subscribe({
      next: (data) => {
        // Filtrar puestos de la sede seleccionada
        const puestosSede = data.puestos.filter(p => p.id_sede === idSede);

        // Crear un mapa para búsqueda rápida de nombres de puestos
        const puestosMap = new Map(puestosSede.map(p => [p.id, p.puesto]));

        // Filtrar QRs que correspondan a esos puestos y tengan localización
        const qrsSede = data.qrs.filter(qr =>
          puestosMap.has(qr.id_puesto) && qr.latitude && qr.longitude
        );

        this.addMarkersToMap(qrsSede, puestosMap);
        this.isLoadingMap = false;
      },
      error: (err) => {
        console.error('Error cargando puntos en el mapa:', err);
        this.isLoadingMap = false;
      }
    });
  }

  private addMarkersToMap(qrs: CodigoQR[], puestosMap: Map<number, string>): void {
    if (!this.map || qrs.length === 0) {
      // Si no hay puntos, centrar mapa en una ubicación por defecto o Bogotá
      this.map?.setView([4.6097, -74.0817], 12);
      return;
    }

    const bounds = L.latLngBounds([]); // Para ajustar la vista automáticamente

    // Usaremos CircleMarkers rojos para un look profesional que combine con Coservanguard
    qrs.forEach(qr => {
      const puestoNombre = puestosMap.get(qr.id_puesto) || 'Puesto Desconocido';

      const marker = L.circleMarker([qr.latitude, qr.longitude], {
        radius: 10,
        fillColor: '#C83832', // Rojo Coservanguard
        color: '#ffffff',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.7
      }).bindPopup(`<strong>${puestoNombre}</strong><br>Punto de Marcación QR`);

      this.markersLayer.addLayer(marker);
      bounds.extend([qr.latitude, qr.longitude]);
    });

    // Ajustar automáticamente la vista para mostrar todos los puntos
    this.map.fitBounds(bounds, { padding: [50, 50] });
  }

  private clearMapMarkers(): void {
    this.markersLayer.clearLayers();
  }
}
