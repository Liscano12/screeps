import creepFunctions  from './creepFunctions'
import * as helper from './helper'
import constanten from './constanten'
import _ from "lodash"

function spawenAllCreeps(room:Room,roomNamesToHarvest: RoomHomeAndTarget[],roomsToClaimName:RoomHomeAndTarget[],
    destroyThisObjeckts:RoomHomeAndTarget[],roomNamesToRepair:RoomHomeAndTarget[],
    roomsToStealName:RoomHomeAndTarget[],roomsControllerToReserve:RoomHomeAndTarget[],
    spawenNeutralRoomBuilderHere:string[]){
    
    if(!(room && room.controller && room.controller.my)){return;}

    let spawns:StructureSpawn[] = room.find(FIND_MY_SPAWNS).filter((s)=>{
        return s.spawning == null
    });
    if(!spawns.length){return}

    let myStructures: AnyOwnedStructure[] = room.find(FIND_MY_STRUCTURES);
    let neutralStructures: AnyStructure[] = room.find(FIND_STRUCTURES);
    let creeps: Creep[] = room.find(FIND_MY_CREEPS);
    
    let containers: StructureContainer[] = neutralStructures.filter((s)=>{
        return s.structureType== STRUCTURE_CONTAINER})
    let extensions: StructureExtension[] = myStructures.filter((s)=>{
        return s.structureType== STRUCTURE_EXTENSION
    })
    let extensionsWithFreeCapacity: StructureExtension[] = myStructures.filter((s)=>{
        return s.structureType== STRUCTURE_EXTENSION}).filter((e)=> e.store.getFreeCapacity(RESOURCE_ENERGY) > 1)

    let result;

    //TODO prüfen ob ein creep ein upgrade bekommen kann. Wenn ja, upgraden
    // Warten um ein upgrade zu erzwingen
    if(spawnBigHarvester(creeps,room) && !(spawns[0].room.energyAvailable<constanten.energyNeedenForHarvester)){
        console.log('Spwawn Harvester in ',spawns[0].room.name)
        spawns[0].spawnCreep([WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE] , 'Harvester' + Game.time, 
            {memory: {role: 'harvester', working: false, roomHome: room.name , source: helper.getEnergySourceForHarvester(room,'harvester')}});
        return;
    }else if(spawnHarvester(creeps, room)){

        //TODO If upgrade möglich aber nicht genug energie verfügbar = return
        //upgrade erst das creep bevor andere erschaffen werden
        // vielleicht in das if mit einem oder upgradePossible()
        console.log('Spwawn harvester in ',spawns[0].room.name)
        let bodyAndPrice = getBody([WORK,CARRY,MOVE],room,constanten.energyNeedenForHarvester)
        spawns[0].spawnCreep( bodyAndPrice.bodyParts, 'Harvester' + Game.time, 
            {memory: {role: 'harvester', working: false, roomHome: room.name ,source: helper.getEnergySourceForHarvester(room,'harvester'),
                bodyPrice: bodyAndPrice.price
            }});
        return;
    }else if(spawnBuilder(creeps, room)){
        console.log('Spwawn Builder in ',spawns[0].room.name)
        let bodyAndPrice = getBody([WORK,CARRY,MOVE],room,500)
        spawns[0].spawnCreep(bodyAndPrice.bodyParts, 'Builder' + Game.time, 
            {memory: {role: 'builder', working: false, roomHome: room.name, bodyPrice: bodyAndPrice.price}});
        return; 
    }else if(spawnUpgrader(creeps,room)){
        console.log('Spwawn Upgrader in ',spawns[0].room.name)
        let bodyAndPrice = getBody([WORK,CARRY,MOVE],room, constanten.energyNeedenForUpgrader)
        spawns[0].spawnCreep(bodyAndPrice.bodyParts, 'Upgrader' + Game.time, 
            {memory: {role: 'upgrader', working: false, roomHome: room.name, bodyPrice: bodyAndPrice.price}});
        return;
    }else if(spawnBigUpgrader(creeps,room) && spawns[0].room.energyAvailable>=constanten.energyNeedenForUpgrader){
        console.log('Spwawn Big Upgrader in ',spawns[0].room.name)
        let bodyAndPrice = getBody([WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE],room, constanten.energyNeedenForUpgrader)
        spawns[0].spawnCreep(bodyAndPrice.bodyParts, 'Upgrader' + Game.time, 
            {memory: {role: 'upgrader', working: false, roomHome: room.name, bodyPrice: bodyAndPrice.price}});
        return;
    }else if ((result=spawenCreepsAttacker(room,destroyThisObjeckts)).spawn){
        console.log('Spwawn Attacker in ',spawns[0].room.name)
        spawns[0].spawnCreep([MOVE, MOVE, MOVE,ATTACK, ATTACK,ATTACK], 'Attacker' + Game.time, {
            memory: {role: 'attacker', roomHome: room.name, roomToAttack: result.roomToAttack}});
        return
    }else if((result=spawenBuilderNeutralRoom(room,spawenNeutralRoomBuilderHere)).spawn){
        console.log('Spwawn BuilderNeutralRoom in ',spawns[0].room.name)
        let bodyAndPrice = getBody([WORK,CARRY,MOVE],room, 1200)
        spawns[0].spawnCreep(bodyAndPrice.bodyParts, 'BuilderNeutralRoom' + Game.time, 
        {memory: {role: 'builderNeutralRoom', working: false, roomHome: room.name, roomToBuild:result.roomToBuild, bodyPrice: bodyAndPrice.price}});
        return;
    }else if((result=spawnRoomHarvester(room,extensions, spawns, extensionsWithFreeCapacity,roomNamesToHarvest)).spawn){
        console.log('Spwawn RoomHarvester in ',spawns[0].room.name)
        let bodyAndPrice = getBody([WORK,WORK,WORK,CARRY,MOVE],room, 1100)
        spawns[0].spawnCreep(bodyAndPrice.bodyParts, 'RoomHarvester' + Game.time, 
            {memory: {role: 'roomHarvester', working: false, roomToHarvest:  result.roomToHarvest, roomHome: room.name, bodyPrice: bodyAndPrice.price }});
        return;
    }else if((result=spawenRoomTransporter(room,extensions, spawns, extensionsWithFreeCapacity,roomNamesToHarvest)).spawn){
        console.log('Spwawn RoomTransporter in ',spawns[0].room.name)
        let bodyAndPrice = getBody([CARRY,CARRY,MOVE],room, 1200)
        spawns[0].spawnCreep( bodyAndPrice.bodyParts, 'RoomTransporter' + Game.time, 
            {memory: {role: 'roomTransporter', working: false, roomToTransport:  result.roomToTransport, roomHome: room.name, bodyPrice: bodyAndPrice.price }});
        return;
    }else if((result=spawnRepairer(room,spawns, extensions, roomNamesToRepair)).spawn){
        console.log('Spwawn Repairer in ',spawns[0].room.name)
        spawns[0].spawnCreep([WORK,WORK,CARRY,CARRY,MOVE],  'Repairer' + Game.time, {
            memory: {role: 'repairer', working: false, roomToRepair: result.roomToRepair, roomHome: room.name}});
        return;
    }if(spawnLogistiker(creeps,room) && spawns[0].room.energyAvailable>=1000){
        console.log('Spwawn Logistiker in ',spawns[0].room.name)
        spawns[0].spawnCreep([CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE], 'Logistiker' + Game.time, 
            {memory: {role: 'logistiker', working: false, roomHome: room.name}});
        return;
    }else if((result=spawenCreepsStealer(room,spawns, extensions, extensionsWithFreeCapacity, roomsToStealName)).spawn) {
        console.log('Spwawn Stealer in ',spawns[0].room.name)
        let bodyAndPrice = getBody([WORK,CARRY,MOVE],room,1500)
        spawns[0].spawnCreep( bodyAndPrice.bodyParts, 'Stealer' + Game.time, 
        {memory: {role: 'stealer', working: false, roomToSteal: result.roomToSteal, roomHome: room.name, bodyPrice: bodyAndPrice.price }});
        return;
    }else if((result=spawenCreepsAttackerFlags(spawns, 'Attack')).spawn){
        console.log('Spwawn Attack in ',spawns[0].room.name)
        spawns[0].spawnCreep([TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,ATTACK,ATTACK,ATTACK ], 'Attacker' + Game.time, {
            memory: {role: 'attackFlag',flag: result.flag, attacking: false}});
        return
    }else if((result=spawenRoomClaimer(room,roomsToClaimName)).spawn){
        console.log('Spwawn RoomClaimer in ',spawns[0].room.name)
        spawns[0].spawnCreep([ CLAIM, CLAIM, MOVE, MOVE ], 'RoomClaimer' + Game.time, {
            memory: {role: 'roomClaimer', roomToClaim: result.roomToClaim}});
        return
    }else if((result=spawenRoomReserver(room,roomsControllerToReserve)).spawn){
        console.log('Spwawn RoomReserver in ',spawns[0].room.name)
        spawns[0].spawnCreep([ CLAIM,CLAIM, MOVE, MOVE], 'RoomReserver' + Game.time, {
            memory: {role: 'roomReserver', roomToReserve: result.roomToReserve, roomHome: room.name}});
        return
    }else if((result=spawnUpgraderRoomWihoutSpawn()).spawn){
        console.log('Spwawn UpgraderRoomWihoutSpawn in ',spawns[0].room.name)
        let bodyAndPrice =getBody([WORK,CARRY,MOVE],room, 1500)
        spawns[0].spawnCreep(bodyAndPrice.bodyParts, 'UpgraderRoomWihoutSpawn' + Game.time, {
            memory: {role: 'upgraderRoomWihoutSpawn', roomToUpgrade: result.roomToUpgrade, bodyPrice: bodyAndPrice.price}});
        return
    }

    return;
    
}

