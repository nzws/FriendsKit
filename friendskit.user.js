// ==UserScript==
// @name            FriendsKit
// @namespace       https://github.com/yuzulabo
// @version         1.0.3
// @description     friends.nico の独自機能を再現するユーザスクリプト
// @author          nzws
// @match           https://knzk.me/*
// @grant           GM_addStyle
// @grant           GM_setClipboard
// @grant           GM_xmlhttpRequest
// @grant           unsafeWindow
// @connect         *
// @require         https://unpkg.com/blob-util/dist/blob-util.min.js
// ==/UserScript==

const s = localStorage.friendskit;
const F = {
    conf: s ? JSON.parse(s) : {
        keyword: []
    },
    imgcache: {},
    iconcache: {},
    regExps: [],
};
const api = F.conf.api_server ? F.conf.api_server : 'https://friendskit.nzws.me/api/';
const user_emoji_regexp = new RegExp(':(_|@)([A-Za-z0-9_@.]+):', 'gm');
const shorten_regexp = new RegExp('(sm|nm|im|sg|mg|bk|lv|co|ch|ar|ap|jk|nw|l\/|dic\/|user\/|mylist\/)([0-9]+)', 'gm');
F.conf.keyword.forEach(word => {
    F.regExps.push({
        word: word,
        regexp: new RegExp(word, 'gim')
    });
});

const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        mutation.addedNodes.forEach(node => runner(node));
    });
});

function watcher() {
    const p = location.pathname;
    if (F.path !== p) {
        runner(document.querySelector('.column:last-child'));
    }
    F.path = p;
}

function runner(node) {
    if (!node.tagName) return;
    const statusAll = node.querySelectorAll('.status__content');
    if (!statusAll[0]) return;

    for (let status of statusAll) {
        const ue_found = status.innerHTML.match(user_emoji_regexp);
        if (ue_found) {
            const display_name_account = status.parentNode.querySelector('.display-name__account');
            const status_display_name = status.parentNode.querySelector('.status__display-name');
            const origin_acct = display_name_account ? display_name_account.textContent.slice(1) : status_display_name.title;
            const domain = '@' + (origin_acct.indexOf('@') !== -1 ? origin_acct.split('@')[1] : location.hostname);

            replaceTool(status, ue_found, domain);
        } else {
            replaceTool(status);
        }
    }
}

function replaceTool(status, ue_found, domain) {
    if (status.hasChildNodes()) {
        for (let node of status.childNodes) {
            replaceTool(node, ue_found, domain);
        }
    } else {
        if (status.nodeName === '#text') {
            const html = document.createElement('span');
            html.innerHTML = status.data;

            if (ue_found) {
                ue_found.forEach(async data => {
                    let acct = data.slice(2).slice(0, -1);
                    if (acct.indexOf('@') === -1) acct += domain;

                    const image = await getIconUrl(acct);
                    html.innerHTML = html.innerHTML.replace(new RegExp(data, 'gm'), `<img src="${image}" class="emojione"/>`);
                });
            }

            F.regExps.forEach(regexp => {
                html.innerHTML = html.innerHTML.replace(regexp.regexp, `<span style='color: orange'>${regexp.word}</span>`);
            });
            html.innerHTML = html.innerHTML.replace(shorten_regexp, `<a href="http://nico.ms/$1$2" target="_blank" rel=”nofollow”>$1$2</a>`);

            status.parentNode.replaceChild(html, status);
        }
    }
}

const friendskit = {
    keyword: {
        add: (word) => {
            const key = F.conf.keyword.indexOf(word);
            if (key !== -1) {
                console.warn('[FriendsKit]', 'このワードは追加済みです');
                return;
            }

            F.conf.keyword.push(word);
            save();
            console.log('[FriendsKit]', 'Done✨');
        },
        remove: (word) => {
            const key = F.conf.keyword.indexOf(word);
            if (key === -1) {
                console.warn('[FriendsKit]', 'このワードは存在しません');
                return;
            }

            delete F.conf.keyword[key];
            save();
            console.log('[FriendsKit]', 'Done✨');
        },
        list: () => {
            console.log('[FriendsKit]', F.conf.keyword);
        },
        reset: () => {
            F.conf.keyword = [];
            save();
            console.log('[FriendsKit]', 'Done✨');
        }
    },
    changeSettings: (name, value) => {
        F.conf[name] = value ? value : null;
        save();
        console.log('[FriendsKit]', 'Done✨');
    },
    exportSettings: () => {
        GM_setClipboard('friendskit.importSettings(`' + localStorage.friendskit + '`)');
        console.log('[FriendsKit]', 'Done✨\nクリップボードにコピーしたコードをインポートしたいページの Console にそのまま打ち込んでください。');
    },
    resetSettings: () => {
        delete localStorage.friendskit;
        return !localStorage.friendskit;
    },
    importSettings: (data) => {
        try {
            JSON.parse(data);
        } catch(e) {
            console.warn('[FriendsKit]', 'このデータは壊れています', e);
            return;
        }
        localStorage.friendskit = data;
        console.log('[FriendsKit]', 'Done✨');
    }
};
exportFunction(friendskit, unsafeWindow, {defineAs: 'friendskit' });

