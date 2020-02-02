<template>
  <div id="app">
    <img alt="Application Logo" src="https://mabletherapy.com/wp-content/themes/mabletherapy/assets/svgs/compressed/logo-mable.svg"><p id="test">(TEST)</p>
    
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
