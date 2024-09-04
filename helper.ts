import constanten  from './constanten';

/**
 * 
 * @param {Room} room
 * @param {string} role 
 * @returns {string} targetSource
 */
export function getEnergySourceForHarvester(room:Room, role:string){
    //Das ganze ding macht nicht was es soll

    let sources = room.find(FIND_SOURCES);
        if(sources.length==1){
            return sources[0].id;
        }
        let harvestersInThisRoom: Creep[] = Object.values(Game.creeps).filter((creep)=> creep.room==room && creep.memory.role==role);
        let harvestersOnSource: {
            sourceId: string,
            harvesters: number
        }[]=[]
        sources.forEach(source => {

            let harvesterOnSource = harvestersInThisRoom.filter((harvester)=>{
                return harvester.memory.source == source.id
            })
            let obj = {
                sourceId: source.id,
                harvesters: harvesterOnSource.length
            };
            harvestersOnSource.push(obj);
        });

        let minKey = harvestersOnSource.reduce((minObj, currentObj) => {
            return currentObj.harvesters < minObj.harvesters ? currentObj: minObj  ;
        }, harvestersOnSource[0]);

        return minKey.sourceId;
};

export function defend(room:Room){
    let structuresEnemys = room.find(FIND_HOSTILE_STRUCTURES)
    let creepsEnemys = room.find(FIND_HOSTILE_CREEPS)

    if(structuresEnemys.length!=0 || creepsEnemys.length!=0){
        let flags= room.find(FIND_FLAGS).filter((f)=>f.name=='Attack')
        if(flags.length==0){
            let error = room.createFlag(25,25,'Attack', COLOR_RED)
            console.log('error',error)
        }
    }else{
        let flags= room.find(FIND_FLAGS).filter((f)=>f.name=='Attack')
        if(flags.length!=0){
            flags.forEach((f)=>f.remove())
        }
    }
}

export function regenerateCreep(room:Room){

    let creepsWantRegeneration = room.find(FIND_MY_CREEPS).filter((c)=>c.memory.regenerate && c.room == room)
    
    if(creepsWantRegeneration.length==0){return false}
    
    let spawns = room.find(FIND_MY_STRUCTURES).filter((spawn) => {
        return spawn.structureType== STRUCTURE_SPAWN})
    if(spawns.length==0){return false}

    //Init regenerateThisCreep
    if(room.memory.regenerateThisCreep == undefined){
        room.memory.regenerateThisCreep = {
            active: false,
            creepID:'',
            creepName: ''
        };
    }

    if(room.memory.regenerateThisCreep.active){
        //TODO
        
        //No Spawns in room
        let spawnsReady= spawns.filter((s)=>{return s.spawning == null})
        if(spawnsReady.length==0){return true}
        
        let creeps = creepsWantRegeneration.filter((c)=>c.id== room.memory.regenerateThisCreep.creepID && c.room == spawns[0].room)
        //Creep ist vielleicht tot

        if(creeps.length==0){ 
            room.memory.regenerateThisCreep = {
                active: false,
                creepID:'',
                creepName: ''
            };
            return false
        }
        
        

        if(room.energyAvailable<=300){
            creeps[0].memory.regenerate=false
            creeps[0].memory.regenerateActive =  false
            room.memory.regenerateThisCreep = {
                active: false,
                creepID:'',
                creepName: ''
            };
            return false
        }
        
        let error = spawns[0].renewCreep(creeps[0])
        if(error == ERR_NOT_IN_RANGE || ERR_BUSY) {
            creeps[0].moveTo(spawns[0]);
        }

        //Creep is regeneratet or no Energy avable
        if(error == ERR_FULL){ 
            creeps[0].memory.regenerate=false
            creeps[0].memory.regenerateActive =  false
            room.memory.regenerateThisCreep = {
                active: false,
                creepID:'',
                creepName: ''
            };
            return false
        }
        return true
    }else{
        if(room.energyAvailable<constanten.energyNeedenForHarvester){return false}
        room.memory.regenerateThisCreep = {
            active: true,
            creepID: creepsWantRegeneration[0].id,
            creepName: creepsWantRegeneration[0].name
        };
        creepsWantRegeneration[0].memory.regenerateActive = true
        return true
    }

}
/*Cleam Memory*/
export function clearCreepMemory(){
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
        }
    }
}
