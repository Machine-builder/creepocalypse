import { EntityDamageCause, world } from "@minecraft/server";

world.afterEvents.entityHurt.subscribe(function(data) {
    if (data.hurtEntity.typeId !== "cpoc:sandstreak") return;
    const damagingEntity = data.damageSource.damagingEntity;
    if (damagingEntity === undefined) return;
    
    // 60% chance to return some damage
    if (Math.random() > 0.6) return;

    // Return 20% of the damage
    const returnDamage = Math.ceil(data.damage * 0.2);

    try {
        damagingEntity.applyDamage(returnDamage, {
            cause: EntityDamageCause.contact,
            damagingEntity: data.hurtEntity
        });
    } catch {}
})