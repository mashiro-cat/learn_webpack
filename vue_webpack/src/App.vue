<template>
  <h1 class="title">hello app</h1>
  <ol>
    <li><router-link to="/home">home</router-link></li>
    <li><router-link to="/about">about</router-link></li>
  </ol>

  <router-view></router-view>
</template>

<script>
export default {};
</script>

<style>
.title {
  color: pink;
}
</style>