/* harvester upgrader
Game.getObjectById('66d81e66bd4d1aa1f937474f').spawnCreep([WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE], 'Harvester' + Game.time, 
        {memory: {role: 'harvester', working: 'false', roomHome: 'W58N36' , source: undefined}})
Game.getObjectById('66d81e66bd4d1aa1f937474f').spawnCreep([WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE], 'Upgrader' + Game.time, 
        {memory: {role: 'upgrader', working: 'false', roomHome: 'W58N36' , source: undefined}})
Game.getObjectById('66d81e66bd4d1aa1f937474f').spawnCreep([WORK,CARRY,MOVE], 'Harvester' + Game.time, 
        {memory: {role: 'harvester', working: 'false', roomHome: 'W58N36' , source: undefined}})
Game.getObjectById('66d81e66bd4d1aa1f937474f').spawnCreep([WORK,CARRY,MOVE], 'Upgrader' + Game.time, 
        {memory: {role: 'upgrader', working: 'false', roomHome: 'W58N36' , source: undefined}})
*/


function spawnHealer(creeps:Creep[],room:Room){
    
    var healers = creeps.filter((creep) => {
        return creep.memory.role == 'healer' && creep.memory.roomHome == room.name})
    if(healers.length >= 1) {return false}

    let injuredCreeps = room.find(FIND_MY_CREEPS).filter((c) => {
        return c.room.name === room.name && c.hits < c.hitsMax;
    });
    if(injuredCreeps.length==0){return false}
    return true
}

