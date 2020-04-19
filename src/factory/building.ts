import { Card } from "model/interaction/game/card";

export const Farm: Card = {
    name: "農場",
    type: "building",
    cost: 1,
    imageURL: "https://2.bp.blogspot.com/-RA_r9EVIbto/Ur1Hh8V6SRI/AAAAAAAAciE/UFlqD_v-9nM/s800/hatake.png",
    description: "消費財を2枚引く",
    buildingType: ["agricultural"],
    score: 6
};

export const SlashAndBurn: Card = {
    name: "焼畑",
    type: "building",
    cost: 1,
    imageURL: "https://3.bp.blogspot.com/-e7FojpyN3s4/VGLMvfM8jSI/AAAAAAAApEw/TYL7jMIJzLE/s400/syoukyaku_noyaki.png",
    description: "消費財を5枚引き焼畑は消滅する\n売却不可",
    buildingType: ["agricultural"],
    score: 0
};

export const DesignOffice: Card = {
    name: "設計事務所",
    type: "building",
    cost: 1,
    imageURL: "https://1.bp.blogspot.com/-LoC09eY9z64/Vm94udsd0KI/AAAAAAAA1rg/I0v8LZvn2zY/s400/job_kenchikuka.png",
    description: "カードを5枚めくり公開する\nうち1枚を引いて残りを捨てる",
    buildingType: [],
    score: 8
};

export const Cafe: Card = {
    name: "珈琲店",
    type: "building",
    cost: 1 ,
    imageURL: "https://3.bp.blogspot.com/-nXH3RSnJnl4/Uku9bM6m3vI/AAAAAAAAYiY/fJeMyoTNauk/s400/tatemono_cafe.png",
    description: "家計から$5を得る",
    buildingType: [],
    score: 8 
};

export const Orchard: Card = {
    name: "果樹園",
    type: "building",
    cost: 2,
    imageURL: "https://1.bp.blogspot.com/-2dcpgAT1LBI/Vdrjle6FZPI/AAAAAAAAxDw/lo_DX1-XOvk/s250/kajuen_ringo.png",
    description: "手札が4枚になるまで果樹園を引く",
    buildingType: ["agricultural"],
    score: 10
};

export const Factory: Card = {
    name: "工場",
    type: "building",
    cost: 2,
    imageURL: "https://4.bp.blogspot.com/-X6Y32Uh5ud4/W_UF70_iobI/AAAAAAABQT0/gF3Braf7peIkKgr_MWRSRz_RuCR4wMnsACLcBGAs/s400/building_koujou_entotsu.png",
    description: "手札を2枚捨てて4枚引く",
    buildingType: ["industrial"],
    score: 12
};

export const ConstructionCompany: Card = {
    name: "建設会社",
    type: "building",
    cost: 2,
    imageURL: "https://1.bp.blogspot.com/-JfG6MJlmyRM/UU--1KQN5ZI/AAAAAAAAO-U/lVUx-tEqS4k/s400/norimono_crane.png",
    description: "建物を1つ作る\nコストは1安くなる",
    buildingType: [],
    score: 10
};

export const Warehouse: Card = {
    name: "倉庫",
    type: "building",
    cost: 2,
    imageURL: "https://1.bp.blogspot.com/-EGGBRGzRSCs/UrlmuJeYxII/AAAAAAAAcKo/0hhaIrtKQr0/s400/souko_building.png",
    description: "手札上限+4\n売却不可",
    buildingType: ["unsellable"],
    score: 10
};

export const LawOffice: Card = {
    name: "法律事務所",
    type: "building",
    cost: 2,
    imageURL: "https://3.bp.blogspot.com/-oz93QSQJ83E/XGjxrj8swtI/AAAAAAABRaw/YRPzdH4aTFkmtKGg_h6aoRNaWJjRrvlHQCLcBGAs/s300/building_law_houritsu.png",
    description: "終了時：負債から5枚まで免除する\n売却不可",
    buildingType: ["unsellable"],
    score: 8
};

export const Plantation: Card = {
    name: "大農園",
    type: "building",
    cost: 3,
    imageURL: "https://1.bp.blogspot.com/-Azzb-u5Yv2o/XSGFwoXoJ-I/AAAAAAABTjw/aCE81_QBqd0OBLk4kQKt-eQRQzyrkVohwCLcBGAs/s400/nougyou_drone_nouyaku.png",
    description: "消費財を3枚引く",
    buildingType:  ["agricultural"],
    score: 12
};

export const Restaurant: Card = {
    name: "レストラン",
    type: "building",
    cost: 3,
    imageURL: "https://1.bp.blogspot.com/-DRdIFx5u7Rk/XVKfn_f43pI/AAAAAAABUDI/53tDXLqaDM4MEihuLeb9RmBeCY5dHBu4QCLcBGAs/s400/building_food_family_restaurant.png",
    description: "手札を1枚捨てて家計から$15を得る",
    buildingType: [],
    score: 16
};

export const Settler: Card = {
    name: "開拓民",
    type: "building",
    cost: 3,
    imageURL: "https://1.bp.blogspot.com/-gFYuyzOTBVk/XXHgWA_0C0I/AAAAAAABUqY/YMCa1XZMjlwzHcBc_ymcRoE8vHoYddQcQCLcBGAs/s400/war_tondenhei_nougyou.png",
    description: "手札にある[agricultural]の建物を\n1つ無料で作る",
    buildingType: [],
    score: 14
};

