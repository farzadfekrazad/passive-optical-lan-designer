
export type PonTechnology = 'GPON' | 'XGS-PON';
export type UserRole = 'user' | 'admin' | 'readonly_admin';

export interface User {
  id: string;
  email: string;
  passwordHash: string; // In a real app, never store plain text passwords
  role: UserRole;
  verified: boolean;
}

export interface SmtpConfig {
  host: string;
  port: number;
  user: string;
  pass: string;
}

export interface OltSfpOption {
  name: string;
  txPower: number; // in dBm
}

export interface OltComponent {
  name: string;
  quantity: number;
}

export interface UplinkPort {
  type: string; // e.g., '10G SFP+', '100G QSFP28'
  count: number;
}

export interface OltDevice {
  id: string;
  model: string;
  description: string;
  technology: PonTechnology;
  ponPorts: number;
  uplinkPorts: UplinkPort[];
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
  technology: PonTechnology;
  rxSensitivity: number; // in dBm
  ethernetPorts: OntEthernetPort[];
  fxsPorts: number;
  wifi: {
    standard: string; // e.g., '802.11ac', '802.11ax'
    bands: string; // e.g., '2.4/5GHz'
  } | null;
}

export type SplitRatio = '1:2' | '1:4' | '1:8' | '1:16' | '1:32' | '1:64';

export interface SplitterConfig {
    type: 'Centralized' | 'Cascaded';
    level1Ratio: SplitRatio;
    level2Ratio: SplitRatio; // Only used in Cascaded
}

export interface PolDesignParameters {
  // Central Office / MDF
  oltId: string;
  sfpSelection: string; // Name of the selected SFP
  ponPorts: number; // Derived from OLT
  oltTxPower: number; // in dBm, derived from sfpSelection

  // Optical Distribution Network (ODN)
  backboneDistance: number; // in meters
  splitterConfig: SplitterConfig;

  // Work Area / User End
  ontId: string;
  ontsPerPonPort: number;
  ontRxSensitivity: number; // in dBm
  dropCableLength: number; // in meters

  // Expert Mode
  expertMode: boolean;
  safetyMargin: number; // in dB
  connectorLoss: number; // in dB
  spliceLoss: number; // in dB
  backboneSplices: number;
  dropSplices: number;
}

// These are just fallback IDs for the initial state.
const DEFAULT_OLT_ID = 'b7a3a9e0-9a2c-4e8b-8c1d-1f3e5a7b9d1c'; // LTP-8X (GPON)
const DEFAULT_ONT_ID = 'c1e4f7a8-3b9d-4e6f-8a2c-1d5e7b9a3c1f'; // NTU-RG-5421G-Wac (GPON)

export const initialParameters: Omit<PolDesignParameters, 'oltTxPower' | 'ponPorts' | 'ontRxSensitivity' | 'sfpSelection'> & { oltId: string; ontId: string } = {
  oltId: DEFAULT_OLT_ID,

  backboneDistance: 500,
  splitterConfig: {
    type: 'Centralized',
    level1Ratio: '1:32',
    level2Ratio: '1:4', // Default for cascaded, not used initially
  },
  
  ontId: DEFAULT_ONT_ID,
  ontsPerPonPort: 32,
  dropCableLength: 50,
  
  // Expert Mode Defaults
  expertMode: false,
  safetyMargin: 3.0,
  connectorLoss: 0.5,
  spliceLoss: 0.1,
  backboneSplices: 2,
  dropSplices: 2,
};