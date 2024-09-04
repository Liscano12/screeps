var roleStealer = {

    /** @param {Creep} creep **/
    run: function(creep:Creep) {
        creep.work(true);

        let myStructures = Object.values(Game.structures)
        let spawns = myStructures.filter((spawn) => {
            return spawn.structureType== STRUCTURE_SPAWN && spawn.room.name == creep.memory.roomHome})

        //Regenerate Creep
        if(creep.memory.regenerate && creep.memory.roomHome && creep.memory.roomHome!=creep.room.name){
            creep.moveToRoom(creep.memory.roomHome)
            return
        }
        if(creep.memory.regenerateActive){return}

	    if(!creep.memory.working) {

            if(creep.memory.roomToSteal && creep.memory.roomToSteal !== creep.room.name){
                return creep.moveToRoom(creep.memory.roomToSteal);
            }
            //TODO hier weiter machen
            let filteredTargets = creep.room.find(FIND_STRUCTURES).filter((target) => {
                return (target.structureType== STRUCTURE_STORAGE ||
                target.structureType == STRUCTURE_EXTENSION) &&
                target.store.getUsedCapacity(RESOURCE_ENERGY)>1
            })
            if(filteredTargets.length){
                let target = creep.pos.findClosestByPath(filteredTargets)
                if(!target){return}
                if(creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            }
        }
        else {
            if(creep.memory.roomHome && creep.memory.roomHome !== creep.room.name){
                return creep.moveToRoom(creep.memory.roomHome);
            }

            let neutralStructures = creep.room.find(FIND_STRUCTURES);
            let containersWithFreeCapatity = neutralStructures.filter((container) => {
                return container.structureType== STRUCTURE_CONTAINER  && container.store.getFreeCapacity(RESOURCE_ENERGY)>1})
            if(containersWithFreeCapatity.length){
                creep.fill(containersWithFreeCapatity);
            }else{
                creep.upgrade(creep.room.controller);
            }
        }
	}
};

export default  roleStealer;