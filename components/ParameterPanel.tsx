
import React from 'react';
import type { PolDesignParameters, OltDevice, OntDevice } from '../types';
import ParameterGroup from './ParameterGroup';
import SelectInput from './SelectInput';
import SliderInput from './SliderInput';
import StaticDisplay from './StaticDisplay';
import SplitterConfig from './SplitterConfig';

interface ParameterPanelProps {
  parameters: PolDesignParameters;
  onChange: (key: keyof PolDesignParameters, value: any) => void;
  oltDevices: OltDevice[];
  ontDevices: OntDevice[];
  selectedOlt?: OltDevice;
  selectedOnt?: OntDevice;
}

const ParameterPanel: React.FC<ParameterPanelProps> = ({ parameters, onChange, oltDevices, ontDevices, selectedOlt, selectedOnt }) => {
  const { splitterConfig } = parameters;
  const maxOnts = splitterConfig.type === 'Centralized' 
    ? parseInt(splitterConfig.level1Ratio.split(':')[1]) 
    : parseInt(splitterConfig.level1Ratio.split(':')[1]) * parseInt(splitterConfig.level2Ratio.split(':')[1]);

  const oltOptions = oltDevices.map(olt => ({ label: `${olt.model} (${olt.technology})`, value: olt.id, description: olt.description }));
  const ontOptions = ontDevices.map(ont => ({ label: `${ont.model} (${ont.technology})`, value: ont.id, description: ont.description }));
  
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
         <div className="flex items-center justify-between bg-gray-900/50 p-3 rounded-md">
          <label htmlFor="expertMode" className="text-sm font-medium text-gray-300">Expert Mode</label>
          <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
              <input 
                  type="checkbox" 
                  name="expertMode" 
                  id="expertMode" 
                  checked={parameters.expertMode}
                  onChange={e => onChange('expertMode', e.target.checked)}
                  className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
              />
              <label htmlFor="expertMode" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-600 cursor-pointer"></label>
          </div>
        </div>
        <SliderInput
          label="Backbone Distance (m)"
          value={parameters.backboneDistance}
          onChange={e => onChange('backboneDistance', parseInt(e.target.value))}
          min={50} max={20000} step={50}
        />
        <SplitterConfig
            config={parameters.splitterConfig}
            onChange={newConfig => onChange('splitterConfig', newConfig)}
        />

        {parameters.expertMode && (
          <div className="space-y-4 p-3 bg-gray-900/50 rounded-md">
             <h4 className="text-sm font-semibold text-cyan-300 border-b border-gray-700 pb-1 mb-2">Expert Loss Configuration</h4>
             <SliderInput
              label="Safety Margin (dB)"
              value={parameters.safetyMargin}
              onChange={e => onChange('safetyMargin', parseFloat(e.target.value))}
              min={0} max={5} step={0.1}
            />
            <SliderInput
              label="Backbone Connectors/Splices"
              value={parameters.backboneSplices}
              onChange={e => onChange('backboneSplices', parseInt(e.target.value))}
              min={0} max={10} step={1}
            />
             <SliderInput
              label="Drop Connectors/Splices"
              value={parameters.dropSplices}
              onChange={e => onChange('dropSplices', parseInt(e.target.value))}
              min={0} max={10} step={1}
            />
            <SliderInput
              label="Connector Loss (dB)"
              value={parameters.connectorLoss}
              onChange={e => onChange('connectorLoss', parseFloat(e.target.value))}
              min={0.1} max={1} step={0.05}
            />
            <SliderInput
              label="Splice Loss (dB)"
              value={parameters.spliceLoss}
              onChange={e => onChange('spliceLoss', parseFloat(e.target.value))}
              min={0.01} max={0.5} step={0.01}
            />
          </div>
        )}
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
                <StaticDisplay label="Technology" value={selectedOnt.technology} />
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
