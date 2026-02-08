import { useState } from "react";
import { Header } from "./components/Header";
import { HomePage } from "./components/HomePage";
import { InheritanceCalculatorAdvanced } from "./components/InheritanceCalculatorAdvanced";
import { EstateManagement } from "./components/EstateManagement";
import { PropertiesForSale } from "./components/PropertiesForSale";

export default function App() {
  const [activeTab, setActiveTab] = useState("home");

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return <HomePage onNavigate={setActiveTab} />;
      case "calculator":
        return <InheritanceCalculatorAdvanced />;
      case "estate":
        return <EstateManagement />;
      case "properties":
        return <PropertiesForSale />;
      default:
        return <HomePage onNavigate={setActiveTab} />;
    }
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-gray-50 to-white"
      dir="rtl"
    >
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {renderContent()}
      </main>

      <footer className="mt-16 py-8 border-t border-border bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-6">
            <div>
              <h4 className="mb-3 text-emerald-700">عن صلة</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                تطبيق متكامل لحساب الميراث وإدارة التركات وفق
                المذهب المالكي والقانون الجزائري
              </p>
            </div>
            <div>
              <h4 className="mb-3 text-emerald-700">
                روابط مهمة
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <button
                    onClick={() => setActiveTab("calculator")}
                    className="hover:text-emerald-600"
                  >
                    حاسبة الميراث
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab("estate")}
                    className="hover:text-emerald-600"
                  >
                    إدارة التركات
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab("properties")}
                    className="hover:text-emerald-600"
                  >
                    عقارات للبيع
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-3 text-emerald-700">
                الأساس القانوني
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• المذهب المالكي في الفرائض</li>
                <li>• قانون الأسرة الجزائري (84-11)</li>
                <li>• القانون المدني الجزائري</li>
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t border-border text-center">
            <p className="text-sm text-muted-foreground">
              © 2026 صلة - جميع الحقوق محفوظة | Application
              Sila - Tous droits réservés
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              هذا التطبيق أداة مساعدة ولا يغني عن استشارة
              المختصين الشرعيين والقانونيين
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}