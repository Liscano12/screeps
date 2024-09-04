import * as helper from './helper'
var roleRepairer = {

    /** @param {Creep} creep **/
    run: function(creep:Creep) {
        creep.work(false);

        //Regenerate Creep
        creep.regenerateLivetime(400)
        if(creep.memory.regenerateActive){return}
        if(creep.memory.regenerate && creep.memory.roomHome && creep.memory.roomHome !== creep.room.name){
                return creep.moveToRoom(creep.memory.roomHome);
        }

	    if(creep.memory.working) {
            if(creep.memory.roomToRepair && creep.memory.roomToRepair !== creep.room.name){
                return creep.moveToRoom(creep.memory.roomToRepair);
            }
			creep.repairAll();
	    }else {

            if(creep.getStorageEnergy(creep)){return}
            if(creep.getStorageEnergyBig(creep.room)){return}
            let sourceId =helper.getEnergySourceForHarvester(creep.room, creep.memory.role)
            let source = Game.getObjectById(sourceId) as Source
            if(source==null){return}
            creep.harvestSource(source)
            return
        }
	}
};

export default  roleRepairer;