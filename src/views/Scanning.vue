<template>
  <div>
    <div class="card border-secondary mb-3 mt-3">
      <div class="card-header bg-info text-white">Scanning</div>
      <div class="card-body">
        <div class="alert alert-danger" role="alert" v-if="errors">
          <ul>
            <li v-for="(error, field) in errors">{{ field }}: {{ error }}</li>
          </ul>
        </div>

        <form>
          <div class="form-group row">
            <label for="name" class="col-sm-3 col-form-label">Scan name</label>
            <div class="col-sm-3">
              <input class="form-control" id="name" v-model="scan.name">
            </div>
            <div class="col-sm-3 text-center">
              <button type="button" class="btn btn-outline-info" @click="saveScan(scan)">Import PCB layout</button>
            </div>
          </div>
          <div class="form-group row">
            <label class="col-sm-3 col-form-label">Date</label>
            <div class="col-sm-9">
              <span class="text-muted">{{ scan.printableDate }}</span>
            </div>
          </div>
          <div class="form-group row">
            <label class="col-sm-3 col-form-label">Scan type</label>
            <div class="col-sm-9">
              <div class="custom-control custom-radio custom-control-inline" v-for="(label, kind) in kinds">
                <input type="radio" :id="kind" class="custom-control-input" name="kind" :value="kind"
                       v-model="scan.kind">
                <label class="custom-control-label" :for="kind">{{ label }}</label>
              </div>
            </div>
          </div>
          <div v-if="scan.kind === 'flat' | scan.kind === 'volumetric'">
            <div class="form-group row">
              <label class="col-sm-3 col-form-label">X axis boundaries</label>
              <div class="input-group col-sm-9">
                <div class="input-group-prepend">
                  <span class="input-group-text">Min.</span>
                </div>
                <input type="number" class="form-control" v-model="scan.min_x" step="0.01">
                <div class="input-group-append mr-5">
                  <span class="input-group-text">mm</span>
                </div>
                <div class="input-group-prepend">
                  <span class="input-group-text">Max.</span>
                </div>
                <input type="number" class="form-control" v-model="scan.max_x" step="0.01">
                <div class="input-group-append">
                  <span class="input-group-text">mm</span>
                </div>
              </div>
            </div>
            <div class="form-group row">
              <label class="col-sm-3 col-form-label">Y axis boundaries</label>
              <div class="input-group col-sm-9">
                <div class="input-group-prepend">
                  <span class="input-group-text">Min.</span>
                </div>
                <input type="number" class="form-control" v-model="scan.min_y" step="0.01">
                <div class="input-group-append mr-5">
                  <span class="input-group-text">mm</span>
                </div>
                <div class="input-group-prepend">
                  <span class="input-group-text">Max.</span>
                </div>
                <input type="number" class="form-control" v-model="scan.max_y" step="0.01">
                <div class="input-group-append">
                  <span class="input-group-text">mm</span>
                </div>
              </div>
            </div>
          </div>

          <div v-if="scan.kind === 'volumetric'">
            <div class="form-group row">
              <label class="col-sm-3 col-form-label">Z axis boundaries</label>
              <div class="input-group col-sm-9">
                <div class="input-group-prepend">
                  <span class="input-group-text">Min.</span>
                </div>
                <input type="number" class="form-control" v-model="scan.min_z" step="0.01">
                <div class="input-group-append mr-5">
                  <span class="input-group-text">mm</span>
                </div>
                <div class="input-group-prepend">
                  <span class="input-group-text">Max.</span>
                </div>
                <input type="number" class="form-control" v-model="scan.max_z" step="0.01">
                <div class="input-group-append">
                  <span class="input-group-text">mm</span>
                </div>
              </div>
            </div>
          </div>

          <div class="form-group row">
            <label for="analyzer" class="col-sm-3 col-form-label">Spectrum analyzer</label>
            <div class="col-sm-3">
              <select id="analyzer" class="custom-select pr-5" v-model="scan.analyzer">
                <option v-for="analyzer in analyzers" v-bind:value="analyzer.id">{{ analyzer.name }}</option>
              </select>
            </div>
            <div class="col-sm-2">
              <small class="text-muted" v-if="scan.analyzer">{{ analyzerFreqRange }}</small>
            </div>
          </div>
          <div class="form-group row">
            <label for="probe" class="col-sm-3 col-form-label">Field probe</label>
            <div class="col-sm-3">
              <select id="probe" class="custom-select pr-5" v-model="scan.probe">
                <option v-for="probe in probes" v-bind:value="probe.id">{{ probe.name }}</option>
              </select>
            </div>
            <div class="col-sm-2">
              <small class="text-muted" v-if="scan.probe">{{ probeFreqRange }}</small>
            </div>
          </div>
          <div class="form-group row">
            <label class="col-sm-3 col-form-label">Frequency range</label>
            <div class="input-group col-sm-9">
              <div class="input-group-prepend">
                <span class="input-group-text">Min.</span>
              </div>
              <input type="number" class="form-control" id="min_frequency" v-model="scan.min_frequency" step="0.01">
              <div class="input-group-append mr-5">
                <select class="custom-select" v-model="scan.min_frequency_unit">
                  <option v-for="unit in freqUnits" v-bind:value="unit">{{ unit }}</option>
                </select>
              </div>
              <div class="input-group-prepend">
                <span class="input-group-text">Max.</span>
              </div>
              <input type="number" class="form-control" id="max_frquency" v-model="scan.max_frequency" step="0.01">
              <div class="input-group-append">
                <select class="custom-select" v-model="scan.max_frequency_unit">
                  <option v-for="unit in freqUnits" v-bind:value="unit">{{ unit }}</option>
                </select>
              </div>
            </div>
          </div>
          <div class="text-center mt-5">
            <button type="button" class="btn btn-outline-success" @click="saveScan(scan)">Start scanning</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
  import {HTTP} from '../http'
  // import _ from 'lodash'

  export default {
    name: 'Scanning',
    data: function () {
      return {
        scan: {
          name: '',
          printableDate: '',
          date: '',
          kind: 'flat', // default
          analyzer: undefined,  // it is very important to declare those properties! (for change detection)
          probe: undefined,
          min_frequency_unit: 'GHz',
          max_frequency_unit: 'GHz',
          min_x: 0,
          min_y: 0,
          min_z: 0,
          max_x: 210,
          max_y: 290,
          max_z: 100
        },
        analyzers: [],
        probes: [],
        kinds: {
          flat: 'Flat',
          volumetric: 'Volumetric',
          z: 'Z-variable'
        },
        freqUnits: ['kHz', 'MHz', 'GHz'],
        errors: null
      }
    },
    computed: {
      analyzerFreqRange: function () {  // get frequency range of selected analyzer
        const selectedAnalyzer = this.analyzers.find(analyzer => analyzer.id === this.scan.analyzer)
        return selectedAnalyzer.freq_range
      },
      probeFreqRange: function () {  // get frequency range of selected field probe
        const selectedProbe = this.probes.find(probe => probe.id === this.scan.probe)
        return selectedProbe.freq_range
      }
    },
    created: function () {
      this.initScan()
      this.getAnalyzers()
      this.getProbes()
    },
    methods: {
      initScan: function () {
        if (!this.scan.id) {
          HTTP.get('scans')
            .then(response => {
              this.scan.name = response.data['next_scan_name']
              this.scan.printableDate = response.data['current_date_printable']
              this.scan.date = response.data['current_date']
            })
        }
      },
      saveScan: function (scan) {
        console.log(scan)
        const url = scan.id ? 'scans/' + scan.id : 'scans/'
        const promise = scan.id ? HTTP.put(url, scan) : HTTP.post(url, scan)
        promise
          .then(response => {
            console.log(response)
            this.$router.push({name: 'home'})
          })
          .catch(error => {
            const errors = error.response.data.errors
            console.log(errors)
            this.errors = errors
          })
      },
      getAnalyzers: function () {
        HTTP.get('analyzers')
          .then(response => {
            console.log(response)
            this.analyzers = response.data.data
            if (!this.scan.id) {  // new scan, set default analyzer
              const defaultAnalyzer = this.analyzers.find(analyzer => analyzer.default)
              if (defaultAnalyzer) {
                this.scan.analyzer = defaultAnalyzer.id
              }
            }
          })
          .catch(error => {
            console.log(error)
          })
      },
      getProbes: function () {
        HTTP.get('probes')
          .then(response => {
            console.log(response)
            this.probes = response.data.data
            if (!this.scan.id) {  // new scan, set default probe
              const defaultProbe = this.probes.find(probe => probe.default)
              if (defaultProbe) {
                this.scan.probe = defaultProbe.id
              }
            }
          })
          .catch(error => {
            console.log(error)
          })
      }
    }
  }
</script>

<style scoped>

</style>
