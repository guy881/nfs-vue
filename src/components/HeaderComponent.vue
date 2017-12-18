<template>
  <header>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container">
        <router-link :to="{ name: 'home' }" class="navbar-brand">NFS</router-link>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav mr-auto">
            <li class="nav-item">
              <router-link :to="{ name: 'home' }" class="nav-link" exact="">Scanning</router-link>
            </li>
            <li class="nav-item">
              <router-link :to="{ name: 'scans' }" class="nav-link" exact="">Previous scans</router-link>
            </li>
            <li class="nav-item">
              <router-link :to="{ name: 'hardware' }" class="nav-link" exact="">Hardware Configuration</router-link>
            </li>
            <li class="nav-item">
              <router-link :to="{ name: 'import' }" class="nav-link" exact="">Import</router-link>
            </li>
            <li class="nav-item">
              <router-link :to="{ name: 'settings' }" class="nav-link" exact="">Settings</router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </header>

</template>

<script>
  export default {
    name: 'HeaderComponent',
    components: {}
  }
</script>
<style lang="scss" scoped>
  @import "../styles/_variables.scss";

</style>
