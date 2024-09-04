type Role = 'harvester'|'builder'|'upgrader'|'repairer'|'roomHarvester'|'roomClaimer'|
'roomClaimer'|'builderNeutralRoom'|'stealer'|'attacker'|'attackFlag'|'upgraderRoomWihoutSpawn'|
'logistiker' | 'roomTransporter'| 'roomReserver'

type RoomHomeAndTarget = {roomHome: string, roomTarget:string}


interface HarvesterMemory extends BaseMemory,WorkerMemory {role: 'harvester', source:string}
interface BuilderMemory extends BaseMemory,WorkerMemory {role: 'builder'}
interface UpgraderMemory extends BaseMemory,WorkerMemory {role: 'upgrader'}
interface BuilderNeutralRoomMemory extends BaseMemory,WorkerMemory {role: 'builderNeutralRoom', roomToBuild:string}
interface RoomHarvesterMemory extends BaseMemory,WorkerMemory {role: 'roomHarvester', roomToHarvest:string}
interface RoomTransporterMemory extends BaseMemory,WorkerMemory {role: 'roomTransporter', roomToTransport:string}
interface RepairerMemory extends BaseMemory,WorkerMemory {role: 'repairer', roomToRepair:string}
interface LogistikerMemory extends BaseMemory,WorkerMemory {role: 'logistiker'}
interface StealerMemory extends BaseMemory,WorkerMemory {role: 'stealer', roomToSteal:string}
interface AttackFlagMemory extends BaseMemory {role: 'attackFlag', flag:string, attacking:boolean}
interface RoomClaimerMemory extends BaseMemory {role: 'attacker', roomToClaim:string}
interface RoomReserverMemory extends BaseMemory {role: 'roomReserver', roomToReserve:string, roomHome:string}
interface UpgraderRoomWihoutSpawn extends BaseMemory {role: 'upgraderRoomWihoutSpawn', roomToUpgrade:string}

type CreepMemory= HarvesterMemory | BuilderMemory | UpgraderMemory | BuilderNeutralRoomMemory |
RoomHarvesterMemory | RoomTransporterMemory | RepairerMemory | LogistikerMemory | StealerMemory |
AttackFlagMemory | AttackerMemory | RoomClaimerMemory | RoomReserverMemory | UpgraderRoomWihoutSpawn


interface BaseMemory{
    role:Role
}

interface WorkerMemory {
    working: boolean
    roomHome: string
}

interface CreepMemory{
    role: Role
    roomToClaim: string
    working: string
    storageSource: string
    roomToHarvest: string
    roomHome: string
    working: boolean
    roomToSteal: string
    roomToRepair: string
    roomToAttack: string
    roomToBuild: string
    flag: string
    regenerate: boolean
    attacking: boolean
    roomToUpgrade: string
    source: string
    roomToTransport: string
    regenerateActive: boolean
    roomToReserve: string
}

interface Creep{
    memory: CreepMemory 
    harvestSource(source:Source) : void
    work(regenerateAfterWork:boolean) : void
    getStorageEnergy(creep: Creep): boolean
    upgrade(controller:Controller): void
    findFilledStorageSources(): StructureContainer[]
    regenerateLivetime(ticksLeftToRegenerate: Int)
    getStorageEnergyBig(room: Room): boolean
    fill(structuresNeedEnergy: AnyStoreStructure[] | StructureSpawn[] | Structure<StructureConstant>[]): void
    buildAll(): boolean
    repairAll(): void
    kill(target: AnyCreep | Structure): void
    moveToRoom(roomName: string): void
    getEnergySourceForHarvester(room: Room, role: Role): Source |null 
}

interface RoomMemory{
    regenerateThisCreep: {
        active:boolean,
        creepID:string,
        creepName:string
    };
}
