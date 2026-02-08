import React, { useState, useEffect } from 'react';
import { Heart, Activity, Droplet, Gauge, Calculator, TrendingUp, AlertCircle, GitBranch, Sun, Moon } from 'lucide-react';

const HDTDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedMetric, setSelectedMetric] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Theme colors
  const theme = {
    bg: isDarkMode ? 'bg-gray-900' : 'bg-gray-50',
    cardBg: isDarkMode ? 'bg-gray-800' : 'bg-white',
    border: isDarkMode ? 'border-gray-700' : 'border-gray-200',
    text: isDarkMode ? 'text-white' : 'text-gray-900',
    textSecondary: isDarkMode ? 'text-gray-400' : 'text-gray-600',
    textTertiary: isDarkMode ? 'text-gray-500' : 'text-gray-500',
    modalBg: isDarkMode ? 'bg-gray-800' : 'bg-white',
    modalOverlay: isDarkMode ? 'bg-black bg-opacity-75' : 'bg-black bg-opacity-50',
    tabActive: isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white',
    tabInactive: isDarkMode ? 'bg-gray-800 text-gray-400 hover:bg-gray-700' : 'bg-white text-gray-700 hover:bg-gray-100',
    infoBg: isDarkMode ? 'bg-gray-900' : 'bg-gray-100',
    badgeBg: isDarkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-700',
    gradient: isDarkMode ? 'from-blue-900 to-blue-800' : 'from-blue-500 to-blue-600',
    headerIcon: isDarkMode ? 'text-red-500' : 'text-red-600',
  };
  
  const [realTimeData, setRealTimeData] = useState({
    heartRate: 72,
    systolic: 120,
    diastolic: 80,
    spo2: 98,
    temp: 36.8,
    lvVolume: 145,
    rvVolume: 150,
    status: 'Normal'
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeData(prev => ({
        ...prev,
        heartRate: 70 + Math.floor(Math.random() * 10),
        systolic: 118 + Math.floor(Math.random() * 5),
        diastolic: 78 + Math.floor(Math.random() * 5),
        spo2: 97 + Math.floor(Math.random() * 2)
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const dataDrivenMapping = {
    'Cardiac Output': {
      formula: 'Heart Rate × Stroke Volume',
      geometrical: ['Left Ventricle Volume'],
      physical: ['Heart Rate'],
      calculation: 'CO = HR × SV, where SV is derived from LV volume changes'
    },
    'Stroke Volume': {
      formula: 'LV End-Diastolic Volume - LV End-Systolic Volume',
      geometrical: ['Left Ventricle Volume'],
      physical: [],
      calculation: 'SV = EDV - ESV (from geometrical measurements)'
    },
    'Ejection Fraction': {
      formula: '(Stroke Volume / LV End-Diastolic Volume) × 100',
      geometrical: ['Left Ventricle Volume'],
      physical: [],
      calculation: 'EF = (SV / EDV) × 100%'
    },
    'Cardiac Index': {
      formula: 'Cardiac Output / Body Surface Area',
      geometrical: ['Left Ventricle Volume'],
      physical: ['Heart Rate', 'Body Mass Index'],
      calculation: 'CI = CO / BSA, BSA derived from BMI'
    },
    'SVR': {
      formula: '(MAP - CVP) / Cardiac Output × 80',
      geometrical: ['Left Ventricle Volume'],
      physical: ['Systolic BP', 'Diastolic BP', 'Central Venous Pressure', 'Heart Rate'],
      calculation: 'SVR = (MAP - CVP) / CO × 80, MAP = DBP + 1/3(SBP-DBP)'
    },
    'PVR': {
      formula: '(MPAP - PCWP) / Cardiac Output × 80',
      geometrical: ['Left Ventricle Volume', 'Right Ventricle Volume'],
      physical: ['Pulmonary Artery Pressure', 'Pulmonary Capillary Wedge Pressure', 'Heart Rate'],
      calculation: 'PVR = (MPAP - PCWP) / CO × 80'
    },
    'MAP': {
      formula: 'Diastolic BP + 1/3(Systolic BP - Diastolic BP)',
      geometrical: [],
      physical: ['Systolic Blood Pressure', 'Diastolic Blood Pressure'],
      calculation: 'MAP = DBP + 1/3(SBP - DBP)'
    },
    'Pulse Pressure': {
      formula: 'Systolic BP - Diastolic BP',
      geometrical: [],
      physical: ['Systolic Blood Pressure', 'Diastolic Blood Pressure'],
      calculation: 'PP = SBP - DBP'
    },
    'Wall Shear Stress': {
      formula: '4μQ / πr³',
      geometrical: ['Aortic Root Diameter', 'Vessel Curvature'],
      physical: ['Blood Viscosity', 'Heart Rate'],
      calculation: 'WSS = 4μQ / πr³, where Q from CO and r from vessel diameter'
    },
    'Reynolds Number': {
      formula: 'ρvD / μ',
      geometrical: ['Aortic Root Diameter'],
      physical: ['Blood Viscosity', 'Heart Rate', 'Hematocrit'],
      calculation: 'Re = ρvD / μ, velocity from CO and diameter'
    },
    'Arterial Compliance': {
      formula: 'ΔVolume / ΔPressure',
      geometrical: ['Aortic Root Diameter', 'Aortic Wall Thickness'],
      physical: ['Systolic Blood Pressure', 'Diastolic Blood Pressure'],
      calculation: 'C = ΔV / ΔP, derived from vessel diameter changes'
    },
    'Arterial Stiffness': {
      formula: 'ln(SBP/DBP) / (Δdiameter/diastolic diameter)',
      geometrical: ['Aortic Root Diameter'],
      physical: ['Systolic Blood Pressure', 'Diastolic Blood Pressure', 'Pulse Wave Velocity'],
      calculation: 'β = ln(SBP/DBP) / strain, measured via PWV'
    },
    'Myocardial Strain': {
      formula: '(L - L₀) / L₀ × 100%',
      geometrical: ['Left Ventricular Wall Thickness', 'Left Ventricle Volume'],
      physical: ['Systolic Blood Pressure'],
      calculation: 'Strain = (L - L₀) / L₀, from wall thickness changes during cycle'
    },
    'LV dP/dt max': {
      formula: 'Maximum rate of LV pressure rise',
      geometrical: ['Left Ventricle Volume', 'Left Ventricular Wall Thickness'],
      physical: ['Heart Rate', 'Systolic Blood Pressure'],
      calculation: 'dP/dt max derived from pressure-volume loop analysis'
    },
    'Coronary Flow Reserve': {
      formula: 'Maximum Flow / Resting Flow',
      geometrical: ['Coronary Artery Ostium Area', 'Left Main Coronary Artery Length'],
      physical: ['Heart Rate', 'Systolic Blood Pressure', 'Diastolic Blood Pressure'],
      calculation: 'CFR = Qmax / Qrest, flow from vessel geometry and pressure gradient'
    },
    'FFR': {
      formula: 'Distal Pressure / Proximal Pressure',
      geometrical: ['Stenosis Location', 'Coronary Artery Ostium Area'],
      physical: ['Systolic Blood Pressure', 'Diastolic Blood Pressure'],
      calculation: 'FFR = Pd / Pa during maximum hyperemia'
    }
  };

  const geometricalData = {
    chambers: [
      { name: 'LV Volume', value: 145, unit: 'mL', normal: '67-155' },
      { name: 'RV Volume', value: 150, unit: 'mL', normal: '87-164' },
      { name: 'LA Volume', value: 65, unit: 'mL', normal: '22-58' },
      { name: 'RA Volume', value: 55, unit: 'mL', normal: '25-58' }
    ],
    vessels: [
      { name: 'Aortic Root', value: 32, unit: 'mm', normal: '20-37' },
      { name: 'Ascending Aorta', value: 35, unit: 'mm', normal: '22-36' },
      { name: 'Main PA', value: 26, unit: 'mm', normal: '20-29' },
      { name: 'IVS Thickness', value: 10, unit: 'mm', normal: '6-11' }
    ],
    valves: [
      { name: 'Mitral Annulus', value: 32, unit: 'mm', normal: '28-40' },
      { name: 'Aortic Annulus', value: 24, unit: 'mm', normal: '20-31' },
      { name: 'Tricuspid Annulus', value: 35, unit: 'mm', normal: '28-46' },
      { name: 'Pulmonary Annulus', value: 23, unit: 'mm', normal: '18-28' }
    ]
  };

  const physicalData = {
    hemodynamic: [
      { name: 'Systolic BP', value: realTimeData.systolic, unit: 'mmHg', status: 'normal' },
      { name: 'Diastolic BP', value: realTimeData.diastolic, unit: 'mmHg', status: 'normal' },
      { name: 'Heart Rate', value: realTimeData.heartRate, unit: 'bpm', status: 'normal' },
      { name: 'SpO2', value: realTimeData.spo2, unit: '%', status: 'normal' },
      { name: 'Temperature', value: realTimeData.temp, unit: '°C', status: 'normal' },
      { name: 'CVP', value: 8, unit: 'mmHg', status: 'normal' }
    ],
    blood: [
      { name: 'Hemoglobin', value: 14.2, unit: 'g/dL', status: 'normal' },
      { name: 'Hematocrit', value: 42, unit: '%', status: 'normal' },
      { name: 'Blood Viscosity', value: 4.2, unit: 'cP', status: 'normal' },
      { name: 'Total Cholesterol', value: 185, unit: 'mg/dL', status: 'normal' },
      { name: 'LDL', value: 110, unit: 'mg/dL', status: 'normal' },
      { name: 'HDL', value: 55, unit: 'mg/dL', status: 'normal' }
    ],
    biomarkers: [
      { name: 'Troponin', value: 0.02, unit: 'ng/mL', status: 'normal' },
      { name: 'BNP', value: 85, unit: 'pg/mL', status: 'normal' },
      { name: 'CRP', value: 1.8, unit: 'mg/L', status: 'normal' },
      { name: 'Glucose', value: 95, unit: 'mg/dL', status: 'normal' }
    ]
  };

  const dataDrivenData = {
    performance: [
      { name: 'Cardiac Output', value: 5.2, unit: 'L/min', status: 'normal', sources: ['Geometrical', 'Physical'] },
      { name: 'Stroke Volume', value: 72, unit: 'mL', status: 'normal', sources: ['Geometrical'] },
      { name: 'Ejection Fraction', value: 58, unit: '%', status: 'normal', sources: ['Geometrical'] },
      { name: 'Cardiac Index', value: 2.8, unit: 'L/min/m²', status: 'normal', sources: ['Geometrical', 'Physical'] }
    ],
    vascular: [
      { name: 'SVR', value: 1200, unit: 'dyn·s/cm⁵', status: 'normal', sources: ['Geometrical', 'Physical'] },
      { name: 'PVR', value: 120, unit: 'dyn·s/cm⁵', status: 'normal', sources: ['Geometrical', 'Physical'] },
      { name: 'MAP', value: 93, unit: 'mmHg', status: 'normal', sources: ['Physical'] },
      { name: 'Pulse Pressure', value: 40, unit: 'mmHg', status: 'normal', sources: ['Physical'] }
    ],
    biomechanical: [
      { name: 'Wall Shear Stress', value: 15.2, unit: 'Pa', status: 'normal', sources: ['Geometrical', 'Physical'] },
      { name: 'Myocardial Strain', value: -18.5, unit: '%', status: 'normal', sources: ['Geometrical', 'Physical'] },
      { name: 'LV dP/dt max', value: 1850, unit: 'mmHg/s', status: 'normal', sources: ['Geometrical', 'Physical'] },
      { name: 'Arterial Stiffness', value: 8.5, unit: 'm/s', status: 'normal', sources: ['Geometrical', 'Physical'] }
    ],
    flow: [
      { name: 'Coronary Flow Reserve', value: 3.2, unit: 'ratio', status: 'normal', sources: ['Geometrical', 'Physical'] },
      { name: 'FFR', value: 0.92, unit: 'ratio', status: 'normal', sources: ['Geometrical', 'Physical'] },
      { name: 'Reynolds Number', value: 2850, unit: '-', status: 'normal', sources: ['Geometrical', 'Physical'] },
      { name: 'Arterial Compliance', value: 1.8, unit: 'mL/mmHg', status: 'normal', sources: ['Geometrical', 'Physical'] }
    ]
  };

  const StatusIndicator = ({ status }) => {
    const colors = {
      normal: 'bg-green-500',
      warning: 'bg-yellow-500',
      critical: 'bg-red-500'
    };
    return <div className={`w-2 h-2 rounded-full ${colors[status] || colors.normal}`} />;
  };

  const MetricCard = ({ name, value, unit, status, normal, sources, onClick }) => (
    <div 
      className={`${theme.cardBg} rounded-lg p-4 border ${theme.border} ${onClick ? 'cursor-pointer hover:border-blue-500 transition-all' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-2">
        <span className={`${theme.textSecondary} text-sm`}>{name}</span>
        <div className="flex items-center gap-2">
          {sources && <GitBranch className="w-3 h-3 text-blue-400" />}
          <StatusIndicator status={status} />
        </div>
      </div>
      <div className={`text-2xl font-bold ${theme.text}`}>{value} <span className={`text-lg ${theme.textSecondary}`}>{unit}</span></div>
      {normal && <div className={`text-xs ${theme.textTertiary} mt-1`}>Normal: {normal}</div>}
      {sources && (
        <div className="flex gap-1 mt-2">
          {sources.map((source, idx) => (
            <span key={idx} className={`text-xs ${theme.badgeBg} px-2 py-1 rounded`}>
              {source}
            </span>
          ))}
        </div>
      )}
    </div>
  );

  const MappingModal = ({ metric, onClose }) => {
    if (!metric || !dataDrivenMapping[metric]) return null;
    
    const mapping = dataDrivenMapping[metric];
    
    return (
      <div className={`fixed inset-0 ${theme.modalOverlay} flex items-center justify-center z-50 p-4`} onClick={onClose}>
        <div className={`${theme.modalBg} rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 border ${theme.border}`} onClick={e => e.stopPropagation()}>
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-2xl font-bold ${theme.text} flex items-center`}>
              <Calculator className="w-6 h-6 text-blue-400 mr-3" />
              {metric}
            </h2>
            <button onClick={onClose} className={`${theme.textSecondary} hover:${theme.text} text-2xl`}>×</button>
          </div>
          
          <div className="space-y-6">
            <div className={`${theme.infoBg} rounded-lg p-4`}>
              <div className={`text-sm ${theme.textSecondary} mb-2`}>Formula</div>
              <div className="text-lg font-mono text-blue-300">{mapping.formula}</div>
            </div>
            
            <div className={`${theme.infoBg} rounded-lg p-4`}>
              <div className={`text-sm ${theme.textSecondary} mb-2`}>Calculation Method</div>
              <div className={theme.text}>{mapping.calculation}</div>
            </div>
            
            {mapping.geometrical.length > 0 && (
              <div>
                <div className="flex items-center mb-3">
                  <Heart className="w-4 h-4 text-red-400 mr-2" />
                  <h3 className={`text-lg font-semibold ${theme.text}`}>Geometrical Data Sources</h3>
                </div>
                <div className={`${theme.infoBg} rounded-lg p-4`}>
                  <ul className="space-y-2">
                    {mapping.geometrical.map((param, idx) => (
                      <li key={idx} className={`${theme.text} flex items-center`}>
                        <div className="w-2 h-2 bg-red-400 rounded-full mr-3"></div>
                        {param}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            
            {mapping.physical.length > 0 && (
              <div>
                <div className="flex items-center mb-3">
                  <Droplet className="w-4 h-4 text-blue-400 mr-2" />
                  <h3 className={`text-lg font-semibold ${theme.text}`}>Physical Data Sources</h3>
                </div>
                <div className={`${theme.infoBg} rounded-lg p-4`}>
                  <ul className="space-y-2">
                    {mapping.physical.map((param, idx) => (
                      <li key={idx} className={`${theme.text} flex items-center`}>
                        <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                        {param}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderOverview = () => (
    <div className="space-y-6">
      <div className={`bg-gradient-to-r ${theme.gradient} rounded-xl p-6 shadow-lg`}>
        <div className="flex items-center mb-4">
          <Activity className="w-6 h-6 text-blue-300 mr-2" />
          <h3 className="text-xl font-bold text-white">Real-Time Vital Signs</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-4xl font-bold text-white">{realTimeData.heartRate}</div>
            <div className="text-sm text-blue-200">bpm</div>
            <div className="text-xs text-blue-300">Heart Rate</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-white">{realTimeData.systolic}/{realTimeData.diastolic}</div>
            <div className="text-sm text-blue-200">mmHg</div>
            <div className="text-xs text-blue-300">Blood Pressure</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-white">{realTimeData.spo2}</div>
            <div className="text-sm text-blue-200">%</div>
            <div className="text-xs text-blue-300">SpO₂</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-white">{realTimeData.temp}</div>
            <div className="text-sm text-blue-200">°C</div>
            <div className="text-xs text-blue-300">Temperature</div>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Calculator className="w-5 h-5 text-purple-400 mr-2" />
            <h3 className={`text-lg font-semibold ${theme.text}`}>Data-Driven Cardiac Performance</h3>
          </div>
          <span className={`text-xs ${theme.textSecondary}`}>Click metrics to see data mapping</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {dataDrivenData.performance.map((item, idx) => (
            <MetricCard 
              key={idx} 
              {...item} 
              onClick={() => setSelectedMetric(item.name)}
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`${theme.cardBg} rounded-lg p-6 border ${theme.border}`}>
          <div className="flex items-center justify-between">
            <div>
              <div className={`${theme.textSecondary} text-sm mb-1`}>Overall Status</div>
              <div className="text-2xl font-bold text-green-400">Normal</div>
            </div>
            <Heart className="w-12 h-12 text-green-400" />
          </div>
        </div>
        <div className={`${theme.cardBg} rounded-lg p-6 border ${theme.border}`}>
          <div className="flex items-center justify-between">
            <div>
              <div className={`${theme.textSecondary} text-sm mb-1`}>Active Parameters</div>
              <div className={`text-2xl font-bold ${theme.text}`}>150</div>
            </div>
            <TrendingUp className="w-12 h-12 text-blue-400" />
          </div>
        </div>
        <div className={`${theme.cardBg} rounded-lg p-6 border ${theme.border}`}>
          <div className="flex items-center justify-between">
            <div>
              <div className={`${theme.textSecondary} text-sm mb-1`}>Last Sync</div>
              <div className={`text-lg font-bold ${theme.text}`}>Just now</div>
            </div>
            <Activity className="w-12 h-12 text-green-400" />
          </div>
        </div>
      </div>
    </div>
  );

  const renderGeometrical = () => (
    <div className="space-y-6">
      <div>
        <h3 className={`text-lg font-semibold ${theme.text} mb-4 flex items-center`}>
          <Heart className="w-5 h-5 text-red-400 mr-2" />
          Cardiac Chambers
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {geometricalData.chambers.map((item, idx) => (
            <MetricCard key={idx} {...item} status="normal" />
          ))}
        </div>
      </div>
      
      <div>
        <h3 className={`text-lg font-semibold ${theme.text} mb-4`}>Vessels & Walls</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {geometricalData.vessels.map((item, idx) => (
            <MetricCard key={idx} {...item} status="normal" />
          ))}
        </div>
      </div>

      <div>
        <h3 className={`text-lg font-semibold ${theme.text} mb-4`}>Valvular Geometry</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {geometricalData.valves.map((item, idx) => (
            <MetricCard key={idx} {...item} status="normal" />
          ))}
        </div>
      </div>
    </div>
  );

  const renderPhysical = () => (
    <div className="space-y-6">
      <div>
        <h3 className={`text-lg font-semibold ${theme.text} mb-4 flex items-center`}>
          <Gauge className="w-5 h-5 text-blue-400 mr-2" />
          Hemodynamic Parameters
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {physicalData.hemodynamic.map((item, idx) => (
            <MetricCard key={idx} {...item} />
          ))}
        </div>
      </div>

      <div>
        <h3 className={`text-lg font-semibold ${theme.text} mb-4 flex items-center`}>
          <Droplet className="w-5 h-5 text-red-400 mr-2" />
          Blood Properties
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {physicalData.blood.map((item, idx) => (
            <MetricCard key={idx} {...item} />
          ))}
        </div>
      </div>

      <div>
        <h3 className={`text-lg font-semibold ${theme.text} mb-4`}>Biomarkers</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {physicalData.biomarkers.map((item, idx) => (
            <MetricCard key={idx} {...item} />
          ))}
        </div>
      </div>
    </div>
  );

  const renderDataDriven = () => (
    <div className="space-y-6">
      <div className={`${isDarkMode ? 'bg-blue-900 bg-opacity-30 border-blue-700' : 'bg-blue-50 border-blue-300'} rounded-lg p-4 border`}>
        <div className="flex items-center">
          <Calculator className="w-5 h-5 text-blue-400 mr-2" />
          <p className={`text-sm ${isDarkMode ? 'text-blue-200' : 'text-blue-800'}`}>
            <strong>Data-Driven Model:</strong> Semua metrik di bawah dihitung dari kombinasi data Geometrical dan Physical Model. 
            Klik pada setiap kartu untuk melihat pemetaan data dan formula perhitungannya.
          </p>
        </div>
      </div>

      <div>
        <h3 className={`text-lg font-semibold ${theme.text} mb-4 flex items-center`}>
          <Calculator className="w-5 h-5 text-purple-400 mr-2" />
          Cardiac Performance
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {dataDrivenData.performance.map((item, idx) => (
            <MetricCard 
              key={idx} 
              {...item}
              onClick={() => setSelectedMetric(item.name)}
            />
          ))}
        </div>
      </div>

      <div>
        <h3 className={`text-lg font-semibold ${theme.text} mb-4`}>Vascular Resistance</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {dataDrivenData.vascular.map((item, idx) => (
            <MetricCard 
              key={idx} 
              {...item}
              onClick={() => setSelectedMetric(item.name)}
            />
          ))}
        </div>
      </div>

      <div>
        <h3 className={`text-lg font-semibold ${theme.text} mb-4`}>Biomechanical Analysis</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {dataDrivenData.biomechanical.map((item, idx) => (
            <MetricCard 
              key={idx} 
              {...item}
              onClick={() => setSelectedMetric(item.name)}
            />
          ))}
        </div>
      </div>

      <div>
        <h3 className={`text-lg font-semibold ${theme.text} mb-4`}>Flow Dynamics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {dataDrivenData.flow.map((item, idx) => (
            <MetricCard 
              key={idx} 
              {...item}
              onClick={() => setSelectedMetric(item.name)}
            />
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen ${theme.bg} ${theme.text} p-6`}>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center">
            <Heart className={`w-8 h-8 ${theme.headerIcon} mr-3`} />
            Human Digital Twin - Cardiovascular Cockpit
          </h1>
          <p className={theme.textSecondary}>Real-time monitoring & analysis of 150 cardiovascular parameters</p>
        </div>
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${theme.cardBg} border ${theme.border} hover:border-blue-500 transition-all`}
          title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDarkMode ? (
            <>
              <Sun className="w-5 h-5 text-yellow-400" />
              <span className={theme.textSecondary}>Light</span>
            </>
          ) : (
            <>
              <Moon className="w-5 h-5 text-blue-600" />
              <span className={theme.textSecondary}>Dark</span>
            </>
          )}
        </button>
      </div>

      <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
        {[
          { id: 'overview', label: 'Overview', icon: Activity },
          { id: 'geometrical', label: 'Geometrical Model', icon: Heart },
          { id: 'physical', label: 'Physical Model', icon: Droplet },
          { id: 'data-driven', label: 'Data-Driven Model', icon: Calculator }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? theme.tabActive
                  : theme.tabInactive
              }`}
            >
              <Icon className="w-4 h-4 mr-2" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="pb-8">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'geometrical' && renderGeometrical()}
        {activeTab === 'physical' && renderPhysical()}
        {activeTab === 'data-driven' && renderDataDriven()}
      </div>

      {selectedMetric && (
        <MappingModal 
          metric={selectedMetric} 
          onClose={() => setSelectedMetric(null)} 
        />
      )}
    </div>
  );
};

export default HDTDashboard;