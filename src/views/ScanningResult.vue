<template>
  <div>
    <div class="card border-secondary mb-3 mt-3">
      <div class="card-header bg-info text-white">Scanning result ({{ scan.name }})</div>
      <div class="card-body">
        <spinner size="big" message="Wait for visualization" v-show="!result.ready"></spinner>
        <div class="text-center" v-show="result.ready">
          <div id="graph" ref="graph"></div>
          <div id="graph-control" v-if="result.ready">
            <p>Frequency range:</p>
            <vue-slider ref="frequencySlider" v-model="currentFrequency" :data="this.result.f" :dot-size="20"
                        :height="8" :tooltip-dir="['top', 'bottom']"></vue-slider>
            <div v-if="scan.z_availabe">
              <p class="mt-5">Z index:</p>
              <vue-slider ref="zSlider" v-model="currentZ" :data="this.result.z" :dot-size="20" :height="8"
                          :tooltip-dir="['top', 'bottom']"></vue-slider>
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
  import Spinner from 'vue-simple-spinner'
  // import {array, arange} from 'numjs'

  export default {
    name: 'ScanningResult',
    components: { vueSlider, Spinner },
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
      minZ: function () {
        return this.result.z[0]
      },
      maxZ: function () {
        return this.result.z[this.result.z.length - 1]
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
                this.getScanResult()
              }
            }
          })
          .catch(error => {
            console.log(error)
          })
      },
      getScanResult: function () {
        const roundFloat = (f) => { return Math.round(f * 100) / 100 }
        const url = host + 'mtresults/' + this.scan.result
        HTTP.get(url)
          .then(response => {
            this.result.x = response.data.x
            this.result.y = response.data.y
            this.result.z = response.data.z
            this.result.f = response.data.f.map(f => roundFloat(f))
            this.result.reduced = response.data.e
            this.currentFrequency = [this.minFrequency, this.maxFrequency]
            this.currentZ = [this.minZ, this.maxZ]
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
          height: 800,
          scene: {zaxis: {title: 'E'}}
        }
        Plotly.newPlot('graph', data, layout)
        this.result.ready = true
      },
      updateVisualization: function () {
        this.result.ready = false
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
        const url = new URL(host + 'mtresults/' + this.scan.result)
        const params = {
          sf: fStartIndex,
          ef: fEndIndex,
          sz: zStartIndex,
          ez: zEndIndex
        }
        Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
        HTTP.get(url)
          .then(response => {
            const reduced = response.data.e
            console.log(reduced)
            Plotly.deleteTraces('graph', 0)
            Plotly.addTraces('graph', this.dataTrace(reduced))
            console.log('yeah!')
            this.result.ready = true
          })
      }
    }
  }
</script>

<style scoped>

</style>
