import { Card } from "entity/card";

function makePublicCard(name: string, imageURL: string, description: string): Card {
    return {
        name: name,
        cost: undefined,
        type: "public",
        imageURL: imageURL,
        description: description,
        buildingType: [],
        score: undefined
    };
}

function makeMulti(card: Card): Card {
    return {...card, description: card.description + "\n何人でもこの職場を使える"};
}

export const Quarry = makePublicCard(
    "採石場", 
    "https://3.bp.blogspot.com/-j9SF6VxlCOs/WIHldKSg-RI/AAAAAAABBPM/cI-x8Jn_j9IEs77JgAFnQXZjno1mLS9RgCLcB/s400/hitsugi_stone.png",
    "カードを1枚引く\nスタートプレイヤーになる"
);

export const Mine = makePublicCard(
    "鉱山",
    "https://2.bp.blogspot.com/-iM2T8SxNcFQ/VlAZE3VoJBI/AAAAAAAA030/-1TaJ1OsRqg/s450/job_sekitan_horu.png",
    "カードを1枚引く\n何人でもこの職場を使える"
);


export const School = makePublicCard(
    "学校",
    "https://2.bp.blogspot.com/-pJeKgOUSBv0/UnIIiJHYxFI/AAAAAAAAaDs/dARR9VJNnfc/s400/tsugaku.png",
    "労働者を1人増やす"
);

export const Carpenter = makePublicCard(
    "大工",
    "https://4.bp.blogspot.com/-ec2EgtvdU1U/VYJrfX9gPcI/AAAAAAAAueY/A23WcWNhIb0/s800/job_daiku_wakamono.png",
    "建物を1つ作る"  
);

export const Stall = makePublicCard(
    "露店",
    "https://2.bp.blogspot.com/-jg-FIts_Nzc/V5Xc4N_WhjI/AAAAAAAA8v8/b1rN75mAoCcfQ4ePrdL-m7z1qE1GPvnSgCLcB/s400/shopping_ichiba_yatai.png",
    "手札を1枚捨てて家計から$6を得る"
);

export const StallMulti = makeMulti(Stall);

export const Market = makePublicCard(
    "市場",
    "https://3.bp.blogspot.com/-jSl412zL-hk/VSufNcT3_SI/AAAAAAAAs4A/W8y-bSva7oE/s400/ichiba_marusye.png",
    "手札を2枚捨てて家計から$12を得る"
);

export const MarketMulti = makeMulti(Market);

export const HighSchool = makePublicCard(
    "高等学校",
    "https://1.bp.blogspot.com/-ADAcf4s4r-E/VlLWxv5I9eI/AAAAAAAA1BM/-6j-8rt5QRA/s450/school_gakuran_couple.png",
    "労働者を4人に増やす"
);

export const Supermarket = makePublicCard(
    "スーパーマーケット",
    "https://1.bp.blogspot.com/-ShmtBFzbO4w/XIJBQ4ZJnYI/AAAAAAABRzI/MDjiyrGETJkhLeXT7beqEu7U9k8_BBPTgCLcBGAs/s450/building_shoping_supermarket.png",
    "手札を3枚捨てて家計から$18を得る"
);

export const SupermarketMulti = makeMulti(Supermarket);

export const University = makePublicCard(
    "大学",
    "https://1.bp.blogspot.com/-FoUrPjaUSRY/Us_L_nhHZ1I/AAAAAAAAc_Q/WJYPClruxuM/s400/daigaku_toudai.png",
    "労働者を5人に増やす"
);

export const DepartmentStore = makePublicCard(
    "百貨店",
    "https://1.bp.blogspot.com/-Unp3L2OEOK8/U5hUNv4QdwI/AAAAAAAAhF8/twyOUqv6eh4/s400/tatemono_department_store.png",
    "手札を4枚捨てて家計から$24を得る"
);

export const DepartmentStoreMulti = makeMulti(DepartmentStore);

export const Collage = makePublicCard(
    "専門学校",
    "https://4.bp.blogspot.com/-C4HSiJSU3R4/VtofRuNhiAI/AAAAAAAA4Wg/xY35DGulaec/s400/building.png",
    "労働者を1人増やす\nこのラウンドからすぐに働ける"
)

export const InternationalExposition = makePublicCard(
    "万博",
    "https://2.bp.blogspot.com/-eHGfNsCpdKk/UZmCA8whRzI/AAAAAAAATaA/Wh4zJOgQFig/s550/world_children.png",
    "手札を5枚捨てて家計から$30を得る"
);

export const InternationalExpositionMulti = makeMulti(InternationalExposition);