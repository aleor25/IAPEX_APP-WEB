import { Component, AfterViewInit } from '@angular/core';
import Chart from 'chart.js/auto';
import { Patient } from '../../../core/models/patients/patient.model';
import * as am5percent from "@amcharts/amcharts5/percent";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import { ContactRequestService } from '../../../core/services/dashboard/contact-request/contact-request.service';
import { PatientService } from '../../../core/services/patients/patient.service';

@Component({
  selector: 'general-view',
  standalone: true,
  imports: [],
  templateUrl: './general-view.component.html',
  styleUrls: ['./general-view.component.css']
})

export class GeneralViewComponent implements AfterViewInit {

  private rootRequests!: am5.Root;

  constructor(
    private contactRequestService: ContactRequestService,
    private patientService: PatientService) { }

  ngAfterViewInit() {

    this.loadData();
    // El método carga los datos de las siguientes gráficas:
    // *Género de los pacientes.


    //GRÁFICAS ESTÁTICAS
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
          }]
        },
        
      });
    } else {
      console.error('No se pudo obtener el contexto 2D para chartRequests.');
    }
  }

  loadData() {
    // Muestra los datos del estatus de las solicitudes
    this.contactRequestService.getAllContactRequests().subscribe(data => {
      // Calcula los totales
      const totalRequests = data.length;
      const newRequests = data.filter(request => request.status === 'nueva').length;
      const inReviewRequests = data.filter(request => request.status === 'en_revision').length;
      const foundRequests = data.filter(request => request.status === 'finalizada').length;


      // Actualiza el HTML con los valores
      const totalRequestsElement = document.getElementById('totalRequests');
      if (totalRequestsElement !== null) {
        totalRequestsElement.innerText = totalRequests.toString();
      }

      const newRequestsElement = document.getElementById('newRequests');
      if (newRequestsElement !== null) {
        newRequestsElement.innerText = newRequests.toString();
      }

      const inReviewRequestsElement = document.getElementById('inReviewRequests');
      if (inReviewRequestsElement !== null) {
        inReviewRequestsElement.innerText = inReviewRequests.toString();
      }

      const foundRequestsElement = document.getElementById('foundRequests');
      if (foundRequestsElement !== null) {
        foundRequestsElement.innerText = foundRequests.toString();
      }

      // Crea la gráfica con los datos transformados
      this.updateChartRequests(data);

      this.updateStatusChart(data);

      // Muestra los datos del género de los pacientes
      this.patientService.getAllPatients().subscribe(patients => {
        const labels = ['Hombres', 'Mujeres'];
        const data = [
          patients.filter((p: Patient) => p.gender === 'Masculino').length,
          patients.filter((p: Patient) => p.gender === 'Femenino').length
        ];

        this.updateGenderChart(labels, data);

        // Procesa y muestra los datos de edad
        const ageData = this.processAgeData(patients);
        this.updateAgeChart(ageData); // Crear la gráfica con los datos procesados

      }, error => {
        console.error('Error al cargar los pacientes', error);
      });

    });
    
  }

  updateRequestCounts(total: number, newCount: number, inReview: number, completed: number) {
    const totalRequestsElement = document.getElementById('totalRequests');
    if (totalRequestsElement) {
      totalRequestsElement.innerText = total.toString();
    }

    const newRequestsElement = document.getElementById('newRequests');
    if (newRequestsElement) {
      newRequestsElement.innerText = newCount.toString();
    }

    const inReviewRequestsElement = document.getElementById('inReviewRequests');
    if (inReviewRequestsElement) {
      inReviewRequestsElement.innerText = inReview.toString();
    }

    const foundRequestsElement = document.getElementById('foundRequests');
    if (foundRequestsElement) {
      foundRequestsElement.innerText = completed.toString();
    }
  }

  updateChartRequests(data: any[]): void {
    // Destruye el gráfico anterior si ya existe
    const existingRoot = am5.registry.rootElements.find(root => root.dom.id === "chartRequests");
    if (existingRoot) {
      existingRoot.dispose();
    }

    // Crea un nuevo root para la gráfica
    this.rootRequests = am5.Root.new("chartRequests");

    // Crea el gráfico
    let chart = this.rootRequests.container.children.push(
      am5xy.XYChart.new(this.rootRequests, {
        panY: false,
        layout: this.rootRequests.verticalLayout
      })
    );

    // Transformar datos si es necesario
    let transformedData = data.map((item, index) => {
      return { day: `Día ${index + 1}`, requests: item.requests };
    });

    // Crear eje Y
    let yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(this.rootRequests, {
        renderer: am5xy.AxisRendererY.new(this.rootRequests, {})
      })
    );

    // Crear eje X
    let xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(this.rootRequests, {
        renderer: am5xy.AxisRendererX.new(this.rootRequests, {}),
        categoryField: "day" 
      })
    );
    xAxis.data.setAll(transformedData); // Establecer los datos en el eje X

    // Crear serie de líneas
    let series = chart.series.push(
      am5xy.LineSeries.new(this.rootRequests, {
        name: "Solicitudes recibidas",
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "requests", // Campo de valores
        categoryXField: "day", // Campo de categorías
        fill: am5.color("#00BFFF"), // Color del área de relleno
        stroke: am5.color("#00BFFF") // Color de la línea
      })
    );

    series.data.setAll(transformedData); // Establecer los datos en la serie

    // Rellenar el área debajo de la línea
    series.fills.template.setAll({
      fillOpacity: 0.3,
      visible: true
    });

    // Añadir puntos en los datos
    series.bullets.push(() => {
      return am5.Bullet.new(this.rootRequests, {
        locationY: 1,
        sprite: am5.Circle.new(this.rootRequests, {
          radius: 5,
          fill: series.get("fill"),
          stroke: am5.color(0xffffff),
          strokeWidth: 2
        })
      });
    });

    // Habilitar tooltips
    series.set("tooltip", am5.Tooltip.new(this.rootRequests, {
      labelText: "{categoryX}: {valueY}"
    }));

    // Añadir cursor
    let cursor = chart.set("cursor", am5xy.XYCursor.new(this.rootRequests, {
      behavior: "none"
    }));

    // Habilitar la línea del cursor
    cursor.lineY.set("visible", false);
  }


  updateStatusChart(data: any[]) {
    // Destruye el gráfico anterior si ya existe
    const existingRoot = am5.registry.rootElements.find(root => root.dom.id === "statusChart");
    if (existingRoot) {
      existingRoot.dispose();
    }

    // Crea el Root para el div con ID "statusChart"
    let root = am5.Root.new("statusChart");

    // Crea una instancia de PieChart
    let chart = root.container.children.push(
      am5percent.PieChart.new(root, {
        layout: root.verticalLayout,
        radius: am5.percent(50),
        innerRadius: am5.percent(60)
      })
    );

    // Configura la serie de datos
    let series = chart.series.push(
      am5percent.PieSeries.new(root, {
        valueField: "count",      // Campo de valores
        categoryField: "status"   // Campo de categorías
      })
    );

    // Cuenta los estados de las solicitudes
    const statusCounts = data.reduce((counts, request) => {
      if (request.status === 'nueva') {
        counts.Nueva++;
      } else if (request.status === 'en revisión') {
        counts.En_revision++;
      } else if (request.status === 'finalizada') {
        counts.Finalizada++;
      }
      return counts;
    }, { Nueva: 0, 'En_revision': 0, Finalizada: 0 });

    // Establece los datos para la serie
    series.data.setAll(
      Object.keys(statusCounts).map(status => ({
        status,
        count: statusCounts[status]
      }))
    );

    // Cambia el color de los segmentos basado en el estado
    series.slices.template.set("stroke", am5.color(0xFFFFFF)); // Color del borde
    series.slices.template.set("strokeWidth", 0); // Ancho del borde

    // Oculta las etiquetas y las líneas de conexión
    series.labels.template.set("forceHidden", true);
    series.ticks.template.set("forceHidden", true);

    series.dataItems.forEach((dataItem) => {
      const status = dataItem.get("category");
      switch (status) {
        case 'nueva':
          dataItem.get("slice").set("fill", am5.color(0xadd8e6)); // Color para Nueva
          break;
        case 'en revisión':
          dataItem.get("slice").set("fill", am5.color(0x0000cd)); // Color para en revisión
          break;
        case 'Finalizadas':
          dataItem.get("slice").set("fill", am5.color(0x40e0d0)); // Color para Finalizadas
          break;
      }
    });

    // Añade una animación inicial
    series.appear(1000, 100);

    // Añade una leyenda al gráfico
    let legend = chart.children.push(am5.Legend.new(root, {
      centerX: am5.percent(50),
      x: am5.percent(50),
      y: am5.percent(80),
      layout: root.horizontalLayout
    }));

    // Configura la leyenda para mostrar solo las etiquetas de categoría
    legend.labels.template.setAll({
      text: "{category}"
    });

    // Configura la leyenda para eliminar valores numéricos de las etiquetas y mostrar los items
    legend.valueLabels.template.setAll({
      visible: false
    });

    // Configura la leyenda para mostrar los ítems de la serie
    legend.data.setAll(series.dataItems);
  }



  // Método para la gráfica de pastel: Género de los pacientes
  updateGenderChart(labels: string[], data: number[]) {

    // Destruye el gráfico anterior si ya existe
    const existingRoot = am5.registry.rootElements.find(root => root.dom.id === "genderChart");
    if (existingRoot) {
      existingRoot.dispose();
    }

    // Crea el Root para el div con ID "genderChart"
    let root = am5.Root.new("genderChart");

    // Crea una instancia de PieChart
    let chart = root.container.children.push(
      am5percent.PieChart.new(root, {
        layout: root.verticalLayout,
        radius: am5.percent(50),
        innerRadius: am5.percent(60)
      })
    );

    // Configura la serie de datos
    let series = chart.series.push(
      am5percent.PieSeries.new(root, {
        valueField: "count",      // Campo de valores
        categoryField: "gender"   // Campo de categorías
      })
    );

    // Establece los datos para la serie
    series.data.setAll(
      labels.map((label, index) => ({ gender: label, count: data[index] }))
    );

    // Cambia el color de los segmentos basado en el género
    series.slices.template.set("stroke", am5.color(0xFFFFFF)); // Color del borde
    series.slices.template.set("strokeWidth", 0); // Ancho del borde

    // Oculta las etiquetas y las líneas de conexión
    series.labels.template.set("forceHidden", true);
    series.ticks.template.set("forceHidden", true);

    series.dataItems.forEach((dataItem) => {
      const gender = dataItem.get("category");
      if (gender === "Mujeres") {
        dataItem.get("slice").set("fill", am5.color(0xFFBECC)); // Color para el segmento mujeres
      } else if (gender === "Hombres") {
        dataItem.get("slice").set("fill", am5.color(0xABD8F7)); // Color para el segmento hombres
      }
    });

    // Añade una animación inicial
    series.appear(1000, 100);

    // Añade una leyenda al gráfico
    let legend = chart.children.push(am5.Legend.new(root, {
      centerX: am5.percent(50),
      x: am5.percent(50),
      y: am5.percent(80),
      layout: root.horizontalLayout
    }));

    // Configura la leyenda para mostrar solo las etiquetas de categoría
    legend.labels.template.setAll({
      text: "{category}"
    });

    // Configura la leyenda para eliminar valores numéricos de las etiquetas y mostrar los items
    legend.valueLabels.template.setAll({
      visible: false
    });

    // Configura la leyenda para mostrar los ítems de la serie
    legend.data.setAll(series.dataItems);
  }


  

  processAgeData(patients: Patient[]): any[] {
    const ageCounts: { [key: string]: number } = {
      "Mayor a 18 años": 0,
      "Menor a 18 años": 0,
      "Mayor a 65 años": 0
    };

    patients.forEach(patient => {
      const age = patient.approximateAge;
      if (age > 65) {
        ageCounts["Mayor a 65 años"]++;
      } else if (age >= 18) {
        ageCounts["Mayor a 18 años"]++;
      } else {
        ageCounts["Menor a 18 años"]++;
      }
    });

    return Object.keys(ageCounts).map(ageGroup => ({
      ageGroup: ageGroup,
      count: ageCounts[ageGroup]
    }));
  }

  updateAgeChart(ageData: any[]): void {
    // Destruye el gráfico anterior si ya existe
    const existingRoot = am5.registry.rootElements.find(root => root.dom.id === "ageChart");
    if (existingRoot) {
      existingRoot.dispose();
    }

    // Crea el Root para el div con ID "ageChart"
    let root = am5.Root.new("ageChart");

    // Crea una instancia de PieChart
    let chart = root.container.children.push(
      am5percent.PieChart.new(root, {
        layout: root.verticalLayout,
        radius: am5.percent(80),
        innerRadius: am5.percent(60)
      })
    );

    // Configura la serie de datos
    let series = chart.series.push(
      am5percent.PieSeries.new(root, {
        valueField: "count",      // Campo de valores
        categoryField: "ageGroup" // Campo de categorías
      })
    );

    // Establece los datos para la serie
    series.data.setAll(ageData);

    // Cambia el color de los segmentos basado en el grupo de edad
    series.slices.template.set("stroke", am5.color(0xFFFFFF)); // Color del borde
    series.slices.template.set("strokeWidth", 0); // Ancho del borde

    // Oculta las etiquetas y las líneas de conexión
    series.labels.template.set("forceHidden", true);
    series.ticks.template.set("forceHidden", true);

    series.dataItems.forEach((dataItem) => {
      const ageGroup = dataItem.get("category");
      if (ageGroup === "Menor a 18 años") {
        dataItem.get("slice").set("fill", am5.color(0xFFD700)); // Color para Menor a 18 años
      } else if (ageGroup === "Mayor a 18 años") {
        dataItem.get("slice").set("fill", am5.color(0x7FFF00)); // Color para Mayor a 18 años
      } else if (ageGroup === "Mayor a 65 años") {
        dataItem.get("slice").set("fill", am5.color(0xFF6347)); // Color para Mayor a 65 años 
      }
    });

    // Añade una animación inicial
    series.appear(1000, 100);

    // Añade una leyenda al gráfico
    let legend = chart.children.push(am5.Legend.new(root, {
      centerX: am5.percent(50),
      x: am5.percent(50),
      y: am5.percent(50),
      layout: root.verticalLayout
    }));

    // Configura la leyenda para mostrar solo las etiquetas de categoría
    legend.labels.template.setAll({
      text: "{category}"
    });

    // Configura la leyenda para eliminar valores numéricos de las etiquetas y mostrar los items
    legend.valueLabels.template.setAll({
      visible: false
    });

    // Configura la leyenda para mostrar los ítems de la serie
    legend.data.setAll(series.dataItems);
  }
}