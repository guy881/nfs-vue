<template>
  <div>
    <div class="card border-secondary mb-3 mt-3">
      <div class="card-header bg-info text-white">Scanning result ({{ scan.name }})</div>
      <div class="card-body">
        <div class="alert alert-danger" role="alert" v-if="errors">
          <ul>
            <li v-for="(error, field) in errors">{{ field }}: {{ error }}</li>
          </ul>
        </div>
        <div class="text-center">
          <div id="graph" ref="graph"></div>
          <div id="graph-control" v-if="result.ready">
            <p>Frequency range:</p>
            <vue-slider ref="frequencySlider" v-model="currentFrequency" :min="minFrequency" :max="maxFrequency"
                        :interval="frequencyStep" :dot-size="20" :height="8"
                        :tooltip-dir="['top', 'bottom']"></vue-slider>
            <div v-if="scan.z_availabe">
              <p class="mt-5">Z index:</p>
              <vue-slider ref="zSlider" v-model="currentZ" :min="minZ" :max="maxZ"
                          :interval="zStep" :dot-size="20" :height="8" :tooltip-dir="['top', 'bottom']"></vue-slider>
            </div>
            <button class="btn btn-primary mt-5" @click="updateVisualization">Update</button>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
  /* eslint-disable no-undef */
  import {host, HTTP} from '../http'
  import vueSlider from 'vue-slider-component'
  // import {array, arange} from 'numjs'

  export default {
    name: 'ScanningResult',
    components: {
      vueSlider
    },
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
          reduced: [],
          ready: false
        },
        currentFrequency: [],
        currentZ: [],
        errors: null
      }
    },
    computed: {
      minFrequency: function () {
        return this.result.f[0]
      },
      maxFrequency: function () {
        return this.result.f[this.result.f.length - 1]
      },
      frequencyStep: function () {
        if (this.result.f.length > 1) {
          return Math.round((this.result.f[1] - this.result.f[0]) * 10000) / 10000
        } else return 0.1
      },
      minZ: function () {
        return this.result.z[0]
      },
      maxZ: function () {
        return this.result.z[this.result.z.length - 1]
      },
      zStep: function () {
        if (this.result.z.length > 1) {
          return Math.round((this.result.z[1] - this.result.z[0]) * 10000) / 10000
        } else return 0.1
      }
    },
    created: function () {
      this.getScan()
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
      reduce4Dto2D: function (params) {
        const a = params.a
        return a.map((x) => {
          return x.map((y) => {
            return y.reduce((zSum, z, zIndex) => {
              if (!('zStartIndex' in params) || (zIndex >= params.zStartIndex && zIndex <= params.zEndIndex)) {
                return z.reduce((fSum, f, fIndex) => {
                  if (!('fStartIndex' in params) || (fIndex >= params.fStartIndex && fIndex <= params.fEndIndex)) {
                    return fSum + f
                  } else return fSum
                }, zSum)
              } else return zSum
            }, 0)
          })
        })
      },
      displayResults: function () {
        const url = host + 'results/' + this.scan.result
        HTTP.get(url)
          .then(response => {
            this.result.x = JSON.parse(response.data.x)
            this.result.y = JSON.parse(response.data.y)
            this.result.z = JSON.parse(response.data.z)
            this.result.f = JSON.parse(response.data.f)
            this.result.e = JSON.parse(response.data.e)
            this.currentFrequency = [this.minFrequency, this.maxFrequency]
            this.currentZ = [this.minZ, this.maxZ]
            // this.result.e = array(JSON.parse(response.data.e))
            console.log(this.result.e)
            this.result.reduced = this.reduce4Dto2D({a: this.result.e})
            window.reduced = this.result.reduced
            this.createVisualization(this.result.reduced)
          })
          .catch(error => {
            console.log(error)
          })
      },
      dataTrace: function (z) {
        return [{
          x: this.result.x,
          y: this.result.y,
          z: z,
          colorscale: 'Viridis',
          type: 'surface'
        }]
      },
      createVisualization: function (z) {
        const data = this.dataTrace(z)

        const layout = {
          title: 'Accumulated power of near field',
          autosize: false,
          width: 1030,
          height: 800
        }
        Plotly.newPlot('graph', data, layout)
        this.result.ready = true
      },
      updateVisualization: function () {
        // get frequency from slider
        const minFreq = this.currentFrequency[0]
        const maxFreq = this.currentFrequency[1]
        const fStartIndex = this.result.f.indexOf(minFreq)
        const fEndIndex = this.result.f.indexOf(maxFreq)
        // get z-index from slider
        const minZ = this.currentZ[0]
        const maxZ = this.currentZ[1]
        const zStartIndex = this.result.z.indexOf(minZ)
        const zEndIndex = this.result.z.indexOf(maxZ)
        // some space
        // more breathe
        const reduced = this.reduce4Dto2D({
          a: this.result.e,
          fStartIndex: fStartIndex,
          fEndIndex: fEndIndex,
          zStartIndex: zStartIndex,
          zEndIndex: zEndIndex
        })
        console.log(reduced)
        Plotly.deleteTraces('graph', 0)
        Plotly.addTraces('graph', this.dataTrace(reduced))
        console.log('yeah!')
      }
    }
  }
</script>

<style scoped>

</style>
