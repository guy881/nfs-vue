<template>
  <div>
    <div class="card border-secondary mb-3 mt-3">
      <div class="card-header bg-info text-white">Analyzer Details</div>
      <div class="card-body">
        <div class="alert alert-danger" role="alert" v-if="errors">
          <ul>
            <li v-for="(error, field) in errors">{{ field }}: {{ error }}</li>
          </ul>
        </div>

        <form>
          <div class="form-group row">
            <label for="name" class="col-sm-3 col-form-label">Name</label>
            <div class="col-sm-9">
              <input class="form-control" id="name" v-model="analyzer.name">
            </div>
          </div>
          <div class="form-group row">
            <label for="model" class="col-sm-3 col-form-label">Model</label>
            <div class="col-sm-9">
              <input class="form-control" id="model" v-model="analyzer.model">
            </div>
          </div>
          <div class="form-group row">
            <label class="col-sm-3 col-form-label">Frequency range</label>
            <div class="input-group col-sm-9">
              <div class="input-group-prepend">
                <span class="input-group-text">Min.</span>
              </div>
              <input type="number" class="form-control" id="min_frequency" v-model="analyzer.min_frequency">
              <div class="input-group-append mr-5">
                <select class="custom-select" v-model="analyzer.min_frequency_unit">
                  <option v-for="unit in freqUnits" v-bind:value="unit">{{ unit }}</option>
                </select>
              </div>
              <div class="input-group-prepend">
                <span class="input-group-text">Max.</span>
              </div>
              <input type="number" class="form-control" id="max_frquency" v-model="analyzer.max_frequency">
              <div class="input-group-append">
                <select class="custom-select" v-model="analyzer.max_frequency_unit">
                  <option v-for="unit in freqUnits" v-bind:value="unit">{{ unit }}</option>
                </select>
              </div>
            </div>
          </div>
          <label class="custom-control custom-checkbox">
            <input type="checkbox" id="defaultCheckbox" class="custom-control-input" v-model="analyzer.default">
            <label class="custom-control-label" for="defaultCheckbox">Default</label>
          </label>
          <div class="text-center">
            <button type="button" class="btn btn-outline-primary" @click="saveAnalyzer(analyzer)">Save</button>
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
    name: 'Analyzer',
    data: function () {
      return {
        analyzer: {
          min_frequency_unit: 'GHz',
          max_frequency_unit: 'GHz'
        },
        errors: null,
        freqUnits: ['kHz', 'MHz', 'GHz']
      }
    },
    created: function () {
      const id = this.$route.params.id
      if (id) {  // edit
        HTTP.get('analyzers/' + id)
          .then(response => {
            this.analyzer = response.data
          })
          .catch(error => {
            console.log(error)
          })
      }
    },
    methods: {
      saveAnalyzer: function (analyzer) {
        // this.analyzer = _.clone(analyzer)
        console.log(analyzer)
        const url = analyzer.id ? 'analyzers/' + analyzer.id : 'analyzers/'
        const promise = analyzer.id ? HTTP.put(url, analyzer) : HTTP.post(url, analyzer)
        promise
          .then(response => {
            console.log(response)
            this.$router.push({name: 'hardware'})
          })
          .catch(error => {
            const errors = error.response.data.errors
            console.log(errors)
            this.errors = errors
          })
      }
    }
  }
</script>

<style scoped>

</style>
