function getParam(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    let regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

// サムネイルを作成し画像を設定する
function setThumbimg() {
    // サムネイルがすでに有るか確認する
    let thumbimg = document.getElementById('thumbimg');
    // サムネイルがなかったら作成する
    if (thumbimg === null) {
        thumbimg = document.createElement('span');
        thumbimg.setAttribute('id', 'thumbimg');
        thumbimg.setAttribute('dir', 'auto');
        thumbimg.setAttribute('class', 'style-scope yt-formatted-string');

        let h1_list = document.getElementsByTagName('h1');
        let title = h1_list[1];
        if (title == null) {
            // まだタイトルが用意されていなかったら設定しない
            return;
        }
        //let child = title.firstChild;
        let child_list = title.getElementsByTagName('yt-formatted-string');
        let child = child_list[0];
        child.prepend(thumbimg);
    }

    // パラメータ取得
    let param_v = getParam('v');
    // パラメータがなかったら処理しない
    if (param_v == null) {
        return;
    }
    // 以前と同じパラメータなら処理しない
    if (current_param_v === param_v) {
        return;
    }
    current_param_v = param_v;

    // 画像設定
    let small_img = 'https://img.youtube.com/vi/'+param_v+'/default.jpg';
    let big_img = 'https://img.youtube.com/vi/'+param_v+'/maxresdefault.jpg';
    let xhr = new XMLHttpRequest();
    xhr.open("HEAD", big_img, false);
    xhr.send(null);
    if (xhr.status == 404) {
        big_img = 'https://img.youtube.com/vi/'+param_v+'/hqdefault.jpg';
    }
    // サムネイル画像を設定する
    let tag = '<a href="'+big_img+'" target="_blank">'
            + '<img src="'+small_img+'" style="position: relative; top: 0.2rem; height: 1.9rem; margin-right: 0.5rem;">'
            + '</a>';
    thumbimg.innerHTML = tag;

    // サムネイル画像を右クリックした時、エンディング画像をトグル表示切り替えする
    document.getElementById("thumbimg").oncontextmenu = function() {
        let show_list = document.querySelectorAll('.ytp-ce-element-show');
        if (show_list.length) {
            show_list.forEach((element) => {
                element.classList.remove('ytp-ce-element-show');
                element.classList.add('ytp-ce-element-show-xxx');
            });
            return false;
        }

        let xxx_list = document.querySelectorAll('.ytp-ce-element-show-xxx');
        if (xxx_list.length) {
            xxx_list.forEach((element) => {
                element.classList.remove('ytp-ce-element-show-xxx');
                element.classList.add('ytp-ce-element-show');
            });
            return false;
        }

        return false;
    }

}

// 読み込まれた時に更新する（２秒後）
window.addEventListener('load', function(){
    setTimeout(function () {
        setThumbimg();
    }, 2000);
});

// URLが変化した時に更新する
let current_href = location.href;
let current_param_v = null;
let observer = new MutationObserver(function(mutations) {
    if(current_href !== location.href) {
        setTimeout(function () {
            setThumbimg();
        }, 2000);
        current_href = location.href;
    }
});
observer.observe(document, { childList: true, subtree: true });

// 前面になった時に更新する
window.addEventListener('focus', function() {
    setTimeout(function () {
        setThumbimg();
    }, 2000);
});
