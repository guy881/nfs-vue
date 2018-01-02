<template>
  <div>
    <div class="card border-secondary mb-3 mt-3">
      <div class="card-header bg-info text-white">Probe Details</div>
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
              <input class="form-control" id="name" v-model="probe.name">
            </div>
          </div>
          <div class="form-group row">
            <label for="model" class="col-sm-3 col-form-label">Type</label>
            <div class="col-sm-9">
              <select id="model" class="custom-select pr-5" v-model.trim="probe.kind">
                <option v-for="(label, kind) in probeKinds" v-bind:value="kind">{{ label }}</option>
              </select>
            </div>
          </div>
          <div class="form-group row">
            <label class="col-sm-3 col-form-label">Frequency range</label>
            <div class="input-group col-sm-9">
              <div class="input-group-prepend">
                <span class="input-group-text">Min.</span>
              </div>
              <input type="number" class="form-control" id="min_frequency" v-model="probe.min_frequency">
              <div class="input-group-append mr-5">
                <span class="input-group-text">GHz</span>
              </div>
              <div class="input-group-prepend">
                <span class="input-group-text">Max.</span>
              </div>
              <input type="number" class="form-control" id="max_frquency" v-model="probe.max_frequency">
              <div class="input-group-append">
                <span class="input-group-text">GHz</span>
              </div>
            </div>
          </div>
          <div class="form-group row">
            <label for="correction_factor" class="col-sm-3 col-form-label">Correction factor</label>
            <div class="col-sm-9">
              <input type="number" class="form-control" id="correction_factor" v-model="probe.correction_factor">
            </div>
          </div>
          <label class="custom-control custom-checkbox">
            <input type="checkbox" id="defaultCheckbox" class="custom-control-input" v-model="probe.default">
            <label class="custom-control-label" for="defaultCheckbox">Default</label>
          </label>
          <div class="text-center">
            <button type="button" class="btn btn-outline-primary" @click="saveProbe(probe)">Save</button>
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
    name: 'Probe',
    data: function () {
      return {
        probe: {},
        probeKinds: {e: 'E', h: 'H'},
        errors: null
      }
    },
    created: function () {
      const id = this.$route.params.id
      if (id) {  // edit
        HTTP.get('probes/' + id)
          .then(response => {
            this.probe = response.data
          })
          .catch(error => {
            console.log(error)
          })
      }
    },
    methods: {
      saveProbe: function (probe) {
        // this.probe = _.clone(probe)
        console.log(probe)
        const url = probe.id ? 'probes/' + probe.id : 'probes/'
        const promise = probe.id ? HTTP.put(url, probe) : HTTP.post(url, probe)
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
