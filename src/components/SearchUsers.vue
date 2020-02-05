<template>
    <div class="container">
        <a href="https://github.com/tutyamxx/MableTherapyTest/fork"><img width="130" height="120" id="forkme" src="https://github.blog/wp-content/uploads/2008/12/forkme_right_darkblue_121621.png?resize=149%2C149" class="attachment-full size-full" alt="Fork me on GitHub" data-recalc-dims="1"></a><br>
        
        <!-- Search box using vue | also autoselects the text on focus -->
        <div>
            <input type="text" v-model.trim="search_query" class="search" placeholder="Search user or paste Github URL" @keyup.enter="clicked_search($event);" @focus="$event.target.select();"><button id="search-user" @click="clicked_search($event);">Search</button>
        </div>

        <!-- Empty error message placeholder (will be filled upon Github request errors) -->
        <span v-html="show_error"></span><br>

        <!-- Some loadng animation when user clicks search -->
        <div class="loading" v-if="loading_animation"><img src="../assets/loading.svg"></div>

        <!-- Show this div only if there is a result from Github API V3 and is not empty -->
        <div class="containerbox" v-if="searched_user && loading_animation === false">

            <!-- Github searched user avatar -->
            <a :href="searched_user_avatar + '?v=4'" target="_blank"><img id="user-avatar" :src="searched_user_avatar"></a>

            <!-- Github searched user profile details with a bit of error checking -->
            <p><b>🕵️‍♂️ Username:</b> {{searched_user.login}}</p>
            <p><b>👨‍🎓 Name:</b> {{(searched_user.name === null) ? "Not found" : searched_user.name}}</p>
            <p><b>🌍 Location:</b> {{(searched_user.location === null) ? "Not found" : searched_user.location}}</p>
            <p><b>📚 Public Repos:</b> {{(searched_user.public_repos === 0) ? "No repositories" : searched_user.public_repos}}</p>
            <p><b>🏷️ Bio:</b> {{(searched_user.bio === null) ? "Not found" : searched_user.bio}}</p>

            <!-- If there is no url provided from JSON data (null or empty), this will be empty anyway -->
            <p><b>🏷️ Profile Url:</b> <a :href="searched_user.html_url" target="_blank">{{searched_user.html_url}}</a></p>

            <!-- Show the user's last activity -->
            <b>✍️ Last Activity:</b> <div id="activity" v-html="show_last_activity"></div>
            <br>
        </div>

        <!-- Github searched user list of all public repos, if it's empty, this will not be displayed on the page -->
        <div class="containerbox" v-if="searched_user_repos.length > 0 && loading_animation === false">
            <p id="repos">📚 Latest Repositories Available:</p>
            <ul>
                <li v-for="repo in searched_user_repos" v-bind:key="repo.id">🔗<a :href="repo.html_url" target="_blank">{{repo.full_name}}&nbsp;<b>({{(repo.language !== null) ? repo.language : "❓"}})</b></a></li>
            </ul>
        </div><br>
    </div>
</template>

