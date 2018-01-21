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
  import {array, arange} from 'numjs'

  export default {
    name: 'ScanningResult',
    data: function () {
      return {
        scan: {
          name: '',
          status: null,
          progress: 0,
          result: null
        },
        result: {
          x: [],
          y: [],
          z: [],
          f: [],
          e: [],
          reduced: []
        },
        errors: null
      }
    },
    computed: {},
    created: function () {
      this.getScan()
    },
    mounted: function () { // DOM ready
      window.arange = arange
      window.array = array
      console.log(array)
      console.log(arange(16).reshape(2, 2, 2, 2))
    },
    methods: {
      getScan: function () {
        const id = this.$route.params.id
        HTTP.get('scans/' + id)
          .then(response => {
            console.log(response.data)
            if (!this.scan.pk) {
              this.scan = response.data
              if (this.scan.result) {
                this.displayResults()
              }
            }
          })
          .catch(error => {
            console.log(error)
          })
      },
      reduce4Dto2D: function (a) {
        return a.map((x) => {
          return x.map((y) => {
            return y.reduce((z1, z2) => {
              return z2.reduce((f3, f4) => { return f3 + f4 }, z1)
            }, 0)
          })
        })
      },
      displayResults: function () {
        const url = 'http://127.0.0.1:8000/results/' + this.scan.result
        HTTP.get(url)
          .then(response => {
            this.result.x = JSON.parse(response.data.x)
            this.result.y = JSON.parse(response.data.y)
            this.result.z = JSON.parse(response.data.z)
            this.result.f = JSON.parse(response.data.f)
            this.result.e = JSON.parse(response.data.e)
            // this.result.e = array(JSON.parse(response.data.e))
            // console.log(this.result.e.shape)
            // console.log(this.result.e.reduce)
            console.log(this.result.e)
            this.result.reduced = this.reduce4Dto2D(this.result.e)
            console.log(this.result.reduced)
            window.reduced = this.result.reduced
            // const g = arange(81).reshape(3, 3, 3, 3).tolist()
            // console.log(g)
            // const p = this.reduce4Dto2D(g)
            // console.log(p)
            this.createVisualization()
          })
          .catch(error => {
            console.log(error)
          })
      },
      createVisualization: function () {
        const data = [{
          x: this.result.x,
          y: this.result.y,
          z: this.result.reduced,
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
