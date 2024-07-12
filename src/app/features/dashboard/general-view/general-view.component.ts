import { Component, AfterViewInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import Chart from 'chart.js/auto';

@Component({
  selector: 'general-view',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './general-view.component.html',
  styleUrls: ['./general-view.component.css']
})
export class GeneralViewComponent implements AfterViewInit {

  ngAfterViewInit() {

    // Gráfica de líneas: solicitudes recibidas
    const ctxChartRequests = (document.getElementById('chartRequests') as HTMLCanvasElement)?.getContext('2d');
    if (ctxChartRequests) {
      const chartRequests = new Chart(ctxChartRequests, {
          type: 'line',
          data: {
              labels: ['Día 1', 'Día 2', 'Día 3', 'Día 4', 'Día 5', 'Día 6', 'Día 7', 'Día 8', 'Día 9', 'Día 10', 'Día 11', 'Día 12', 'Día 13', 'Día 14', 'Día 15', 'Día 16', 'Día 17', 'Día 18', 'Día 19', 'Día 20', 'Día 21', 'Día 22', 'Día 23', 'Día 24', 'Día 25', 'Día 26', 'Día 27', 'Día 28', 'Día 29', 'Día 30'],
              datasets: [{
                  label: 'Solicitudes recibidas',
                  data: [5, 6, 5, 8, 6, 9, 7, 6, 8, 10, 9, 11, 13, 12, 14, 15, 14, 13, 16, 18, 17, 19, 20, 18, 21, 22, 23, 24, 26, 30],
                  borderColor: 'rgba(0, 123, 255, 1)',
                  borderWidth: 2,
                  fill: false
              }]
          },
          options: {
              responsive: true,
              scales: {
                  x: {
                      beginAtZero: true
                  },
                  y: {
                      beginAtZero: true
                  }
              }
          }
      });
    } else {
      console.error('No se pudo obtener el contexto 2D para chartRequests.');
    }

    // Gráfica de pastel: Estatus de las solicitudes
    const ctxStatusChart = (document.getElementById('statusChart') as HTMLCanvasElement)?.getContext('2d');
    if (ctxStatusChart) {
      const statusChart = new Chart(ctxStatusChart, {
          type: 'pie',
          data: {
              labels: ['Nuevas', 'En revisión', 'Finalizadas'],
              datasets: [{
                  data: [7, 12, 11],
                  backgroundColor: ['#add8e6', '#0000cd', '#40e0d0'],
              }]
          },
          options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                  legend: {
                      position: 'right',
                  },
                  title: {
                      display: true,
                      text: 'Estatus de las solicitudes'
                  }
              }
          }
      });
    } else {
      console.error('No se pudo obtener el contexto 2D para statusChart.');
    }

    // Gráfica de líneas: Pacientes recibidos
    const ctxChartPatients = (document.getElementById('chartPatients') as HTMLCanvasElement)?.getContext('2d');
    if (ctxChartPatients) {
      const chartPatients = new Chart(ctxChartPatients, {
          type: 'line',
          data: {
              labels: ['Día 1', 'Día 2', 'Día 3', 'Día 4', 'Día 5', 'Día 6', 'Día 7', 'Día 8', 'Día 9', 'Día 10', 'Día 11', 'Día 12', 'Día 13', 'Día 14', 'Día 15', 'Día 16', 'Día 17', 'Día 18', 'Día 19', 'Día 20', 'Día 21', 'Día 22', 'Día 23', 'Día 24', 'Día 25', 'Día 26', 'Día 27', 'Día 28', 'Día 29', 'Día 30'],
              datasets: [{
                  label: 'Pacientes recibidos',
                  data: [1, 16, 9, 17, 6, 14, 6, 15, 11, 17, 13, 18, 10, 18, 16, 12, 15, 13, 15, 18, 19, 10, 14, 18, 16, 17, 11, 14, 17],
                  borderColor: 'rgba(0, 123, 255, 1)',
                  borderWidth: 2,
                  fill: false
              }]
          },
          options: {
              responsive: true,
              scales: {
                  x: {
                      beginAtZero: true
                  },
                  y: {
                      beginAtZero: true
                  }
              }
          }
      });
    } else {
      console.error('No se pudo obtener el contexto 2D para chartRequests.');
    }

    // Gráfica de pastel: Género 
    const ctxGender = (document.getElementById('genderChart') as HTMLCanvasElement)?.getContext('2d');
    if (ctxGender) {
      const genderChart = new Chart(ctxGender, {
          type: 'pie',
          data: {
              labels: ['Hombres', 'Mujeres'],
              datasets: [{
                  data: [7, 11],
                  backgroundColor: ['#ADD8E6', '#FFC0CB'],
              }]
          },
          options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                  legend: {
                      position: 'bottom',
                  },
                  title: {
                      display: true,
                      text: 'Género de los pacientes'
                  }
              }
          }
      });
    } else {
      console.error('No se pudo obtener el contexto 2D para statusChart.');
    }

    // Gráfica de pastel: Edades
    const ctxAge = (document.getElementById('ageChart') as HTMLCanvasElement)?.getContext('2d');
    if (ctxAge) {
      const ageChart = new Chart(ctxAge, {
          type: 'pie',
          data: {
              labels: ['Mayor a 18 años', 'Menor a 18 años', 'Mayor a 65 años'],
              datasets: [{
                  data: [70, 20, 103],
                  backgroundColor: ['#7FFF00', '#FFD700', '#FF6347'],
              }]
          },
          options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                  legend: {
                      position: 'bottom',
                  },
                  title: {
                      display: true,
                      text: 'Edad de los pacientes'
                  }
              }
          }
      });
    } else {
      console.error('No se pudo obtener el contexto 2D para statusChart.');
    }



    // Gráfica de líneas: solicitudes recibidas
    const ctxChartSearch = (document.getElementById('chartSearch') as HTMLCanvasElement)?.getContext('2d');
    if (ctxChartSearch) {
      const chartSearch = new Chart(ctxChartSearch, {
          type: 'line',
          data: {
              labels: ['Día 1', 'Día 2', 'Día 3', 'Día 4', 'Día 5', 'Día 6', 'Día 7', 'Día 8', 'Día 9', 'Día 10', 'Día 11', 'Día 12', 'Día 13', 'Día 14', 'Día 15', 'Día 16', 'Día 17', 'Día 18', 'Día 19', 'Día 20', 'Día 21', 'Día 22', 'Día 23', 'Día 24', 'Día 25', 'Día 26', 'Día 27', 'Día 28', 'Día 29', 'Día 30'],
              datasets: [{
                  label: 'Búsquedas realizadas',
                  data: [14, 29, 46, 53, 81, 97, 10, 61, 85, 31, 49, 67, 19, 82, 25, 56, 38, 41, 71, 92, 11, 58, 33, 44, 75, 64, 51, 69, 88, 96],
                  borderColor: 'rgba(0, 123, 255, 1)',
                  borderWidth: 2,
                  fill: false
              }]
          },
          options: {
              responsive: true,
              scales: {
                  x: {
                      beginAtZero: true
                  },
                  y: {
                      beginAtZero: true
                  }
              }
          }
      });
    } else {
      console.error('No se pudo obtener el contexto 2D para chartRequests.');
    }

    // Gráfica de pastel: Estatus de las solicitudes
    const ctxRegionChart = (document.getElementById('regionChart') as HTMLCanvasElement)?.getContext('2d');
    if (ctxRegionChart) {
      const regionChart = new Chart(ctxRegionChart, {
          type: 'pie',
          data: {
              labels: ['Córdoba', 'Cuitláhuac', 'Yerin'],
              datasets: [{
                  data: [3, 32, 44],
                  backgroundColor: ['#FFFF00', '#BA55D3', '#D3D3D3'],
              }]
          },
          options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                  legend: {
                      position: 'right',
                  },
                  title: {
                      display: true,
                      text: 'Búsquedas por región'
                  }
              }
          }
      });
    } else {
      console.error('No se pudo obtener el contexto 2D para statusChart.');
    }
    
  }
}