<script>
import axios from 'axios';
import validUrl from 'valid-url';

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
            last_commit_sha: "",
            loading_animation: false
        };
    },

    methods:
    {
        // --| When the user clicked the search button
        clicked_search: async function (event)
        {
            // --| Display a loading animation
            this.loading_animation = true;

            // --| Blur after the query has been set
            event.target.blur();

            // --| Forgot to trim the search query and let people search usernames with spaces in front and after...
            // --| Also this magic allows to search directly from Github URL's too!
            // --| Example: https://github.com/tutyamxx/MableTherapyTest -> will return "tutyamxx"
            let FormatSearchQuery = this.search_query.trim();

            // --| Check if URL starts with https or http ://github.
            let RegexCheckHTTP = new RegExp(/^(?:https?:\/\/)?(?:www\.)?github\.[a-zA-Z0-9./]+$/, "gi");
            FormatSearchQuery = (FormatSearchQuery.match(RegexCheckHTTP)) ? this.search_query = FormatSearchQuery = FormatSearchQuery.trim().replace(/(https?:\/\/|www\.)/gi, "").split("/")[1] : FormatSearchQuery.replace("%", "");

            // --| Don't flood the Github API with empty requests (60 requests per hour idk for public access)
            if(FormatSearchQuery !== "")
            {
                 // --| Check if is not a valid Github URL and display a error
                if(validUrl.isUri(FormatSearchQuery) && !FormatSearchQuery.match(RegexCheckHTTP))
                {
                    // --| Display an error
                    this.show_error = '<div id="notfound">Not a valid Github URL!</div>';
                    this.loading_animation = false;

                    // --| Delete the error message after 2 seconds
                    setTimeout(() => { this.show_error = null; }, 2500);

                    return;
                }
                
                // --| Call our URLs for the searched user from Github API V3 in one single request
                await axios.all(
                [
                    axios.get("https://api.github.com/users/" + FormatSearchQuery, GithubHeader), 
                    axios.get("https://api.github.com/users/" + FormatSearchQuery + "/repos", GithubHeader), 
                    axios.get("https://api.github.com/users/" + FormatSearchQuery + "/events", GithubHeader)
                    
                ]).then(await axios.spread(async (ResponseForUsers, ResponseForRepos, ResponseForEvents) =>
                {
                    // --| Handle stuff for basic user profile response
                    if(ResponseForUsers)
                    {
                        // --| Set the details
                        this.searched_user = await ResponseForUsers.data;
                        this.loading_animation = false;

                        // --| Remove ?v=4 at the end of the avatar URL
                        this.searched_user_avatar = await ResponseForUsers.data.avatar_url.replace("?v=4", "");
                    }

                    // --| Handle stuff for repo response
                    if(ResponseForRepos)
                    {
                        this.searched_user_repos = await ResponseForRepos.data;
                    }

                    // --| Handle stuff for events response
                    if(ResponseForEvents)
                    {
                        // --| Get the response
                        const UserActivity = await ResponseForEvents.data;
                        this.last_activity = UserActivity;
                        
                        // --| If event has any commits in it
                        if(UserActivity[0] !== undefined && UserActivity[0].payload.hasOwnProperty("commits"))
                        {
                            this.last_commit_sha = UserActivity[0].payload.commits[0].sha;
                        }
                        
                        // --| No commit, no sha to pass.
                        else { this.last_commit_sha = ""; }
                    }

                })).catch((errorUser, errorRepos, errorEvents) =>
                {
                    // --| Catch any error from the first url call
                    if(errorUser)
                    {
                        // --| Custom message response
                        let szResponseMessage = "";

                        switch(errorUser.response.status)
                        {
                            // --| 404 - not found
                            case 404:
                                szResponseMessage = "User not found";
                                break;
                            
                            // --| API reaching limit of requests
                            case 403:
                                szResponseMessage = "Request limit reached, try again in 1 hour";
                                break;
                            
                            // --| 400 - Bad Request
                            case 400:
                                szResponseMessage = "Bad request 😡";
                                break;
                            
                            // --| If there is none of the above just display the error as a message
                            default:
                                szResponseMessage = errorUser.message;
                                break;
                        }

                        // --| Display an error
                        this.show_error = '<div id="notfound">' + szResponseMessage + '</div>';

                        // --| Clear the values from result
                        this.searched_user = "";
                        this.searched_user_avatar = DefaultGitAvatar;
                        this.searched_user_repos = [];
                        this.loading_animation = false;

                        // --| Delete the error message after 2 seconds
                        setTimeout(() => { this.show_error = null; }, 2500);
                    }

                    // --| Catch the error from second url call
                    if(errorRepos)
                    {
                        // --| Clear the values from result
                        this.searched_user = "";
                        this.searched_user_repos = [];
                        this.searched_user_avatar = DefaultGitAvatar;

                        // --| Delete the error message after 2 seconds
                        setTimeout(() => { this.show_error = null; }, 2500);
                    }

                    // --| Catch the error from the third url call
                    // eslint-disable-next-line no-empty
                    if(errorEvents) { }
                });
            }

            else
            {
                // --| Display an error
                this.show_error = '<div id="notfound">Search field cannot be empty!</div>';
                this.loading_animation = false;

                // --| Delete the error message after 2 seconds
                setTimeout(() => { this.show_error = null; }, 2500);
            }
        }
    },

    computed:
    {
        show_last_activity: function ()
        {
            // --| If there is no activity, display custom response
            if(this.last_activity.length <= 0)
            {
                return "Unknown Activity 👀";
            }

            // --| Get the activity type
            const ActivityEvent = this.last_activity[0].type.replace("Event", "");

            // --| If the last activity is a EventPush, we want to get the commit and url, otherwise just display the event
            return (ActivityEvent === "Push" ? ActivityEvent + " ➡️ " + this.last_activity[0].repo.name + ' (<a href="https://github.com/' + this.last_activity[0].repo.name + "/commit/" + this.last_commit_sha + '" target="_blank">' + this.last_commit_sha.substr(0, 7) + "</a>)" : ActivityEvent + " ➡️ " + this.last_activity[0].repo.name);
        }
    }
};
</script>

<style>
@import '../assets/css/style.css';
</style>