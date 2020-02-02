<template>
    <div class="container">
        <a href="https://github.com/tutyamxx/MableTherapyTest/fork"><img width="149" height="149" id="forkme" src="https://github.blog/wp-content/uploads/2008/12/forkme_right_darkblue_121621.png?resize=149%2C149" class="attachment-full size-full" alt="Fork me on GitHub" data-recalc-dims="1"></a>
        <!-- Search box using vue | also autoselects the text on focus -->
        <div>
            <input type="text" v-model="search_query" class="search" placeholder="Search user" @focus="$event.target.select();"><button id="search-user" @click="clicked_search">Search</button>
        </div>

        <!-- Empty error message placeholder (will be filled upon Github request errors) -->
        <span v-html="show_error"></span><br>

        <!-- Show this div only if there is a result from Github API V3 and is not empty -->
        <div class="containerbox" v-if="searched_user">
            <!-- Github searched user avatar -->
            <a :href="searched_user_avatar + '?v=4'" target="_blank"><img id="user-avatar" :src="searched_user_avatar"></a>

            <!-- Github searched user profile details with a bit of error checking -->
            <p><b>🕵️‍♂️ Username:</b> {{searched_user.login}}</p>
            <p><b>👨‍🎓 Name:</b> {{(searched_user.name === null) ? "Not found" : searched_user.name}}</p>
            <p><b>🌍 Location:</b> {{(searched_user.location === null) ? "Not found" : searched_user.location}}</p>
            <p><b>📚 Public Repos:</b> {{(searched_user.public_repos === 0) ? "No repositories" : searched_user.public_repos}}</p>
            <p><b>🏷️ Bio:</b> {{(searched_user.bio === null) ? "Not found" : searched_user.bio}}</p>
            <p><b>✍️ Last Activity:</b> {{(last_activity.length > 0) ? last_activity[0].type.replace("Event", "") + " ➡️ " + last_activity[0].repo.name + last_commit_sha : "Unknown Activity 👀"}}</p>

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
            show_error: null,
            last_activity: [],
            last_commit_sha: ""
        };
    },

    methods:
    {
        // --| When the user clicked the search button
        clicked_search: async function ()
        {
            // --| Don't flood the Github API with empty requests (60 requests per hour idk for public access)
            if(this.search_query !== "")
            {
                // --| Wait to get basic details about the searched user from Github API V3
                await axios.get("https://api.github.com/users/" + this.search_query, GithubHeader).then(async (response) =>
                {
                    // --| Set the details
                    this.searched_user = await response.data;

                    // --| Remove ?v=4 at the end of the avatar URL
                    this.searched_user_avatar = await response.data.avatar_url.replace("?v=4", "");

                }).catch((e) =>
                {
                    // --| Custom message response
                    let szResponseMessage = "";

                    switch(e.response.status)
                    {
                        // --| 404 - not found
                        case 404:
                            szResponseMessage = "User not found";
                            break;
                        
                        // --| API reaching limit of requests
                        case 403:
                            szResponseMessage = "Request limit reached, try again in 1 hour";
                            break;
                        
                        // --| If there is none of the above just display the error as a message
                        default:
                            szResponseMessage = e.message;
                            break;
                    }

                    // --| Display an error
                    this.show_error = '<div id="notfound">' + szResponseMessage + '</div>';

                    // --| Clear the values from result
                    this.searched_user = "";
                    this.searched_user_avatar = DefaultGitAvatar;
                    this.searched_user_repos = [];

                    // --| Delete the error message after 2 seconds
                    setTimeout(() => { this.show_error = null; }, 2500);
                });

                // --| After first request completed, wait to get the public repositories of the searched user from Github API V3
                await axios.get("https://api.github.com/users/" + this.search_query + "/repos", GithubHeader).then(async (response) =>
                {
                    this.searched_user_repos = await response.data;

                }).catch(() =>
                {
                    // --| Clear the values from result
                    this.searched_user = "";
                    this.searched_user_repos = [];
                    this.searched_user_avatar = DefaultGitAvatar;

                    // --| Delete the error message after 2 seconds
                    setTimeout(() => { this.show_error = null; }, 2500);
                });

                // --| After second request completed, wait to get the last activity of the searched user from Github API V3
                await axios.get("https://api.github.com/users/" + this.search_query + "/events", GithubHeader).then(async (response) =>
                {
                    // --| Get the response
                    const UserActivity = await response.data;
                    this.last_activity = UserActivity;
                    
                    // --| If event has any commits in it
                    if(UserActivity[0] !== undefined && UserActivity[0].payload.hasOwnProperty("commits"))
                    {
                        this.last_commit_sha = " (" + UserActivity[0].payload.commits[0].sha.substr(0, 7) + ")";
                    }
                    
                    // --| No commit, no sha to pass.
                    else { this.last_commit_sha = ""; }

                }).catch(() => { });
            }

            else
            {
                // --| Display an error
                this.show_error = '<div id="notfound">Search field cannot be empty!</div>';

                // --| Delete the error message after 2 seconds
                setTimeout(() => { this.show_error = null; }, 2500);
            }
        }
    }
};
</script>

<style>
@import '../assets/css/style.css';
</style>