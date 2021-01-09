import { Card } from "model/interaction/game/card";

export const Ruins: Card = {
    name: "遺跡",
    type: "public",
    cost: undefined,
    imageURL: "https://3.bp.blogspot.com/-kyY7d96QffE/VRUSM5jKsCI/AAAAAAAAsng/E-CuZhl7xvA/s400/maya_kukulcan.png",
    description: "消費財を1枚引く\n勝利点トークンを1枚得る",
    buildingType: [],
    score: undefined
};

export const Artifact: Card = {
    name: "遺物",
    type: "building",
    cost: 0,
    imageURL: "https://1.bp.blogspot.com/--zzovCQLgNs/XT7NPK3Gs5I/AAAAAAABT50/4w4Q2bUQWE0dDKoaheyu-PjAIy-mR_kTwCLcBGAs/s400/drink_dokuro_sakaduki.png",
    onConstructed: "建設時：勝利点トークンを2枚得る",
    description: "売却不可",
    buildingType: ["unsellable"],
    score: 4
};

export const Rural: Card = {
    name: "農村",
    type: "building",
    cost: 1,
    imageURL: "https://1.bp.blogspot.com/-2iC8CU3nAmY/XaKa65UgJJI/AAAAAAABVkM/dRCQ0kC_u0wb-ntMzTpi1iioFCfHa7lZgCNcBGAsYHQ/s180-c/hokkaidou_kaitaku_syuujin.png",
    description: "消費財を2枚引く|or|消費財を2枚捨ててカードを3枚引く",
    buildingType: ["agricultural"],
    score: 6    
};

export const Colony: Card = {
    name: "植民団",
    type: "building",
    cost: 1,
    imageURL: "https://1.bp.blogspot.com/-M9ZorsaCGzc/Vte24Cd6PLI/AAAAAAAA4T4/bIQPrZgCHho/s180-c/airgun_women_syufu.png",
    description: "建物を1つ作る\nその後消費財を1枚引く",
    buildingType: [],
    score: 6
};

export const Workshop: Card = {
    name: "工房",
    type: "building",
    cost: 1,
    imageURL: "https://3.bp.blogspot.com/-zfO154hEQho/Wge8BRjo1tI/AAAAAAABIE8/py-ovsWeVccgIgklpRJku5p2-tgnp8j-ACLcBGAs/s500/machine_senban.png",
    description: "カードを1枚引く\n勝利点トークンを1枚得る",
    buildingType: ["industrial"],
    score: 8
};

export const SteamFactory: Card = {
    name: "蒸気工場",
    type: "building",
    cost: 2,
    costReduction: {
        description: "勝利点2枚以上で建設コスト-1",
        to: player => player.victoryToken >= 2 ? 1 : 2
    },
    imageURL: "https://3.bp.blogspot.com/-K4be24-Wo2Q/W7lP-igyclI/AAAAAAABPUc/1MDUhsRZkgUJECZ5aC6OPyfvoWkT13QDQCLcBGAs/s400/fantasy_steampunk.png",
    description: "手札を2枚捨て4枚引く",
    buildingType: ["industrial"],
    score: 10
};

export const PoultryFarm: Card = {
    name: "養鶏場",
    type: "building",
    cost: 2,
    imageURL: "https://1.bp.blogspot.com/-fxrWbZlFJDE/UvTd2Qw3BgI/AAAAAAAAdfQ/muh6T_CeSJg/s400/bird_niwatori_brown.png",
    description: "消費財を2枚引く\n手札が奇数枚なら3枚引く",
    buildingType: ["agricultural"],
    score: 12
};

export const SkyscraperConstrution: Card = {
    name: "摩天建設",
    type: "building",
    cost: 2,
    imageURL: "https://3.bp.blogspot.com/-kyCggVWkmro/Uku9bVG2B7I/AAAAAAAAYic/El5YLTvXyQs/s400/tatemono_buildings.png",
    description: "建物を1つ作る\n手札が空になったらカードを2枚引く",
    buildingType: [],
    score: 10
};

export const GameCafe: Card = {
    name: "ゲームカフェ",
    type: "building",
    cost: 2,
    imageURL: "https://3.bp.blogspot.com/-RTitFpO94mY/V1z8v_6cezI/AAAAAAAA7L0/8BGqS0IwCQMozc3qnCH5nsRQeDEWk1OyACLcB/s400/board_game.png",
    description: "家計から$5を得る\nこれがラウンド最後の行動なら$10得る",
    buildingType: [],
    score: 10
};

