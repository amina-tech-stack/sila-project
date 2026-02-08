import { Calculator, Building2, FileText, Scale, CheckCircle2 } from 'lucide-react';

interface HomePageProps {
  onNavigate: (tab: string) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  const features = [
    {
      icon: Calculator,
      title: 'حاسبة الميراث',
      description: 'احسب الأنصبة الشرعية للورثة وفق المذهب المالكي والقانون الجزائري',
      color: 'bg-emerald-100 text-emerald-700',
      action: () => onNavigate('calculator'),
    },
    {
      icon: FileText,
      title: 'إدارة التركات',
      description: 'سجل وأدر الأموال والممتلكات والعقارات الخاصة بالتركة',
      color: 'bg-blue-100 text-blue-700',
      action: () => onNavigate('estate'),
    },
    {
      icon: Building2,
      title: 'عقارات للبيع',
      description: 'تصفح العقارات المعروضة للبيع من التركات',
      color: 'bg-amber-100 text-amber-700',
      action: () => onNavigate('properties'),
    },
  ];

  const legalBasis = [
    'توافق تام مع أحكام المذهب المالكي في الفرائض',
    'مطابقة لقانون الأسرة الجزائري (الأمر رقم 84-11)',
    'مراعاة أحكام الرد والعصبة والحجب',
    'دعم كامل لجميع حالات الإرث',
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-l from-emerald-50 to-white rounded-2xl p-8 border border-emerald-100">
        <div className="max-w-3xl">
          <h2 className="text-3xl mb-3 text-emerald-800">مرحباً بك في تطبيق صلة</h2>
          <p className="text-lg text-muted-foreground mb-6">
            منصة متكاملة لحساب الميراث وإدارة التركات وفق المذهب المالكي والقانون الجزائري
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => onNavigate('calculator')}
              className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              ابدأ الحساب الآن
            </button>
            <button
              onClick={() => onNavigate('estate')}
              className="px-6 py-3 border border-border rounded-lg hover:bg-accent transition-colors"
            >
              إدارة التركة
            </button>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <button
              key={index}
              onClick={feature.action}
              className="bg-white rounded-xl p-6 border border-border hover:shadow-lg transition-all text-right group"
            >
              <div className={`w-14 h-14 ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <Icon className="w-7 h-7" />
              </div>
              <h3 className="mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </button>
          );
        })}
      </div>

      {/* Legal Compliance */}
      <div className="bg-white rounded-xl p-6 border border-border">
        <div className="flex items-center gap-2 mb-4">
          <Scale className="w-6 h-6 text-emerald-600" />
          <h3>الأساس الشرعي والقانوني</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {legalBasis.map((item, index) => (
            <div key={index} className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-muted-foreground">{item}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Important Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
        <h4 className="text-amber-900 mb-2">تنويه قانوني</h4>
        <p className="text-sm text-amber-800 leading-relaxed">
          هذا التطبيق أداة مساعدة لحساب الميراث وإدارة التركات. للحالات المعقدة والإجراءات الرسمية، 
          يُنصح بمراجعة موثق معتمد أو محامي متخصص في قضايا الميراث، والرجوع إلى عالم شرعي 
          للتأكد من صحة التقسيم الشرعي.
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-6 border border-border text-center">
          <p className="text-3xl text-emerald-600 mb-1">100%</p>
          <p className="text-sm text-muted-foreground">مطابقة شرعية</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-border text-center">
          <p className="text-3xl text-blue-600 mb-1">دقيق</p>
          <p className="text-sm text-muted-foreground">حسابات دقيقة</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-border text-center">
          <p className="text-3xl text-amber-600 mb-1">سهل</p>
          <p className="text-sm text-muted-foreground">واجهة بسيطة</p>
        </div>
      </div>
    </div>
  );
}
