import * as helper from './helper'
var roleRoomHarvester = {

    /** @param {Creep} creep **/
    run: function(creep:Creep) {
        creep.work(false);

        let myStructures = Object.values(Game.structures)
        let spawns = myStructures.filter((spawn) => {
            return spawn.structureType== STRUCTURE_SPAWN && spawn.room.name == creep.memory.roomHome})

        //Regenerate Creep      
        creep.regenerateLivetime(spawns)
        if(creep.memory.regenerateActive){return}
        if(creep.memory.regenerate){
            if(creep.memory.roomHome && creep.memory.roomHome !== creep.room.name){
                return creep.moveToRoom(creep.memory.roomHome);
            }
            return
        }

	    if(!creep.memory.working) {
            if(creep.memory.roomToHarvest && creep.memory.roomToHarvest !== creep.room.name){
                return creep.moveToRoom(creep.memory.roomToHarvest);
            }
            let sourceId = creep.memory.source
            if(!creep.memory.source){
                sourceId = helper.getEnergySourceForHarvester(creep.room, creep.memory.role);
                creep.memory.source = sourceId
            }
            let source = Game.getObjectById(sourceId) as Source
            if(source==null){return}
            creep.harvestSource(source)
        }
        else {

            //TODO nur der Container neben dir
            let neutralStructures = creep.room.find(FIND_STRUCTURES);
            let containersWithFreeCapatity = neutralStructures.filter((container) => {
                return container.structureType== STRUCTURE_CONTAINER  && container.store.getFreeCapacity(RESOURCE_ENERGY)>1})
            if(containersWithFreeCapatity.length){
                creep.fill(containersWithFreeCapatity);
            }
        }
	}
};

export default  roleRoomHarvester;