export const CottonFarm: Card = {
    name: "綿花農場",
    type: "building",
    cost: 3,
    imageURL: "https://2.bp.blogspot.com/-ynCrAdttcLc/V0QncePOrFI/AAAAAAAA65Q/28C0_xEYQIox_0mub0KNoBdt1NuKIG-VwCLcB/s400/flower_menka.png",
    description: "消費財を5枚引く\n労働者2人必要",
    buildingType: ["agricultural"],
    score: 14
};

export const Museum: Card = {
    name: "美術館",
    type: "building",
    cost: 3,
    imageURL: "https://2.bp.blogspot.com/-rm665PUJoCQ/U-8GPxYg9CI/AAAAAAAAk1g/-eQP6xQokTw/s400/building_art_gallery.png",
    description: "家計から$7を得る\n手札がちょうど5枚なら$14得る",
    buildingType: [],
    score: 14
};

export const Monument: Card = {
    name: "記念碑",
    type: "building",
    cost: 3,
    imageURL: "https://4.bp.blogspot.com/-ZOeWwXY4sbg/W1a43MoXfEI/AAAAAAABNiU/MrLwwnfpibQKmHEMZd6YZOzz7Zacr-T-wCLcBGAs/s400/landmark_washington_monument.png",
    description: "売却不可",
    buildingType: ["unsellable"],
    score: 24
};

export const ConsumerUnion: Card = {
    name: "消費者組合",
    type: "building",
    cost: 3,
    imageURL: "https://1.bp.blogspot.com/-9wNqT55EpBQ/XaKa3XzaPgI/AAAAAAABVjg/LRr_JdIn_QIy2g-8hVeW7zq924U-e8L-wCNcBGAsYHQ/s550/family_shopping_bag_paper.png",
    description: "終了時：|agricultural|ｊの合計額20以上で18点\n売却不可",
    buildingType: ["unsellable"],
    score: 18
};

export const Automata: Card = {
    name: "機械人形",
    type: "building",
    cost: 4,
    imageURL: "https://2.bp.blogspot.com/-ZwYKR5Zu28s/U6Qo2qAjsqI/AAAAAAAAhkM/HkbDZEJwvPs/s400/omocha_robot.png",
    onConstructed: "建設時：機械人形を1体得る\n(機械人形は労働者として使用でき、給与も研修も必要としない)",
    description: "売却不可",
    buildingType: ["unsellable"],
    score: 2
};

export const CoalMine: Card = {
    name: "炭鉱",
    type: "building",
    cost: 4,
    imageURL: "https://3.bp.blogspot.com/-ps-2lHhEBek/V6iIbuFB7xI/AAAAAAAA9Bw/jWP98SdhRRsz5tKog-mbMrK7Mmn-2otWwCLcB/s400/torokko_trolley_sekitan.png",
    description: "カードを5枚引く\n労働者2人必要",
    buildingType: ["industrial"],
    score: 20
};

export const ModernismConstruction: Card = {
    name: "モダニズム建設",
    type: "building",
    cost: 4,
    imageURL: "https://2.bp.blogspot.com/-DFYJ0CzgqJY/UZSsq4i94qI/AAAAAAAAS6E/e3Ny9Nf3cbs/s400/tatemono2_10.png",
    description: "建物を1つ作る\nコストを支払う際消費財は2枚分になる",
    buildingType: [],
    score: 18
};

export const Theater: Card = {
    name: "劇場",
    type: "building",
    cost: 4,
    imageURL: "https://4.bp.blogspot.com/-WYFz1hpF2oI/XIJBQJ7vN-I/AAAAAAABRzA/1B59lzRuZdER_ZuG1xewyf2RSYBkfhoJwCLcBGAs/s400/building_gekijou_theater.png",
    description: "手札を2枚捨てて家計から$20を得る",
    buildingType: [],
    score: 20
};

export const GuildHall: Card = {
    name: "ギルドホール",
    type: "building",
    cost: 4,
    imageURL: "https://3.bp.blogspot.com/-1ejqMi_4t7E/WBsADPzJxDI/AAAAAAAA_SA/yJFJH9Oc2X87EUDZ-69yqNk--UOMb2CTACLcB/s400/building_europe_kojou.png",
    description: "終了時：|agricultural|と|industrial|があれば+20点\n売却不可",
    buildingType: ["unsellable"],
    score: 20
};

export const IvoryTower: Card = {
    name: "象牙の塔",
    type: "building",
    cost: 4 ,
    imageURL: "https://4.bp.blogspot.com/-zikT_vinzfM/W6DTD5xFFpI/AAAAAAABO48/_TUQXKpuj0AvVSb7tpKtUhLtlHTUP_w9ACLcBGAs/s400/art_zouge_tou.png",
    description: "終了時：勝利点7枚以上で+22点\n売却不可",
    buildingType: ["unsellable"],
    score: 22 
};

