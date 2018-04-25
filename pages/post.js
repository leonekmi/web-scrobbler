/*
    This file is part of Kitsu Web Scrobbler.

    Kitsu Web Scrobbler is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    Kitsu Web Scrobbler is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Kitsu Web Scrobbler.  If not, see <http://www.gnu.org/licenses/>.
*/
var vm;
chrome.runtime.sendMessage({action: 'getScrobbling'}, scrobbling => {
    if (!scrobbling.error) {
        $('body').text(chrome.i18n.getMessage('nothing'));
        return;
    }
    getCredentials().then(userdata => {
        fetch('https://kitsu.io/api/edge/users?filter[self]=true', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/vnd.api+json',
                'Accept': 'application/vnd.api+json',
                'Authorization': 'Bearer ' + userdata.atoken
            },
        }).then(profile => {
            if (!profile.ok) throw new Error('Profile fetch failed');
            profile.json().then(jsondata => {
                vm = new Vue({
                    el: '#postbox',
                    data: {
                        scrobbling: scrobbling,
                        userdata: userdata,
                        profile: jsondata.data[0]
                    },
                    methods: {
                        trans: function(str) {
                            return chrome.i18n.getMessage(str);
                        },
                        post: function(e) {
                            postFeed(scrobbling.animeData.id, scrobbling.episode, {
                                text: $('textarea').val(),
                                spoiler: $('#spoiler').prop('checked'),
                                nsfw: $('#nsfw').prop('checked')
                            }).then(r => {
                                window.close();
                            });
                        }
                    }
                });
            });
        });
    });
});