function spawnUpgraderRoomWihoutSpawn(){
    let result ={spawn: false, roomToUpgrade: ''}

    let roomsWithController:Room[] = Object.values(Game.rooms).filter((r)=>r.controller)
    let roomsWitMyController:Room[] = roomsWithController.filter((r)=>r.controller && r.controller.my)
    let spawns = Object.values(Game.structures).filter((s)=>s.structureType==STRUCTURE_SPAWN)
    roomsWitMyController.forEach((room) => {
        let spawnsInRoom = spawns.filter((s)=>s.room==room)

        let upgraderRoomWihoutSpawn = Object.values(Game.creeps).filter((creep) => {
            return creep.memory.role == 'upgraderRoomWihoutSpawn' &&  creep.memory.roomToUpgrade === room.name})

        if(spawnsInRoom.length==0 && upgraderRoomWihoutSpawn.length<constanten.upgraderRoomWihoutSpawnAmount){
             result ={spawn: true, roomToUpgrade: room.name}
            return
        }
    })

    return result
}

function spawenRoomReserver(room: Room, roomsToReserveName: RoomHomeAndTarget[]) {
    let result = { spawn: false, roomToReserve: '' };
    if (roomsToReserveName.length == 0) {
        return result;
    }
    
    for (let roomName of roomsToReserveName) {
        // Überprüfen, ob der aktuelle Raum der Heimatraum ist
        if (room.name != roomName.roomHome) {
            continue;
        }

        // Finden des Zielraums
        let targetRooms = Object.values(Game.rooms).filter((r) => r.name == roomName.roomTarget);
        if (targetRooms.length == 0 || targetRooms[0] == undefined) {
            continue;
        }

        let targetRoom = targetRooms[0];

        // Überprüfen, ob der Controller schon unter eigener Kontrolle ist
        if (targetRoom.controller == undefined || targetRoom.controller.my) {
            continue;
        }
       
        // Überprüfen der Reservierung
        let reservation = targetRoom.controller.reservation;
        if (reservation != undefined && reservation.username ==='Liscano' && reservation.ticksToEnd > 500) {
            continue;
        }

        // Überprüfen, ob es bereits einen Reserver für diesen Raum gibt
        let roomReserver = Object.values(Game.creeps).filter((creep) => {
            return creep.memory.role == 'roomReserver' && creep.memory.roomToReserve === roomName.roomTarget && creep.memory.roomHome == roomName.roomHome;
        });

        if (roomReserver.length < 1) {
            result = { spawn: true, roomToReserve: roomName.roomTarget };
            break; // Beendet die Schleife, sobald ein Raum gefunden wurde, für den ein Reserver gespawnt werden muss
        }
    }

    return result;
}

