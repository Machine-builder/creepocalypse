// Imports

import { Dimension, Entity, EntityHealthComponent, EntityIsStunnedComponent, TicksPerSecond, Vector3, system, world } from "@minecraft/server";
import { GenericEventSignal } from "./lib/event";

// Event arg types

interface ExplodeEvent {
    entity: Entity,
    location: Vector3,
    dimension: Dimension
}

export const explodeEvent = new GenericEventSignal<ExplodeEvent>();

function isEntityAlive(entity: Entity) {
    const healthComponent = entity.getComponent(EntityHealthComponent.componentId);
    return healthComponent?.currentValue??0 > 0;
}

system.afterEvents.scriptEventReceive.subscribe(data => {
    if (data.id == "cpoc:start_exploding") {
        const entity: Entity | undefined = data.sourceEntity;
        if (entity === undefined) return;

        /*

        Something a little odd goes on here. This is the explanation:

        - Listen for the start explode event, and set a timeout with the
          fuse duration

        - After fuse duration - 1 tick (so just before creeper explodes)
          check if the creeper still has the exploding component
        
        - If it does, set a 1 tick timeout and after that check if the entity
          is still valid. If the entity is not valid, we know it exploded. If
          it is valid, the explosion did not complete

        */

        system.runTimeout(() => {
            if (entity.hasComponent(EntityIsStunnedComponent.componentId) && isEntityAlive(entity)) {

                // Get some attributes from the entity before we can't anymore
                const location = entity.location;
                const dimension = entity.dimension;

                system.runTimeout(() => {
                    if (!entity.isValid() || entity.hasComponent(EntityIsStunnedComponent.componentId)) {
                        explodeEvent.trigger({ entity: entity, location: location, dimension: dimension });
                    };
                }, 1);
            }
        }, (data.message.length>0 ? parseFloat(data.message) : 1.5*TicksPerSecond) - 1);
    }
});