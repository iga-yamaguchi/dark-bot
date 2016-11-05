// Description:
//   misc
//
// Commands:
//   hubot poem - オサレポエム
//   hubot 炎上 <text> <text> - ババーン
//   なんだと・・・
//   hubot goma - やればわかる
//   hubot isao - やればわかる
//

"use strict"

const uuid = require("node-uuid");
const config = require("config");
const Levenshtein = require("levenshtein");
const sqlite3 = require("sqlite3").verbose();
const sqliteDBPath = process.env.KUSOKORA_DB_PATH
const db = new sqlite3.Database(sqliteDBPath || ':memory:');
const KusokoraRepository = require("../dark/KusokoraRepository");
const kusokoraRepository = new KusokoraRepository(db);

const gomas = [
    () => `http://yamiga.waka.ru.com/images/goma/01.jpg?cb=${uuid.v4()}`,
    () => `http://yamiga.waka.ru.com/images/goma/02.jpg?cb=${uuid.v4()}`,
    () => `http://yamiga.waka.ru.com/images/goma/03.jpg?cb=${uuid.v4()}`,
    () => `http://yamiga.waka.ru.com/images/goma/04.jpg?cb=${uuid.v4()}`,
    () => `http://yamiga.waka.ru.com/images/goma/05.jpg?cb=${uuid.v4()}`,
    () => "```\n　　　CH \n　　　／＼ \n　　／　＼＼ \nHC／　　　＼＼CH \n ｜｜C6H6　　｜ \n ｜｜　´д｀｜ \nHC＼　　　／／CH \n　　＼　／／ \n　　　＼／ \n　　　CH\n```"
];
const isaos = [
    () => `https://36.media.tumblr.com/3df68abdd9a1eb7a0fbda4dacb9930af/tumblr_ns5chdb0Vm1un4u6lo1_1280.jpg?cb=${uuid.v4()}`,
    () => `https://camo.githubusercontent.com/4a011f97909b89a26822ee21e921eb7012e9df18/68747470733a2f2f34302e6d656469612e74756d626c722e636f6d2f31346231333736396364336238303235623163653338626238626238626261352f74756d626c725f6e75313538697269536c31756e3475366c6f315f313238302e6a7067?cb=${uuid.v4()}`
];

const nayus = [
    ":nayu: 「宇宙規模で見れば3000行のコミットなんて些細な物」"
];

module.exports = (robot) => {

    robot.respond(/poem$/i, (res) => {
        res.send(res.random(config.poem))
    })

    robot.hear(/なん(\.|。|・)*だと(\.|。|・)*$/i, (res) => {
        res.send(`http://yamiga.waka.ru.com/images/nandato.png?cb=${uuid.v4()}`);
    })

    robot.respond(/炎上 (.+) (.+)/i, (res) => {
        const text1 = encodeURIComponent(res.match[1])
        const text2 = encodeURIComponent(res.match[2])
        res.send(`https://enjo-generator.herokuapp.com/api/create-enjo?text1=${text1}&text2=${text2}`);
    })

    robot.respond(/距離 (.+) (.+)/i, (res) => {
        const l = new Levenshtein(res.match[1],res.match[2]);
        res.send(`距離: ${l.distance}`);
    });

    robot.respond(/goma$/i, (res) => {
        res.send((res.random(gomas))())
    })

    robot.respond(/isao$/i, (res) => {
        res.send((res.random(isaos))())
    })

    robot.respond(/PAPIX$/i, (res) => {
        kusokoraRepository.getAll((urls) => {
            if (urls.length > 0) {
                const url = res.random(urls);
                res.send(`${url}#cb=${uuid.v4()}`);
            }
        });
    });

    robot.respond(/stenyan (.+)$/, (res) => {
        const target = res.match[1];
        res.send(`ウェーイww君${target}っぽいね？てかLINEやってる？笑`);
    });

    robot.respond(/NAYU$/i, (res) => {
        res.send(res.random(nayus));
    });

    robot.hear(/^di (.+)$/, (res) => {
        const message = res.message;
        const matched = res.match[1];
        message.text = `${robot.name} image ${matched}`;
    });
}
