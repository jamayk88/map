# API rooms and map locations

Rechecked the configured room API on 2026-11-09: **83 rooms**, with **75 linked** to existing map areas and **8 pending** location confirmation.

The 21 additional matches are already included in `src/data/apiRoomMappings.js`. The API spelling `Pychology Room` is preserved as an explicit alias for Psychology Room.

The user confirmed that the former HB Server Room is the Research Office. Its existing `server-room` ID is retained for routes and links.

| API room | Map ID | Building / floor |
| --- | --- | --- |
| MAIN-301 | main3-lecture-ne | Main / 3rd |
| MAIN-302 | main3-lecture-north | Main / 3rd |
| MAIN-303 | main3-lecture-nw | Main / 3rd |
| MAIN-304 | main3-west-upper | Main / 3rd |
| MAIN-305 | main3-west-lower | Main / 3rd |
| MAIN-306 | main3-spare | Main / 3rd |
| MAIN-307 | main3-lecture-center-west | Main / 3rd |
| MAIN-308 | main3-lecture-center-east | Main / 3rd |
| MAIN-309 | main3-lecture-se | Main / 3rd |
| MAIN-310 | main3-lecture-sw | Main / 3rd |
| HB-Research Office | server-room | Hernandez / Ground |
| MAIN-401 | main4-401 | Main / 4th |
| MAIN-402 | main4-402 | Main / 4th |
| MAIN-403 | main4-403 | Main / 4th |
| MAIN-404 | main4-404 | Main / 4th |
| MAIN-405 | main4-405 | Main / 4th |
| MAIN-407 | main4-407 | Main / 4th |
| MAIN-408 | main4-408 | Main / 4th |
| MAIN-409 | main4-409 | Main / 4th |
| MAIN-410 | main4-410 | Main / 4th |
| CCJE-101 | ccje-101 | CCJE / Ground |
| CCJE-201 | ccje-201 | CCJE / 2nd |
| CCJE-202 | ccje-202 | CCJE / 2nd |
| CCJE-203 | ccje-203 | CCJE / 2nd |
| CCJE-204 | ccje-204 | CCJE / 2nd |
| CCJE-205 | ccje-205 | CCJE / 2nd |
| CCJE-206 | ccje-206 | CCJE / 2nd |
| CCJE-207 | ccje-207 | CCJE / 2nd |
| CCJE-301 | ccje-301 | CCJE / 3rd |
| CCJE-302 | ccje-302 | CCJE / 3rd |
| HB-ROOM 101 | room-1 | Hernandez / Ground |
| HB-ROOM 102 | room-2 | Hernandez / Ground |
| HB-ROOM 103 | room-3 | Hernandez / Ground |
| HB-Prog. Lab | programming-lab | Hernandez / Ground |
| HB-Net./Troub. Lab | networking-lab | Hernandez / Ground |
| HB-Multimedia Lab | multimedia-room | Hernandez / Ground |
| HB-Comp. Lab | computer-lab | Hernandez / Ground |
| MB-101 | mb-101 | Mercado / Ground |
| MB-102 | mb-102 | Mercado / Ground |
| MB-201 | mb2-201 | Mercado / 2nd |
| MB-202 | mb2-202 | Mercado / 2nd |
| MB-203 | mb2-203 | Mercado / 2nd |
| MB-204 | mb2-204 | Mercado / 2nd |
| MB-205 | mb2-205 | Mercado / 2nd |
| MB-Speech Lab | mb2-speech-lab | Mercado / 2nd |
| MB-AVR | mb2-avr | Mercado / 2nd |
| MB-301 | mb3-301 | Mercado / 3rd |
| MB-302 | mb3-302 | Mercado / 3rd |
| MB-303 | mb3-303 | Mercado / 3rd |
| MB-304 | mb3-304 | Mercado / 3rd |
| MB-305 | mb3-305 | Mercado / 3rd |
| MB-306 | mb3-306 | Mercado / 3rd |
| MB-ED Tech | mb3-edtech | Mercado / 3rd |
| MAIN-ComLab 1 | main-comlab-1 | Main / Ground |
| CCJE-Dark Room | ccje3-darkroom | CCJE / 3rd |
| CCJE-Defensive Tactics Room | ccje3-defensive-tactics | CCJE / 3rd |
| CCJE-Forensic Ballistics and Dactyloscopy Room | ccje3-ballistics | CCJE / 3rd |
| CCJE-Permanent Crime Scene Room | ccje3-crime-scene | CCJE / 3rd |
| CCJE-Polygraph Examination and Interrogation Room | ccje3-polygraph | CCJE / 3rd |
| CCJE-Questioned Document and Photography Room | ccje3-documents-photo | CCJE / 3rd |
| CCJE-303 | ccje-303 | CCJE / 3rd |
| CCJE-304 | ccje-304 | CCJE / 3rd |
| CCJE-305 | ccje-305 | CCJE / 3rd |
| BSBA Simulation Room | mb3-bsba | Mercado / 3rd |
| Pychology Room | mb3-psychology | Mercado / 3rd |
| HB-ROOM 104 | room-4 | Hernandez / Ground |
| MAIN-LC Bar (Beverage Operations Lab) | main-lc-bar | Main / Ground |
| MAIN-LC Culinary Kitchen | main-culinary-kitchen | Main / Ground |
| MAIN-Computer Lab 1 | main2-computer-lab-1 | Main / 2nd |
| MAIN-Computer Lab 2 | main2-computer-lab-2 | Main / 2nd |
| MAIN-Computer Tech | main2-computer-tech | Main / 2nd |
| MAIN-Electronic Lab | main2-electronic | Main / 2nd |
| MAIN-Natural Science Lab | main2-natural-science | Main / 2nd |
| MAIN-Seaman Lab | main2-seaman | Main / 2nd |
| Tourism Room | main2-tourism | Main / 2nd |

Third-floor numbering mirrors fourth-floor positions (301–305 and 307–310). Room 306 occupies the former Spare Room. Existing map IDs and geometry are retained.

## Unmapped rooms (8)

The rooms below remain unmapped until their locations are confirmed. All three CCJE floors follow the supplied drawings. The second-floor sketch's “Room 2” is interpreted as Room 202, and the bottom-left room as Room 201.

- **Main:** MAIN-Old SHS Faculty, MAIN-210, MAIN-Old Crim. No confirmed correspondence to existing rooms.
- **Main:** MAIN-406 is not shown in the supplied fourth-floor layout. The user confirmed the west room below 404 is 405.
- **Main:** MAIN-Bar 1 and MAIN-Bar 2. The current map contains one LC Bar area (`main-lc-bar`) without confirmed correspondence to these records.
- **CCJE:** CCJE-PE room has no confirmed correspondence to the Defensive Tactics Room. The grouped API record CCJE-303-305 covers three separately drawn rooms (`ccje-303`, `ccje-304`, `ccje-305`); it remains pending because the current mapping supports one physical room per API name.

All 83 API room names are included in `src/data/apiRoomMappings.js`. The 8 pending rooms have empty string values (`''`); replace a blank with the confirmed map room ID when available. `pendingApiRoomNames` is derived automatically from those blank entries. New physical rooms also require geometry and graph connections; do not assign them to arbitrary existing rooms.

## Classrooms and laboratories without a linked API room

Only map locations categorized as Classroom or Laboratory are included. Each location below has no explicit link in `src/data/apiRoomMappings.js`.

Total: **0 unlinked classrooms and laboratories**.
