<template>
  <div id="app">
    <img alt="Application Logo" src="./assets/logo.svg"><p id="test">Github API Test</p>
    
    <SearchUsers />
  </div>
</template>

<script>
import SearchUsers from './components/SearchUsers.vue';

export default
{
    name: 'app',
    components:
    {
        SearchUsers
    }
}
</script>

<style>
@import './assets/css/style.css';
</style>
