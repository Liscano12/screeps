var roomClaimer = {

    /** @param {Creep} creep **/
    run: function(creep:Creep) {
        //creep.work();
        
	    if(creep.memory.roomToClaim && creep.memory.roomToClaim !== creep.room.name){
            return creep.moveToRoom(creep.memory.roomToClaim);
        }
        if(creep.memory.roomToClaim && creep.memory.roomToClaim == creep.room.name){
            //TODO Claim oder Reservieren umsetzen
            let controller = creep.room.controller
            if(!controller){return}
            if(creep.claimController(controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(controller);
            }
            return;
        }
	}
};

export default  roomClaimer;