const axios = require("axios");
const cheerio = require("cheerio");
const spreadsheet = require('./spreadsheet');
const getHtml = async (count) => {
    try {
        return await axios.post("https://work.mma.go.kr/caisBYIS/search/cygonggogeomsaek.do", 'ar_eopjong_gbcd=11111%2C11112&eopjong_gbcd_list=11111%2C11112&eopjong_gbcd=1&gegyumo_cd=&eopjong_cd=11111&eopjong_cd=11112&eopche_nm=&sido_addr=&sigungu_addr=&cyjemok_nm=&yeokjong_brcd=&pageIndex=' + count);
    } catch (error) {
        console.error(error);
    }
};
const getCount = async () => {
    try {
        let html = await axios.post("https://work.mma.go.kr/caisBYIS/search/cygonggogeomsaek.do", 'ar_eopjong_gbcd=11111%2C11112&eopjong_gbcd_list=11111%2C11112&eopjong_gbcd=1&gegyumo_cd=&eopjong_cd=11111&eopjong_cd=11112&eopche_nm=&sido_addr=&sigungu_addr=&cyjemok_nm=&yeokjong_brcd=');
        let $ = cheerio.load(html.data);
        let count = $('#content > div.brd_top_n > div').text().split('건')[0].split(' : ')[1];
        return count;
    } catch (error) {
        console.log(error);
    }
}
let list = [];

const getList = async (count) => {
    for (let i = 0; i < count / 10; i++) {
        let html = await getHtml(i + 1);
        const $ = cheerio.load(html.data);
        let tbody = $('.brd_list_n tbody');
        for (let i = 0; i < tbody.children().length; i++) {
            let row = tbody.children().eq(i).children();
            let obj = new Object();
            obj.index = row.eq(0).text();
            obj.name = row.eq(1).text();
            obj.endDate = row.eq(3).text();
            obj.startDate = row.eq(4).text();
            obj.url = "https://work.mma.go.kr" + row.eq(1).children('a').attr('href');
            list.push(obj);
        }
    }
}

const func = function () {
    list = [];
    getCount()
        .then((count) => {
            getList(count)
                .then(() => {
                    list.sort(function (a, b) {
                        return new Date(b['startDate']) - new Date(a['startDate']);
                    });
                    // Google Spreadsheet 버전
                    spreadsheet.update(list);
                });
        })
}
setInterval(func, 1000 * 60 * 60); // 1시간마다 실행