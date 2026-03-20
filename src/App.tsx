import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, CheckCircle2, AlertCircle, User, Brain, FileText, Calculator, MessageSquare, LayoutTemplate, Activity, Image as ImageIcon, X } from 'lucide-react';

type AppState = {
  patient: { name: string; age: string; education: string; handedness: string; medications: string; observations: string; };
  consciousness: { level: string; description: string; };
  orientation: { personName: boolean; personAge: boolean; placeLocation: boolean; placeDistrict: boolean; timeMonth: boolean; timeDay: boolean; timeYear: boolean; timeDayOfWeek: boolean; timeHour: boolean; };
  attention: { screen: boolean | null; metric: boolean[]; };
  memoryReg: { trials: string; };
  language: { picDesc: string; compScreen: boolean | null; compMetric: boolean[]; repScreen: boolean | null; repMetric: number[]; namingScreen: boolean | null; namingMetric: boolean[]; };
  construction: { screen: boolean | null; metric: number[]; };
  memory: { words: number[]; };
  calculation: { screen: boolean | null; metric: boolean[]; };
  reasoning: { simScreen: boolean | null; simMetric: number[]; judgScreen: boolean | null; judgMetric: number[]; };
};

const initialState: AppState = {
  patient: { name: '', age: '', education: '', handedness: '', medications: '', observations: '' },
  consciousness: { level: '', description: '' },
  orientation: { personName: false, personAge: false, placeLocation: false, placeDistrict: false, timeMonth: false, timeDay: false, timeYear: false, timeDayOfWeek: false, timeHour: false },
  attention: { screen: null, metric: Array(8).fill(false) },
  memoryReg: { trials: '' },
  language: { picDesc: '', compScreen: null, compMetric: Array(6).fill(false), repScreen: null, repMetric: Array(6).fill(0), namingScreen: null, namingMetric: Array(8).fill(false) },
  construction: { screen: null, metric: Array(3).fill(0) },
  memory: { words: Array(4).fill(0) },
  calculation: { screen: null, metric: Array(4).fill(false) },
  reasoning: { simScreen: null, simMetric: Array(4).fill(0), judgScreen: null, judgMetric: Array(3).fill(0) }
};

const steps = [
  { id: 0, title: '基本資料', icon: User },
  { id: 1, title: '意識與定向', icon: Brain },
  { id: 2, title: '專注與記憶註冊', icon: Activity },
  { id: 3, title: '語言能力', icon: MessageSquare },
  { id: 4, title: '結構組織', icon: LayoutTemplate },
  { id: 5, title: '記憶能力', icon: Brain },
  { id: 6, title: '計算能力', icon: Calculator },
  { id: 7, title: '推理能力', icon: FileText },
  { id: 8, title: '測試結果', icon: CheckCircle2 },
];

const calculateScores = (state: AppState) => {
  const o = state.orientation;
  const orientation = (o.personName ? 0 : 0) + (o.personAge ? 2 : 0) + (o.placeLocation ? 2 : 0) + (o.placeDistrict ? 2 : 0) + (o.timeMonth ? 1 : 0) + (o.timeDay ? 1 : 0) + (o.timeYear ? 2 : 0) + (o.timeDayOfWeek ? 1 : 0) + (o.timeHour ? 1 : 0);
  const attention = state.attention.screen ? 8 : state.attention.metric.filter(Boolean).length;
  const comprehension = state.language.compScreen ? 6 : state.language.compMetric.filter(Boolean).length;
  const repetition = state.language.repScreen ? 12 : state.language.repMetric.reduce((a, b) => a + b, 0);
  const naming = state.language.namingScreen ? 8 : state.language.namingMetric.filter(Boolean).length;
  const construction = state.construction.screen ? 6 : state.construction.metric.reduce((a, b) => a + b, 0);
  const memory = state.memory.words.reduce((a, b) => a + b, 0);
  const calculation = state.calculation.screen ? 4 : state.calculation.metric.filter(Boolean).length;
  const similarities = state.reasoning.simScreen ? 8 : state.reasoning.simMetric.reduce((a, b) => a + b, 0);
  const judgment = state.reasoning.judgScreen ? 6 : state.reasoning.judgMetric.reduce((a, b) => a + b, 0);

  return { orientation, attention, comprehension, repetition, naming, construction, memory, calculation, similarities, judgment };
};