async function getImage(url) {
    return new Promise(resolve => {
        if (F.imgcache[url]) {
            resolve(F.imgcache[url]);
            return;
        }
        blobUtil.imgSrcToDataURL(url, 'image/png', 'Anonymous').then(function (dataurl) {
            F.imgcache[url] = dataurl;
            resolve(F.imgcache[url]);
        }).catch(function (err) {
            console.warn('[FriendsKit]', '画像取得に失敗', url);
        });
    });
}

async function getIconUrl(acct) {
    return new Promise(resolve => {
        if (F.iconcache[acct]) {
            resolve(F.iconcache[acct]);
            return;
        }

        GM_xmlhttpRequest({
            method: 'POST',
            responseType: 'json',
            url: api + 'get_icon.php?acct=' + acct,
            onerror: () => {
                console.warn('[FriendsKit]', 'json取得に失敗', acct);
                return;
            },
            onload: (response) => {
                if (response.status !== 200) {
                    console.warn('[FriendsKit]', `json取得に失敗 ${response.status}`, acct);
                    return;
                }

                if (response.response.error) {
                    console.warn('[FriendsKit]', response.response.error, acct);
                    return;
                }

                F.iconcache[acct] = response.response.url;
                resolve(F.iconcache[acct]);
            }
        });
    });
}

function save() {
    const data = JSON.stringify(F.conf);
    localStorage.friendskit = data;
}

function at_pizza() {
    const textarea = document.querySelector('.autosuggest-textarea__textarea');
    if (!textarea) return;

    if (textarea.value.match(/[@|＠]ピザ/)) {
        window.open('https://www.google.com/search?q=近くのピザ屋さん');
    }

    if (textarea.value.match(/[@|＠]ハローワーク/)) {
        window.open('https://www.hellowork.go.jp/');
    }
}

const mainElem = document.getElementById('mastodon');
if (!mainElem) return;

observer.observe(mainElem, { childList: true, subtree: true });

let css = ``;

window.onload = async () => {
    if (!F.conf.fav_icon_default_force) {
        const i = F.conf.fav_icon ? await getImage(F.conf.fav_icon) : 'https://media.knzk.me/media_attachments/files/004/510/885/original/caf4ce0b3e7bd6d3.png';
        const ig = F.conf.fav_icon_gray ? await getImage(F.conf.fav_icon_gray) : 'https://media.knzk.me/media_attachments/files/004/510/887/original/bfb5e4222a3423fd.png';

        const char = F.conf.fav_icon_char ? F.conf.fav_icon_char : null;

        css += `
.fa-star {
background-image: ${char || !ig ? `none` : `url('${ig}')`};
width: 16px;
height: 16px;
background-size: cover;
background-repeat: no-repeat;
background-position: center center;
}

.fa-star:before {
content: '${char ? char : (ig ? '' : '\\f005')}';
}

.active .fa-star, .notification__message .fa-star {
background-image: ${char || !i ? `none` : `url('${i}')`};
}

.active .fa-star:before, .notification__message .fa-star:before {
content: '${char ? char : (i ? '' : '\\f005')}';
}
`;

        if (i && !char) {
            css += `
.active .fa-star, .notification__message .fa-star {
background-image: url('${i}');
}
`;
        }
    }

    if (!F.conf.no_fav_icon_big) {
        css += `
.status__info, .status__content {
margin-right: 40px;
}

.status button.star-icon {
position: absolute;
top: 20px;
right: 10px;
z-index: 999999;
}

.status .fa-star {
width: 40px;
height: 40px;
font-size: 2em;
}
`;
    }

    GM_addStyle(css);
    setInterval(watcher, 1000);

    document.querySelector('.compose-form__publish-button-wrapper button').addEventListener('click', at_pizza, false);
    document.querySelector('.autosuggest-textarea__textarea').onkeydown = (e) => {
        if (e.keyCode === 13 && (e.ctrlKey || e.metaKey)) at_pizza();
    };
};