import { Card } from "model/interaction/game/card";
import cardFactory from "./card";
import { victoryTokenScore } from "model/interaction/game/score";

export const VegetableGarden: Card= {
    name: "菜園",
    type: "building",
    cost: 2,
    imageURL: "https://1.bp.blogspot.com/-LktLouo8utY/XRtksKINQ2I/AAAAAAABTdc/_b_g78fr1Uk_UnNtSzpy3RWdFAXLY4e8wCLcBGAs/s400/nouka_man_hatake.png",
    description: "消費財を2枚得る\n勝利点トークンを得る",
    buildingType: ["agricultural"],
    score: 10
};

export const Ironworks: Card = {
    name: "鉄工所",
    type: "building",
    cost: 1,
    imageURL: "https://4.bp.blogspot.com/-xiE83qmFLXE/WUdYZ4_aL0I/AAAAAAABE7g/WNexEU7x5RM3_vV8QKkmtmesDlAG3Lv7gCLcBGAs/s450/dougu_tetsu_pipe.png",
    description: "あなたの労働者が鉱山にいれば\nカードを2枚引く",
    buildingType: ["industrial"],
    score: 8
};

export const Lottery: Card = {
    name: "宝くじ",
    type: "building",
    cost: 2,
    imageURL: "https://4.bp.blogspot.com/-TB46ivV-x5E/VNH7Z18n_5I/AAAAAAAAreM/BYa3W6nYD2o/s400/takarakuji_uriba.png",
    description: "家計から$20を得て$10返す",
    buildingType: [],
    score: 10
};

export const AmusementPark: Card = {
    name: "遊園地",
    type: "building",
    cost: 5,
    imageURL: "https://4.bp.blogspot.com/-Ov2t1LF6laE/UYDkHzAMHQI/AAAAAAAAQ-w/oVU1LesXaU0/s400/yuenchi.png",
    description: "手札を2枚捨てて家計から$25を得る",
    buildingType: [],
    score: 24
};

export const PotatoField: Card = {
    name: "芋畑",
    type: "building",
    cost: 1,
    imageURL: "https://4.bp.blogspot.com/-LATOgPykNtU/UbVu_ojVQ7I/AAAAAAAAUlU/lTaQEMzF6HU/s400/imohori.png",
    description: "手札が3枚になるまで消費財を引く",
    buildingType: ["agricultural"],
    score: 6
};

export const TouristRanch: Card = {
    name: "観光牧場",
    type: "building",
    cost: 3,
    imageURL: "https://2.bp.blogspot.com/-GUgdEctld5o/VXOTfwppjmI/AAAAAAAAuAY/LH-o7SNo-Eg/s400/bokujou.png",
    description: "手札にある消費財1枚につき\n$4を家計から得る",
    buildingType: ["agricultural"],
    score: 14
};

export const BuildingCompany: Card = {
    name: "建築会社",
    type: "building",
    cost: 2,
    imageURL: "https://1.bp.blogspot.com/-t6dkKoVG6IM/VYJrfpVB8HI/AAAAAAAAueg/0MuUEfaptzg/s400/job_kenchikuka_woman.png",
    description: "|unsellable|の付いた建物を1つ作る\nその後カードを2枚引く",
    buildingType: [],
    score: 10    
};

export const Laboratory: Card = {
    name: "研究所",
    type: "building",
    cost: 3,
    imageURL: "https://1.bp.blogspot.com/-4qs60mWA5Lg/VOsJZbmnxEI/AAAAAAAArnI/UFOA9WYD7g0/s400/kenkyu_woman.png",
    description: "カードを2枚引く\n勝利点トークンを取る",
    buildingType: [],
    score: 16
};

export const FoodFactory: Card = {
    name: "食品工場",
    type: "building",
    cost: 2,
    costReduction: {
        description: "|agricultural|を所有していれば建設コスト-1",
        to: player => player.buildings.filter(b => cardFactory(b.card).buildingType.includes("agricultural")).length > 0 ? 1 : 2
    },
    imageURL: "https://4.bp.blogspot.com/-5fE6RVDdAxw/WUdYuUzWLNI/AAAAAAABE-w/_nQaIMSTUAQ_TIdePsUDKVN8_5Nxr2GAwCLcBGAs/s400/job_syokuhin_koujou_apron.png",
    description: "手札を2枚捨て4枚引く",
    buildingType: ["industrial"],
    score: 12
};

export const Brewery: Card = {
    name: "醸造所",
    type: "building",
    cost: 4,
    imageURL: "https://2.bp.blogspot.com/-eHBLHHC1X8I/VfS6WdSRKfI/AAAAAAAAxPY/agK3fVQyzew/s450/job_kuroudo_touji_sakagura.png",
    description: "消費財を4枚取り置き\n次ラウンド開始時に手札に加える",
    buildingType: ["agricultural"],
    score: 18
};

