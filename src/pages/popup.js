/*!
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
/* global moment, ClipboardJS */
if (new URL(document.location.href).searchParams.get('popup')) {
    $('body').css('width', 'auto');
    $('.header .right').remove();
    $('#mac').attr('href', 'makeAChoose.html?popup=1');
}
var vm;
chrome.runtime.sendMessage({action: 'getScrobbling'}, scrobbling => {
    vm = new Vue({
        el: '.vue',
        data: {
            scrobbling: scrobbling
        },
        methods: {
            trans: function(id, ...args) {
                return chrome.i18n.getMessage(id, args);
            },
            mjsnow: function(date) {
                return moment(date).fromNow();
            },
            getVersion: function() {
                return chrome.runtime.getManifest().version;
            },
            showComment: function(comment) {
                var target = comment.path.find(element => {
                    return element.nodeName === 'A';
                });
                $(target).parent().parent().children('.end').show();
                $(target).parent().hide();
                var comments = $(target).parents('.row.stream-item.ember-view')[0];
                $(comments).children('.stream-item-comments.ember-view.end').show();
            },
            scrobbleNow: function(cevent) {
                chrome.runtime.sendMessage({action: 'scrobbleNow'}, function(response) {
                    $(cevent.target).remove();
                    this.scrobbling.notice = chrome.i18n.getMessage('scrobbled');
                });
            },
            openOptions: function() {
                chrome.runtime.openOptionsPage();
                window.close();
            },
            openDropdown: function(e) {
                e.preventDefault();
                var target = e.path.find(element => {
                    return element.nodeName === 'SPAN';
                });
                $(target).toggleClass('open');
            },
            pDefault: function(e) {
                e.preventDefault();
                console.warn('Report and Block events are not handled for now');
            },
            copyLink: function(e) {
                e.preventDefault();
                $(e.target).parent().parent().toggleClass('open');
            },
            followPost: function(e) {
                e.preventDefault();
                followPost($(e.target).attr('data-post-id'));
                $(e.target).parent().parent().toggleClass('open');
            },
            likePost: function(e) {
                e.preventDefault();
                var target = e.path.find(element => {
                    return element.nodeName === 'A';
                });
                if ($(target).attr('data-post-liked') === 'true') {
                    unlikePost($(target).attr('data-post-id'));
                    $(target).attr('data-post-liked', 'false');
                } else {
                    likePost($(target).attr('data-post-id'));
                    $(target).attr('data-post-liked', 'true');
                }
                $(target).toggleClass('is-liked');
            },
            openPopup: function(e) {
                e.preventDefault();
                window.open(chrome.runtime.getURL('pages/popup.html?popup=1'),'das','location=no,links=no,scrollbars=no,toolbar=no');
                window.close();
                return;
            }
        },
        created: function() {
            $('.progress').progress({
                total: scrobbling.animeData.attributes.episodeCount
            });
            $('.progress').progress('set progress', scrobbling.progress);
            new ClipboardJS('.copylink');
        }
    });
});

var refreshInterval = setInterval(function() {
    chrome.runtime.sendMessage({action: 'getScrobbling'}, scrobbling => {
        vm.scrobbling = scrobbling;
        $('.progress').progress({
            total: scrobbling.animeData.attributes.episodeCount
        });
        $('.progress').progress('set progress', scrobbling.progress);
        new ClipboardJS('.copylink');
    });
}, 3500);