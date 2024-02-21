import { world } from "@minecraft/server";
import { explodeEvent } from "./explodeEvent";

explodeEvent.subscribe(function(data) {
    if (data.entity.typeId !== "cpoc:sporeburst") return;


    // Place mycelium nearby


})