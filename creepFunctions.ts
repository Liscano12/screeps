import constanten from "./constanten";

Creep.prototype.regenerateLivetime= function(ticksLeft){


    if(!this.ticksToLive){return false}
    if(this.ticksToLive<ticksLeft){
        this.memory.regenerate=true
        return true
    }
    return false
}

Creep.prototype.kill= function(target){
    if(target) {
        if(this.attack(target) == ERR_NOT_IN_RANGE) {
            this.moveTo(target);
        }
    }
}

Creep.prototype.moveToRoom = function(roomName) {
    this.moveTo(new RoomPosition(25,25, roomName,),{visualizePathStyle: {stroke: '#ffffff'}});
}

type HarvestersOnSource = {
    id: string,
    harvesters: number}

    Creep.prototype.getEnergySourceForHarvester = function (room: Room, role: string): Source |null {
        // Finde alle Energiequellen im Raum
        let sources = room.find(FIND_SOURCES);
        if (sources.length === 0) {
            return null;  // Falls keine Quellen vorhanden sind, gib null zurück
        }
    
        if (sources.length === 1) {
            return sources[0];  // Falls nur eine Quelle vorhanden ist, gib diese zurück
        }
    
        // Finde alle Harvester in diesem Raum mit der gegebenen Rolle
        let harvestersInThisRoom = Object.values(Game.creeps).filter(
            (creep) => creep.room.name === room.name && creep.memory.role === role
        );
    
        // Erstelle ein Array, um die Anzahl der Harvester pro Quelle zu speichern
        let harvestersOnSource: HarvestersOnSource[] = sources.map((source) => {
            let harvesterCount = harvestersInThisRoom.filter(
                (harvester) => harvester.memory.source === source.id
            ).length;
    
            return {
                id: source.id,
                harvesters: harvesterCount
            };
        });
    
        // Finde die Quelle mit den wenigsten Harvestern
        let targetSourceData = harvestersOnSource.reduce((leastHarvested, current) => {
            return current.harvesters < leastHarvested.harvesters ? current : leastHarvested;
        });
    
        // Speichere die ID der gewählten Quelle im Creep-Speicher
        this.memory.source = targetSourceData.id;
    
        // Hole das Source-Objekt und gib es zurück
        let targetSource = Game.getObjectById(targetSourceData.id) as Source;
        return targetSource;
    }

Creep.prototype.findFilledStorageSources = function() {

    //Finde filled storage
    let storage = this.room.find(FIND_STRUCTURES).filter(function(struct){
        return struct.structureType == STRUCTURE_CONTAINER && struct.store[RESOURCE_ENERGY]>200
    }) as StructureContainer[]
    if(storage.length){
        return [];
    }
    return storage;
}

Creep.prototype.harvestSource = function(source) {
    let error = this.harvest(source)
    if(error == ERR_NOT_IN_RANGE) {
        this.moveTo(source, {visualizePathStyle: {stroke: '#ffffff'}});
    }
}
/**
 * 
 * @param {Room} room  
 * @returns {boolean} 
 */
Creep.prototype.getStorageEnergy = function(creep) {
    let containers = creep.room.find(FIND_STRUCTURES).filter((s)=>s.structureType == STRUCTURE_CONTAINER &&
        s.store.getUsedCapacity(RESOURCE_ENERGY)!=0 && s.store.getUsedCapacity(RESOURCE_ENERGY) > creep.store.getFreeCapacity(RESOURCE_ENERGY))
    if(containers.length==0){return false}
    let targt = this.pos.findClosestByPath(containers)
    if(!targt){return false}
    if(this.withdraw(targt,RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        this.moveTo(targt);
    }
    return true;
}
/**
 * 
 * @param {Room} room 
 * @returns boolean
 */
Creep.prototype.getStorageEnergyBig = function(room){
    let storages = room.find(FIND_MY_STRUCTURES).filter((structure)=> structure.structureType == STRUCTURE_STORAGE )
    if(storages.length && storages[0].store.getUsedCapacity(RESOURCE_ENERGY)!=0 ){
        if(this.withdraw(storages[0],RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            this.moveTo(storages[0], {visualizePathStyle: {stroke: '#ffffff'}});
        }
        return true
    }
    return false;
}
/**
 * 
 * @returns 1 //buld, 2// nothing to build
 */
Creep.prototype.buildAll = function() {
    var targets = this.room.find(FIND_MY_CONSTRUCTION_SITES);
    if(targets.length) {
        let target = this.pos.findClosestByPath(targets)
        if(!target){return false}
        if(this.build(target) == ERR_NOT_IN_RANGE) {
            this.moveTo(target);
        }
        return true
    }
    let constructionSitesInOtherRoom = Object.values(Game.constructionSites).filter((constructionSite)=>constructionSite.room!=this.room);
    if(constructionSitesInOtherRoom.length){
        // TODO ist unsauber [0] könne bei mehrern Räumen zu hin und herlaufen führen
        this.moveTo(constructionSitesInOtherRoom[0]);
        return true
    }
    return false

}
/**
 * 
 * @returns 1 // ok, 2 //Noting to repair
 */
Creep.prototype.repairAll = function() {

    Object.values(Game.structures)

    var targets = this.room.find(FIND_STRUCTURES);
    let filteredTargets = targets.filter((target) => {
        return target.hits!== undefined && 
        target.hits < target.hitsMax &&
        (target.structureType== STRUCTURE_CONTAINER ||
        target.structureType== STRUCTURE_ROAD)})

    var sources = this.room.find(FIND_MY_STRUCTURES);
    let filteredSources = sources.filter((source) => {
        return source.hits!== undefined && source.hits < source.hitsMax})

    filteredTargets.concat(filteredSources);
    if(filteredTargets.length) {
        let target = this.pos.findClosestByPath(filteredTargets)
        if(!target){return}
        if(this.repair(target) == ERR_NOT_IN_RANGE) {
            this.moveTo(target);
        }
        return;
    }
}

Creep.prototype.upgrade = function(controller) {
    if(this.upgradeController(controller) == ERR_NOT_IN_RANGE) {
        this.moveTo(controller, {visualizePathStyle: {stroke: '#ffffff'}});
    }
}
/**
 * 
 * @param {boolean} regenerateAfterWork 
 */
Creep.prototype.work = function(regenerateAfterWork) {
    if(this.memory.working && this.store[RESOURCE_ENERGY] == 0) {
        this.memory.working = false;
        if(regenerateAfterWork){
            this.memory.regenerate=true;
        }
        this.say('🔄 harvest');
    }
    if(!this.memory.working && this.store.getFreeCapacity() == 0) {
        this.memory.working = true;
        this.say('🚧 working');
    }
}

Creep.prototype.fill = function(structuresNeedEnergy) {
    let target =this.pos.findClosestByRange(structuresNeedEnergy)
    if(target==null){return}
    if(target.structureType==STRUCTURE_STORAGE){
        for (const resourceType in this.store) {
            if(this.transfer(target, resourceType as ResourceConstant) == ERR_NOT_IN_RANGE) {
                this.moveTo(target);
            }
        }
    }else{
        if(this.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            this.moveTo(target);
        }
    }
}

export default {}

