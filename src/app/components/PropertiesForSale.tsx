import { useState } from 'react';
import { Building2, MapPin, Bed, Bath, Square, Phone, Mail, Filter } from 'lucide-react';

interface Property {
  id: string;
  title: string;
  type: 'apartment' | 'house' | 'land' | 'commercial';
  price: number;
  location: string;
  area: number;
  bedrooms?: number;
  bathrooms?: number;
  description: string;
  features: string[];
  contact: {
    phone: string;
    email: string;
  };
}

export function PropertiesForSale() {
  const [selectedType, setSelectedType] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<string>('all');

  // بيانات وهمية للعقارات
  const properties: Property[] = [
    {
      id: '1',
      title: 'شقة فاخرة في وهران',
      type: 'apartment',
      price: 8500000,
      location: 'وهران، حي السلام',
      area: 120,
      bedrooms: 3,
      bathrooms: 2,
      description: 'شقة فاخرة مكونة من 3 غرف نوم وصالون واسع ومطبخ مجهز بالكامل',
      features: ['موقف سيارات', 'مصعد', 'شرفة واسعة', 'قريبة من المدارس'],
      contact: {
        phone: '+213 555 123 456',
        email: 'contact@exemple.dz',
      },
    },
    {
      id: '2',
      title: 'فيلا راقية في الجزائر العاصمة',
      type: 'house',
      price: 45000000,
      location: 'الجزائر العاصمة، حيدرة',
      area: 350,
      bedrooms: 5,
      bathrooms: 4,
      description: 'فيلا راقية بطابقين مع حديقة وموقف سيارات',
      features: ['حديقة خاصة', 'موقف 3 سيارات', 'مسبح', 'أمن 24/7'],
      contact: {
        phone: '+213 555 234 567',
        email: 'villas@exemple.dz',
      },
    },
    {
      id: '3',
      title: 'أرض للبناء في قسنطينة',
      type: 'land',
      price: 12000000,
      location: 'قسنطينة، الخروب',
      area: 500,
      description: 'أرض للبناء في موقع استراتيجي بالقرب من الطريق السريع',
      features: ['قابلة للبناء', 'كل المرافق متوفرة', 'موقع استراتيجي'],
      contact: {
        phone: '+213 555 345 678',
        email: 'terrains@exemple.dz',
      },
    },
    {
      id: '4',
      title: 'محل تجاري في عنابة',
      type: 'commercial',
      price: 15000000,
      location: 'عنابة، وسط المدينة',
      area: 80,
      description: 'محل تجاري في موقع حيوي وسط المدينة مناسب لجميع الأنشطة',
      features: ['واجهة زجاجية', 'موقع حيوي', 'مساحة تخزين'],
      contact: {
        phone: '+213 555 456 789',
        email: 'commercial@exemple.dz',
      },
    },
  ];

  const propertyTypes = [
    { value: 'all', label: 'الكل / Tous' },
    { value: 'apartment', label: 'شقة / Appartement' },
    { value: 'house', label: 'فيلا / Villa' },
    { value: 'land', label: 'أرض / Terrain' },
    { value: 'commercial', label: 'تجاري / Commercial' },
  ];

  const priceRanges = [
    { value: 'all', label: 'كل الأسعار' },
    { value: '0-10', label: 'أقل من 10 مليون' },
    { value: '10-20', label: '10 - 20 مليون' },
    { value: '20-50', label: '20 - 50 مليون' },
    { value: '50+', label: 'أكثر من 50 مليون' },
  ];

  const filteredProperties = properties.filter(property => {
    const typeMatch = selectedType === 'all' || property.type === selectedType;
    
    let priceMatch = true;
    if (priceRange !== 'all') {
      const price = property.price / 1000000;
      if (priceRange === '0-10') priceMatch = price < 10;
      else if (priceRange === '10-20') priceMatch = price >= 10 && price < 20;
      else if (priceRange === '20-50') priceMatch = price >= 20 && price < 50;
      else if (priceRange === '50+') priceMatch = price >= 50;
    }
    
    return typeMatch && priceMatch;
  });

  const getPropertyTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      apartment: 'شقة',
      house: 'فيلا',
      land: 'أرض',
      commercial: 'تجاري',
    };
    return labels[type] || type;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-l from-amber-50 to-white rounded-xl p-6 border border-amber-100">
        <div className="flex items-center gap-3 mb-3">
          <Building2 className="w-8 h-8 text-amber-600" />
          <div>
            <h2 className="text-2xl text-amber-900">عقارات للبيع من التركات</h2>
            <p className="text-sm text-muted-foreground">Biens immobiliers à vendre issus de successions</p>
          </div>
        </div>
        <p className="text-sm text-amber-800">
          تصفح العقارات المعروضة للبيع من التركات بأسعار مناسبة ومواقع متميزة
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-border p-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-emerald-600" />
          <h3>الفلاتر / Filtres</h3>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-3 text-sm">نوع العقار / Type de bien</label>
            <div className="grid grid-cols-2 gap-2">
              {propertyTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setSelectedType(type.value)}
                  className={`py-2 px-4 rounded-lg border-2 transition-all text-sm ${
                    selectedType === type.value
                      ? 'bg-emerald-50 border-emerald-600 text-emerald-700'
                      : 'bg-white border-border hover:bg-accent'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block mb-3 text-sm">نطاق السعر / Fourchette de prix</label>
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border-2 border-border bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {priceRanges.map((range) => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Properties Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {filteredProperties.length} عقار متاح / {filteredProperties.length} biens disponibles
        </p>
      </div>

      {/* Properties Grid */}
      {filteredProperties.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-6">
          {filteredProperties.map((property) => (
            <div
              key={property.id}
              className="bg-white rounded-xl border border-border overflow-hidden hover:shadow-xl transition-shadow"
            >
              {/* Property Image Placeholder */}
              <div className="h-48 bg-gradient-to-br from-emerald-100 to-emerald-50 flex items-center justify-center">
                <Building2 className="w-16 h-16 text-emerald-300" />
              </div>

              <div className="p-6">
                {/* Title and Type */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="mb-1">{property.title}</h4>
                    <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs">
                      {getPropertyTypeLabel(property.type)}
                    </span>
                  </div>
                </div>

                {/* Price */}
                <div className="mb-4">
                  <p className="text-2xl text-emerald-700">
                    {property.price.toLocaleString('fr-DZ')} DA
                  </p>
                </div>

                {/* Location */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                  <MapPin className="w-4 h-4" />
                  <span>{property.location}</span>
                </div>

                {/* Property Details */}
                <div className="flex items-center gap-4 mb-4 pb-4 border-b border-border">
                  <div className="flex items-center gap-2 text-sm">
                    <Square className="w-4 h-4 text-muted-foreground" />
                    <span>{property.area} م²</span>
                  </div>
                  {property.bedrooms && (
                    <div className="flex items-center gap-2 text-sm">
                      <Bed className="w-4 h-4 text-muted-foreground" />
                      <span>{property.bedrooms}</span>
                    </div>
                  )}
                  {property.bathrooms && (
                    <div className="flex items-center gap-2 text-sm">
                      <Bath className="w-4 h-4 text-muted-foreground" />
                      <span>{property.bathrooms}</span>
                    </div>
                  )}
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground mb-4">
                  {property.description}
                </p>

                {/* Features */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {property.features.map((feature, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                {/* Contact */}
                <div className="pt-4 border-t border-border space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-emerald-600" />
                    <a href={`tel:${property.contact.phone}`} className="text-emerald-600 hover:underline">
                      {property.contact.phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-emerald-600" />
                    <a href={`mailto:${property.contact.email}`} className="text-emerald-600 hover:underline">
                      {property.contact.email}
                    </a>
                  </div>
                </div>

                {/* Action Button */}
                <button className="w-full mt-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                  تواصل الآن / Contacter maintenant
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-xl p-12 text-center border-2 border-dashed border-gray-300">
          <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-muted-foreground mb-2">لا توجد عقارات متطابقة مع الفلاتر المحددة</p>
          <p className="text-sm text-muted-foreground">جرب تغيير معايير البحث</p>
        </div>
      )}

      {/* Info Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <p className="text-sm text-blue-900">
          <strong>ملاحظة:</strong> جميع العقارات المعروضة هنا هي من تركات تم تقسيمها وفق الشريعة الإسلامية والقانون الجزائري. 
          للاستفسار والمزيد من المعلومات، يرجى الاتصال بالأرقام المذكورة.
        </p>
      </div>
    </div>
  );
}