export const Smelter: Card = {
    name: "精錬所",
    type: "building",
    cost: 5,
    imageURL: "https://4.bp.blogspot.com/-0DfREiP4rU4/WK_Yo4JzUuI/AAAAAAABCC4/Nv0T7SZ_wlgE-JbYAO6OKifKWJv9BTpWgCLcB/s400/landmark_nirayama_hansyaro.png",
    costReduction: {
        description: "勝利点3枚以上で建設コスト-2",
        to: player => player.victoryToken >= 3 ? 5 : 3
    },
    description: "カードを3枚引く",
    buildingType: ["industrial"],
    score: 16
};

export const Teleporter: Card = {
    name: "転送装置",
    type: "building",
    cost: 5,
    imageURL: "https://1.bp.blogspot.com/-P7kfu7ps8cQ/XhwqQ_oKFeI/AAAAAAABW9g/dHjpNuVa-AsOY0fKxY5h_ZHtaymlJnRrwCNcBGAsYHQ/s400/fantasy_mahoujin_syoukan.png",
    description: "建物を1つ無料で作る\n労働者2人必要",
    buildingType: [],
    score: 22
};

export const RevolutionSquare: Card = {
    name: "革命広場",
    type: "building",
    cost: 5,
    imageURL: "https://3.bp.blogspot.com/-p1h2iPbteM8/WNUsxgdeUkI/AAAAAAABC1I/0XNm6mAQpgc40eybb-45IZG4WnFbAF55QCLcB/s400/landmark_roudousenshi_dois_guerreiros.png",
    description: "終了時：人間の労働者5人で+18点\n売却不可",
    buildingType: ["unsellable"],
    score: 18
};

export const Festival: Card = {
    name: "収穫祭",
    type: "building",
    cost: 5,
    imageURL: "https://4.bp.blogspot.com/-14XsgOnPSrg/VoX5JD6nDEI/AAAAAAAA2Sg/VSyE7I4uhn4/s400/chisanchisyou_tokusanhin.png",
    description: "終了時：手札に消費財4枚で+26点\n売却不可",
    buildingType: ["unsellable"],
    score: 26
};

export const TechExhibition: Card = {
    name: "技術展示会",
    type: "building",
    cost: 5,
    imageURL: "https://3.bp.blogspot.com/-HvtSRPVSLdM/WWXXCMNXqAI/AAAAAAABFew/RxIi8UEWa2EeynH9A_gkY-SDvKuQmfYGwCLcBGAs/s500/machine_robot_contest_big.png",
    description: "終了時：|industrial|の合計額30以上で+24点\n売却不可",
    buildingType: ["unsellable"],
    score: 24
};

export const Greenhouse: Card = {
    name: "温室",
    type: "building",
    cost: 6,
    costReduction: {
        description: "勝利点4枚以上で建設コスト-2",
        to: player => player.victoryToken >= 4 ? 4 : 6
    },
    imageURL: "https://1.bp.blogspot.com/-Lx-UW4CvfIg/XdttuCD7m7I/AAAAAAABWLY/pvQPJOYGzIQ1X2yitsnw9GCP-eqLLOi2QCNcBGAsYHQ/s400/plant_onshitsu_shokubutsuen.png",
    description: "消費財を4枚引く",
    buildingType: ["agricultural"],
    score: 18
};

export const EmpyrialTemple: Card = {
    name: "浄火の神殿",
    type: "building",
    cost: 6,
    imageURL: "https://3.bp.blogspot.com/-bTpI2R-Kxe0/Viio_KII7WI/AAAAAAAAztM/oNokVj_uJyI/s400/honoo_hi_fire.png",
    description: "終了時：これが唯一の|unsellable|なら+30点\n売却不可",
    buildingType: ["unsellable"],
    score: 30
};

export const LocomotiveFactory: Card = {
    name: "機関車工場",
    type: "building",
    cost: 7,
    costReduction: {
        description: "勝利点5枚以上で建設コスト-3",
        to: player => player.victoryToken >= 5 ? 4: 7
    },
    imageURL: "https://4.bp.blogspot.com/-lutyoYSaTg8/WaNvCmOT-TI/AAAAAAABGKc/elEOCcXctoQufWlsaLe3TlEdcK8gGdu-ACLcBGAs/s400/train_kikansya.png",
    description: "手札を3枚捨て7枚引く",
    buildingType: ["industrial"],
    score: 24
};