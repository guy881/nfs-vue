<template>
  <div>
    <div class="row">
      <div class="col-12">
        <div class="card border-secondary mb-3 mt-3">
          <div class="card-header bg-info text-white">Previous scans</div>
          <div class="card-body">
            <table class="table table-hover">
              <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Name</th>
                <th scope="col">Date</th>
                <th scope="col">Type</th>
                <th scope="col">Analyzer</th>
                <th scope="col">Field probe</th>
                <th scope="col">Action</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(scan, index) in scans">
                <th scope="row">{{ index + 1 }}</th>
                <td>{{ scan.name }}</td>
                <td>{{ scan.printable_date }}</td>
                <td>{{ scan.printable_kind }}</td>
                <td>{{ scan.analyzer_name }}</td>
                <td>{{ scan.probe_name }}</td>
                <td>
                  <span class="btn btn-sm btn-outline-danger ml-1" @click="deleteScan(scan)">Delete</span>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {HTTP} from '../http'
  import {askForDeletion, confirmDeleted} from '../utils'

  export default {
    name: 'ScanHistory',
    data: function () {
      return {
        scans: []
      }
    },
    created: function () {
      this.getScans()
    },
    methods: {
      getScans: function () {
        HTTP.get('scans')
          .then(response => {
            console.log(response)
            this.scans = response.data.data
          })
          .catch(error => {
            console.log(error)
          })
      },
      deleteScan: function (scan) {
        askForDeletion()
          .then(result => {
            if (result.value) {
              HTTP.delete('scans/' + scan.id)
                .then(() => {
                  confirmDeleted()
                  this.getScans()
                })
            }
          })
      }
    }
  }
</script>

<style scoped>
  .badge {
    min-width: 70px;
  }
</style>