export const Realtor: Card = {
    name: "不動産屋",
    type: "building",
    cost: 3,
    imageURL: "https://3.bp.blogspot.com/-0OFdjac3WHY/Vf-Zk0Rp6lI/AAAAAAAAyA8/Ci0Rbv0vsr0/s400/building_fudousan.png",
    description: "終了時：所有する建物1つにつき+3点\n売却不可",
    buildingType: ["unsellable"],
    score: 10
};

export const SteelWorks: Card = {
    name: "製鉄所",
    type: "building",
    cost: 4,
    imageURL: "https://1.bp.blogspot.com/-DbsEksOLpDk/WGnPeo8NUtI/AAAAAAABA74/Qo59NpT4A1kAHXHTNL9Q6igACjlIBhg4QCLcB/s400/tekkotsu_silver.png",
    description: "カードを3枚引く",
    buildingType: ["industrial"],
    score: 20
};

export const GeneralConstructor: Card = {
    name: "ゼネコン",
    type: "building",
    cost: 4,
    imageURL: "https://3.bp.blogspot.com/-sO4-TTFwx6U/Wn1Z0efOCRI/AAAAAAABKPg/lI-UeNdog0cw8D3_5IP7r_BCnnX_ukrSgCLcBGAs/s450/kouji_genba_building.png",
    description: "建物を1つ作る\nその後カードを2枚引く",
    buildingType: [],
    score: 18
};

export const COOP: Card = {
    name: "農協",
    type: "building",
    cost: 4,
    imageURL: "https://3.bp.blogspot.com/-qCgnIYFQ5zE/VoX5IAy8C0I/AAAAAAAA2SY/9ltDQNwCQyA/s550/chisanchisyou_text.png",
    description: "終了時：手札の消費財1枚につき+3点\n売却不可",
    buildingType: ["unsellable"],
    score: 12
};

export const Union: Card = {
    name: "労働組合",
    type: "building",
    cost: 3,
    imageURL: "https://2.bp.blogspot.com/-2E2Ml8C0My0/VyNdSAwabtI/AAAAAAAA6Mk/c9DqLRh_UR4aZM0925CZoFdJi4NpKQz6ACLcB/s450/demo_strike_worker.png",
    description: "終了時：労働者1人につき+6点\n売却不可",
    buildingType: ["unsellable"],
    score: 0
};

export const CarFactory: Card = {
    name: "自動車工場",
    type: "building",
    cost: 5,
    imageURL: "https://2.bp.blogspot.com/-fLpSrIJDcnY/WWNAafRzbiI/AAAAAAABFS8/jnpY3yc4sw0o7Esbc_vAHEKDkQ41yIE_gCLcBGAs/s400/car_engine.png",
    description: "手札を3枚捨てて7枚引く",
    buildingType: ["industrial"],
    score: 24
};

export const Raillord: Card = {
    name: "鉄道",
    type: "building",
    cost: 5,
    imageURL: "https://3.bp.blogspot.com/-YJrC2uSdeHo/WaNvCvqgInI/AAAAAAABGKg/QfKlpB-ZLeg4DpVRjN9_C-1gaFAE49XbQCLcBGAs/s400/train_kikansya_kemuri.png",
    description: "終了時：所有する[industrial]につき+8点\n売却不可",
    buildingType: ["unsellable"],
    score: 18
};

export const HQBuilding: Card = {
    name: "本社ビル",
    type: "building",
    cost: 5,
    imageURL: "https://1.bp.blogspot.com/-Uo4P6jchvm4/VpjCmhB9vEI/AAAAAAAA3D8/EfnGQe4_YM4/s400/kousou_building.png",
    description: "終了時：所有する[unsellable]につき+6点\n売却不可",
    buildingType: ["unsellable"],
    score: 20
};

export const CompanyHousing: Card = {
    name: "社宅",
    type: "building",
    cost: 2,
    imageURL: "https://3.bp.blogspot.com/-uMyXdwz2VdA/UZM5ITjJOBI/AAAAAAAASUE/1w4JOXO31Is/s450/tatemono_danchi.png",
    description: "労働者上限+1\n売却不可",
    buildingType: ["unsellable"],
    score: 8
};

export const Mansion: Card = {
    name: "邸宅",
    type: "building",
    cost: 4,
    imageURL: "https://4.bp.blogspot.com/-Btz47iBHM8M/Udy6itsKbtI/AAAAAAAAWH8/2B5p0xLupGI/s450/building_goutei.png",
    description: "売却不可",
    buildingType: ["unsellable"],
    score: 28
};

export const ChemicalFactory: Card = {
    name: "化学工場",
    type: "building",
    cost: 4,
    imageURL: "https://3.bp.blogspot.com/-4tTARDfOs7s/Wm1yyYeQOSI/AAAAAAABJ7U/KKJB1SHiaXohXnva9ekuecBraEwYgczKwCLcBGAs/s400/science_machine_rotary_evaporator.png",
    description: "カードを2枚引く\n手札が無ければ4枚引く",
    buildingType: ["industrial"],
    score: 18
};

export const CombineConstructor: Card = {
    name: "二胡市建設",
    type: "building",
    cost: 5,
    imageURL: "https://2.bp.blogspot.com/-MWODd0KAm5s/UO_3d8RN9LI/AAAAAAAAKto/P47gBO-BaZo/s500/futago_boys.png",
    description: "同じコストの建物を2つ作る\n1つ文分のコストだけ支払う",
    buildingType: [],
    score: 20
};