import { useState } from 'react';
import { Users, Calculator, Share2, FileText, AlertCircle } from 'lucide-react';

interface Heir {
  id: string;
  relation: string;
  gender: 'male' | 'female';
  count: number;
  name?: string;
}

interface InheritanceResult {
  heir: Heir;
  fraction: string;
  percentage: number;
  amount: number;
  explanation: string;
}

export function InheritanceCalculatorAdvanced() {
  const [deceasedGender, setDeceasedGender] = useState<'male' | 'female'>('male');
  const [estate, setEstate] = useState<string>('');
  const [heirs, setHeirs] = useState<Heir[]>([]);
  const [results, setResults] = useState<InheritanceResult[]>([]);
  const [showResults, setShowResults] = useState(false);

  const heirRelations = [
    { value: 'son', label: 'ابن / Fils', gender: 'male', category: 'أبناء' },
    { value: 'daughter', label: 'بنت / Fille', gender: 'female', category: 'أبناء' },
    { value: 'father', label: 'أب / Père', gender: 'male', category: 'أصول' },
    { value: 'mother', label: 'أم / Mère', gender: 'female', category: 'أصول' },
    { value: 'husband', label: 'زوج / Mari', gender: 'male', category: 'زوجية' },
    { value: 'wife', label: 'زوجة / Épouse', gender: 'female', category: 'زوجية' },
    { value: 'brother', label: 'أخ شقيق / Frère germain', gender: 'male', category: 'إخوة' },
    { value: 'sister', label: 'أخت شقيقة / Sœur germaine', gender: 'female', category: 'إخوة' },
    { value: 'half_brother', label: 'أخ لأب / Frère consanguin', gender: 'male', category: 'إخوة' },
    { value: 'half_sister', label: 'أخت لأب / Sœur consanguine', gender: 'female', category: 'إخوة' },
    { value: 'grandfather', label: 'جد / Grand-père', gender: 'male', category: 'أصول' },
    { value: 'grandmother', label: 'جدة / Grand-mère', gender: 'female', category: 'أصول' },
  ];

  const addHeir = (relation: string, gender: 'male' | 'female') => {
    const newHeir: Heir = {
      id: Math.random().toString(36).substr(2, 9),
      relation,
      gender,
      count: 1,
    };
    setHeirs([...heirs, newHeir]);
  };

  const removeHeir = (id: string) => {
    setHeirs(heirs.filter(heir => heir.id !== id));
  };

  const updateHeirCount = (id: string, count: number) => {
    setHeirs(heirs.map(heir => 
      heir.id === id ? { ...heir, count: Math.max(1, count) } : heir
    ));
  };

  const calculateInheritance = () => {
    if (!estate || heirs.length === 0) return;

    const estateValue = parseFloat(estate);
    const calculatedResults: InheritanceResult[] = [];
    
    const hasChildren = heirs.some(h => h.relation === 'son' || h.relation === 'daughter');
    const hasSons = heirs.some(h => h.relation === 'son');
    const hasFather = heirs.some(h => h.relation === 'father');
    const hasMother = heirs.some(h => h.relation === 'mother');
    const hasSpouse = heirs.some(h => h.relation === 'husband' || h.relation === 'wife');
    const hasBrothers = heirs.some(h => h.relation === 'brother' || h.relation === 'half_brother');
    
    let remainingEstate = estateValue;
    let tempResults: InheritanceResult[] = [];

    // 1. الزوج أو الزوجة
    const spouse = heirs.find(h => h.relation === 'husband' || h.relation === 'wife');
    if (spouse) {
      let spouseFraction = 0;
      let fractionText = '';
      let explanation = '';
      
      if (spouse.relation === 'husband') {
        if (hasChildren) {
          spouseFraction = 0.25;
          fractionText = '1/4 (الربع)';
          explanation = 'نصيب الزوج الربع لوجود فرع وارث (المادة 150 من قانون الأسرة)';
        } else {
          spouseFraction = 0.5;
          fractionText = '1/2 (النصف)';
          explanation = 'نصيب الزوج النصف لعدم وجود فرع وارث';
        }
      } else {
        if (hasChildren) {
          spouseFraction = 0.125;
          fractionText = '1/8 (الثمن)';
          explanation = 'نصيب الزوجة الثمن لوجود فرع وارث (المادة 151 من قانون الأسرة)';
        } else {
          spouseFraction = 0.25;
          fractionText = '1/4 (الربع)';
          explanation = 'نصيب الزوجة الربع لعدم وجود فرع وارث';
        }
      }
      
      const amount = estateValue * spouseFraction;
      tempResults.push({
        heir: spouse,
        fraction: fractionText,
        percentage: spouseFraction * 100,
        amount,
        explanation,
      });
      remainingEstate -= amount;
    }

    // 2. الأم
    const mother = heirs.find(h => h.relation === 'mother');
    if (mother) {
      let motherFraction = 0;
      let fractionText = '';
      let explanation = '';
      
      if (hasChildren || (hasBrothers && heirs.filter(h => h.relation === 'brother' || h.relation === 'half_brother').length >= 2)) {
        motherFraction = 1/6;
        fractionText = '1/6 (السدس)';
        explanation = 'نصيب الأم السدس لوجود فرع وارث أو جمع من الإخوة (المادة 148 من قانون الأسرة)';
      } else {
        motherFraction = 1/3;
        fractionText = '1/3 (الثلث)';
        explanation = 'نصيب الأم الثلث لعدم وجود فرع وارث ولا جمع من الإخوة';
      }
      
      const amount = estateValue * motherFraction;
      tempResults.push({
        heir: mother,
        fraction: fractionText,
        percentage: motherFraction * 100,
        amount,
        explanation,
      });
      remainingEstate -= amount;
    }

    // 3. الأب
    const father = heirs.find(h => h.relation === 'father');
    if (father) {
      let fatherFraction = 0;
      let fractionText = '';
      let explanation = '';
      let amount = 0;
      
      if (hasChildren) {
        fatherFraction = 1/6;
        fractionText = '1/6 (السدس)';
        amount = estateValue * fatherFraction;
        explanation = 'نصيب الأب السدس فرضاً لوجود فرع وارث (المادة 147 من قانون الأسرة)';
        remainingEstate -= amount;
      } else {
        fractionText = 'الباقي تعصيباً';
        amount = remainingEstate;
        explanation = 'الأب يأخذ الباقي تعصيباً لعدم وجود فرع وارث';
        remainingEstate = 0;
      }
      
      tempResults.push({
        heir: father,
        fraction: fractionText,
        percentage: (amount / estateValue) * 100,
        amount,
        explanation,
      });
    }

    // 4. الأبناء والبنات
    const sons = heirs.filter(h => h.relation === 'son');
    const daughters = heirs.filter(h => h.relation === 'daughter');
    
    if ((sons.length > 0 || daughters.length > 0) && remainingEstate > 0) {
      const totalSons = sons.reduce((sum, s) => sum + s.count, 0);
      const totalDaughters = daughters.reduce((sum, d) => sum + d.count, 0);
      
      // للذكر مثل حظ الأنثيين
      const shares = totalSons * 2 + totalDaughters;
      const shareValue = remainingEstate / shares;
      
      sons.forEach(son => {
        const amount = shareValue * 2 * son.count;
        tempResults.push({
          heir: son,
          fraction: 'عصبة (للذكر مثل حظ الأنثيين)',
          percentage: (amount / estateValue) * 100,
          amount,
          explanation: 'الابن يرث بالتعصيب، للذكر مثل حظ الأنثيين (المادة 144 من قانون الأسرة)',
        });
      });
      
      daughters.forEach(daughter => {
        const amount = shareValue * daughter.count;
        let fractionText = 'عصبة مع الابن';
        let explanation = 'البنت ترث مع الابن بالتعصيب، للذكر مثل حظ الأنثيين';
        
        if (totalSons === 0) {
          if (totalDaughters === 1) {
            fractionText = '1/2 (النصف)';
            explanation = 'البنت الواحدة ترث النصف فرضاً (المادة 145 من قانون الأسرة)';
          } else {
            fractionText = '2/3 (الثلثان)';
            explanation = 'البنتان فأكثر يرثن الثلثين فرضاً';
          }
        }
        
        tempResults.push({
          heir: daughter,
          fraction: fractionText,
          percentage: (amount / estateValue) * 100,
          amount,
          explanation,
        });
      });
      
      remainingEstate = 0;
    }

    // 5. الإخوة والأخوات (إذا لم يكن هناك فرع وارث ولا أب)
    if (!hasChildren && !hasFather && remainingEstate > 0) {
      const brothers = heirs.filter(h => h.relation === 'brother' || h.relation === 'half_brother');
      const sisters = heirs.filter(h => h.relation === 'sister' || h.relation === 'half_sister');
      
      if (brothers.length > 0 || sisters.length > 0) {
        const totalBrothers = brothers.reduce((sum, b) => sum + b.count, 0);
        const totalSisters = sisters.reduce((sum, s) => sum + s.count, 0);
        
        const shares = totalBrothers * 2 + totalSisters;
        const shareValue = remainingEstate / shares;
        
        brothers.forEach(brother => {
          const amount = shareValue * 2 * brother.count;
          const label = brother.relation === 'brother' ? 'شقيق' : 'لأب';
          tempResults.push({
            heir: brother,
            fraction: `عصبة (${label})`,
            percentage: (amount / estateValue) * 100,
            amount,
            explanation: `الأخ ${label} يرث بالتعصيب لعدم وجود فرع وارث ولا أب`,
          });
        });
        
        sisters.forEach(sister => {
          const amount = shareValue * sister.count;
          const label = sister.relation === 'sister' ? 'شقيقة' : 'لأب';
          tempResults.push({
            heir: sister,
            fraction: `عصبة مع الأخ (${label})`,
            percentage: (amount / estateValue) * 100,
            amount,
            explanation: `الأخت ${label} ترث مع الأخ بالتعصيب`,
          });
        });
        
        remainingEstate = 0;
      }
    }

    setResults(tempResults);
    setShowResults(true);
  };

  const resetCalculator = () => {
    setHeirs([]);
    setResults([]);
    setShowResults(false);
    setEstate('');
  };

  const groupedRelations = heirRelations.reduce((acc, relation) => {
    if (!acc[relation.category]) {
      acc[relation.category] = [];
    }
    acc[relation.category].push(relation);
    return acc;
  }, {} as Record<string, typeof heirRelations>);

  return (
    <div className="space-y-6">
      {!showResults ? (
        <>
          {/* معلومات المتوفى */}
          <div className="bg-white rounded-xl border border-border p-6">
            <div className="flex items-center gap-2 mb-6">
              <Users className="w-5 h-5 text-emerald-600" />
              <h2>معلومات المتوفى / Informations du défunt</h2>
            </div>
            
            <div className="space-y-5">
              <div>
                <label className="block mb-3">جنس المتوفى / Sexe du défunt</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setDeceasedGender('male')}
                    className={`py-4 px-4 rounded-lg border-2 transition-all ${
                      deceasedGender === 'male'
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-700'
                        : 'bg-white border-border hover:bg-accent'
                    }`}
                  >
                    <div className="text-center">
                      <div className="mb-1">ذكر</div>
                      <div className="text-xs text-muted-foreground">Masculin</div>
                    </div>
                  </button>
                  <button
                    onClick={() => setDeceasedGender('female')}
                    className={`py-4 px-4 rounded-lg border-2 transition-all ${
                      deceasedGender === 'female'
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-700'
                        : 'bg-white border-border hover:bg-accent'
                    }`}
                  >
                    <div className="text-center">
                      <div className="mb-1">أنثى</div>
                      <div className="text-xs text-muted-foreground">Féminin</div>
                    </div>
                  </button>
                </div>
              </div>

              <div>
                <label className="block mb-3">قيمة التركة / Valeur de la succession (DA)</label>
                <input
                  type="number"
                  value={estate}
                  onChange={(e) => setEstate(e.target.value)}
                  placeholder="أدخل قيمة التركة بالدينار الجزائري"
                  className="w-full px-4 py-4 rounded-lg border-2 border-border bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
                <p className="text-sm text-muted-foreground mt-2">
                  * يتم الحساب بالدينار الجزائري (DA)
                </p>
              </div>
            </div>
          </div>

          {/* إضافة الورثة */}
          <div className="bg-white rounded-xl border border-border p-6">
            <div className="flex items-center gap-2 mb-6">
              <Share2 className="w-5 h-5 text-emerald-600" />
              <h2>الورثة / Héritiers</h2>
            </div>

            <div className="space-y-6">
              {Object.entries(groupedRelations).map(([category, relations]) => (
                <div key={category}>
                  <h3 className="text-sm text-muted-foreground mb-3">{category}</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {relations.map((relation) => (
                      <button
                        key={relation.value}
                        onClick={() => addHeir(relation.value, relation.gender as 'male' | 'female')}
                        className="py-3 px-4 rounded-lg border-2 border-border bg-white hover:bg-emerald-50 hover:border-emerald-300 transition-all text-sm"
                      >
                        {relation.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              {heirs.length > 0 && (
                <div className="mt-6 pt-6 border-t border-border space-y-3">
                  <h3 className="text-sm text-muted-foreground mb-4">الورثة المضافون:</h3>
                  {heirs.map((heir) => {
                    const relation = heirRelations.find(r => r.value === heir.relation);
                    return (
                      <div
                        key={heir.id}
                        className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-lg"
                      >
                        <span className="flex-1">{relation?.label}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">العدد:</span>
                          <input
                            type="number"
                            min="1"
                            value={heir.count}
                            onChange={(e) => updateHeirCount(heir.id, parseInt(e.target.value) || 1)}
                            className="w-20 px-3 py-2 rounded-lg border-2 border-border bg-white text-center focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          />
                        </div>
                        <button
                          onClick={() => removeHeir(heir.id)}
                          className="text-red-600 hover:text-red-700 px-3 py-1 rounded hover:bg-red-50 transition-colors"
                        >
                          حذف
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* ملاحظة قانونية */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-900">
              <p className="font-medium mb-1">ملاحظة / Note</p>
              <p>الحساب وفق المذهب المالكي وأحكام قانون الأسرة الجزائري (الأمر 84-11 المعدل والمتمم)</p>
            </div>
          </div>

          {/* زر الحساب */}
          <button
            onClick={calculateInheritance}
            disabled={!estate || heirs.length === 0}
            className="w-full py-5 px-6 bg-gradient-to-l from-emerald-600 to-emerald-700 text-white rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg shadow-emerald-200"
          >
            <Calculator className="w-6 h-6" />
            <span className="text-lg">احسب الميراث / Calculer l'héritage</span>
          </button>
        </>
      ) : (
        <>
          {/* النتائج */}
          <div className="bg-white rounded-xl border border-border p-6">
            <div className="flex items-center gap-2 mb-6">
              <FileText className="w-5 h-5 text-emerald-600" />
              <h2>نتائج التوزيع / Résultats de la répartition</h2>
            </div>
            
            <div className="space-y-6">
              <div className="p-6 bg-gradient-to-l from-emerald-50 to-white border border-emerald-200 rounded-xl">
                <p className="text-sm text-emerald-700 mb-2">قيمة التركة الإجمالية / Valeur totale</p>
                <p className="text-3xl text-emerald-800">{parseFloat(estate).toLocaleString('fr-DZ')} DA</p>
              </div>

              <div className="space-y-4">
                {results.map((result, index) => {
                  const relation = heirRelations.find(r => r.value === result.heir.relation);
                  return (
                    <div key={index} className="p-5 border-2 border-border rounded-xl hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <p className="font-medium text-lg mb-1">{relation?.label}</p>
                          {result.heir.count > 1 && (
                            <p className="text-sm text-muted-foreground">
                              العدد: {result.heir.count} | Nombre: {result.heir.count}
                            </p>
                          )}
                          <p className="text-sm text-muted-foreground mt-2">
                            {result.fraction}
                          </p>
                        </div>
                        <div className="text-left">
                          <p className="text-xl text-emerald-700 mb-1">
                            {result.amount.toLocaleString('fr-DZ')} DA
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {result.percentage.toFixed(2)}%
                          </p>
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-l from-emerald-500 to-emerald-600 transition-all"
                            style={{ width: `${result.percentage}%` }}
                          />
                        </div>
                      </div>
                      
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p className="text-xs text-blue-800">
                          <strong>الأساس الشرعي:</strong> {result.explanation}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-900">
                <p className="font-medium mb-2">تنبيه هام / Avertissement important</p>
                <p>
                  هذه النتائج استرشادية. للتوثيق الرسمي، يجب مراجعة موثق معتمد (Notaire) وعالم شرعي متخصص.
                </p>
              </div>
            </div>
          </div>

          {/* أزرار الإجراءات */}
          <div className="flex gap-4">
            <button
              onClick={resetCalculator}
              className="flex-1 py-4 px-6 border-2 border-border rounded-xl hover:bg-accent transition-colors"
            >
              حساب جديد / Nouveau calcul
            </button>
            <button
              onClick={() => window.print()}
              className="flex-1 py-4 px-6 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
            >
              طباعة / Imprimer
            </button>
          </div>
        </>
      )}
    </div>
  );
}
