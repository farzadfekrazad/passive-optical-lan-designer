
import React from 'react';
import type { PolDesignParameters, OltDevice, OntDevice } from '../types';
import ParameterGroup from './ParameterGroup';
import SelectInput from './SelectInput';
import SliderInput from './SliderInput';
import StaticDisplay from './StaticDisplay';

interface ParameterPanelProps {
  parameters: PolDesignParameters;
  onChange: (key: keyof PolDesignParameters, value: any) => void;
  oltDevices: OltDevice[];
  ontDevices: OntDevice[];
  selectedOlt?: OltDevice;
  selectedOnt?: OntDevice;
}

const ParameterPanel: React.FC<ParameterPanelProps> = ({ parameters, onChange, oltDevices, ontDevices, selectedOlt, selectedOnt }) => {
  const maxOnts = parseInt(parameters.splitRatio.split(':')[1]);

  const oltOptions = oltDevices.map(olt => ({ label: `${olt.model}`, value: olt.id, description: olt.description }));
  const ontOptions = ontDevices.map(ont => ({ label: `${ont.model}`, value: ont.id, description: ont.description }));
  
  const sfpOptions = selectedOlt?.sfpOptions.map(sfp => ({ label: `${sfp.name} (${sfp.txPower.toFixed(1)} dBm)`, value: sfp.name })) || [];

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg space-y-4 max-h-[calc(100vh-120px)] overflow-y-auto">
      <ParameterGroup title="Central Office / MDF" defaultOpen={true}>
        <SelectInput 
          label="OLT Model"
          value={parameters.oltId}
          onChange={e => onChange('oltId', e.target.value)}
          options={oltOptions}
        />
        {selectedOlt && sfpOptions.length > 0 && (
          <SelectInput
            label="SFP Module"
            value={parameters.sfpSelection}
            onChange={e => onChange('sfpSelection', e.target.value)}
            options={sfpOptions}
          />
        )}
        <StaticDisplay label="PON Ports" value={parameters.ponPorts} />
        <SelectInput 
          label="Uplink Speed"
          value={parameters.uplinkSpeed}
          onChange={e => onChange('uplinkSpeed', e.target.value)}
          options={['10G', '40G', '100G'].map(o => ({label: o, value: o}))}
        />
      </ParameterGroup>
      
      <ParameterGroup title="Optical Distribution Network (ODN)" defaultOpen={true}>
        <SliderInput
          label="Backbone Distance (m)"
          value={parameters.backboneDistance}
          onChange={e => onChange('backboneDistance', parseInt(e.target.value))}
          min={50} max={20000} step={50}
        />
        <SelectInput 
          label="Split Ratio"
          value={parameters.splitRatio}
          onChange={e => onChange('splitRatio', e.target.value)}
          options={['1:4', '1:8', '1:16', '1:32', '1:64'].map(o => ({label: o, value: o}))}
        />
        <SliderInput
          label="Connectors / Splices Count"
          value={parameters.numberOfSplices}
          onChange={e => onChange('numberOfSplices', parseInt(e.target.value))}
          min={2} max={10} step={1}
        />
         <SliderInput
          label="Connector Loss (dB)"
          value={parameters.connectorLoss}
          onChange={e => onChange('connectorLoss', parseFloat(e.target.value))}
          min={0.1} max={1} step={0.05}
        />
      </ParameterGroup>

      <ParameterGroup title="Work Area / User End" defaultOpen={true}>
        <SelectInput 
          label="ONT Model"
          value={parameters.ontId}
          onChange={e => onChange('ontId', e.target.value)}
          options={ontOptions}
        />
        {selectedOnt && (
            <div className="bg-gray-900/50 p-3 rounded-md space-y-2 text-sm">
                <StaticDisplay label="Rx Sensitivity" value={`${selectedOnt.rxSensitivity.toFixed(1)} dBm`} />
                {selectedOnt.ethernetPorts.map(p => <StaticDisplay key={p.type} label={`ETH ${p.type}`} value={`${p.count} port(s)`} />)}
                {selectedOnt.fxsPorts > 0 && <StaticDisplay label="FXS Ports" value={selectedOnt.fxsPorts} />}
                {selectedOnt.wifi && <StaticDisplay label="Wi-Fi" value={`${selectedOnt.wifi.standard} (${selectedOnt.wifi.bands})`} />}
            </div>
        )}
        <SliderInput
          label="ONTs per PON Port"
          value={parameters.ontsPerPonPort}
          onChange={e => onChange('ontsPerPonPort', parseInt(e.target.value))}
          min={1} max={maxOnts} step={1}
        />
         <SliderInput
          label="Drop Cable Length (m)"
          value={parameters.dropCableLength}
          onChange={e => onChange('dropCableLength', parseInt(e.target.value))}
          min={5} max={100} step={5}
        />
      </ParameterGroup>
    </div>
  );
};

export default ParameterPanel;
