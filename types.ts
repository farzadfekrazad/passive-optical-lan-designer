
import { initialOltDevices, initialOntDevices } from './data/eltexDevices';

export interface OltDevice {
  id: string;
  model: string;
  description: string;
  ponPorts: number;
  txPower: number; // in dBm
}

export interface OntDevice {
  id: string;
  model: string;
  description: string;
  rxSensitivity: number; // in dBm
}

export interface PolDesignParameters {
  // Central Office / MDF
  oltId: string; 
  ponPorts: number;
  uplinkSpeed: '10G' | '40G' | '100G';
  redundancyType: 'None' | 'Type A' | 'Type B';
  oltTxPower: number; // in dBm

  // Optical Distribution Network (ODN)
  fiberType: 'Singlemode OS2';
  cableType: 'Riser' | 'Plenum' | 'Armored';
  backboneDistance: number; // in meters
  splitRatio: '1:4' | '1:8' | '1:16' | '1:32' | '1:64';
  splitterLevels: '1 (Centralized)' | '2 (Cascaded)';
  connectorType: 'SC/APC' | 'LC/APC';
  connectorLoss: number; // in dB
  spliceLoss: number; // in dB
  numberOfSplices: number;

  // Work Area / User End
  ontId: string; 
  ontsPerPonPort: number;
  ontRxSensitivity: number; // in dBm
  ontPowering: 'Local AC' | 'Remote PoE';
  dropCableLength: number; // in meters
}

const defaultOlt = initialOltDevices[2]; // Default to LTP-8X
const defaultOnt = initialOntDevices[0]; // Default to NTU-1 rev.C

export const initialParameters: PolDesignParameters = {
  oltId: defaultOlt.id,
  ponPorts: defaultOlt.ponPorts,
  uplinkSpeed: '10G',
  redundancyType: 'Type B',
  oltTxPower: defaultOlt.txPower,

  fiberType: 'Singlemode OS2',
  cableType: 'Plenum',
  backboneDistance: 500,
  splitRatio: '1:32',
  splitterLevels: '1 (Centralized)',
  connectorType: 'SC/APC',
  connectorLoss: 0.5,
  spliceLoss: 0.1,
  numberOfSplices: 2,

  ontId: defaultOnt.id,
  ontsPerPonPort: 32,
  ontRxSensitivity: defaultOnt.rxSensitivity,
  ontPowering: 'Remote PoE',
  dropCableLength: 50,
};
