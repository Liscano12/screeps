

var roleRoomReserver = {

    /** @param {Creep} creep **/
    run: function(creep:Creep) {
        if(creep.memory.roomToReserve && creep.memory.roomToReserve !== creep.room.name){
            return creep.moveToRoom(creep.memory.roomToReserve);
        }
        if(creep.memory.roomToReserve && creep.memory.roomToReserve == creep.room.name){
            //TODO Claim oder Reservieren umsetzen
            if(creep.room.controller== undefined){return}

            let error = creep.reserveController(creep.room.controller)
            if(error == ERR_NOT_IN_RANGE) {
                //console.log('claim room',creep.room.controller.id);
                creep.moveTo(creep.room.controller);
            }
            if(error == ERR_INVALID_TARGET){
                creep.attackController(creep.room.controller)
            }
            return;
        }
 
	}
};

export default  roleRoomReserver;