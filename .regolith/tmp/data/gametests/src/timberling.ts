import { EntityInitializationCause, world } from "@minecraft/server";
import { explodeEvent } from "./explodeEvent";

explodeEvent.subscribe(function(data) {
    if (data.entity.typeId !== "cpoc:timberling") return;

    // Spawn projectiles

    data.dimension.spawnEntity("cpoc:timberling_blast", {
        x: data.location.x,
        y: data.location.y + 1.2,
        z: data.location.z
    });
});

world.afterEvents.entitySpawn.subscribe(function(data) {
    if (data.entity.typeId !== "cpoc:timberling_splinter") return;
    if (data.cause !== EntityInitializationCause.Event) return;

    const projectile = data.entity;

    const yaw = Math.random()*Math.PI*2;
    const directionX = Math.sin(yaw);
    const directionZ = -Math.cos(yaw);
    const verticalStrength = (Math.random()-0.5)*1.5;

    try {
        projectile.applyImpulse({
            x: directionX,
            y: verticalStrength,
            z: directionZ
        });
    } catch {}
})