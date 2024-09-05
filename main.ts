import roleHarvester from './role.harvester'
import roleUpgrader  from './role.upgrader'
import roleBuilder  from './role.builder'
import roleRepairer  from './role.repairer'
import './creepFunctions'
import tower  from './tower'
import spawnCreeps  from './spawnCreeps'
import roleRoomHarvester from './role.roomHarvester'
import roleRoomClaimer  from './role.roomClaimer'
import rolestealer  from './role.stealer'
import roleBuilderNeutralRoom   from './role.builderNeutralRoom'
import roleAttacker  from './role.attacker'
import roleAttackFlag  from './role.attackFlag'
import roleUpgraderRoomWihoutSpawn  from './role.upgraderRoomWihoutSpawn'
import roleLogistiker  from './role.logistiker'
import roleTransporter  from './role.transporter'
import roleRoomReserver from './role.roomReserver'
import roleHealer from './role.healer'
import * as helper  from './helper';



export function loop () {

    helper.clearCreepMemory()

    //TODOS beschädigte creeps reparieren

    //Manual Room Settings

    //Hier werden roomHarvester and roomTransporter entsant
    let harvestThisRooms:RoomHomeAndTarget[] = [
        {roomHome: 'W57N34', roomTarget: 'W58N34'},
        {roomHome: 'W58N35', roomTarget: 'W59N35'},
        {roomHome: 'W58N35', roomTarget: 'W59N34'}
    ]

    //Hier wird ein repaier stationiert
    let roomNamesToRepair:RoomHomeAndTarget[] = [
        {roomHome: 'W57N34', roomTarget: 'W58N34'},
        {roomHome: 'W58N35', roomTarget: 'W59N35'},
        {roomHome: 'W58N35', roomTarget: 'W59N34'},
        {roomHome: 'W58N35', roomTarget: 'W58N36'}
    ]

    //Dieser Raum wird erobert, falls möglich
    let roomsToClaimName:RoomHomeAndTarget[] = [
        //{roomHome: 'W59N35', roomTarget: 'W58N34'}
    ]

    //Dieser Raum wird reserviert
    let roomsControllerToReserve:RoomHomeAndTarget[] = [
        {roomHome: 'W57N34', roomTarget: 'W58N34'},
        {roomHome: 'W58N35', roomTarget: 'W59N35'}
    ] ;
    
    // Aus dem Storage eines anderen Spielers wird gestohlen
    let roomsToStealName:RoomHomeAndTarget[] = [] ;

    //Genau diese id wird angegriffen
    let destroyThisObjeckts:RoomHomeAndTarget[] = [
        //{roomHome: 'W58N35', roomTarget: 'W59N35'}
    ]

    //In diesem Raum wird ein neutralRoomBuilder erstellt
    let spawenNeutralRoomBuilderHere:string[] = ['W58N35']

    //Main loop durch alle sichbaren Räume
    Object.values(Game.rooms).forEach((room)=> {

        helper.defend(room)

        //Aktion in allein Räumen die ich kontrolliere
        if(room.controller && room.controller.my){
            spawnCreeps.spawenAllCreeps(room,harvestThisRooms,roomsToClaimName,
                destroyThisObjeckts,roomNamesToRepair,roomsToStealName,
                roomsControllerToReserve,spawenNeutralRoomBuilderHere);
            
            //Tower Reperatur und angriff auf Feinde
            tower(room);
            //Reperaturlogik von beschädigten creeps
            helper.regenerateCreep(room)
        }

        //Schicke alle creeps arbeiten
        let creepsInThisRoom = Object.values(Game.creeps).filter((creep)=> creep.room==room);
        creepsInThisRoom.forEach((creep)=>{
            if(creep.memory.role == 'harvester') {
                roleHarvester.run(creep);
            }
            if(creep.memory.role == 'upgrader') {
                if(room.controller){
                    roleUpgrader.run(creep, room.controller);
                }
            }
            if(creep.memory.role == 'builder') {
                roleBuilder.run(creep);
            }
            if(creep.memory.role == 'repairer') {
                roleRepairer.run(creep);
            }
            if(creep.memory.role == 'roomHarvester') {
                roleRoomHarvester.run(creep);
            }
            if(creep.memory.role == 'roomClaimer'){
                roleRoomClaimer.run(creep);
            }
            if(creep.memory.role == 'builderNeutralRoom'){
                roleBuilderNeutralRoom.run(creep);
            }
            if(creep.memory.role == 'stealer'){
                rolestealer.run(creep);
            }
            if(creep.memory.role == 'attacker'){
                roleAttacker.run(creep,destroyThisObjeckts);
            }
            if(creep.memory.role == 'attackFlag'){
                roleAttackFlag.run(creep);
            }
            if(creep.memory.role =='upgraderRoomWihoutSpawn'){
                roleUpgraderRoomWihoutSpawn.run(creep)
            }if(creep.memory.role =='logistiker'){
                roleLogistiker.run(creep)
            }if(creep.memory.role =='roomTransporter'){
                roleTransporter.run(creep)
            }if(creep.memory.role == 'roomReserver'){
                roleRoomReserver.run(creep)
            }if(creep.memory.role == 'roleHealer'){
                roleHealer.run(creep)
            }
        })
    })
}





