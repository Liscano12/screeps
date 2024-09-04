var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep:Creep, controller: StructureController) {
        
        let myStructures = creep.room.find(FIND_MY_STRUCTURES);
        let spawns = myStructures.filter((spawn) => {
            return spawn.structureType== STRUCTURE_SPAWN})

        //Regenerate Creep
        creep.regenerateLivetime(300)
        if(creep.memory.regenerateActive){return}

        creep.work(false);
	    if(!creep.memory.working) {
            //
            if(creep.getStorageEnergy(creep)){
            }else if( creep.getStorageEnergyBig(creep.room)){
                
               
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