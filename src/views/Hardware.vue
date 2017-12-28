<template>
  <div>
    <div class="row">
      <div class="col-12">
        <div class="card border-secondary mb-3 mt-3">
          <div class="card-header bg-info text-white">Spectrum analyzers</div>
          <div class="card-body">
            <table class="table table-hover">
              <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Name</th>
                <th scope="col">Model</th>
                <th scope="col">Freq. range</th>
                <th scope="col">Default</th>
                <th scope="col">Action</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(analyzer, index) in analyzers">
                <th scope="row">{{ index + 1 }}</th>
                <td>{{ analyzer.name }}</td>
                <td>{{ analyzer.model }}</td>
                <td>{{ analyzer.freq_range }}</td>
                <!--<td><span v-bind:class="['badge', 'badge-pill', analyzer.default ? 'badge-primary' : 'badge-secondary']">{{ analyzer.default }}</span></td>-->
                <td><i class="fas fa-check-circle ml-3 text-info" v-if="analyzer.default"></i></td>
                <td>
                  <router-link :to="{ name: 'analyzer', params: {id: analyzer.id} }" class="btn btn-sm btn-outline-primary">Edit</router-link>
                  <span class="btn btn-sm btn-outline-danger ml-1" @click="deleteAnalyzer(analyzer)">Delete</span>
                </td>
              </tr>
              </tbody>
            </table>
            <div class="text-center">
              <router-link :to="{ name: 'analyzer' }" class="btn btn-outline-success">Add analyzer</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {HTTP} from '../http'

  export default {
    name: 'Hardware',
    data: function () {
      return {
        analyzers: []
      }
    },
    created: function () {
      HTTP.get('analyzers')
        .then(response => {
          console.log(response)
          this.analyzers = response.data.data
        })
        .catch(error => {
          console.log(error)
        })
    },
    methods: {
      deleteAnalyzer: function (analyzer) {
        console.log(analyzer)
      }
    }
  }
</script>

<style scoped>
  .badge {
    min-width: 70px;
  }
</style>
