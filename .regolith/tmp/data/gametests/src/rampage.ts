import { Vector3, system, world } from "@minecraft/server"

system.afterEvents.scriptEventReceive.subscribe(data => {
    if (data.id == "cpoc:tick") {

        const entity = data.sourceEntity;

        if (entity?.typeId !== "cpoc:rampage") return;

        const hasTarget = entity.getProperty("cpoc:has_target") ?? false;
        if (!hasTarget) return;

        // Check if not moving for x time

        const velocity = entity.getVelocity();
        const isMoving = !(Math.abs(velocity.x) < 0.025 && Math.abs(velocity.z) < 0.025);

        // If entity is currently still
        if (entity.getDynamicProperty("cpoc:is_still") ?? false) {

            // Get the "still location" and the current location to see if the entity has moved too far
            // from the still location...
            // @ts-ignore
            const stillLoc: Vector3 = entity.getDynamicProperty("cpoc:still_location") ?? {x:0,y:0,z:0};
            const location = entity.location;
            const isNearby = Math.abs(stillLoc.x - location.x) < 1 && Math.abs(stillLoc.z - location.z) < 1 ;

            // If entity moved too far, unset the still property and reset the timer
            if (!isNearby) {
                entity.setDynamicProperty("cpoc:is_still", undefined);
                entity.setDynamicProperty("cpoc:still_timer", 0);

            // Otherwise count the timer up, and explode when some time is reached
            } else {
                // @ts-ignore
                let timerValue: number = entity.getDynamicProperty("cpoc:still_timer") ?? -1;
                timerValue++;
                entity.setDynamicProperty("cpoc:still_timer", timerValue);

                if (timerValue > 3) {
                    // Spawn an explosion
                    entity.dimension.spawnEntity("cpoc:rampage_instant_explosion", entity.location);

                    // Force explode
                    entity.remove();

                    return;
                }
            }
        } else if (!isMoving) {
            entity.setDynamicProperty("cpoc:is_still", true);

            // Store current location
            entity.setDynamicProperty("cpoc:still_location", entity.location);
        }
    }
});