function spawenRoomClaimer(room: Room, roomsToClaimName: RoomHomeAndTarget[]) {
    let result = { spawn: false, roomToClaim: '' };

    if (roomsToClaimName.length == 0) {
        return result;
    }

    for (let roomName of roomsToClaimName) {
        if (room.name != roomName.roomHome) {
            continue;
        }

        // Zielräume finden
        let targetRooms = Object.values(Game.rooms).filter((r) => r.name == roomName.roomTarget);
        if (targetRooms.length == 0 || targetRooms[0].controller == undefined) {
            continue;
        }

        let targetRoom = targetRooms[0];

         // Überprüfen, ob es einen Controller in dem Raum gibt
        if (targetRoom.controller == undefined) {
            continue;
        }

        // Überprüfen, ob der Controller bereits unter eigener Kontrolle ist
        if (targetRoom.controller.my) {
            continue;
        }

        // Überprüfen, ob es bereits einen Claimer für diesen Raum gibt
        let roomClaimer = Object.values(Game.creeps).filter((creep) => {
            return creep.memory.role == 'roomClaimer' && creep.memory.roomToClaim === roomName.roomTarget && creep.memory.roomHome == roomName.roomHome;
        });

        if (roomClaimer.length < 1) {
            result = { spawn: true, roomToClaim: roomName.roomTarget };
            break; // Beendet die Schleife, sobald ein Raum gefunden wurde, für den ein Claimer gespawnt werden muss
        }
    }

    return result;
}

function spawenRoomTransporter(
    room: Room,
    extensions: StructureExtension[],
    spawns: StructureSpawn[],
    extensionsWithFreeCapacity: StructureExtension[],
    roomNamesToHarvest: RoomHomeAndTarget[]
) {
    let result = { spawn: false, roomToTransport: '' };

    if (
        extensionsWithFreeCapacity.length == 0 &&
        spawns[0].store.getFreeCapacity(RESOURCE_ENERGY) == 0 &&
        extensions.length >= 5 &&
        roomNamesToHarvest != undefined
    ) {
        for (let roomName of roomNamesToHarvest) {
            if (room.name != roomName.roomHome) {
                continue;
            }

            let targetRomm= Game.rooms[roomName.roomTarget]
            if(targetRomm == undefined){break}
            let sources = targetRomm.find(FIND_SOURCES)
            if(sources.length==0){break}

            let roomTransporter = Object.values(Game.creeps).filter((creep) => {
                return (
                    creep.memory.role == 'roomTransporter' &&
                    creep.memory.roomToTransport === roomName.roomTarget &&
                    creep.memory.roomHome == roomName.roomHome
                );
            });

            // TODO Ein Transporter pro Quelle
            if (roomTransporter.length < sources.length) {
                result = { spawn: true, roomToTransport: roomName.roomTarget };
                break;
            }
        }
    }

    return result;
}

function spawnRoomHarvester(
    room: Room,
    extensions: Structure[],
    spawns: StructureSpawn[],
    extensionsWithFreeCapacity: Structure[],
    roomNamesToHarvest: RoomHomeAndTarget[]
) {
    let result = { spawn: false, roomToHarvest: '' };

    if (
        extensionsWithFreeCapacity.length == 0 &&
        spawns[0].store.getFreeCapacity(RESOURCE_ENERGY) == 0 &&
        extensions.length >= 5 &&
        roomNamesToHarvest != undefined
    ) {
        for (let roomName of roomNamesToHarvest) {
            if (room.name != roomName.roomHome) {
                continue;
            }
            let targetRomm= Game.rooms[roomName.roomTarget]
            if(targetRomm == undefined){return result} //TODO eventuell ein bug
            let sources = targetRomm.find(FIND_SOURCES)
            if(sources.length==0){break}

            let roomHarvesters = Object.values(Game.creeps).filter((creep) => {
                return (
                    creep.memory.role == 'roomHarvester' &&
                    creep.memory.roomToHarvest === roomName.roomTarget &&
                    creep.memory.roomHome == roomName.roomHome
                );
            });

            if (roomHarvesters.length < sources.length) {
                result = { spawn: true, roomToHarvest: roomName.roomTarget };
                break; // Beendet die Schleife, sobald ein passender Raum gefunden wurde
            }
        }
    }

    return result;
}

