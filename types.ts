
export interface OltSfpOption {
  name: string;
  txPower: number; // in dBm
}

export interface OltComponent {
  name: string;
  quantity: number;
}

export interface OltDevice {
  id: string;
  model: string;
  description: string;
  ponPorts: number;
  sfpOptions: OltSfpOption[];
  components: OltComponent[]; // For chassis-based OLTs
}

export interface OntEthernetPort {
  type: string; // e.g., '10/100/1000Base-T', '10GBase-T'
  count: number;
}

export interface OntDevice {
  id: string;
  model: string;
  description: string;
  rxSensitivity: number; // in dBm
  ethernetPorts: OntEthernetPort[];
  fxsPorts: number;
  wifi: {
    standard: string; // e.g., '802.11ac', '802.11ax'
    bands: string; // e.g., '2.4GHz', '2.4/5GHz'
  } | null;
}

export interface PolDesignParameters {
  // Central Office / MDF
  oltId: string;
  sfpSelection: string; // Name of the selected SFP
  ponPorts: number;
  uplinkSpeed: '10G' | '40G' | '100G';
  redundancyType: 'None' | 'Type A' | 'Type B';
  oltTxPower: number; // in dBm, derived from sfpSelection

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

// These are just fallback IDs for the initial state.
// The useLocalStorage hook will ensure valid IDs from the persisted list are used.
const DEFAULT_OLT_ID = 'b7a3a9e0-9a2c-4e8b-8c1d-1f3e5a7b9d1c'; // LTP-8X
const DEFAULT_ONT_ID = 'c1e4f7a8-3b9d-4e6f-8a2c-1d5e7b9a3c1f'; // NTU-RG-5421G-Wac

export const initialParameters: Omit<PolDesignParameters, 'oltTxPower' | 'ponPorts' | 'ontRxSensitivity' | 'sfpSelection'> & { oltId: string; ontId: string } = {
  oltId: DEFAULT_OLT_ID,
  uplinkSpeed: '10G',
  redundancyType: 'Type B',

  fiberType: 'Singlemode OS2',
  cableType: 'Plenum',
  backboneDistance: 500,
  splitRatio: '1:32',
  splitterLevels: '1 (Centralized)',
  connectorType: 'SC/APC',
  connectorLoss: 0.5,
  spliceLoss: 0.1,
  numberOfSplices: 2,

  ontId: DEFAULT_ONT_ID,
  ontsPerPonPort: 32,
  ontPowering: 'Remote PoE',
  dropCableLength: 50,
};
