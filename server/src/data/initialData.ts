
import type { OltDevice, OntDevice } from '../types';

export const initialOltDevices: OltDevice[] = [
  { 
    id: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
    model: 'MA4000-PX (16 Ports)', 
    description: 'Chassis OLT with 2x PLC8 GPON Line Cards',
    technology: 'GPON',
    ponPorts: 16,
    uplinkPorts: [
      { type: '10G SFP+', count: 4 },
      { type: '1G RJ45', count: 4 },
    ],
    sfpOptions: [
      { name: 'GPON SFP B+', txPower: 3.0 },
      { name: 'GPON SFP C+', txPower: 5.0 },
      { name: 'GPON SFP C++', txPower: 7.0 },
    ],
    components: [
      { name: 'MA4000-PX Chassis', quantity: 1 },
      { name: 'PLC8 Line Card', quantity: 2 },
      { name: 'PP4X Management Card', quantity: 1 },
    ]
  },
  { 
    id: 'b7a3a9e0-9a2c-4e8b-8c1d-1f3e5a7b9d1c', 
    model: 'LTP-8X', 
    description: 'Station terminal LTP-8X, 8 ports GPON', 
    technology: 'GPON',
    ponPorts: 8,
    uplinkPorts: [
      { type: '10G SFP+', count: 2 },
      { type: '1G Combo', count: 4 },
    ],
    sfpOptions: [
      { name: 'GPON SFP B+', txPower: 3.5 },
      { name: 'GPON SFP C+', txPower: 5.5 },
    ],
    components: []
  },
  { 
    id: 'd4e5f6a1-b2c3-4d5e-8f9a-0b1c2d3e4f5a', 
    model: 'LTP-16N', 
    description: 'Station terminal LTP-16N, 16 GPON ports', 
    technology: 'GPON',
    ponPorts: 16,
    uplinkPorts: [{ type: '10G SFP+', count: 8 }],
    sfpOptions: [
      { name: 'GPON SFP B+', txPower: 3.5 },
      { name: 'GPON SFP C+', txPower: 5.5 },
    ],
    components: []
  },
  { 
    id: 'f1a2b3c4-d5e6-7f8a-9b0c-1d2e3f4a5b6c', 
    model: 'LTX-8', 
    description: 'Station terminal XGS-GPON LTX-8, 8 ports XGS-PON', 
    technology: 'XGS-PON',
    ponPorts: 8,
    uplinkPorts: [{ type: '100G QSFP28', count: 4 }],
    sfpOptions: [
      { name: 'XGS-PON SFP N1', txPower: 5.0 },
      { name: 'XGS-PON SFP N2', txPower: 7.0 },
    ],
    components: []
  },
];

export const initialOntDevices: OntDevice[] = [
    { 
      id: 'c1e4f7a8-3b9d-4e6f-8a2c-1d5e7b9a3c1f', 
      model: 'NTU-RG-5421G-Wac', 
      description: 'Subscriber terminal NTU-RG-5421G-Wac Rev.B, 1 PON, 4 LAN GbE, 1xFXS, Wi-Fi 802.11ac', 
      technology: 'GPON',
      rxSensitivity: -28,
      ethernetPorts: [{ type: '10/100/1000Base-T', count: 4 }],
      fxsPorts: 1,
      wifi: { standard: '802.11ac', bands: '2.4/5GHz' }
    },
    { 
      id: 'd2f5a8b9-4c0e-5d7g-9b3d-2e6f8c0b4d2g', 
      model: 'NTU-1 rev.C', 
      description: 'Subscriber terminal ONT NTU-1 rev. C, 1 port PON(SC), 1 port LAN 10/100/1000 Base-T', 
      technology: 'GPON',
      rxSensitivity: -28.5,
      ethernetPorts: [{ type: '10/100/1000Base-T', count: 1 }],
      fxsPorts: 0,
      wifi: null
    },
     { 
      id: 'e3g6b9c0-5d1f-6e8h-0c4e-3f7g9d1c5e3h', 
      model: 'NTU-RG-5520G-Wax', 
      description: 'Subscriber terminal NTU-RG-5520G-Wax, 1 PON, 4 LAN GbE, Wi-Fi 802.11ax', 
      technology: 'GPON',
      rxSensitivity: -28,
      ethernetPorts: [{ type: '10/100/1000Base-T', count: 4 }],
      fxsPorts: 0,
      wifi: { standard: '802.11ax', bands: '2.4/5GHz' }
    },
    { 
      id: 'f4h7c0d1-6e2g-7f9i-1d5f-4g8h0e2d6f4i', 
      model: 'NTX-1', 
      description: 'Subscriber terminal NTX-1, 1 XGS-PON, 1 1G LAN, 1 10G LAN', 
      technology: 'XGS-PON',
      rxSensitivity: -29,
      ethernetPorts: [
          { type: '10/100/1000Base-T', count: 1 },
          { type: '10GBase-T', count: 1 }
      ],
      fxsPorts: 0,
      wifi: null
    },
];
