import React, { useState, useEffect } from 'react';
import type { SmtpConfig } from '../types';
import { useI18n } from '../contexts/I18nContext';

const SMTP_CONFIG_KEY = 'smtpConfig';

const SmtpSettings: React.FC = () => {
    const { t } = useI18n();
    const [config, setConfig] = useState<SmtpConfig>({
        host: '',
        port: 587,
        user: '',
        pass: '',
    });
    const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

    useEffect(() => {
        try {
            const storedConfig = localStorage.getItem(SMTP_CONFIG_KEY);
            if (storedConfig) {
                setConfig(JSON.parse(storedConfig));
            }
        } catch (error) {
            console.error("Failed to parse SMTP config from localStorage", error);
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        setConfig(prev => ({
            ...prev,
            [name]: type === 'number' ? parseInt(value, 10) || 0 : value,
        }));
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        localStorage.setItem(SMTP_CONFIG_KEY, JSON.stringify(config));
        setMessage({ type: 'success', text: t('smtp.saveSuccess') });
        setTimeout(() => setMessage(null), 3000);
    };
    
    const handleTest = () => {
        // This is a simulation. In a real app, you'd use a library like Nodemailer on a backend.
        if (config.host && config.port > 0 && config.user) {
             setMessage({ type: 'success', text: t('smtp.testSuccess') });
        } else {
             setMessage({ type: 'error', text: t('smtp.testFailure') });
        }
         setTimeout(() => setMessage(null), 4000);
    };

    return (
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg max-w-2xl mx-auto">
            <h2 className="text-xl font-bold text-cyan-400 mb-2">{t('smtp.title')}</h2>
            <p className="text-sm text-gray-400 mb-6">{t('smtp.description')}</p>
            
            <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="host" className="block text-sm font-medium text-gray-400 mb-1">{t('smtp.host')}</label>
                        <input type="text" name="host" id="host" value={config.host} onChange={handleChange} className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white" />
                    </div>
                    <div>
                        <label htmlFor="port" className="block text-sm font-medium text-gray-400 mb-1">{t('smtp.port')}</label>
                        <input type="number" name="port" id="port" value={config.port} onChange={handleChange} className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white" />
                    </div>
                </div>
                 <div>
                    <label htmlFor="user" className="block text-sm font-medium text-gray-400 mb-1">{t('smtp.user')}</label>
                    <input type="text" name="user" id="user" value={config.user} onChange={handleChange} className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white" />
                </div>
                 <div>
                    <label htmlFor="pass" className="block text-sm font-medium text-gray-400 mb-1">{t('smtp.pass')}</label>
                    <input type="password" name="pass" id="pass" value={config.pass} onChange={handleChange} className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white" />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <button type="button" onClick={handleTest} className="bg-gray-600 hover:bg-gray-500 text-gray-200 font-semibold py-2 px-4 rounded-md transition-colors">{t('smtp.testConnection')}</button>
                    <button type="submit" className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 px-4 rounded-md transition-colors">{t('smtp.save')}</button>
                </div>
            </form>
            
            {message && (
                 <div className={`mt-4 p-3 rounded-md text-sm ${message.type === 'success' ? 'bg-green-900/50 text-green-300' : 'bg-red-900/50 text-red-300'}`}>
                    {message.text}
                 </div>
            )}
        </div>
    );
};

export default SmtpSettings;