export const EarthConstruction: Card = {
    name: "地球建設",
    type: "building",
    cost: 4,
    imageURL: "https://4.bp.blogspot.com/-vZoB7pVysxU/VCkblSBHj5I/AAAAAAAAnJg/hM45LlZP5lg/s400/kurobe_dam.png",
    description: "建物を2つ同時に作る\n手札が空になったらカードを3枚引く",
    buildingType: [],
    score: 16
};

export const PetroleumComplex: Card = {
    name: "石油コンビナート",
    type: "building",
    cost: 6,
    imageURL: "https://1.bp.blogspot.com/-0i9gMGbGPR0/XkZcvnyYvjI/AAAAAAABXPM/FOhmH3eujtgouXWdzqugF-jD6QDywmmbQCNcBGAsYHQ/s400/building_sekiyu_plant_kombinat.png",
    description: "カードを4枚引く",
    buildingType: ["industrial"],
    score: 28
};

export const Cathedral: Card = {
    name: "大聖堂",
    type: "building",
    cost: 10,
    costReduction: {
        description: "勝利点トークン5枚以上で建設コスト-4",
        to: player => player.victoryToken >= 5 ? 6 : 10,
    },
    imageURL: "https://3.bp.blogspot.com/-B4kXgTY4qD4/WKFjC2vpd-I/AAAAAAABBtE/lxWgqO44Zeof4GPUotel_HHfR5bbVd4mwCLcB/s400/landmark_notre_dame.png",
    description: "売却不可",
    buildingType: ["unsellable"],
    score: 50
};

export const TempleCarpenter: Card = {
    name: "宮大工",
    type: "building",
    cost: 1,
    imageURL: "https://1.bp.blogspot.com/-q2Fps_t2Q5Y/UQ92eXPvYTI/AAAAAAAALx8/OGtDP4A5aCs/s400/oshiro.png",
    description: "建物を1つ作る\n勝利点トークンを得る",
    buildingType: [],
    score: 8
};

export const Shipyard: Card = {
    name: "造船所",
    type: "building",
    cost: 4,
    imageURL: "https://1.bp.blogspot.com/-cPkRKw85W1I/XhwqqdqqL5I/AAAAAAABXCo/MoZd_5BoJmMGmhzRtIy5iwgMR-CqUNftQCNcBGAsYHQ/s400/ship_tousen_karabune.png",
    description: "手札を3枚捨てて6枚引く",
    buildingType: ["industrial"],
    score: 20
};

export const IndustrialPark: Card = {
    name: "工業団地",
    type: "building",
    cost: 5,
    costReduction: {
        description: "所有する|industrial|1つにつき建設コスト-1",
        to: player => Math.max(0, 5 - player.buildings.filter(b => cardFactory(b.card).buildingType.includes("industrial")).length)
    },
    imageURL: "https://3.bp.blogspot.com/-uMyXdwz2VdA/UZM5ITjJOBI/AAAAAAAASUE/1w4JOXO31Is/s450/tatemono_danchi.png",
    description: "カードを3枚引く",
    buildingType: ["industrial"],
    score: 22
};

export const Cafeteria: Card = {
    name: "食堂",
    type: "building",
    cost: 1,
    imageURL: "https://1.bp.blogspot.com/-CrOGQVn9erA/VnE3WP-KIOI/AAAAAAAA10w/VDaIHJtPb4M/s400/building_syokudou.png",
    description: "手札を1枚捨てて家計から$8を得る",
    buildingType: [],
    score: 8
};

export const PrefabricatedBuilder: Card = {
    name: "プレハブ工務店",
    type: "building",
    cost: 3,
    imageURL: "https://1.bp.blogspot.com/-UUGKUabryiA/WGYi2kEeTqI/AAAAAAABAuk/Zm1am0Mv3YEe81Y3AsLcmrqtdC3fshuQgCLcB/s400/building_purehabu.png",
    description: "価値10以下の建物を1つ無料で作る",
    buildingType: [],
    score: 12
};

export const Nursery: Card = {
    name: "養殖場",
    type: "building",
    cost: 2,
    imageURL: "https://1.bp.blogspot.com/-aeKekNAoLUc/WSa80P0dK0I/AAAAAAABEhk/WbxbJh70DB4Av2ykjq14Vgp9ipzCtKCPwCLcB/s450/job_gyogyou_ryoushi.png",
    description: "消費財を2枚引く\n手札に消費財があれば3枚引く",
    buildingType: ["agricultural"],
    score: 12
};