function spawnLogistiker(creeps:Creep[],room:Room){

    var logistiker = creeps.filter((creep) => {
        return creep.memory.role == 'logistiker' && creep.memory.roomHome == room.name})
    //if(room.name == 'W58N35' && logistiker.length < 1){return true} //TODO das muss ich anders regeln
    if(logistiker.length < 1) {
       return true
    }
    return false
}

/**
 * 
 * @param {Creep[]} creeps 
 * @returns boolean
 */
function spawnUpgrader(creeps:Creep[],room:Room){

    var upgrader = creeps.filter((creep) => {
        return creep.memory.role == 'upgrader' && creep.memory.roomHome == room.name})
    if(upgrader.length < constanten.smalUpgraderAmount) {
       return true;    
    }
    return false;
}

function spawnBigUpgrader(creeps:Creep[],room:Room){
    //TODO Mach den Storage leer!

    var upgrader = creeps.filter((creep) => {
        return creep.memory.role == 'upgrader' && creep.memory.roomHome == room.name})
    if(upgrader.length < constanten.smalUpgraderAmount+constanten.bigUpgraderAmmount) {
       return true;    
    }
    let storages=room.find(FIND_MY_STRUCTURES).filter((s)=> s.structureType==STRUCTURE_STORAGE)

    if(storages.length==0){return false}
    
    if(upgrader.length < constanten.smalUpgraderAmount+constanten.bigUpgraderAmmount && storages[0].store.getCapacity(RESOURCE_ENERGY)>50000) {
        return true;    
     }

    return false;
}

/**
 * 
 * @param {Creep[]} creeps 
 * @param {Room} room 
 * @returns boolean
 */
function spawnBuilder(creeps:Creep[], room:Room){
    // Spawen builder
    var constructionsSites = room.find(FIND_MY_CONSTRUCTION_SITES);
    if(!constructionsSites.length) {return false;}

    var builder = creeps.filter((creep) => creep.memory.role == 'builder');
    if(builder.length < constanten.builderAmount) { return true; }
    
    return false;
}
/**
 * 
 * @param {Creep[]} creeps 
 * @returns boolean
 */
function spawnHarvester(creeps:Creep[], room:Room){
    let harvesters = creeps.filter((creep) => {
        return creep.memory.role == 'harvester' && creep.memory.roomHome==room.name})
    if(harvesters.length < constanten.smalHarvesterAmount) {
        return true
    }
    //room.energyCapacityAvailable
    //TODO eventuell hier auf upgrade prüfen
    return false
}

/**
 * 
 * @param {Creep[]} creeps 
 * @returns boolean
 */
function spawnBigHarvester(creeps:Creep[],room:Room){
    let harvesters = creeps.filter((creep) => {
        return creep.memory.role == 'harvester' && creep.memory.roomHome==room.name})
    if(harvesters.length < constanten.bigHarvesterAmount) {
        return true
    }
    return false
}

function spawenCreepsStealer(room:Room,spawns:StructureSpawn[], extensions:StructureExtension[], extensionsWithFreeCapacity:StructureExtension[], roomsToStealName:RoomHomeAndTarget[]){
    let result= {spawn: false, roomToSteal: ''}
    if(!(extensionsWithFreeCapacity.length==0 && spawns[0].store.getFreeCapacity(RESOURCE_ENERGY) == 0 && extensions.length>=5)){
        return result
    }
        
    roomsToStealName.forEach((roomName) => {
        if(room.name !=roomName.roomHome){return}
        let roomStealers = Object.values(Game.creeps).filter((creep) => {
            return creep.memory.role == 'stealer' &&  creep.memory.roomToSteal === roomName.roomTarget && creep.memory.roomHome == roomName.roomHome})
        if(!roomStealers.length || roomStealers.length <constanten.roomStealerAmount){
            result= {spawn: true, roomToSteal: roomName.roomTarget}
            return 
        }
    });
    
    return result
}

