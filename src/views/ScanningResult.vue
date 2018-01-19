<template>
  <div>
    <div class="card border-secondary mb-3 mt-3">
      <div class="card-header bg-info text-white">Scanning results</div>
      <div class="card-body">
        <div class="alert alert-danger" role="alert" v-if="errors">
          <ul>
            <li v-for="(error, field) in errors">{{ field }}: {{ error }}</li>
          </ul>
        </div>
        <div class="text-center">
          <h3>{{ scan.name }} result:</h3>
          <div id="graph" ref="graph"></div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
  /* eslint-disable no-undef */
  import {HTTP} from '../http'

  export default {
    name: 'ScanningResult',
    data: function () {
      return {
        scan: {
          name: '',
          status: null,
          progress: 0
        },
        errors: null
      }
    },
    computed: {},
    created: function () {
      this.getScan()
    },
    mounted: function () { // DOM ready
      this.createVisualization()
    },
    methods: {
      getScan: function () {
        const id = this.$route.params.id
        HTTP.get('scans/' + id)
          .then(response => {
            console.log(response.data)
            if (!this.scan.pk) {
              this.scan = response.data
            } else {
              this.scan.status = response.data.status
              this.scan.progress = response.data.progress
            }
          })
          .catch(error => {
            console.log(error)
          })
      },
      createVisualization: function () {
        const data = [{
          x: [-0.02, -0.015, -0.01, -0.005, 0, 0.005, 0.01, 0.015, 0.02],
          y: [-0.02, -0.015, -0.01, -0.005, 0, 0.005, 0.01, 0.015, 0.02],
          z: [
            [11.27318318, 147.28138899, 365.90469269, 747.47607279,
              3055.38326749, 1064.70509474, 918.79888497, 822.52352193,
              831.75579348],
            [141.34969225, 15.07407478, 239.51464804, 583.54133923,
              1554.34179601, 1336.96208156, 1408.08111142, 1189.08922684,
              1013.52085742],
            [357.34668711, 224.62034929, 27.22973268, 489.50380689,
              1877.85873517, 2274.15433703, 2072.51558244, 1586.78597368,
              1252.26582965],
            [741.85491557, 574.29708358, 494.26136916, 78.66529394,
              1989.34262141, 10055.43138663, 2649.27779398, 1756.43455652,
              1362.43842076],
            [2640.65254686, 1858.92841057, 1949.26652161, 1862.52500545,
              29.80298632, 3388.20922497, 2109.34259072, 1502.56176314,
              1254.94265648],
            [1057.80364877, 1338.02011381, 2293.61323227, 6206.56340623,
              2022.64096821, 90.31987549, 834.33223421, 928.31253227,
              963.29774471],
            [928.36934844, 1415.97442831, 2071.85048736, 2637.88249158,
              2138.04481608, 836.99230554, 26.61125047, 387.96604103,
              620.20939035],
            [826.89030338, 1190.27421579, 1586.47513448, 1765.650341,
              1494.54573223, 930.54145908, 395.34233907, 14.67344341,
              290.23165843],
            [829.99294836, 1015.64568043, 1252.02178137, 1359.61867121,
              1251.65019378, 970.98948563, 628.9369939, 291.85988414,
              11.68525064]
          ],
          colorscale: 'Viridis',
          type: 'surface'
        }]

        const layout = {
          title: 'Accumulated power of near field',
          autosize: false,
          width: '900',
          height: 800
        }
        Plotly.newPlot('graph', data, layout)
      }
    }
  }
</script>

<style scoped>

</style>