export const OldTown: Card = {
    name: "旧市街",
    type: "building",
    cost: 2,
    imageURL: "https://2.bp.blogspot.com/-W54r9BvDO74/WTd4VgUFyTI/AAAAAAABEnA/m-y5TunhPn8H3iK3Wv_iubwc14KCxvO-QCLcB/s550/bg_machi_nihon.jpg",
    description: "売却不可",
    buildingType: ["industrial", "agricultural", "unsellable"],
    score: 10
};

export const AccountingFirm: Card = {
    name: "会計事務所",
    type: "building",
    cost: 3,
    imageURL: "https://4.bp.blogspot.com/-0lK3yio74A0/WdyDfjR-bnI/AAAAAAABHdA/pY0ehrDzSakHMb5uT2mZG5y09IEpQqy7gCLcBGAs/s450/job_kaikeishi_man.png",
    description: "終了時：勝利点トークンの価値2倍\n売却不可",
    buildingType: ["unsellable"],
    score: 12,
    bonusScore: player => victoryTokenScore(player.victoryToken)
};

export const Graveyard: Card = {
    name: "墓地",
    type: "building",
    cost: 1,
    imageURL: "https://4.bp.blogspot.com/-BFFBL-28K1c/WlGoL8kHHLI/AAAAAAABJh0/u0W4wu1FWC48CQWVMaqIIiCLxVpxYBk8ACLcBGAs/s450/ohaka_bochi_seiyou_jujika.png",
    description: "終了時：手札が0枚なら+8点\n売却不可",
    buildingType: ["unsellable"],
    score: 8,
    bonusScore: player => player.hand.length == 0 ? 8 : 0
};

export const ExportPort: Card = {
    name: "輸出港",
    type: "building",
    cost: 5,
    imageURL: "https://4.bp.blogspot.com/-aWrQ_gAlar0/XGjyLeunYnI/AAAAAAABReo/k5HY9dOLHAgFu4qZ9Ff_8nSYh4D85m0mACLcBGAs/s800/boueki_container_yard_terminal.png",
    description: "終了時：|industrial|2つ以上所有で+24点\n売却不可",
    buildingType: ["unsellable"],
    score: 24,
    bonusScore: player => player.buildings.filter(b => cardFactory(b.card).buildingType.includes("industrial")).length >= 2 ? 24 : 0
};

export const RailroadStation: Card = {
    name: "鉄道駅",
    type: "building",
    cost: 3,
    imageURL: "https://2.bp.blogspot.com/-zjXfMTouf5w/U7O8UduO49I/AAAAAAAAieA/qF7mo1rdKbw/s600/tokyo_eki.png",
    description: "終了時：建物6つ以上所有で+18点\n売却不可",
    buildingType: ["unsellable"],
    score: 18,
    bonusScore: player => player.buildings.length >= 6 ? 18 : 0
};

export const InvestmentBank: Card = {
    name: "投資銀行",
    type: "building",
    cost: 6,
    imageURL: "https://4.bp.blogspot.com/-wiuuXIr7ee4/WdyEAs1h1YI/AAAAAAABHhg/nxShr_q4eCM8TROul3l7OnQqeVBFdI2wQCLcBGAs/s500/toushika_kabunushi_happy.png",
    description: "終了時：|unsellable|4つ以上所有で+30点\n売却不可",
    buildingType: ["unsellable"],
    score: 30,
    bonusScore: player => player.buildings.filter(b => cardFactory(b.card).buildingType.includes("unsellable")).length >= 4 ? 30 : 0
};

export const BotanicalGarden: Card = {
    name: "植物園",
    type: "building",
    cost: 4,
    imageURL: "https://1.bp.blogspot.com/-2ExZIM6zoQ4/XdtturXp6eI/AAAAAAABWLc/XT74tMYGPRUK2ZU4WHPf2rTLT9eUHouzwCNcBGAsYHQ/s400/plant_onshitsu_shokubutsuen_chou.png",
    description: "終了時：|agricultural|3つ以上所有で+22点\n売却不可",
    buildingType: ["unsellable"],
    score: 22,
    bonusScore: player => player.buildings.filter(b => cardFactory(b.card).buildingType.includes("agricultural")).length >= 3 ? 22 : 0
};

export const Museum: Card = {
    name: "博物館",
    type: "building",
    cost: 5,
    imageURL: "https://3.bp.blogspot.com/-kvbJ2Lk3e5g/Ur1GXV2yTsI/AAAAAAAAcck/uu_54SA8zwY/s450/trex_kokkaku.png",
    description: "売却不可",
    buildingType: ["unsellable"],
    score: 34
};
