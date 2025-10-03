import React from 'react';
import type { PolDesignParameters, OltDevice, OntDevice } from '../types';
import ParameterGroup from './ParameterGroup';
import SelectInput from './SelectInput';
import SliderInput from './SliderInput';
import StaticDisplay from './StaticDisplay';
import SplitterConfig from './SplitterConfig';
import { useI18n } from '../contexts/I18nContext';

interface ParameterPanelProps {
  parameters: PolDesignParameters;
  onChange: (key: keyof PolDesignParameters, value: any) => void;
  oltDevices: OltDevice[];
  ontDevices: OntDevice[];
  selectedOlt?: OltDevice;
  selectedOnt?: OntDevice;
}

const ParameterPanel: React.FC<ParameterPanelProps> = ({ parameters, onChange, oltDevices, ontDevices, selectedOlt, selectedOnt }) => {
  const { t } = useI18n();
  const { splitterConfig } = parameters;
  const maxOnts = splitterConfig.type === 'Centralized' 
    ? parseInt(splitterConfig.level1Ratio.split(':')[1]) 
    : parseInt(splitterConfig.level1Ratio.split(':')[1]) * parseInt(splitterConfig.level2Ratio.split(':')[1]);

  const oltOptions = oltDevices.map(olt => ({ label: `${olt.model} (${olt.technology})`, value: olt.id, description: olt.description }));
  const ontOptions = ontDevices.map(ont => ({ label: `${ont.model} (${ont.technology})`, value: ont.id, description: ont.description }));
  
  const sfpOptions = selectedOlt?.sfpOptions.map(sfp => ({ label: `${sfp.name} (${sfp.txPower.toFixed(1)} dBm)`, value: sfp.name })) || [];

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg space-y-4 max-h-[calc(100vh-120px)] overflow-y-auto">
      <ParameterGroup title={t('parameterPanel.co_mdf')} defaultOpen={true}>
        <SelectInput 
          label={t('parameterPanel.oltModel')}
          value={parameters.oltId}
          onChange={e => onChange('oltId', e.target.value)}
          options={oltOptions}
        />
        {selectedOlt && sfpOptions.length > 0 && (
          <SelectInput
            label={t('parameterPanel.sfpModule')}
            value={parameters.sfpSelection}
            onChange={e => onChange('sfpSelection', e.target.value)}
            options={sfpOptions}
          />
        )}
        <div className="bg-gray-900/50 p-3 rounded-md space-y-2 text-sm">
            <StaticDisplay label={t('parameterPanel.ponPorts')} value={parameters.ponPorts} />
            {selectedOlt?.uplinkPorts.map(p => <StaticDisplay key={p.type} label={t('parameterPanel.uplinkPorts', {type: p.type})} value={t('parameterPanel.portCount', {count: p.count})} />)}
        </div>
      </ParameterGroup>
      
      <ParameterGroup title={t('parameterPanel.odn')} defaultOpen={true}>
         <div className="flex items-center justify-between bg-gray-900/50 p-3 rounded-md">
          <label htmlFor="expertMode" className="text-sm font-medium text-gray-300">{t('parameterPanel.expertMode')}</label>
          <div className="relative inline-block w-10 h-6 align-middle select-none">
              <input 
                  type="checkbox" 
                  name="expertMode" 
                  id="expertMode" 
                  checked={parameters.expertMode}
                  onChange={e => onChange('expertMode', e.target.checked)}
                  className="toggle-checkbox block w-6 h-6 rounded-full bg-white border-4 border-gray-600 appearance-none cursor-pointer"
              />
              <label htmlFor="expertMode" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-600 cursor-pointer"></label>
          </div>
        </div>
        <SliderInput
          label={t('parameterPanel.backboneDistance')}
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
             <h4 className="text-sm font-semibold text-cyan-300 border-b border-gray-700 pb-1 mb-2">{t('parameterPanel.advancedLossConfig')}</h4>
             <SliderInput
              label={t('parameterPanel.safetyMargin')}
              value={parameters.safetyMargin}
              onChange={e => onChange('safetyMargin', parseFloat(e.target.value))}
              min={0} max={5} step={0.1}
            />
            <SliderInput
              label={t('parameterPanel.backboneSplices')}
              value={parameters.backboneSplices}
              onChange={e => onChange('backboneSplices', parseInt(e.target.value))}
              min={0} max={10} step={1}
            />
             <SliderInput
              label={t('parameterPanel.dropSplices')}
              value={parameters.dropSplices}
              onChange={e => onChange('dropSplices', parseInt(e.target.value))}
              min={0} max={10} step={1}
            />
            <SliderInput
              label={t('parameterPanel.connectorLoss')}
              value={parameters.connectorLoss}
              onChange={e => onChange('connectorLoss', parseFloat(e.target.value))}
              min={0.1} max={1} step={0.05}
            />
            <SliderInput
              label={t('parameterPanel.spliceLoss')}
              value={parameters.spliceLoss}
              onChange={e => onChange('spliceLoss', parseFloat(e.target.value))}
              min={0.01} max={0.5} step={0.01}
            />
          </div>
        )}
      </ParameterGroup>

      <ParameterGroup title={t('parameterPanel.userEnd')} defaultOpen={true}>
        <SelectInput 
          label={t('parameterPanel.ontModel')}
          value={parameters.ontId}
          onChange={e => onChange('ontId', e.target.value)}
          options={ontOptions}
          disabled={ontOptions.length === 0}
        />
        {ontOptions.length === 0 && <p className="text-xs text-yellow-400 p-2 bg-yellow-900/50 rounded-md">{t('parameterPanel.noCompatibleOnt')}</p>}
        {selectedOnt && (
            <div className="bg-gray-900/50 p-3 rounded-md space-y-2 text-sm">
                <StaticDisplay label={t('parameterPanel.technology')} value={selectedOnt.technology} />
                <StaticDisplay label={t('parameterPanel.rxSensitivity')} value={`${selectedOnt.rxSensitivity.toFixed(1)} dBm`} />
                {selectedOnt.ethernetPorts.map(p => <StaticDisplay key={p.type} label={t('parameterPanel.ethernetPorts', { type: p.type })} value={t('parameterPanel.portCount', {count: p.count})} />)}
                {selectedOnt.fxsPorts > 0 && <StaticDisplay label={t('parameterPanel.fxsPorts')} value={selectedOnt.fxsPorts} />}
                {selectedOnt.wifi && <StaticDisplay label={t('parameterPanel.wifi')} value={`${selectedOnt.wifi.standard} (${selectedOnt.wifi.bands})`} />}
            </div>
        )}
        <SliderInput
          label={t('parameterPanel.ontsPerPon')}
          value={parameters.ontsPerPonPort}
          onChange={e => onChange('ontsPerPonPort', parseInt(e.target.value))}
          min={1} max={maxOnts} step={1}
        />
         <SliderInput
          label={t('parameterPanel.dropCableLength')}
          value={parameters.dropCableLength}
          onChange={e => onChange('dropCableLength', parseInt(e.target.value))}
          min={5} max={100} step={5}
        />
      </ParameterGroup>
    </div>
  );
};

export default ParameterPanel;