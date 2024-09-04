var roleTransporter = {

    /** @param {Creep} creep **/
    run: function(creep:Creep) {
        creep.work(true);

        //Regenerate Creep
        creep.regenerateLivetime(400)
        if(creep.memory.regenerateActive){return}
        
	    if(!creep.memory.working) {
            if(creep.memory.roomToTransport && creep.memory.roomToTransport !== creep.room.name){
                return creep.moveToRoom(creep.memory.roomToTransport);
            }
            creep.getStorageEnergy(creep)

            if(creep.store.getFreeCapacity(RESOURCE_ENERGY)==0){return}

            let harvesters:Creep[] = creep.room.find(FIND_MY_CREEPS).filter((c)=>c.memory.role=='roomHarvester' &&
                c.room == creep.room && c.store.getUsedCapacity(RESOURCE_ENERGY)>0)
            if(harvesters.length>0){
                let harvester= creep.pos.findClosestByPath(harvesters)
                if(harvester==null){return}
                let error = harvester.transfer(creep,RESOURCE_ENERGY)
                if(error == ERR_NOT_IN_RANGE) {
                    creep.moveTo(harvester, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
	    }else {
            if(creep.memory.roomHome && creep.memory.roomHome !== creep.room.name){
                return creep.moveToRoom(creep.memory.roomHome);
            }

            let neutralStructures = creep.room.find(FIND_STRUCTURES);

            // Deliver Storage
            let storages:StructureStorage[] = neutralStructures.filter((storage) => {
                return storage.structureType== STRUCTURE_STORAGE}).filter((s)=> s.store.getFreeCapacity(RESOURCE_ENERGY)>1)
            if(storages.length){
                creep.fill(storages);
                return;
            }
            
             // Deliver Container
             let containers = neutralStructures.filter((container) => {
                return container.structureType== STRUCTURE_CONTAINER}).filter((s)=>s.store.getFreeCapacity(RESOURCE_ENERGY)>1)
            if(containers.length){
                creep.fill(containers);
                return;
            }
            
            
        }
	}
};

export default  roleTransporter;