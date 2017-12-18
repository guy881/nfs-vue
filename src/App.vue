<template>
  <div id="app">
    <HeaderComponent></HeaderComponent>
    <div class="container">
      <transition name="fade">
        <router-view/>
      </transition>
    </div>
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

  // fluent animation between view

  .fade-enter-active, .fade-leave-active {
    transition-property: opacity;
    transition-duration: .2s;
  }

  .fade-enter-active {
    transition-delay: .2s;
  }

  .fade-enter, .fade-leave-active {
    opacity: 0
  }

</style>
