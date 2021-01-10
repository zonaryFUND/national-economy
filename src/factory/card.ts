import { Card } from "model/interaction/game/card";
import { Farm, SlashAndBurn, DesignOffice, Cafe, Orchard, Factory, ConstructionCompany, Warehouse, LawOffice, Plantation, Restaurant, Settler, Realtor, SteelWorks, GeneralConstructor, COOP, Union, CarFactory, HQBuilding, CompanyHousing, Mansion, ChemicalFactory, DoubleConstructor, Railroad } from "./building";
import { Quarry, Mine, School, Carpenter, Stall, StallMulti, Market, MarketMulti, HighSchool, Supermarket, SupermarketMulti, University, DepartmentStore, DepartmentStoreMulti, Collage, InternationalExposition, InternationalExpositionMulti } from "./public-estate";
import { ConsumerGoods } from "./consumer-goods";
import { CardName } from "model/protocol/game/card";
import { VegetableGarden, Ironworks, Lottery, AmusementPark, PotatoField, TouristRanch, BuildingCompany, Laboratory, FoodFactory, Brewery, EarthConstruction, PetroleumComplex, Cathedral, TempleCarpenter, Shipyard, IndustrialPark, Cafeteria, PrefabricatedBuilder, Nursery, OldTown, AccountingFirm, Graveyard, ExportPort, RailroadStation, InvestmentBank, BotanicalGarden, Museum } from "./mecenat-buildings";
import { Ruins, Artifact, Rural, Colony, Workshop, SteamFactory, PoultryFarm, SkyscraperConstrution, GameCafe, CottonFarm, Monument, ConsumerUnion, Automata, CoalMine, ModernismConstruction, Theater, GuildHall, IvoryTower, Smelter, Teleporter, RevolutionSquare, Festival, TechExhibition, Greenhouse, EmpyrialTemple, LocomotiveFactory, ArtMuseum } from "./glory-buildings";

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

        // メセナの建物カード
        case "菜園":    return VegetableGarden;
        case "鉄工所":  return Ironworks;
        case "宝くじ":  return Lottery;
        case "遊園地":  return AmusementPark;
        case "芋畑":    return PotatoField;
        case "観光牧場":
                        return TouristRanch;
        case "建築会社":
                        return BuildingCompany;
        case "研究所":  return Laboratory;
        case "食品工場":
                        return FoodFactory;
        case "醸造所":  return Brewery;
        case "地球建設":
                        return EarthConstruction;
        case "石油コンビナート":
                        return PetroleumComplex;
        case "大聖堂":  return Cathedral;
        case "宮大工":  return TempleCarpenter;
        case "造船所":  return Shipyard;
        case "工業団地":
                        return IndustrialPark;
        case "食堂":    return Cafeteria;
        case "プレハブ工務店":
                        return PrefabricatedBuilder;
        case "養殖場":  return Nursery;
        case "旧市街":  return OldTown;
        case "会計事務所":
                        return AccountingFirm;
        case "墓地":    return Graveyard;
        case "輸出港":  return ExportPort;
        case "鉄道駅":  return RailroadStation;
        case "投資銀行":
                        return InvestmentBank;
        case "植物園":  return BotanicalGarden;
        case "博物館":  return Museum;


        // グローリーの追加公共建物カード
        case "遺跡": return Ruins;


        // グローリーの建物カード
        case "遺物": return Artifact;
        case "農村": return Rural;
        case "植民団": return Colony;
        case "工房": return Workshop;
        case "蒸気工場": return SteamFactory;
        case "養鶏場": return PoultryFarm;
        case "摩天建設": return SkyscraperConstrution;
        case "ゲームカフェ": return GameCafe;
        case "綿花農場": return CottonFarm;
        case "美術館": return ArtMuseum;
        case "記念碑": return Monument;
        case "消費者組合": return ConsumerUnion;
        case "機械人形": return Automata;
        case "炭鉱": return CoalMine;
        case "モダニズム建設": return ModernismConstruction;
        case "劇場": return Theater;
        case "ギルドホール": return GuildHall;
        case "象牙の塔": return IvoryTower;
        case "精錬所": return Smelter;
        case "転送装置": return Teleporter;
        case "革命広場": return RevolutionSquare;
        case "収穫祭": return Festival;
        case "技術展示会":return TechExhibition;
        case "温室": return Greenhouse;
        case "浄火の神殿": return EmpyrialTemple;
        case "機関車工場": return LocomotiveFactory;

        // 消費財
        case "消費財":  return ConsumerGoods;

        default:        return Farm;
    }
}