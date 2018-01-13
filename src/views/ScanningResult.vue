<template>
  <div>
    <div class="card border-secondary mb-3 mt-3">
      <div class="card-header bg-info text-white">Scanning results</div>
      <div class="card-body">
        <div class="alert alert-danger" role="alert" v-if="errors">
          <ul>
            <li v-for="(error, field) in errors">{{ field }}: {{ error }}</li>
          </ul>
        </div>
        <div class="text-center">
          <h3>{{ scan.name }} result:</h3>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
  import {HTTP} from '../http'

  export default {
    name: 'ScanningResult',
    data: function () {
      return {
        scan: {
          name: '',
          status: null,
          progress: 0
        },
        errors: null
      }
    },
    computed: {
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
            } else {
              this.scan.status = response.data.status
              this.scan.progress = response.data.progress
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
