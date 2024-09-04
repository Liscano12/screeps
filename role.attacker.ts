var roleAttacker = {

    

    /** @param {Creep} creep **/
    run: function(creep:Creep, destroyThisObjeckts: RoomHomeAndTarget[]) {

        //TODO wenn ich keine eigenen creeps in dem raum habe, sehe ich die objeckte nicht. Das creep muss da erst mal hinlaufen

        if(creep.memory.roomToAttack && creep.memory.roomToAttack !== creep.room.name){
            return creep.moveToRoom(creep.memory.roomToAttack);
        }


        //TODO dieser code ist temp code
        let enemys = creep.room.find(FIND_HOSTILE_CREEPS)
        if(enemys){
            let target = creep.pos.findClosestByRange(enemys)
            if(target){
            if(creep.attack(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
                return
            }}
        }

        //TODO das hier funktioniert nicht bei creeps
        var targetsObject:RoomHomeAndTarget[] = destroyThisObjeckts.filter((target)=>{
            return target.roomHome == creep.room.name
            })
        
        let realTargets:any[]=[]
        targetsObject.filter((target)=>{
            return Game.getObjectById(target.roomTarget)!=undefined && realTargets.push(Game.getObjectById(target.roomTarget))
        })
        creep.kill(creep.pos.findClosestByPath(realTargets));
	}
};

export default roleAttacker;