function spawnRepairer(room: Room, spawns: StructureSpawn[], extensions: StructureExtension[], roomsToRepair: RoomHomeAndTarget[]) {
    let result = { spawn: false, roomToRepair: '' };

    if (!(spawns[0].store.getFreeCapacity(RESOURCE_ENERGY) == 0 && extensions.length >= 5)) {
        return result;
    }

    for (let roomName of roomsToRepair) {

        if(roomName.roomHome!=room.name){continue}
        let roomRepairers = Object.values(Game.creeps).filter((creep) => {
            return creep.memory.role == 'repairer' && creep.memory.roomToRepair === roomName.roomTarget && creep.memory.roomHome == room.name;
        });

        if (roomRepairers.length < constanten.roomRepairerAmount) {
            result = { spawn: true, roomToRepair: roomName.roomTarget };
            break; // Beendet die Schleife, sobald ein passender Raum gefunden wurde
        }
    }

    return result;
}

function spawenCreepsAttacker(room: Room, destroyThisObjeckts: RoomHomeAndTarget[]) {
    let result = { spawn: false, roomToAttack: '' };

    if (!destroyThisObjeckts.length) {
        return result;
    }

    for (let target of destroyThisObjeckts) {
        if (room.name != target.roomHome) {
            continue;
        }

        let roomAttackers = Object.values(Game.creeps).filter((creep) => {
            return (
                creep.memory.role == 'attacker' &&
                creep.memory.roomToAttack == target.roomTarget &&
                creep.memory.roomHome == target.roomHome
            );
        });

        if (roomAttackers.length < constanten.atackerAmount) {
            result = { spawn: true, roomToAttack: target.roomTarget };
            break; // Beendet die Schleife, sobald ein passender Raum gefunden wurde
        }
    }

    return result;
}

function spawenBuilderNeutralRoom(room:Room, spawenNeutralRoomBuilderHere:string[]) {

    let result = { spawn: false, roomToBuild: '' };
    let constructionSitesInOtherRoom = Object.values(Game.constructionSites)
        .filter((constructionSite) => constructionSite.room != room);

    if (!constructionSitesInOtherRoom.length) {
        return result;
    }

    for (let roomName of spawenNeutralRoomBuilderHere) {
        if(roomName!=room.name){continue}
        let builderNeutralRoom = Object.values(Game.creeps).filter((creep) => {
            return creep.memory.role == 'builderNeutralRoom' && creep.memory.roomHome == roomName;
        });

        if (builderNeutralRoom.length < constanten.roomBuilderAmount) {
            result = { spawn: true, roomToBuild: constructionSitesInOtherRoom[0].pos.roomName };
            break;
        }
    }

    return result;
}

function spawenCreepsAttackerFlags(spawn:StructureSpawn[], flagName:string){

    let flags = Object.values(Game.flags)
    if(!flags.length){return {spawn: false, flag: ''}}
    let attackHere = flags.filter((flag)=> flag.name=flagName)
    if(!attackHere.length){return{spawn: false, flag: ''}}

    let attackersFlag = Object.values(Game.creeps).filter((creep) => {
        return creep.memory.role == 'attackFlag';
    });

    if(!(!attackersFlag.length || attackersFlag.length < constanten.attackerOnFlagAmount)) {
        return{spawn: false, flag: ''}
    }
    return {spawn: true, flag: flagName}
}

function getBody(segment:BodyPartConstant[], room:Room, maxEnergy:number): BodyAndPrice{
    let body:BodyPartConstant[] = [];

    //how much each segment costs
    let segmentCost = segment.reduce((sum,s)=> sum+BODYPART_COST[s],0)

    //how much energy we can use total
    var energyAvailable=room.energyAvailable;
    if(maxEnergy !== undefined && energyAvailable >= maxEnergy){
        energyAvailable = maxEnergy;
    }

    //how many times we can include the segment wirh room energy
    let maxSegemnts = Math.floor(energyAvailable / segmentCost);

    //push the segment multiple times
    _.times(maxSegemnts, function(){
        _.forEach(segment, s => body.push(s));
    });
    let bodyAndPrice:BodyAndPrice = {bodyParts:body, price:maxSegemnts*segmentCost}
    

    return bodyAndPrice;
}
   
export default  {spawenAllCreeps, getBody, spawenCreepsStealer,spawenCreepsAttacker,spawenBuilderNeutralRoom,spawenCreepsAttackerFlags};