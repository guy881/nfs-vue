<template>
  <div id="app">
    <HeaderComponent></HeaderComponent>
    <transition name="fade">
      <router-view/>
    </transition>
    <FooterComponent></FooterComponent>
  </div>
</template>

<script>
  import HeaderComponent from '@/components/HeaderComponent'
  import FooterComponent from '@/components/FooterComponent'

  export default {
    name: 'app',
    components: {
      HeaderComponent,
      FooterComponent
    }
  }
</script>

<style lang="scss">
  @import "styles/_variables.scss";
  @import "../node_modules/normalize.css/normalize";

</style>
