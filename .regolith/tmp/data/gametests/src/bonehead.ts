import { world } from "@minecraft/server";

world.afterEvents.entityHurt.subscribe(function(data) {
    // Chance for head to fall off
    try {
        if (Math.random() < 0.3) {
            const entity = data.hurtEntity;

            if (entity.getProperty(`cpoc:headless`)) return;

            const dimension = entity.dimension;
            const headLocation = entity.getHeadLocation();
            const rotation = entity.getRotation();

            entity.triggerEvent(`cpoc:become_headless`);
            const headEntity = dimension.spawnEntity(`cpoc:bonehead_head`, {
                x: headLocation.x,
                y: headLocation.y - 0.5,
                z: headLocation.z
            });
            headEntity.setRotation(rotation);

            const yawRad = rotation.y / 180 * Math.PI;
            const knockbackX = Math.sin(yawRad);
            const knockbackZ = -Math.cos(yawRad);

            headEntity.applyKnockback(knockbackX, knockbackZ, 0.6, 0.5);
        }
    } catch {}
}, {
    entityTypes: ["cpoc:bonehead"]
});