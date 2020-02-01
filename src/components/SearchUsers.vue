<template>
    <div class="container">
        <div>
            <input type="text" v-model="search_query" class="search" placeholder="Search user" @focus="$event.target.select();"><button id="search-user" @click="clicked_search" v-on:keyup.enter="clicked_search">Search</button>
        </div>

        <span v-html="HTMLcontent"></span><br>

        <div class="maincontent">
            <img id="user-avatar" :src="searched_user_avatar">

            <p><b>🕵️‍♂️ Username:</b> {{searched_user.login}}</p>
            <p><b>🕵️‍♂️ Name:</b> {{(searched_user.name === null) ? "Not specified" : searched_user.name}}</p>
            <p><b>🌍 Location:</b> {{(searched_user.location === null) ? "Not specified" : searched_user.location}}</p>
            <p><b>📚 Public Repos:</b> {{(searched_user.public_repos === 0) ? "No repositories" : searched_user.public_repos}}</p>
            <p><b>🏷️ Bio:</b> {{(searched_user.bio === null) ? "Empty" : searched_user.bio}}</p>
            <p><b>🏷️ Profile Url:</b> <a :href="searched_user.html_url" target="_blank">{{searched_user.html_url}}</a></p>
        </div>

        <div class="maincontent">
            kekw
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
            HTMLcontent: null
        };
    },

    methods:
    {
        // --| When the user clicked the search button
        clicked_search: async function ()
        {
            // --| Get basic details about the searched user from Github API V3
            await axios.get("https://api.github.com/users/" + this.search_query, GithubHeader).then(async (response) =>
            {
                this.searched_user = await response.data;

                // --| Remove ?v=4 at the end of the avatar URL
                this.searched_user_avatar = await response.data.avatar_url.replace("?v=4", "");

            }).catch((e) =>
            {
                // --| Display an error
                this.HTMLcontent = '<div id="notfound">' + e.message + '</div>';

                // --| Clear the values from result
                this.searched_user = "";
                this.searched_user_avatar = DefaultGitAvatar;

                // --| Delete the error message after 2 seconds
                setTimeout(() => { this.HTMLcontent = null; }, 2500);
            });

            await axios.get("https://api.github.com/users/" + this.search_query + "/repos", GithubHeader).then(async (response) =>
            {
                this.searched_user_repos = await response.data;

            }).catch((e) =>
            {
                // --| Display an error
                this.HTMLcontent = '<div id="notfound">' + e.message + '</div>';

                // --| Clear the values from result
                this.searched_user = "";
                this.searched_user_avatar = DefaultGitAvatar;

                // --| Delete the error message after 2 seconds
                setTimeout(() => { this.HTMLcontent = null; }, 2500);
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

.maincontent
{
    margin-top: 45px;
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
</style>