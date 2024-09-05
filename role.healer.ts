var roleHealer = {

    /** @param {Creep} creep **/
    run: function(creep:Creep) {

        let injuredCreeps = creep.room.find(FIND_MY_CREEPS).filter((c) => {
            return c.room.name === creep.room.name && c.hits < c.hitsMax;
        });

        if(injuredCreeps.length ==0){return}

        //TODO in anderen räumen mit spawn schauen und auch da reparieren
        let target = creep.pos.findClosestByPath(injuredCreeps)
        if(target == null){return}
        if(creep.heal(target) == ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
        }
	}
};

export default  roleHealer;