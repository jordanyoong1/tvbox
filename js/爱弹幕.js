var rule = {
    title: '爱弹幕',
    host: 'https://ani.girigirilove.com',
    homeUrl: '/',
    // 分类列表：fyclass=分类ID，fypage=页码
    url: 'https://m3u8.girigirilove.com/api.php/Vod/get_list?type_id=fyclass&offset=fypage&limit=20',
    // 详情接口：fyid=影片ID
    detailUrl: 'https://m3u8.girigirilove.com/api.php/Vod/get_detail?vod_id=fyid&user_id=',
    // 搜索接口（根据列表接口里的 vod_name 参数推测，未经验证）
    searchUrl: 'https://m3u8.girigirilove.com/api.php/Vod/get_list?vod_name=**&offset=fypage&limit=20',
    searchable: 2,
    quickSearch: 0,
    filterable: 1, // 筛选功能暂时关闭，等其他部分都正常后再加回来
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

    二级: `js:
        var json = JSON.parse(request(input));
        var it = json.info;
        var pic = it.vod_pic || '';
        // 详情接口里的封面是相对路径，需要补上图片域名
        if (pic.indexOf('http') !== 0) {
            pic = 'https://jpg.girigirilove.com/' + pic;
        }
        VOD = {
            vod_id: it.vod_id,
            vod_name: it.vod_name,
            vod_pic: pic,
            type_name: it.vod_class,
            vod_year: it.vod_year,
            vod_area: it.vod_area,
            vod_remarks: it.vod_remarks,
            vod_actor: it.vod_actor,
            vod_director: it.vod_director,
            vod_content: String(it.vod_content || it.vod_blurb || '').replace(/<[^>]+>/g, ''),
            // 这两项本身就是 TVBox 认识的格式，原样传过去即可
            vod_play_from: it.vod_play_from,
            vod_play_url: it.vod_play_url
        };
    `,

    // 播放地址已经是 .m3u8 或 .mp4 直链，不需要再解析
    lazy: `js:
        input = {
            jx: 0,
            parse: 0,
            url: input,
            header: { 'Referer': 'https://ani.girigirilove.com/' }
        };
    `,

    搜索: `js:
        var kw = input.match(/vod_name=([^&]*)/)[1];
        try { kw = encodeURIComponent(decodeURIComponent(kw)); } catch (e) {}
        var pg = parseInt(input.match(/offset=(\\d+)/)[1]);
        // 真实的搜索请求里没有 type_id 参数，每页 24 条
        var api = 'https://m3u8.girigirilove.com/api.php/Vod/get_list?offset=' + ((pg - 1) * 24)
            + '&limit=24&vod_name=' + kw + '&orderby=';
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
}
