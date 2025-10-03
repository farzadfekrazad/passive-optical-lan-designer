
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
