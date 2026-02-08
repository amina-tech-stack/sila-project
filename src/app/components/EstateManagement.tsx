import { useState } from 'react';
import { Plus, Home, Car, Coins, Briefcase, Trash2, Edit2, Building2 } from 'lucide-react';

interface Asset {
  id: string;
  type: 'real_estate' | 'vehicle' | 'cash' | 'other';
  name: string;
  description: string;
  value: number;
  location?: string;
}

export function EstateManagement() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [formData, setFormData] = useState({
    type: 'real_estate' as Asset['type'],
    name: '',
    description: '',
    value: '',
    location: '',
  });

  const assetTypes = [
    { value: 'real_estate', label: 'عقار / Bien immobilier', icon: Home, color: 'text-blue-600' },
    { value: 'vehicle', label: 'مركبة / Véhicule', icon: Car, color: 'text-purple-600' },
    { value: 'cash', label: 'أموال نقدية / Liquidités', icon: Coins, color: 'text-amber-600' },
    { value: 'other', label: 'أخرى / Autres', icon: Briefcase, color: 'text-gray-600' },
  ];

  const handleAddAsset = () => {
    if (!formData.name || !formData.value) return;

    const newAsset: Asset = {
      id: Math.random().toString(36).substr(2, 9),
      type: formData.type,
      name: formData.name,
      description: formData.description,
      value: parseFloat(formData.value),
      location: formData.location,
    };

    if (editingAsset) {
      setAssets(assets.map(a => a.id === editingAsset.id ? { ...newAsset, id: editingAsset.id } : a));
      setEditingAsset(null);
    } else {
      setAssets([...assets, newAsset]);
    }

    setFormData({
      type: 'real_estate',
      name: '',
      description: '',
      value: '',
      location: '',
    });
    setShowAddForm(false);
  };

  const handleEditAsset = (asset: Asset) => {
    setEditingAsset(asset);
    setFormData({
      type: asset.type,
      name: asset.name,
      description: asset.description,
      value: asset.value.toString(),
      location: asset.location || '',
    });
    setShowAddForm(true);
  };

  const handleDeleteAsset = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا العنصر؟')) {
      setAssets(assets.filter(a => a.id !== id));
    }
  };

  const totalValue = assets.reduce((sum, asset) => sum + asset.value, 0);
  const assetsByType = assetTypes.map(type => ({
    ...type,
    count: assets.filter(a => a.type === type.value).length,
    total: assets.filter(a => a.type === type.value).reduce((sum, a) => sum + a.value, 0),
  }));

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-6 text-white">
          <p className="text-sm opacity-90 mb-1">القيمة الإجمالية</p>
          <p className="text-2xl mb-1">{totalValue.toLocaleString('fr-DZ')} DA</p>
          <p className="text-xs opacity-75">Valeur totale</p>
        </div>
        {assetsByType.slice(0, 3).map((type) => {
          const Icon = type.icon;
          return (
            <div key={type.value} className="bg-white rounded-xl p-6 border border-border">
              <div className="flex items-center justify-between mb-3">
                <Icon className={`w-5 h-5 ${type.color}`} />
                <span className="text-2xl">{type.count}</span>
              </div>
              <p className="text-sm text-muted-foreground mb-1">{type.label}</p>
              <p className="text-sm font-medium">{type.total.toLocaleString('fr-DZ')} DA</p>
            </div>
          );
        })}
      </div>

      {/* Add Button */}
      {!showAddForm && (
        <button
          onClick={() => setShowAddForm(true)}
          className="w-full py-4 px-6 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          إضافة عنصر للتركة / Ajouter un bien
        </button>
      )}

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="bg-white rounded-xl border border-border p-6">
          <h3 className="mb-6">
            {editingAsset ? 'تعديل العنصر / Modifier' : 'إضافة عنصر جديد / Nouveau bien'}
          </h3>
          
          <div className="space-y-5">
            <div>
              <label className="block mb-3">نوع العنصر / Type de bien</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {assetTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.value}
                      onClick={() => setFormData({ ...formData, type: type.value as Asset['type'] })}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        formData.type === type.value
                          ? 'bg-emerald-50 border-emerald-600'
                          : 'bg-white border-border hover:bg-accent'
                      }`}
                    >
                      <Icon className={`w-6 h-6 mx-auto mb-2 ${type.color}`} />
                      <p className="text-xs text-center">{type.label.split(' / ')[0]}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block mb-2">اسم العنصر / Nom</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="مثال: شقة في وهران"
                className="w-full px-4 py-3 rounded-lg border-2 border-border bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block mb-2">الوصف / Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="وصف تفصيلي للعنصر..."
                rows={3}
                className="w-full px-4 py-3 rounded-lg border-2 border-border bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
              />
            </div>

            {formData.type === 'real_estate' && (
              <div>
                <label className="block mb-2">الموقع / Localisation</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="مثال: وهران، حي السلام"
                  className="w-full px-4 py-3 rounded-lg border-2 border-border bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            )}

            <div>
              <label className="block mb-2">القيمة / Valeur (DA)</label>
              <input
                type="number"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                placeholder="0.00"
                className="w-full px-4 py-3 rounded-lg border-2 border-border bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleAddAsset}
                disabled={!formData.name || !formData.value}
                className="flex-1 py-3 px-6 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {editingAsset ? 'حفظ التعديلات / Enregistrer' : 'إضافة / Ajouter'}
              </button>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setEditingAsset(null);
                  setFormData({ type: 'real_estate', name: '', description: '', value: '', location: '' });
                }}
                className="flex-1 py-3 px-6 border-2 border-border rounded-lg hover:bg-accent transition-colors"
              >
                إلغاء / Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assets List */}
      {assets.length > 0 ? (
        <div className="space-y-4">
          <h3 className="text-muted-foreground">عناصر التركة / Biens de la succession</h3>
          {assets.map((asset) => {
            const assetType = assetTypes.find(t => t.type === asset.type);
            const Icon = assetType?.icon || Briefcase;
            return (
              <div
                key={asset.id}
                className="bg-white rounded-xl border border-border p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 ${assetType?.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="mb-1">{asset.name}</h4>
                        <p className="text-sm text-muted-foreground">{assetType?.label}</p>
                      </div>
                      <div className="text-left mr-4">
                        <p className="text-xl text-emerald-700 mb-1">
                          {asset.value.toLocaleString('fr-DZ')} DA
                        </p>
                      </div>
                    </div>
                    
                    {asset.description && (
                      <p className="text-sm text-muted-foreground mb-2">{asset.description}</p>
                    )}
                    
                    {asset.location && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                        <Building2 className="w-4 h-4" />
                        <span>{asset.location}</span>
                      </div>
                    )}
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditAsset(asset)}
                        className="px-4 py-2 text-sm border border-border rounded-lg hover:bg-accent transition-colors flex items-center gap-2"
                      >
                        <Edit2 className="w-4 h-4" />
                        تعديل
                      </button>
                      <button
                        onClick={() => handleDeleteAsset(asset.id)}
                        className="px-4 py-2 text-sm border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors flex items-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        حذف
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-xl p-12 text-center border-2 border-dashed border-gray-300">
          <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-muted-foreground mb-2">لا توجد عناصر في التركة</p>
          <p className="text-sm text-muted-foreground">ابدأ بإضافة العقارات والأموال والممتلكات</p>
        </div>
      )}
    </div>
  );
}
