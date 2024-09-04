var roleUpgraderRoomWihoutSpawn = {

    /** @param {Creep} creep **/
    run: function(creep:Creep) {
        creep.work(false);

        //Regenerate Creep
        creep.regenerateLivetime(300)
        if(creep.memory.regenerateActive){return}

        let spawns = creep.room.find(FIND_MY_SPAWNS)


        //Move to Target romm
        if(creep.memory.roomToUpgrade && creep.memory.roomToUpgrade != creep.room.name){
            creep.moveToRoom(creep.memory.roomToUpgrade)
            return
        }

        //TODO BUG. Die creeps haben eine falsche source id im speicher und machen dann nihts im zielraum

        if(!creep.memory.working) {
            let source = Game.getObjectById(creep.memory.source)
            if(!source || source.room !=creep.room){
                source = creep.getEnergySourceForHarvester(creep.room, creep.memory.role)
            }
            creep.harvestSource(source);
        }else{
            if(spawns[0].store.getFreeCapacity(RESOURCE_ENERGY) > 1){
                if(creep.transfer(Game.spawns['Spawn2'], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(Game.spawns['Spawn2']);
                }
                return;
            }
            creep.buildAll()
        }
	}
};

export default  roleUpgraderRoomWihoutSpawn;