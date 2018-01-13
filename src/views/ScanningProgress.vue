<template>
  <div>
    <div class="card border-secondary mb-3 mt-3">
      <div class="card-header bg-info text-white">Scanning in progress</div>
      <div class="card-body">
        <div class="alert alert-danger" role="alert" v-if="errors">
          <ul>
            <li v-for="(error, field) in errors">{{ field }}: {{ error }}</li>
          </ul>
        </div>
        <div class="text-center">
          <h3>{{ scan.name }} in progress:</h3>

          <div class="status mt-5 mb-5">
            <p>{{ scan.status }}</p>
          </div>
        </div>
        <div class="progress">
          <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar"
               :aria-valuenow="scan.progress"
               aria-valuemin="0" aria-valuemax="100" :style="progressWidth"></div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
  import {HTTP} from '../http'

  export default {
    name: 'ScanningProgress',
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
      progressWidth: function () {
        return 'width: ' + this.scan.progress + '%'
      }
    },
    created: function () {
      var intr = setInterval(() => {
        this.getScan()
        if (this.scan.status === 'finished') {
          clearInterval(intr)
          this.$router.push({name: 'scanning_result', params: {id: this.scan.id}})
        }
      }, 2000)
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
