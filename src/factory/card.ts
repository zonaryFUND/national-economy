import { Card } from "model/interaction/game/card";
import { Farm, SlashAndBurn, DesignOffice, Cafe, Orchard, Factory, ConstructionCompany, Warehouse, LawOffice, Plantation, Restaurant, Settler, Realtor, SteelWorks, GeneralConstructor, COOP, Union, CarFactory, HQBuilding, CompanyHousing, Mansion, ChemicalFactory, DoubleConstructor, Railroad } from "./building";
import { Quarry, Mine, School, Carpenter, Stall, StallMulti, Market, MarketMulti, HighSchool, Supermarket, SupermarketMulti, University, DepartmentStore, DepartmentStoreMulti, Collage, InternationalExposition, InternationalExpositionMulti } from "./public-estate";
import { ConsumerGoods } from "./consumer-goods";
import { CardName } from "model/protocol/game/card";

export default function cardFactory(name: CardName, players: number = 2): Card {
    switch (name) {
        // 公共の建物カード
        case "採石場":  return Quarry;
        case "鉱山":    return Mine;
        case "学校":    return School;
        case "大工":    return Carpenter;
        case "露店":    return players == 2 ? Stall : StallMulti;
        case "市場":    return players == 2 ? Market : MarketMulti;
        case "高等学校":
                        return HighSchool;
        case "スーパーマーケット":    
                        return players == 2 ? Supermarket : SupermarketMulti;
        case "大学":    return University;
        case "百貨店":  return players == 2 ? DepartmentStore : DepartmentStoreMulti;
        case "専門学校":
                        return Collage;
        case "万博":    return players == 2 ? InternationalExposition : InternationalExpositionMulti;
        
        // 建物カード
        case "農場":    return Farm;
        case "焼畑":    return SlashAndBurn;
        case "設計事務所":
                        return DesignOffice;
        case "珈琲店":  return Cafe;
        case "果樹園":  return Orchard;
        case "工場":    return Factory;
        case "建設会社":
                        return ConstructionCompany;
        case "倉庫":    return Warehouse;
        case "法律事務所":
                        return LawOffice;
        case "大農園":  return Plantation;
        case "レストラン":
                        return Restaurant;
        case "開拓民":  return Settler;
        case "不動産屋":
                        return Realtor;
        case "製鉄所":  return SteelWorks;
        case "ゼネコン":
                        return GeneralConstructor;
        case "農協":    return COOP;
        case "労働組合":
                        return Union;
        case "自動車工場":
                        return CarFactory;
        case "鉄道":    return Railroad;
        case "本社ビル": 
                        return HQBuilding;
        case "社宅":    return CompanyHousing;
        case "邸宅":    return Mansion;
        case "化学工場":
                        return ChemicalFactory;
        case "二胡市建設":
                        return DoubleConstructor;

        // 消費財
        case "消費財":  return ConsumerGoods;

        default:        return Farm;
    }
}