const ScoreSelect = ({ label, value, onChange, options, onShowMaterial }: any) => (
  <div className="flex flex-col md:flex-row md:items-center justify-between py-3 border-b border-gray-100 last:border-0 gap-3">
    <div className="flex items-center gap-2">
      <span className="text-gray-700 text-sm md:text-base">{label}</span>
      {onShowMaterial && (
        <button 
          onClick={(e) => { e.preventDefault(); onShowMaterial(); }} 
          className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-md transition-colors flex items-center gap-1 text-xs font-medium"
        >
          <ImageIcon className="w-4 h-4" /> 顯示
        </button>
      )}
    </div>
    <div className="flex gap-2 shrink-0">
      {options.map((opt: any) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center border transition-colors text-sm md:text-base font-medium ${value === opt.value ? 'bg-blue-600 text-white border-blue-600 shadow-sm' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'}`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  </div>
);

const CheckboxItem = ({ label, checked, onChange, points, onShowMaterial }: any) => (
  <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0 hover:bg-gray-50 px-2 rounded-md transition-colors">
    <div className="flex items-center gap-2">
      <label className="flex items-center gap-3 cursor-pointer py-1">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 focus:ring-offset-0"
        />
        <span className="text-gray-700 text-sm md:text-base">{label}</span>
      </label>
      {onShowMaterial && (
        <button 
          onClick={(e) => { e.preventDefault(); onShowMaterial(); }} 
          className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-md transition-colors flex items-center gap-1 text-xs font-medium"
        >
          <ImageIcon className="w-4 h-4" /> 顯示
        </button>
      )}
    </div>
    {points !== undefined && <span className="text-xs md:text-sm text-gray-400 bg-gray-100 px-2 py-1 rounded-full">{points} 分</span>}
  </div>
);

const MaterialModal = ({ material, onClose }: { material: {title: string, content: React.ReactNode} | null, onClose: () => void }) => {
  if (!material) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 sm:p-8 animate-in fade-in duration-200 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-full flex flex-col overflow-hidden shadow-2xl">
        <div className="flex justify-between items-center p-4 border-b bg-gray-50">
          <h2 className="text-xl font-bold text-gray-800">{material.title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="flex-1 overflow-auto p-8 flex items-center justify-center bg-white min-h-[50vh]">
          {material.content}
        </div>
        <div className="p-4 border-t bg-gray-50 text-center text-sm text-gray-500">
          請向病人展示此畫面
        </div>
      </div>
    </div>
  );
};

const Pattern1 = () => (
  <svg width="100%" height="100%" viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="6" className="max-w-md text-gray-900">
    <rect x="40" y="80" width="120" height="40" />
    <rect x="80" y="40" width="40" height="120" />
  </svg>
);

const Pattern2 = () => (
  <svg width="100%" height="100%" viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="6" strokeLinejoin="round" className="max-w-md text-gray-900">
    <rect x="40" y="80" width="80" height="80" />
    <rect x="80" y="40" width="80" height="80" />
    <line x1="40" y1="80" x2="80" y2="40" />
    <line x1="120" y1="80" x2="160" y2="40" />
    <line x1="120" y1="160" x2="160" y2="120" />
    <line x1="40" y1="160" x2="80" y2="120" />
  </svg>
);

const Pattern3 = () => (
  <svg width="100%" height="100%" viewBox="0 0 300 200" fill="none" stroke="currentColor" strokeWidth="6" strokeLinejoin="round" className="max-w-lg text-gray-900">
    <polygon points="100,40 40,90 60,160 140,160 160,90" />
    <polygon points="200,40 140,90 160,160 240,160 260,90" />
  </svg>
);

const ScreenMetricSection = ({ title, screenLabel, screenPassed, onScreenChange, children }: any) => (
  <div className="mb-6 border border-gray-200 rounded-xl p-5 bg-white shadow-sm">
    <h3 className="text-lg font-bold text-gray-900 mb-4">{title}</h3>
    <div className="mb-2">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
        <div>
          <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded mb-2">甄別試 Screen</span>
          <p className="font-medium text-gray-800">{screenLabel}</p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => onScreenChange(true)}
            className={`px-4 py-2 rounded-md border text-sm font-medium transition-colors ${screenPassed === true ? 'bg-green-500 border-green-600 text-white shadow-sm' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}`}
          >
            合格
          </button>
          <button
            onClick={() => onScreenChange(false)}
            className={`px-4 py-2 rounded-md border text-sm font-medium transition-colors ${screenPassed === false ? 'bg-red-500 border-red-600 text-white shadow-sm' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}`}
          >
            不合格
          </button>
        </div>
      </div>
    </div>
    {screenPassed === false && (
      <div className="pt-5 mt-5 border-t border-gray-100 animate-in fade-in slide-in-from-top-2 duration-300">
        <div className="mb-4 flex items-center gap-2">
          <span className="inline-block px-2 py-1 bg-orange-100 text-orange-800 text-xs font-semibold rounded">等級試 Metric</span>
          <span className="text-sm text-gray-500">請完成以下測試項目</span>
        </div>
        <div className="bg-white border border-gray-100 rounded-lg p-2">
          {children}
        </div>
      </div>
    )}
  </div>
);

export default function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [state, setState] = useState<AppState>(initialState);
  const [material, setMaterial] = useState<{title: string, content: React.ReactNode} | null>(null);

  const updateState = (section: keyof AppState, data: any) => setState(prev => ({ ...prev, [section]: data }));
  const updatePatient = (field: string, val: string) => updateState('patient', { ...state.patient, [field]: val });
  const updateOrientation = (field: string, val: boolean) => updateState('orientation', { ...state.orientation, [field]: val });
  
  const updateAttentionMetric = (idx: number, val: boolean) => {
    const newMetric = [...state.attention.metric];
    newMetric[idx] = val;
    updateState('attention', { ...state.attention, metric: newMetric });
  };

  const updateLanguage = (field: string, val: any) => updateState('language', { ...state.language, [field]: val });
  const updateLanguageMetric = (field: 'compMetric' | 'namingMetric', idx: number, val: boolean) => {
    const newMetric = [...state.language[field]];
    newMetric[idx] = val;
    updateLanguage(field, newMetric);
  };
  const updateLanguageMetricNum = (field: 'repMetric', idx: number, val: number) => {
    const newMetric = [...state.language[field]];
    newMetric[idx] = val;
    updateLanguage(field, newMetric);
  };

  const updateConstructionMetric = (idx: number, val: number) => {
    const newMetric = [...state.construction.metric];
    newMetric[idx] = val;
    updateState('construction', { ...state.construction, metric: newMetric });
  };

  const updateMemoryWord = (idx: number, val: number) => {
    const newWords = [...state.memory.words];
    newWords[idx] = val;
    updateState('memory', { words: newWords });
  };

  const updateCalculationMetric = (idx: number, val: boolean) => {
    const newMetric = [...state.calculation.metric];
    newMetric[idx] = val;
    updateState('calculation', { ...state.calculation, metric: newMetric });
  };

  const updateReasoning = (field: string, val: any) => updateState('reasoning', { ...state.reasoning, [field]: val });
  const updateReasoningMetric = (field: 'simMetric' | 'judgMetric', idx: number, val: number) => {
    const newMetric = [...state.reasoning[field]];
    newMetric[idx] = val;
    updateReasoning(field, newMetric);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">基本資料</h2>
              <p className="text-gray-500">請填寫病人的基本資料以開始評估。</p>
            </div>
            <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-sm font-medium text-gray-700">姓名</span>
                  <input type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" value={state.patient.name} onChange={e => updatePatient('name', e.target.value)} />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-gray-700">年齡</span>
                  <input type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" value={state.patient.age} onChange={e => updatePatient('age', e.target.value)} />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-gray-700">教育程度</span>
                  <input type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" value={state.patient.education} onChange={e => updatePatient('education', e.target.value)} />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-gray-700">偏手傾向 (Handedness)</span>
                  <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border bg-white" value={state.patient.handedness} onChange={e => updatePatient('handedness', e.target.value)}>
                    <option value="">請選擇...</option>
                    <option value="right">右撇子</option>
                    <option value="left">左撇子</option>
                    <option value="ambidextrous">雙手通用</option>
                  </select>
                </label>
              </div>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-6 border border-gray-200 rounded-xl p-5 bg-white shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4">一、 意識程度 (Level of Consciousness)</h3>
              <div className="flex flex-wrap gap-4 mb-4">
                {['清醒', '呆滯', '不穩定'].map(level => (
                  <label key={level} className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="consciousness" className="w-4 h-4 text-blue-600 focus:ring-blue-500" checked={state.consciousness.level === level} onChange={() => updateState('consciousness', { ...state.consciousness, level })} />
                    <span className="text-gray-700">{level}</span>
                  </label>
                ))}
              </div>
              <textarea placeholder="具體情況描述..." className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" rows={3} value={state.consciousness.description} onChange={e => updateState('consciousness', { ...state.consciousness, description: e.target.value })} />
            </div>

            <div className="mb-6 border border-gray-200 rounded-xl p-5 bg-white shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4">二、 定向能力 (Orientation)</h3>
              
              <h4 className="font-semibold text-gray-800 mb-2 bg-gray-50 p-2 rounded">甲、人物</h4>
              <CheckboxItem label="姓名" points={0} checked={state.orientation.personName} onChange={(v: boolean) => updateOrientation('personName', v)} />
              <CheckboxItem label="年齡" points={2} checked={state.orientation.personAge} onChange={(v: boolean) => updateOrientation('personAge', v)} />

              <h4 className="font-semibold text-gray-800 mb-2 mt-6 bg-gray-50 p-2 rounded">乙、地點</h4>
              <CheckboxItem label="現時位置" points={2} checked={state.orientation.placeLocation} onChange={(v: boolean) => updateOrientation('placeLocation', v)} />
              <CheckboxItem label="區域名稱" points={2} checked={state.orientation.placeDistrict} onChange={(v: boolean) => updateOrientation('placeDistrict', v)} />

              <h4 className="font-semibold text-gray-800 mb-2 mt-6 bg-gray-50 p-2 rounded">丙、時間</h4>
              <CheckboxItem label="日期：月" points={1} checked={state.orientation.timeMonth} onChange={(v: boolean) => updateOrientation('timeMonth', v)} />
              <CheckboxItem label="日期：日" points={1} checked={state.orientation.timeDay} onChange={(v: boolean) => updateOrientation('timeDay', v)} />
              <CheckboxItem label="日期：年" points={2} checked={state.orientation.timeYear} onChange={(v: boolean) => updateOrientation('timeYear', v)} />
              <CheckboxItem label="星期" points={1} checked={state.orientation.timeDayOfWeek} onChange={(v: boolean) => updateOrientation('timeDayOfWeek', v)} />
              <CheckboxItem label="一小時內的當時時間" points={1} checked={state.orientation.timeHour} onChange={(v: boolean) => updateOrientation('timeHour', v)} />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <ScreenMetricSection
              title="三、 專注能力 (Attention)"
              screenLabel="請病人覆述數字 8-3-5-2-9-1"
              screenPassed={state.attention.screen}
              onScreenChange={(v: boolean) => updateState('attention', { ...state.attention, screen: v })}
            >
              <div className="space-y-4">
                <p className="text-sm text-gray-500 mb-2">若在覆述同一長度的一組數字時出現兩次錯誤，則停止此項測試。</p>
                <div>
                  <h5 className="font-semibold text-sm text-gray-700 mb-1 bg-gray-50 p-1 rounded">3個位</h5>
                  <CheckboxItem label="3-7-2" checked={state.attention.metric[0]} onChange={(v: boolean) => updateAttentionMetric(0, v)} />
                  <CheckboxItem label="4-9-5" checked={state.attention.metric[1]} onChange={(v: boolean) => updateAttentionMetric(1, v)} />
                </div>
                <div>
                  <h5 className="font-semibold text-sm text-gray-700 mb-1 bg-gray-50 p-1 rounded mt-2">4個位</h5>
                  <CheckboxItem label="5-1-4-9" checked={state.attention.metric[2]} onChange={(v: boolean) => updateAttentionMetric(2, v)} />
                  <CheckboxItem label="9-2-7-4" checked={state.attention.metric[3]} onChange={(v: boolean) => updateAttentionMetric(3, v)} />
                </div>
                <div>
                  <h5 className="font-semibold text-sm text-gray-700 mb-1 bg-gray-50 p-1 rounded mt-2">5個位</h5>
                  <CheckboxItem label="8-3-5-2-9" checked={state.attention.metric[4]} onChange={(v: boolean) => updateAttentionMetric(4, v)} />
                  <CheckboxItem label="6-1-7-3-8" checked={state.attention.metric[5]} onChange={(v: boolean) => updateAttentionMetric(5, v)} />
                </div>
                <div>
                  <h5 className="font-semibold text-sm text-gray-700 mb-1 bg-gray-50 p-1 rounded mt-2">6個位</h5>
                  <CheckboxItem label="2-8-5-1-6-4" checked={state.attention.metric[6]} onChange={(v: boolean) => updateAttentionMetric(6, v)} />
                  <CheckboxItem label="9-1-7-5-8-2" checked={state.attention.metric[7]} onChange={(v: boolean) => updateAttentionMetric(7, v)} />
                </div>
              </div>
            </ScreenMetricSection>

            <div className="mb-6 border rounded-xl p-5 bg-blue-50 border-blue-200 shadow-sm">
              <h3 className="text-lg font-bold mb-2 text-blue-900 flex items-center gap-2"><Activity className="w-5 h-5"/> 📌 四詞記憶測試 (註冊階段)</h3>
              <p className="mb-3 text-blue-900">在進行語言測試前，必須先讓病人記下四個詞語：<strong className="bg-blue-100 px-2 py-1 rounded">鸚鵡、蘿蔔、鋼琴、綠色</strong></p>
              <p className="text-sm text-blue-800 mb-4">病人必須正確地把這四個詞語覆述兩次。</p>
              <label className="block">
                <span className="text-blue-900 font-medium">所需練習次數：</span>
                <input type="number" className="mt-1 block w-32 rounded-md border-blue-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border bg-white" value={state.memoryReg.trials} onChange={e => updateState('memoryReg', { trials: e.target.value })} />
              </label>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-6 border border-gray-200 rounded-xl p-5 bg-white shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-bold text-gray-900">甲、看圖描述</h3>
                <button 
                  onClick={() => setMaterial({ 
                    title: '看圖描述 - 釣魚圖畫', 
                    content: <img src="https://images.unsplash.com/photo-1508182314998-3bd49473002f?auto=format&fit=crop&q=80&w=1200" alt="釣魚圖畫" className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-md" referrerPolicy="no-referrer" /> 
                  })} 
                  className="flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors text-sm font-medium"
                >
                  <ImageIcon className="w-4 h-4" /> 顯示圖片給病人
                </button>
              </div>
              <p className="text-sm text-gray-600 mb-3">向病人展示「釣魚圖畫」，要求描述，清楚正確地記錄病人的回應。</p>
              <textarea className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" rows={3} value={state.language.picDesc} onChange={e => updateLanguage('picDesc', e.target.value)}></textarea>
            </div>

            <ScreenMetricSection
              title="乙、理解能力"
              screenLabel="發出三步指令：「翻轉張紙，把原子筆遞給我跟著指著自己的鼻子。」"
              screenPassed={state.language.compScreen}
              onScreenChange={(v: boolean) => updateLanguage('compScreen', v)}
            >
              <CheckboxItem label="1. 拾起原子筆" checked={state.language.compMetric[0]} onChange={(v: boolean) => updateLanguageMetric('compMetric', 0, v)} />
              <CheckboxItem label="2. 指向地板" checked={state.language.compMetric[1]} onChange={(v: boolean) => updateLanguageMetric('compMetric', 1, v)} />
              <CheckboxItem label="3. 把鑰匙交給我" checked={state.language.compMetric[2]} onChange={(v: boolean) => updateLanguageMetric('compMetric', 2, v)} />
              <CheckboxItem label="4. 指著原子筆跟著拾起鑰匙" checked={state.language.compMetric[3]} onChange={(v: boolean) => updateLanguageMetric('compMetric', 3, v)} />
              <CheckboxItem label="5. 把張紙遞給我跟著指著硬幣" checked={state.language.compMetric[4]} onChange={(v: boolean) => updateLanguageMetric('compMetric', 4, v)} />
              <CheckboxItem label="6. 指著鑰匙、把原子筆遞給我跟著拾起硬幣" checked={state.language.compMetric[5]} onChange={(v: boolean) => updateLanguageMetric('compMetric', 5, v)} />
            </ScreenMetricSection>

            <ScreenMetricSection
              title="丙、覆述能力"
              screenLabel="請病人覆述：「第一個動作顯示了作曲家的意圖」"
              screenPassed={state.language.repScreen}
              onScreenChange={(v: boolean) => updateLanguage('repScreen', v)}
            >
              <p className="text-sm text-gray-500 mb-2">評分：第一次答對得2分，第二次答對得1分，答錯則0分。</p>
              <ScoreSelect label="1. 在窗外面" value={state.language.repMetric[0]} onChange={(v: number) => updateLanguageMetricNum('repMetric', 0, v)} options={[{value:2, label:'2'}, {value:1, label:'1'}, {value:0, label:'0'}]} />
              <ScoreSelect label="2. 他游過那個湖" value={state.language.repMetric[1]} onChange={(v: number) => updateLanguageMetricNum('repMetric', 1, v)} options={[{value:2, label:'2'}, {value:1, label:'1'}, {value:0, label:'0'}]} />
              <ScoreSelect label="3. 那彎路是通往那條村莊" value={state.language.repMetric[2]} onChange={(v: number) => updateLanguageMetricNum('repMetric', 2, v)} options={[{value:2, label:'2'}, {value:1, label:'1'}, {value:0, label:'0'}]} />
              <ScoreSelect label="4. 他讓門半掩著" value={state.language.repMetric[3]} onChange={(v: number) => updateLanguageMetricNum('repMetric', 3, v)} options={[{value:2, label:'2'}, {value:1, label:'1'}, {value:0, label:'0'}]} />
              <ScoreSelect label="5. 那蝙蝠洞擠滿了喜歡遊歷的人" value={state.language.repMetric[4]} onChange={(v: number) => updateLanguageMetricNum('repMetric', 4, v)} options={[{value:2, label:'2'}, {value:1, label:'1'}, {value:0, label:'0'}]} />
              <ScoreSelect label="6. 不是如果、和或但是" value={state.language.repMetric[5]} onChange={(v: number) => updateLanguageMetricNum('repMetric', 5, v)} options={[{value:2, label:'2'}, {value:1, label:'1'}, {value:0, label:'0'}]} />
            </ScreenMetricSection>

            <ScreenMetricSection
              title="丁、命名能力"
              screenLabel="指著原子筆的四個部分請病人命名：(i)原子筆 (ii)筆蓋/筆套 (iii)筆夾 (iv)筆尖/筆咀"
              screenPassed={state.language.namingScreen}
              onScreenChange={(v: boolean) => updateLanguage('namingScreen', v)}
            >
              <CheckboxItem label="1. 鞋" checked={state.language.namingMetric[0]} onChange={(v: boolean) => updateLanguageMetric('namingMetric', 0, v)} onShowMaterial={() => setMaterial({ title: '命名 - 鞋', content: <div className="text-[200px] leading-none">👟</div> })} />
              <CheckboxItem label="2. 馬蹄鐵" checked={state.language.namingMetric[1]} onChange={(v: boolean) => updateLanguageMetric('namingMetric', 1, v)} onShowMaterial={() => setMaterial({ title: '命名 - 馬蹄鐵', content: <div className="text-[200px] leading-none">🧲</div> })} />
              <CheckboxItem label="3. 巴士" checked={state.language.namingMetric[2]} onChange={(v: boolean) => updateLanguageMetric('namingMetric', 2, v)} onShowMaterial={() => setMaterial({ title: '命名 - 巴士', content: <div className="text-[200px] leading-none">🚌</div> })} />
              <CheckboxItem label="4. 梯子" checked={state.language.namingMetric[3]} onChange={(v: boolean) => updateLanguageMetric('namingMetric', 3, v)} onShowMaterial={() => setMaterial({ title: '命名 - 梯子', content: <div className="text-[200px] leading-none">🪜</div> })} />
              <CheckboxItem label="5. 風箏" checked={state.language.namingMetric[4]} onChange={(v: boolean) => updateLanguageMetric('namingMetric', 4, v)} onShowMaterial={() => setMaterial({ title: '命名 - 風箏', content: <div className="text-[200px] leading-none">🪁</div> })} />
              <CheckboxItem label="6. 錨" checked={state.language.namingMetric[5]} onChange={(v: boolean) => updateLanguageMetric('namingMetric', 5, v)} onShowMaterial={() => setMaterial({ title: '命名 - 錨', content: <div className="text-[200px] leading-none">⚓</div> })} />
              <CheckboxItem label="7. 八爪魚/章魚" checked={state.language.namingMetric[6]} onChange={(v: boolean) => updateLanguageMetric('namingMetric', 6, v)} onShowMaterial={() => setMaterial({ title: '命名 - 八爪魚/章魚', content: <div className="text-[200px] leading-none">🐙</div> })} />
              <CheckboxItem label="8. 楊琴" checked={state.language.namingMetric[7]} onChange={(v: boolean) => updateLanguageMetric('namingMetric', 7, v)} onShowMaterial={() => setMaterial({ title: '命名 - 楊琴', content: <div className="text-[200px] leading-none">🎹</div> })} />
            </ScreenMetricSection>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <ScreenMetricSection
              title="五、 結構組織能力 (Construction)"
              screenLabel="視覺記憶測試：觀察圖案板10秒，然後憑記憶畫出完全相同的圖案。"
              screenPassed={state.construction.screen}
              onScreenChange={(v: boolean) => updateState('construction', { ...state.construction, screen: v })}
            >
              <p className="text-sm text-gray-600 mb-4">要求病人用積木或圖卡拼出指定的圖案。<br/>評分：0-30秒(2分)；31-60秒(1分)；&gt;60秒或錯誤(0分)</p>
              <ScoreSelect label="圖案一 (兩個長方形)" value={state.construction.metric[0]} onChange={(v: number) => updateConstructionMetric(0, v)} options={[{value:2, label:'2'}, {value:1, label:'1'}, {value:0, label:'0'}]} onShowMaterial={() => setMaterial({ title: '圖案一', content: <Pattern1 /> })} />
              <ScoreSelect label="圖案二 (立體方塊)" value={state.construction.metric[1]} onChange={(v: number) => updateConstructionMetric(1, v)} options={[{value:2, label:'2'}, {value:1, label:'1'}, {value:0, label:'0'}]} onShowMaterial={() => setMaterial({ title: '圖案二', content: <Pattern2 /> })} />
              <ScoreSelect label="圖案三 (連環五邊形)" value={state.construction.metric[2]} onChange={(v: number) => updateConstructionMetric(2, v)} options={[{value:2, label:'2'}, {value:1, label:'1'}, {value:0, label:'0'}]} onShowMaterial={() => setMaterial({ title: '圖案三', content: <Pattern3 /> })} />
            </ScreenMetricSection>
          </div>
        );
      case 5:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-6 border border-gray-200 rounded-xl p-5 bg-white shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-3">六、 記憶能力 (Memory)</h3>
              <p className="text-sm text-gray-600 mb-4">要求病人回憶在第三步驟後記下的四個詞語。<br/>評分：不需要提示(3分)，需要類別提示(2分)，從目錄中選出(1分)，選擇錯誤(0分)。</p>
              <ScoreSelect label="鸚鵡 (雀鳥)" value={state.memory.words[0]} onChange={(v: number) => updateMemoryWord(0, v)} options={[{value:3, label:'3'}, {value:2, label:'2'}, {value:1, label:'1'}, {value:0, label:'0'}]} />
              <ScoreSelect label="蘿蔔 (蔬菜)" value={state.memory.words[1]} onChange={(v: number) => updateMemoryWord(1, v)} options={[{value:3, label:'3'}, {value:2, label:'2'}, {value:1, label:'1'}, {value:0, label:'0'}]} />
              <ScoreSelect label="鋼琴 (樂器)" value={state.memory.words[2]} onChange={(v: number) => updateMemoryWord(2, v)} options={[{value:3, label:'3'}, {value:2, label:'2'}, {value:1, label:'1'}, {value:0, label:'0'}]} />
              <ScoreSelect label="綠色 (顏色)" value={state.memory.words[3]} onChange={(v: number) => updateMemoryWord(3, v)} options={[{value:3, label:'3'}, {value:2, label:'2'}, {value:1, label:'1'}, {value:0, label:'0'}]} />
            </div>
          </div>
        );
      case 6:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <ScreenMetricSection
              title="七、 計算能力 (Calculation)"
              screenLabel="問病人「5 × 13」。必須在 20 秒內答對。"
              screenPassed={state.calculation.screen}
              onScreenChange={(v: boolean) => updateState('calculation', { ...state.calculation, screen: v })}
            >
              <p className="text-sm text-gray-500 mb-3">每題須在 20 秒內答對得 1 分（可重覆問題，但不會停止計時）</p>
              <CheckboxItem label="1. 5 + 3" checked={state.calculation.metric[0]} onChange={(v: boolean) => updateCalculationMetric(0, v)} />
              <CheckboxItem label="2. 15 + 7" checked={state.calculation.metric[1]} onChange={(v: boolean) => updateCalculationMetric(1, v)} />
              <CheckboxItem label="3. 39 + 3" checked={state.calculation.metric[2]} onChange={(v: boolean) => updateCalculationMetric(2, v)} />
              <CheckboxItem label="4. 31 - 8" checked={state.calculation.metric[3]} onChange={(v: boolean) => updateCalculationMetric(3, v)} />
            </ScreenMetricSection>
          </div>
        );
      case 7:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <ScreenMetricSection
              title="八甲、 類似性 (Similarities)"
              screenLabel="問「一幅畫和音樂有何相似？」(答案必須抽象，如藝術)"
              screenPassed={state.reasoning.simScreen}
              onScreenChange={(v: boolean) => updateReasoning('simScreen', v)}
            >
              <p className="text-sm text-gray-500 mb-3">評分：抽象答案得2分；部分正確得1分；答錯0分。</p>
              <ScoreSelect label="1. 玫瑰、劍蘭 (花)" value={state.reasoning.simMetric[0]} onChange={(v: number) => updateReasoningMetric('simMetric', 0, v)} options={[{value:2, label:'2'}, {value:1, label:'1'}, {value:0, label:'0'}]} />
              <ScoreSelect label="2. 的士、地鐵 (交通工具)" value={state.reasoning.simMetric[1]} onChange={(v: number) => updateReasoningMetric('simMetric', 1, v)} options={[{value:2, label:'2'}, {value:1, label:'1'}, {value:0, label:'0'}]} />
              <ScoreSelect label="3. 手錶、間尺 (量度工具)" value={state.reasoning.simMetric[2]} onChange={(v: number) => updateReasoningMetric('simMetric', 2, v)} options={[{value:2, label:'2'}, {value:1, label:'1'}, {value:0, label:'0'}]} />
              <ScoreSelect label="4. 罐頭刀、鏟 (工具)" value={state.reasoning.simMetric[3]} onChange={(v: number) => updateReasoningMetric('simMetric', 3, v)} options={[{value:2, label:'2'}, {value:1, label:'1'}, {value:0, label:'0'}]} />
            </ScreenMetricSection>

            <ScreenMetricSection
              title="八乙、 判斷能力 (Judgment)"
              screenLabel="「假如你流落在大嶼山的梅窩碼頭，但是口袋裏只有$1，你會怎樣做？」"
              screenPassed={state.reasoning.judgScreen}
              onScreenChange={(v: boolean) => updateReasoning('judgScreen', v)}
            >
              <p className="text-sm text-gray-500 mb-3">評分：答對得2分；部分答對得1分；答錯0分。</p>
              <ScoreSelect label="1. 早上8:00前一分鐘起床，記得自己要在8:00到市區出席一個重要的約會，你會怎樣做？" value={state.reasoning.judgMetric[0]} onChange={(v: number) => updateReasoningMetric('judgMetric', 0, v)} options={[{value:2, label:'2'}, {value:1, label:'1'}, {value:0, label:'0'}]} />
              <ScoreSelect label="2. 假設你在湖邊散步，看見一個2歲的小孩獨自在碼頭的盡頭玩耍，你會怎樣做？" value={state.reasoning.judgMetric[1]} onChange={(v: number) => updateReasoningMetric('judgMetric', 1, v)} options={[{value:2, label:'2'}, {value:1, label:'1'}, {value:0, label:'0'}]} />
              <ScoreSelect label="3. 假如當你回家的時候，發現一條水管爆裂，廚房被水浸，你會怎樣做？" value={state.reasoning.judgMetric[2]} onChange={(v: number) => updateReasoningMetric('judgMetric', 2, v)} options={[{value:2, label:'2'}, {value:1, label:'1'}, {value:0, label:'0'}]} />
            </ScreenMetricSection>
          </div>
        );
      case 8:
        const scores = calculateScores(state);
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">測試結果與總結</h2>
              <p className="text-gray-500">檢視各項認知範疇的得分與正常標準對比。</p>
            </div>

            <div className="bg-white p-6 rounded-xl border shadow-sm mb-6">
              <h3 className="text-lg font-semibold mb-4 border-b pb-2">臨床觀察與藥物紀錄</h3>
              <div className="space-y-4">
                <label className="block">
                  <span className="text-sm font-medium text-gray-700">目前服用藥物</span>
                  <textarea className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" rows={2} value={state.patient.medications} onChange={e => updatePatient('medications', e.target.value)}></textarea>
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-gray-700">測試過程特點 (如分心、不耐煩、視覺/聽覺受損等)</span>
                  <textarea className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" rows={3} value={state.patient.observations} onChange={e => updatePatient('observations', e.target.value)}></textarea>
                </label>
              </div>
            </div>

            <div className="bg-white p-0 rounded-xl border shadow-sm overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">認知範疇</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">得分</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">正常標準</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">狀態</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {[
                    { key: 'orientation', label: '定向能力', score: scores.orientation, max: 12 },
                    { key: 'attention', label: '專注能力', score: scores.attention, max: 8 },
                    { key: 'comprehension', label: '理解能力', score: scores.comprehension, max: 6 },
                    { key: 'repetition', label: '覆述能力', score: scores.repetition, max: 12 },
                    { key: 'naming', label: '命名能力', score: scores.naming, max: 8 },
                    { key: 'construction', label: '結構組織', score: scores.construction, max: 6 },
                    { key: 'memory', label: '記憶能力', score: scores.memory, max: 12 },
                    { key: 'calculation', label: '計算能力', score: scores.calculation, max: 4 },
                    { key: 'similarities', label: '類似性', score: scores.similarities, max: 8 },
                    { key: 'judgment', label: '判斷能力', score: scores.judgment, max: 6 },
                  ].map(item => (
                    <tr key={item.key}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.label}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-bold">{item.score}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">{item.max}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {item.score >= item.max ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">正常</span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">受損</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-md mt-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-yellow-500" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">臨床診斷重要注意事項</h3>
                  <div className="mt-2 text-sm text-yellow-700 space-y-2">
                    <p>1. <strong>年齡因素：</strong>若病人超過65歲，在測試其<strong>組織能力、記憶力及類似性</strong>時，若分數等同「輕微受損程度」一級，仍屬<strong>正常</strong>。</p>
                    <p>2. <strong>局限性：</strong>並非所有因腦部受損而導致的認知缺陷都可從 NCSE 測試出來。表示正常的分數不足以證明腦部沒有毛病，同樣地，受損的分數也不一定反映出腦部出現機能障礙。</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row font-sans">
      <MaterialModal material={material} onClose={() => setMaterial(null)} />
      <div className="w-full md:w-64 bg-white border-r shadow-sm p-4 hidden md:block">
        <h1 className="text-xl font-bold text-blue-900 mb-6 flex items-center gap-2"><Brain className="w-6 h-6"/> NCSE 評估</h1>
        <nav className="space-y-1">
          {steps.map(step => (
            <button
              key={step.id}
              onClick={() => setCurrentStep(step.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${currentStep === step.id ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <step.icon className="w-5 h-5" />
              {step.title}
            </button>
          ))}
        </nav>
      </div>

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <div className="md:hidden bg-white border-b p-4 flex items-center justify-between">
          <h1 className="text-lg font-bold text-blue-900 flex items-center gap-2"><Brain className="w-5 h-5"/> NCSE 評估</h1>
          <span className="text-sm font-medium text-gray-500">步驟 {currentStep + 1} / {steps.length}</span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-3xl mx-auto">
            {renderStep()}

            <div className="mt-8 flex justify-between pt-6 border-t">
              <button
                onClick={() => setCurrentStep(p => Math.max(0, p - 1))}
                disabled={currentStep === 0}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded-md hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" /> 上一步
              </button>
              <button
                onClick={() => setCurrentStep(p => Math.min(steps.length - 1, p + 1))}
                disabled={currentStep === steps.length - 1}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                下一步 <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
