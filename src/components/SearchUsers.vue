<template>
    <div class="container">
        <!-- Search box using vue | also autoselects the text on focus -->
        <div>
            <input type="text" v-model="search_query" class="search" placeholder="Search user" @focus="$event.target.select();"><button id="search-user" @click="clicked_search">Search</button>
        </div>

        <!-- Empty error message placeholder (will be filled upon Github request errors) -->
        <span v-html="show_error"></span><br>

        <!-- Show this div only if there is a result from Github API V3 and is not empty -->
        <div class="containerbox" v-if="searched_user">
            <!-- Github searched user avatar -->
            <img id="user-avatar" :src="searched_user_avatar">

            <!-- Github searched user profile details with a bit of error checking -->
            <p><b>🕵️‍♂️ Username:</b> {{searched_user.login}}</p>
            <p><b>🕵️‍♂️ Name:</b> {{(searched_user.name === null) ? "Not found" : searched_user.name}}</p>
            <p><b>🌍 Location:</b> {{(searched_user.location === null) ? "Not found" : searched_user.location}}</p>
            <p><b>📚 Public Repos:</b> {{(searched_user.public_repos === 0) ? "No repositories" : searched_user.public_repos}}</p>
            <p><b>🏷️ Bio:</b> {{(searched_user.bio === null) ? "Not found" : searched_user.bio}}</p>

            <!-- If there is no url provided from JSON data (null or empty), this will be empty anyway -->
            <p><b>🏷️ Profile Url:</b> <a :href="searched_user.html_url" target="_blank">{{searched_user.html_url}}</a></p>
        </div>

        <!-- Github searched user list of all public repos, if it's empty, this will not be displayed on the page -->
        <div class="containerbox" v-if="searched_user_repos.length > 0">
            <p id="repos">📚 Repositories Available:</p>
            <ul>
                <li v-for="repo in searched_user_repos" v-bind:key="repo.id">🔗<a :href="repo.html_url" target="_blank">{{repo.full_name}}</a></li>
            </ul>
        </div><br>
    </div>
</template>

<script>
import axios from 'axios';

// --| Some random Github default avatar
const DefaultGitAvatar = require("../assets/defaultavatar.png");

// --| Request V3 specifically
const GithubHeader = { headers: { Accept: "application/vnd.github.v3+json" } };

export default
{
    name: 'SearchUsers',
    
    data()
    {
        return {
            search_query: "",
            searched_user: "",
            searched_user_avatar: DefaultGitAvatar,
            searched_user_repos: [],
            show_error: null
        };
    },

    methods:
    {
        // --| When the user clicked the search button
        clicked_search: async function ()
        {
            // --| Wait to get basic details about the searched user from Github API V3
            await axios.get("https://api.github.com/users/" + this.search_query, GithubHeader).then(async (response) =>
            {
                this.searched_user = await response.data;

                // --| Remove ?v=4 at the end of the avatar URL
                this.searched_user_avatar = await response.data.avatar_url.replace("?v=4", "");

            }).catch((e) =>
            {
                // --| Display an error
                this.show_error = '<div id="notfound">' + e.message + '</div>';

                // --| Clear the values from result
                this.searched_user = "";
                this.searched_user_avatar = DefaultGitAvatar;

                // --| Delete the error message after 2 seconds
                setTimeout(() => { this.show_error = null; }, 2500);
            });

            // --| After first request completed, wait to get the public repositories of the searched user from Github API V3
            await axios.get("https://api.github.com/users/" + this.search_query + "/repos", GithubHeader).then(async (response) =>
            {
                this.searched_user_repos = await response.data;

            }).catch((e) =>
            {
                // --| Display an error
                this.show_error = '<div id="notfound">' + e.message + '</div>';

                // --| Clear the values from result
                this.searched_user = "";
                this.searched_user_avatar = DefaultGitAvatar;

                // --| Delete the error message after 2 seconds
                setTimeout(() => { this.show_error = null; }, 2500);
            });
        }
    }
};
</script>

<style>
.search
{
    margin-top: 30px;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    border-radius: 5px;
    width: 50%;
    height: 40px;
    font-family: 'Special Elite', cursive;
    padding: 8px;
    -moz-box-shadow: 0 0 8px whitesmoke;
    -webkit-box-shadow: 0 0 8px whitesmoke;
    box-shadow: 0 0 8px whitesmoke;
}

.containerbox
{
    margin-top: 20px;
    width: 100%;
    height: 100%;
    max-width: 100%;
    -moz-box-shadow: 0 0 8px whitesmoke;
    -webkit-box-shadow: 0 0 8px whitesmoke;
    box-shadow: 0 0 8px whitesmoke;
    background-color: aliceblue;
    display: block;
    margin-left: auto;
    margin-right: auto;
    text-align: left;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    border-radius: 5px;
    padding: 10px;
    padding-top: 30px;
    position: relative;
    overflow-wrap: break-word;
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
}

#user-avatar
{
    margin-top: 5px;
    margin-right: 5px;
    position: absolute;
    top: 0;
    right: 0;
    width: 100px;
    height: 100px;
    max-height: 100%;
    max-width: 100%;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    border-radius: 5px;
}

#search-user
{
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    border-radius: 5px;
    width: 100px;
    height: 40px;
    font-family: 'Special Elite', cursive;
    padding: 8px;
    -moz-box-shadow: 0 0 8px whitesmoke;
    -webkit-box-shadow: 0 0 8px whitesmoke;
    box-shadow: 0 0 8px whitesmoke;
    margin-left: 5px;
    display: inline-block;
    padding-top: 5px;
    background-color: whitesmoke;
    text-align: center;
    font-weight: bold;
}

#notfound
{
    font-family: 'Special Elite', cursive;
    text-align: center;
    font-weight: bold;
    color: brown;
    margin-top: 20px;
    margin-bottom: -55px;
    padding: 10px;
}

#repos
{
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    padding: 8px;
    text-align: center;
    margin-bottom: 25px;
}
</style>