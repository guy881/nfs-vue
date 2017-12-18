<template>
  <div>
    <div class="row">
      <div class="col-7">
        <div class="card border-secondary mb-3 mt-3">
          <div class="card-header bg-info text-white">Hardware Configuration</div>
          <div class="card-body">
            <h4 class="card-title">Spectrum analyzers</h4>
            <table class="table table-hover">
              <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Name</th>
                <th scope="col">Model</th>
                <th scope="col">Freq. range</th>
                <th scope="col">Default</th>
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
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div class="col-5">
        <div class="card border-secondary mb-3 mt-3">
          <div class="card-header ">Hardware Configuration</div>
          <div class="card-body">
            <h4 class="card-title">Spectrum analyzers</h4>

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
        analyzers: [
          {
            name: 'My analyzer',
            model: 'ZVL Rohde & Schwarz',
            freq_range: '9 kHz - 3 GHz',
            default: true
          },
          {
            name: 'My analyzer 2',
            model: 'ZVL Rohde & Schwarz',
            freq_range: '9 kHz - 3 GHz',
            default: false
          }
        ]
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
    }
  }
</script>

<style scoped>
  .badge {
    min-width: 70px;
  }
</style>
