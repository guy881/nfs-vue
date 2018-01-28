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
                <select class="custom-select" v-model="probe.min_frequency_unit">
                  <option v-for="unit in freqUnits" v-bind:value="unit">{{ unit }}</option>
                </select>
              </div>
              <div class="input-group-prepend">
                <span class="input-group-text">Max.</span>
              </div>
              <input type="number" class="form-control" id="max_frquency" v-model="probe.max_frequency">
              <div class="input-group-append">
                <select class="custom-select" v-model="probe.max_frequency_unit">
                  <option v-for="unit in freqUnits" v-bind:value="unit">{{ unit }}</option>
                </select>
              </div>
            </div>
          </div>
          <div class="form-group row">
            <label for="correction_factor" class="col-sm-3 col-form-label">Correction factor</label>
            <div class="col-sm-9">
              <span class="btn btn-outline-info" data-toggle="modal"
                    data-target="#fileUploadModal">Import correction factor file</span>
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

    <!-- Modal -->
    <div class="modal fade" id="fileUploadModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
         aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Import correction factor file</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Cancel">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <vue-dropzone @vdropzone-success="fileUploaded" ref="myVueDropzone" id="dropzone" :options="dropzoneOptions"></vue-dropzone>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" data-dismiss="modal">Done</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {host, HTTP} from '../http'
  import vue2Dropzone from 'vue2-dropzone'

  export default {
    name: 'Probe',
    components: {
      vueDropzone: vue2Dropzone
    },
    data: function () {
      return {
        probe: {
          min_frequency_unit: 'GHz',
          max_frequency_unit: 'GHz'
        },
        probeKinds: {e: 'E', h: 'H'},
        errors: null,
        freqUnits: ['kHz', 'MHz', 'GHz'],
        dropzoneOptions: {
          paramName: 'file',
          url: host + 'file-upload',
          maxFiles: 1
        }
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
      },
      fileUploaded: function (file, response) {
        this.probe.correction_factor = response
      }
    }
  }
</script>

<style scoped>

</style>
