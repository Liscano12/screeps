var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep:Creep, controller: StructureController) {

        //Regenerate Creep
        creep.regenerateLivetime(300)
        if(creep.memory.regenerateActive){return}

        creep.work(false);
	    if(!creep.memory.working) {
            //
            let storages = creep.room.find(FIND_MY_STRUCTURES).filter((structure)=> structure.structureType == STRUCTURE_STORAGE )
            if(storages.length>0){
                creep.getStorageEnergyBig(creep.room)
                return
            }

            if(creep.getStorageEnergy(creep)){
            }else if(creep.room.controller && creep.room.controller.level<3){
                let source = Game.getObjectById(creep.memory.source)
                if(!source){
                    source = creep.getEnergySourceForHarvester(creep.room, creep.memory.role);
                }
                creep.harvestSource(source);
            }
        }
        else {
            creep.upgrade(controller);
        }
	}
};

export default  roleUpgrader;