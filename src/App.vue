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
#app
{
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
}

body
{
    background-color: #2c3e50;
    height: 100%;
}

#test
{
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    display: inline;
    color: whitesmoke;
    font-weight: bold;
    font-size: large;
}
</style>
