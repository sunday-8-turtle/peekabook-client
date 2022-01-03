<template>
  <div id="nav">
    <router-link to="/">민교님 새로 팜</router-link> |
    <router-link to="/about">창오님 잘 되나요</router-link>
  </div>
  <router-view />
</template>

<script setup lang="ts">
// setup 옵션이 lang="ts" 옵션보다 먼저 와야합니다.
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
