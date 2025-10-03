
import type { OltDevice, OntDevice } from '../types';

// OLT Tx Power is based on common GPON SFP classes (B+ or C+)
// Class B+: 1.5 to 5 dBm
// Class C+: 3 to 7 dBm
// A safe average of 3.5 is used for C+ typical devices.

export const initialOltDevices: OltDevice[] = [
  { id: crypto.randomUUID(), model: 'MA4000-PX (8 Ports)', description: 'Chassis with 1x PLC8 GPON Line Card', ponPorts: 8, txPower: 3.5 },
  { id: crypto.randomUUID(), model: 'LTP-4X', description: 'Station terminal GPON LTP-4X, 4 GPON ports', ponPorts: 4, txPower: 3.5 },
  { id: crypto.randomUUID(), model: 'LTP-8X', description: 'Station terminal LTP-8X, 8 ports GPON', ponPorts: 8, txPower: 3.5 },
  { id: crypto.randomUUID(), model: 'LTP-8N', description: 'Station terminal LTP-8N, 8 ports SFP-xPON', ponPorts: 8, txPower: 3.5 },
  { id: crypto.randomUUID(), model: 'LTP-16N', description: 'Station terminal LTP-16N, 16 GPON ports', ponPorts: 16, txPower: 3.5 },
  { id: crypto.randomUUID(), model: 'MA4000-PX (16 Ports)', description: 'Chassis with 2x PLC8 GPON Line Cards', ponPorts: 16, txPower: 3.5 },
  { id: crypto.randomUUID(), model: 'MA4000-PX (32 Ports)', description: 'Chassis with 4x PLC8 GPON Line Cards', ponPorts: 32, txPower: 3.5 },
  { id: crypto.randomUUID(), model: 'LTX-8', description: 'Station terminal XGS-GPON LTX-8, 8 ports XGS-PON', ponPorts: 8, txPower: 4.5 },
  { id: crypto.randomUUID(), model: 'LTX-16', description: 'Station terminal XGS-GPON LTX-16, 16 ports XGS-PON', ponPorts: 16, txPower: 4.5 },
];

// ONT Rx Sensitivity is based on common GPON standards, typically around -27dBm or -28dBm.
// A standard -28dBm is used for all models for consistency. XGS-PON typically has slightly better sensitivity.

export const initialOntDevices: OntDevice[] = [
    { id: crypto.randomUUID(), model: 'NTU-1 rev.C', description: 'Subscriber terminal ONT NTU-1 rev. C, 1 port PON(SC), 1 port LAN 10/100/1000 Base-T', rxSensitivity: -28 },
    { id: crypto.randomUUID(), model: 'NTU-1C', description: 'Subscriber terminal ONT NTU-1C, 1 port PON(SC), 1 port LAN 10/100/1000 Base-T, 1xRF', rxSensitivity: -28 },
    { id: crypto.randomUUID(), model: 'NTU-52W', description: 'Subscriber terminal NTU-52W, 1 port GPON, 2 LAN, 802.11n Wi-Fi', rxSensitivity: -28 },
    { id: crypto.randomUUID(), model: 'NTU-MD500P', description: 'NTU-MD500P, 1 GPON port, 4 10/100/1000Base-T LAN ports with PoE support', rxSensitivity: -28 },
    { id: crypto.randomUUID(), model: 'NTU-RG-5420G-Wac', description: 'Subscriber terminal NTE-RG-5420G-Wac rev. B, 1 PON, 4 LAN GbE, Wi-Fi 802.11ac', rxSensitivity: -28 },
    { id: crypto.randomUUID(), model: 'NTU-RG-5421G-Wac', description: 'Subscriber terminal NTU-RG-5421G-Wac Rev.B, 1 PON, 4 LAN GbE, 1xFXS, Wi-Fi 802.11ac', rxSensitivity: -28 },
    { id: crypto.randomUUID(), model: 'NTU-SFP-200', description: 'ONT NTU-SFP-200, subscriber terminal, SFP form factor', rxSensitivity: -28 },
    { id: crypto.randomUUID(), model: 'NTX-1', description: 'Subscriber terminal NTX-1, 1 XGS-PON, 1 1G LAN, 1 10G LAN', rxSensitivity: -29 },
    { id: crypto.randomUUID(), model: 'NTX-1F', description: 'Subscriber terminal NTX-1F, 1 XGS-PON, 1 1G LAN, 1 10G SFP+', rxSensitivity: -29 },
    { id: crypto.randomUUID(), model: 'NTU-RG-5520G-Wax', description: 'Subscriber terminal NTU-RG-5520G-Wax, 1 PON, 4 LAN GbE, Wi-Fi 802.11ax', rxSensitivity: -28 },
];
