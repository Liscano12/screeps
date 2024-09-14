# Screeps AI

This repository contains the AI code for my Screeps game, where I am developing and testing strategies to control my colony of creeps by Typescript.

The project aims is to provide largely automated base management and defense for a Screeps empire.

## About the game
https://screeps.com/

Screeps is a real-time strategy game for programmers, where players write JavaScript to control units and automate actions within the game.

# Current Features

Below is a summary of the current state of the software


### Automatic Creep Spawning
The system detects the need for creeps and automatically spawns them based on current requirements.

### Defense Against Small Attacks
In the event of small attacks on the base, creeps automatically defend themselves and attempt to neutralize the threat.

### Room Logistics
The system manages logistics within controlled rooms and organizes the transport of resources to the storage structure for efficient resource usage. You should manually place containers next to each energy source.

### Controller Upgrades
Creeps automatically handle upgrading the controller in every controlled room.

### Regeneration of Injured Creeps
When needed, a healing creep is spawned in controlled rooms to heal damaged creeps.

## Manually Implemented Features

### Building Placement
The placement of blueprints for new buildings must be done manually.

### Actions in Neutral Rooms
Constants can be set to enable specific actions in neutral rooms.

## Special Actions

### Stationing Repair Creeps
Repair creeps can be stationed to maintain structures in controlled rooms.

### Harvesting and Reserving in Neutral Rooms
Creeps can harvest resources, transport them, and reserve neutral rooms.

### Attacking Foreign Rooms
To initiate an attack, place a flag named Attack in a foreign room. A group of creeps will automatically be spawned and attack everything in the room.