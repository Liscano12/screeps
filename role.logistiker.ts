var roleLogistiker = {

    /** @param {Creep} creep **/
    run: function(creep: Creep) {

        let myStructures = creep.room.find(FIND_MY_STRUCTURES);
        let spawns = myStructures.filter((spawn) => {
            return spawn.structureType== STRUCTURE_SPAWN})

        //Regenerate Creep
        creep.regenerateLivetime(300)
        if(creep.memory.regenerateActive){return}

	    creep.work(false);

        let extensions: StructureExtension[] = myStructures.filter((extension) => {
            return extension.structureType== STRUCTURE_EXTENSION})
        let emptyExtensions: Structure[] = extensions.filter((extension) => {
            return extension.store.getFreeCapacity(RESOURCE_ENERGY)>1});
        let neutralStructures: Structure[] = creep.room.find(FIND_STRUCTURES);

	    if(!creep.memory.working) {

            let droppedResources: Resource<ResourceConstant>[] = creep.room.find(FIND_DROPPED_RESOURCES)
            if(droppedResources.length){
                let closesResource = creep.pos.findClosestByPath(droppedResources)
                if(!closesResource){return}
                if(creep.pickup(closesResource) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(closesResource);
                    return
                }
            }
            let tombstones = creep.room.find(FIND_TOMBSTONES).filter((t)=>t.store.getUsedCapacity(RESOURCE_ENERGY)!=0)
            if(tombstones.length){
                let closesTombstone = creep.pos.findClosestByPath(tombstones)
                if(!closesTombstone){return}
                if(creep.withdraw(closesTombstone,RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(closesTombstone);
                    return
                }
            }

            if(creep.getStorageEnergy(creep)){
            }else if(creep.store.getFreeCapacity(RESOURCE_ENERGY)> 1){
                
                creep.getStorageEnergyBig(creep.room)
            }
	    }
	    else {
            //TODo liefer alle resourcen die keine energei sind an den Storage

            //Deliver Towers
            let towers = myStructures.filter((tower) => {
                return tower.structureType== STRUCTURE_TOWER}).filter((t)=> t.store.getFreeCapacity(RESOURCE_ENERGY) >150)
            if(towers.length){
                creep.fill(towers);
                return;
            }

             //Deliver Spawn   
             if(spawns[0].store.getFreeCapacity(RESOURCE_ENERGY) > 1){
                emptyExtensions.push(spawns[0])
            }

            //Deliver Extensions
            if(emptyExtensions.length){
                creep.fill(emptyExtensions);
                return;
            }

            // Deliver Storage
            let storages: StructureStorage[] = neutralStructures.filter((storage) => {
                return storage.structureType== STRUCTURE_STORAGE}) as StructureStorage[]
            let storageFilled = storages.filter((s)=>s.store.getFreeCapacity(RESOURCE_ENERGY)>1)
            if(storageFilled.length){
                creep.fill(storageFilled);
                return;
            }
	    }
	}
};

export default  roleLogistiker;