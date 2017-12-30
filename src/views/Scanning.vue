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
              <button type="button" class="btn btn-outline-info" @click="saveScan(scan)">Import SVG</button>
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
          <div class="form-group row">
            <label for="analyzer" class="col-sm-3 col-form-label">Spectrum analyzer</label>
            <div class="col-sm-9">
              <select id="analyzer" class="custom-select pr-5" v-model="scan.analyzer">
                <option v-for="analyzer in analyzers" v-bind:value="analyzer.id">{{ analyzer.name }}</option>
              </select>
            </div>
          </div>
          <div class="form-group row">
            <label for="probe" class="col-sm-3 col-form-label">Field probe</label>
            <div class="col-sm-9">
              <select id="probe" class="custom-select pr-5" v-model="scan.probe">
                <option v-for="probe in probes" v-bind:value="probe.id">{{ probe.name }}</option>
              </select>
            </div>
          </div>
          <div class="form-group row no-gutters">
            <label class="col-sm-3 col-form-label">Frequency range</label>
            <div class="col-sm-3 ml-2">
              <div class="custom-control-inline">
                <input type="number" class="form-control" id="min_frequency" v-model="scan.min_frequency">
                <small class="ml-2 mt-2 text-muted">GHz</small>
                <p class="mt-1 ml-3">-</p>
              </div>
            </div>
            <div class="col-sm-3">
              <div class="custom-control-inline">
                <input type="number" class="form-control" id="max_frequency" v-model="scan.max_frequency">
                <small class="ml-2 mt-2 text-muted">GHz</small>
              </div>
            </div>
          </div>
          <div class="text-center">
            <button type="button" class="btn btn-outline-primary" @click="saveScan(scan)">Save</button>
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
          name: 'Scan 1',
          printableDate: '',
          date: '',
          kind: 'flat', // default
          analyzer: undefined
        },
        analyzers: [],
        probes: [],
        kinds: {
          flat: 'Flat',
          volumetric: 'Volumetric',
          z: 'Z-variable'
        },
        errors: null
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
              const defaultAnalyzers = this.analyzers.filter(analyzer => analyzer.default)
              if (defaultAnalyzers) {
                this.scan.analyzer = defaultAnalyzers[0].id
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
              const defaultProbes = this.probes.filter(probe => probe.default)
              if (defaultProbes) {
                this.scan.probe = defaultProbes[0].id
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