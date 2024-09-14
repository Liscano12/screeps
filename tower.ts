function tower(room:Room){
    let myStructures = room.find(FIND_MY_STRUCTURES);
    let towers = myStructures.filter((tower) => {
        return tower.structureType== STRUCTURE_TOWER }).filter((t)=>t.room == room) as StructureTower[]
        
    if(!towers.length){
        return;
    }
    let creeps= room.find(FIND_HOSTILE_CREEPS)
    if(creeps.length){
        towerAttackEnemy(towers);
        return
    }
    towerRepairing(towers);
    towerHeal(towers, room)
    
}

function towerHeal(towers:StructureTower[],room:Room){
    let creepsToHeal = room.find(FIND_MY_CREEPS).filter((c)=>c.hits<c.hitsMax)
    towers.forEach(tower => {
        if(tower.store.getFreeCapacity(RESOURCE_ENERGY)<500){
            tower.heal(creepsToHeal[0])
        }
    });
}

function towerAttackEnemy(towers:StructureTower[]) {
    towers.forEach(tower => {
        let closesHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closesHostile){
            tower.attack(closesHostile);
        }
    });
}

function towerRepairing(towers:StructureTower[]){

    let room= towers[0].room
    var targets = room.find(FIND_STRUCTURES);
    let filteredTargets = targets.filter((target) => {
        return target.hits!== undefined && 
        target.hits < target.hitsMax &&
        (target.structureType== STRUCTURE_CONTAINER ||
        target.structureType== STRUCTURE_ROAD)})

    var sources = room.find(FIND_MY_STRUCTURES);
    let filteredSources = sources.filter((source) => {
        return source.hits!== undefined && source.hits < source.hitsMax})

    filteredTargets.concat(filteredSources);
    if(!filteredTargets.length) {
        return;
    }

    towers.forEach(tower => {
        if(tower.store.getFreeCapacity(RESOURCE_ENERGY)<500){
            tower.repair(filteredTargets[0])
        }
    });
}

export default  tower;