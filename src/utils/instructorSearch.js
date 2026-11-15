import { rooms } from '../data/rooms.js';
import { buildings, floors } from '../data/floors.js';

const mapRooms = new Map(rooms.map(room => [room.id, room]));

export function getInstructorOptions({ byMapRoom = {}, unmapped = [] }) {
  const entries = [
    ...Object.entries(byMapRoom).flatMap(([mapRoomId, records]) => records.map(record => ({ record, mapRoomId }))),
    ...unmapped.map(record => ({ record, mapRoomId: null })),
  ];
  return entries.filter(({ record }) => record.isAssigned && record.assignedInstructor?.name?.trim())
    .map(({ record, mapRoomId }, index) => {
      const room = mapRooms.get(mapRoomId);
      const building = buildings.find(item => item.id === room?.buildingId)?.name;
      const floor = floors.find(item => item.id === room?.floorId)?.shortName;
      return {
        value: `${record.id ?? record.name}-${index}`,
        label: record.assignedInstructor.name.trim(),
        description: [record.name, building, floor, !room && 'Map location unconfirmed'].filter(Boolean).join(' · '),
        mapRoomId: room?.id,
        disabled: !room,
      };
    }).sort((a, b) => a.label.localeCompare(b.label) || a.description.localeCompare(b.description));
}
