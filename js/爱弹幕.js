var rule = {
    title: '爱弹幕',
    host: 'https://ani.girigirilove.com',
    homeUrl: '/',
    // 分类列表：新站点改成了 JSON 接口，fyclass=分类ID，fypage=页码
    url: 'https://m3u8.girigirilove.com/api.php/Vod/get_list?type_id=fyclass&offset=fypage&limit=20',
    filterable: 0, // 筛选功能暂时关闭，等列表、详情、播放都修好后再加回来
    class_name: '日番&美番&劇場版&真人番劇&BD副音軌&其他',
    class_url: '2&3&21&20&24&26',
    play_parse: true,

    推荐: `js:
        var api = 'https://m3u8.girigirilove.com/api.php/Vod/get_list?type_id=2&offset=0&limit=20&orderby=';
        var json = JSON.parse(request(api));
        var d = [];
        json.info.rows.forEach(function (it) {
            d.push({
                title: it.vod_name,
                img: it.vod_pic,
                desc: it.vod_remarks,
                url: String(it.vod_id)
            });
        });
        setResult(d);
    `,

    一级: `js:
        // input 里带着分类ID和页码，取出来后自己拼出真正的接口地址
        var tid = input.match(/type_id=(\\d+)/)[1];
        var pg = parseInt(input.match(/offset=(\\d+)/)[1]);
        var api = 'https://m3u8.girigirilove.com/api.php/Vod/get_list?type_id=' + tid
            + '&offset=' + ((pg - 1) * 20) + '&limit=20&orderby=';
        var json = JSON.parse(request(api));
        var d = [];
        json.info.rows.forEach(function (it) {
            d.push({
                title: it.vod_name,
                img: it.vod_pic,
                desc: it.vod_remarks,
                url: String(it.vod_id)
            });
        });
        setResult(d);
    `,

    // 二级（详情页）、lazy（播放）、搜索：等拿到对应接口的数据后再补上
}
