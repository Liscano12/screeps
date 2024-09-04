import constanten from "./constanten"

var roleAttackFlag = {

    /** @param {Creep} creep **/
    run: function(creep:Creep) {

        let attackFlags = Object.values(Game.flags).filter((flag)=> flag.name='Attack')
        if(!attackFlags.length){return}

        //TODO warte auf das spawen aller Attack creeps
        let creepArmy = Object.values(Game.creeps).filter((c)=>{ return c.memory.role == 'attackFlag'})
        if(creepArmy.length >= constanten.attackerOnFlagAmount){
            creep.memory.attacking = true;
        }

        if(!creep.memory.attacking){
            return;
        }

        //Laufe in den Raum mit der Attack Flagge
        if(attackFlags[0].room !== creep.room){
            return creep.moveToRoom(attackFlags[0].pos.roomName);
        }

        //Greife feindliche Creeps an
        let target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(target && target.owner.username !=='Source Keeper'){
            
            //TODO wenn es von der richtigen fraktions ist, greif es an
            if(creep.attack(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
        }

        //Greife feindliche Strukturen an
        let hostileStructures = creep.room.find(FIND_HOSTILE_STRUCTURES).filter((s)=>s.owner!= undefined &&s.owner.username !== 'Source Keeper');
        if(hostileStructures.length){
            let target = creep.pos.findClosestByRange(hostileStructures)
            if(!target){return}
            if(creep.attack(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
                return
            }
            if(creep.rangedAttack(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target)
                return
            }
        }
	}
};

export default roleAttackFlag;