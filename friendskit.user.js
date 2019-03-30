// ==UserScript==
// @name            FriendsKit
// @namespace       https://github.com/yuzulabo
// @version         0.1.0
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
const user_emoji_regexp = new RegExp(':_([A-Za-z0-9_@.]+):', 'gm');
F.conf.keyword.forEach(word => {
    F.regExps.push({
        word: word,
        regexp: new RegExp(word, 'gim')
    });
});

const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        mutation.addedNodes.forEach(async node => {
            if (!node.tagName) return;
            const status = node.querySelector('.status__content');
            if (!status) return;

            const ue_found = status.innerHTML.match(user_emoji_regexp);
            if (ue_found) {
                let domain = '';

                const status_display_name = node.querySelector('.status__display-name');
                if (status_display_name) {
                    const origin_acct = status_display_name.title;
                    if (origin_acct.indexOf('@') !== -1) {
                        domain = '@' + origin_acct.split('@')[1];
                    } else {
                        domain = '@' + location.hostname;
                    }
                } else {
                    const origin_acct = node.querySelector('.display-name__account').textContent.slice(1);
                    domain = '@' + origin_acct.split('@')[1];
                }

                ue_found.forEach(async data => {
                    let acct = data.slice(2).slice(0, -1);
                    if (acct.indexOf('@') === -1) acct += domain;

                    const image = await getIconUrl(acct);
                    const regExp = new RegExp(data, 'gm');
                    status.innerHTML = status.innerHTML.replace(regExp, `<img src="${image}" class="emojione"/>`);
                });
            }

            F.regExps.forEach(regexp => replaceHighlight(regexp, status));
        });
    });
});

function replaceHighlight(regexp, status) {
    if (status.hasChildNodes()) {
        for (let node of status.childNodes) {
            replaceHighlight(regexp, node);
        }
    } else {
        if (status.nodeName === '#text') {
            const html = document.createElement('span');
            html.innerHTML = status.data.replace(regexp.regexp, `<span style='color: orange'>${regexp.word}</span>`);
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
                    console.warn('[FriendsKit]', response.response.error);
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

    if (textarea.value.indexOf('@ピザ') !== -1) {
        window.open('https://www.google.com/search?q=近くのピザ屋さん');
    }
}

let css = ``;

(async () => {
    if (F.conf.fav_icon && F.conf.fav_icon_gray) {
        const i = await getImage(F.conf.fav_icon);
        const ig = await getImage(F.conf.fav_icon_gray);

        css += `
.fa-star {
background-image: url('${i}');
width: 16px;
height: 16px;
background-size: cover;
background-repeat: no-repeat;
background-position: center center;
}

.active .fa-star, .notification__message .fa-star {
background-image: url('${ig}');
}

.fa-star:before {
content: '';
}
`;
    }

    if (F.conf.fav_icon_big) {
        css += `
.status__info, .status__content {
margin-right: 40px;
}

.status button.star-icon {
position: absolute;
top: 20px;
right: 10px;
}

.status .fa-star {
width: 40px;
height: 40px;
font-size: 2em;
}
`;
    }

    GM_addStyle(css);

    const mainElem = document.getElementById('mastodon');
    if (!mainElem) return;

    observer.observe(mainElem, { childList: true, subtree: true });

    const bt = document.querySelector('.compose-form__publish-button-wrapper button');
    if (bt) bt.addEventListener('click', at_pizza, false);
})();