import { Component, Inject, AfterViewInit, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import * as L from 'leaflet';
// Asegúrate de que la ruta de importación coincida con la ubicación de tu interfaz
import { MarcacionCombinada } from '../marcaciones-qr-realizadas/marcaciones-qr-realizadas';

@Component({
  selector: 'app-marcacion-detalle-dialog',
  standalone: false,
  templateUrl: './marcacion-detalle.html',
  styleUrls: ['./marcacion-detalle.scss']
})
export class MarcacionDetalleDialogComponent implements AfterViewInit, OnDestroy {
  private map: L.Map | undefined;

  constructor(
    public dialogRef: MatDialogRef<MarcacionDetalleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: MarcacionCombinada
  ) {}

  ngAfterViewInit(): void {
    this.initMap();
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }

  private initMap(): void {
    // Extraemos la latitud y longitud del string "lat, lng" que viene de la tabla
    const coords = this.data.ubicacion.split(',');
    const lat = parseFloat(coords[0].trim());
    const lng = parseFloat(coords[1].trim());

    // Inicializamos el mapa centrado en la coordenada exacta
    this.map = L.map('map-dialog').setView([lat, lng], 16);

    // Capa base de OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    // Marcador circular con el color rojo corporativo (#C83832)
    L.circleMarker([lat, lng], {
      radius: 10,
      fillColor: '#C83832',
      color: '#ffffff',
      weight: 2,
      opacity: 1,
      fillOpacity: 0.7
    }).addTo(this.map)
      .bindPopup(`<strong>${this.data.puesto}</strong><br>${this.data.sede}`)
      .openPopup();

    // InvalidateSize() soluciona los problemas de renderizado (cuadros grises) de Leaflet dentro de Modales
    setTimeout(() => {
      this.map?.invalidateSize();
    }, 200);
  }
}
