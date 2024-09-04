var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep:Creep) {

        let myStructures = creep.room.find(FIND_MY_STRUCTURES);
        let spawns = creep.room.find(FIND_MY_SPAWNS)

        //Regenerate Creep
        creep.regenerateLivetime(400)
        if(creep.memory.regenerateActive){return}
        
        creep.work(false);
        
	    if(creep.memory.working) {
            
            let extensions = myStructures.filter((extension) => {
                return extension.structureType== STRUCTURE_EXTENSION})
            let emptyExtensions: AnyStoreStructure[] = extensions.filter((extension) => {
                return extension.store.getFreeCapacity(RESOURCE_ENERGY)>1});
            
            let neutralStructures = creep.room.find(FIND_STRUCTURES);

            
            //TODO Prüfen ob das geht
            if(spawns[0].store.getFreeCapacity(RESOURCE_ENERGY) > 1 &&  extensions.length <5){
                if(creep.transfer(spawns[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(spawns[0]);
                }
                return;
            }
            
            if(creep.room.find(FIND_MY_CREEPS).filter((c)=>c.memory.role== "logistiker").length==0){
                
                if(spawns[0].store.getFreeCapacity(RESOURCE_ENERGY) > 1){
                    emptyExtensions.push(spawns[0])
                }
                
                //Deliver Towers
                let towers = myStructures.filter((tower) => {
                    return tower.structureType== STRUCTURE_TOWER && tower.store.getFreeCapacity(RESOURCE_ENERGY) >150})
                if(towers.length){
                    creep.fill(towers);
                    return;
                }

                //Deliver Extensions
                if(emptyExtensions.length){
                    creep.fill(emptyExtensions);
                    return;
                }
            }
            
            // Deliver Container
            let containers = neutralStructures.filter((container) => {
                return container.structureType== STRUCTURE_CONTAINER  && container.store.getFreeCapacity(RESOURCE_ENERGY)>1})
            if(containers.length){
                creep.fill(containers);
                return;
            }
            // Deliver Storage
            let storages = neutralStructures.filter((storage) => {
                return storage.structureType== STRUCTURE_STORAGE  && storage.store.getFreeCapacity(RESOURCE_ENERGY)>1})
            if(storages.length){
                creep.fill(storages);
                return;
            }
            var constructionSides = creep.room.find(FIND_MY_CONSTRUCTION_SITES);
            if(constructionSides.length){
               creep.buildAll();
               return;
            }else{
                creep.upgrade(creep.room.controller);
                return;
            }
        }else{
            let source = Game.getObjectById(creep.memory.source)
            if(!source){
                source = creep.getEnergySourceForHarvester(creep.room, creep.memory.role);
            }
            creep.harvestSource(source);
        }
	}
};

export default roleHarvester;