
interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Header({ activeTab, onTabChange }: HeaderProps) {
  const tabs = [
    { id: 'home', label: 'الرئيسية' },
    { id: 'calculator', label: 'حاسبة الميراث' },
    { id: 'estate', label: 'إدارة التركات' },
    { id: 'properties', label: 'عقارات للبيع' },
  ];

  return (
    <header className="bg-white border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <img 
              src={"../assets/sila-logo.png"} 
              alt="شعار صلة" 
              className="w-14 h-14 object-contain"
            />
            <div>
              <h1 className="text-2xl text-emerald-700">صلة</h1>
              <p className="text-xs text-muted-foreground">المذهب المالكي • القانون الجزائري</p>
            </div>
          </div>
        </div>
        
        {/* Navigation Tabs */}
        <nav className="flex gap-1 -mb-px overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`px-6 py-3 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-emerald-600 text-emerald-700'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}