var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep:Creep) {

	    creep.work(false);

		//TODO dieses creep nach dem erledigen aller aufgaben verschrotten

	    if(creep.memory.working) {
	        creep.buildAll();
	    }
	    else {
			if(creep.getStorageEnergy(creep)){
				return
            }

                
			if(creep.getStorageEnergyBig(creep.room)){
				return
			}

			let source = Game.getObjectById(creep.memory.source)
			if(!source){
				source = creep.getEnergySourceForHarvester(creep.room, creep.memory.role);
			}
			creep.harvestSource(source);

	    }
	}
};

export default  roleBuilder;