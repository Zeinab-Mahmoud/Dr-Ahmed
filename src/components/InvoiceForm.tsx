import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Plus, 
  Trash2, 
  Save, 
  ArrowLeft,
  Calculator,
  Package,
  AlertCircle
} from 'lucide-react';
import { Invoice, InvoiceItem, InvoiceDetail, WoodType } from '@/types';
import { 
  loadInvoices, 
  saveInvoices, 
  loadWoodTypes,
  generateInvoiceNumber,
  calculateDetailTotal,
  calculateAdjustedPrice,
  calculateDifference,
  formatCurrency 
} from '@/lib/storage';

interface InvoiceFormProps {
  type: 'وارد' | 'منصرف';
  editingInvoice?: Invoice | null;
  onClose: () => void;
}

export default function InvoiceForm({ type, editingInvoice, onClose }: InvoiceFormProps) {
  const [formData, setFormData] = useState<Partial<Invoice>>({
    رقم_الفاتورة: '',
    التاريخ: new Date().toISOString().split('T')[0],
    الوقت: new Date().toLocaleTimeString('ar-EG'),
    اسم_العميل: '',
    رقم_الهاتف: '',
    نوع_الفاتورة: type,
    العناصر: [],
    مصاريف_النقل: 0,
    مصاريف_التنزيل: 0,
    إجمالي_المصاريف: 0,
    الإجمالي_النهائي: 0,
    حالة_الدفع: 'غير مدفوع',
    المبلغ_المدفوع: 0,
    المبلغ_المتبقي: 0,
    ملاحظات: ''
  });

  const [woodTypes, setWoodTypes] = useState<WoodType[]>([]);
  const [currentItem, setCurrentItem] = useState<Partial<InvoiceItem>>({
    النوع: '',
    البيان: '',
    العدد_الإجمالي: 0,
    التفاصيل: [],
    إجمالي_الصنف: 0
  });

  const [currentDetail, setCurrentDetail] = useState<Partial<InvoiceDetail>>({
    العرض: 0,
    التخانة: 0,
    الطول: 0,
    عدد_الامتار_الاجمالي: 1,
    سعر_المتر: 0,
    المكعب: 0,
    الاجمالي: 0,
    عرض_السعر_المعدل: false,
    نوع_السعر_المعدل: 'فصال'
  });

  useEffect(() => {
    setWoodTypes(loadWoodTypes());
    
    if (editingInvoice) {
      setFormData(editingInvoice);
    } else {
      setFormData(prev => ({
        ...prev,
        رقم_الفاتورة: generateInvoiceNumber(type)
      }));
    }
  }, [editingInvoice, type]);

  useEffect(() => {
    // Calculate cubic meters and total for current detail using NEW FORMULA
    const cubic = (currentDetail.العرض || 0) * (currentDetail.التخانة || 0) * (currentDetail.الطول || 0) * (currentDetail.عدد_الامتار_الاجمالي || 0);
    // NEW CALCULATION: الاجمالي = سعر المتر * الطول * العرض * التخانة * عدد الامتار الاجمالي
    const total = (currentDetail.سعر_المتر || 0) * (currentDetail.الطول || 0) * (currentDetail.العرض || 0) * (currentDetail.التخانة || 0) * (currentDetail.عدد_الامتار_الاجمالي || 0);
    
    let adjustedPrice = 0;
    let difference = 0;

    if (currentDetail.عرض_السعر_المعدل) {
      if (currentDetail.نوع_السعر_المعدل === 'فصال' && currentDetail.فصال && cubic > 0) {
        // سعر المتر بعد الفصال = فصال / (الطول * العرض * التخانة * عدد الامتار الاجمالي)
        adjustedPrice = currentDetail.فصال / cubic;
        // الفرق = الاجمالي - الفصال
        difference = total - currentDetail.فصال;
      } else if (currentDetail.نوع_السعر_المعدل === 'مديونية' && currentDetail.مديونية) {
        // الفرق = الاجمالي - المديونية
        difference = total - currentDetail.مديونية;
      }
    }
    
    setCurrentDetail(prev => ({
      ...prev,
      المكعب: cubic,
      الاجمالي: total,
      سعر_المتر_بعد_الفصال: adjustedPrice,
      الفرق: difference
    }));
  }, [
    currentDetail.العرض,
    currentDetail.التخانة,
    currentDetail.الطول,
    currentDetail.عدد_الامتار_الاجمالي,
    currentDetail.سعر_المتر,
    currentDetail.فصال,
    currentDetail.مديونية,
    currentDetail.نوع_السعر_المعدل,
    currentDetail.عرض_السعر_المعدل
  ]);

  useEffect(() => {
    // Calculate totals
    const itemsTotal = (formData.العناصر || []).reduce((sum, item) => sum + item.إجمالي_الصنف, 0);
    const expensesTotal = (formData.مصاريف_النقل || 0) + (formData.مصاريف_التنزيل || 0);
    const finalTotal = itemsTotal + expensesTotal;
    const remaining = finalTotal - (formData.المبلغ_المدفوع || 0);

    setFormData(prev => ({
      ...prev,
      إجمالي_المصاريف: expensesTotal,
      الإجمالي_النهائي: finalTotal,
      المبلغ_المتبقي: remaining,
      حالة_الدفع: remaining <= 0 ? 'مدفوع' : (formData.المبلغ_المدفوع || 0) > 0 ? 'مدفوع جزئياً' : 'غير مدفوع'
    }));
  }, [formData.العناصر, formData.مصاريف_النقل, formData.مصاريف_التنزيل, formData.المبلغ_المدفوع]);

  const handleWoodTypeChange = (value: string) => {
    const selectedType = woodTypes.find(w => w.النوع === value);
    if (selectedType) {
      setCurrentItem(prev => ({
        ...prev,
        النوع: selectedType.النوع,
        البيان: selectedType.البيان
      }));
    }
  };

  const addDetailToItem = () => {
    if (!currentDetail.العرض || !currentDetail.التخانة || !currentDetail.الطول || !currentDetail.سعر_المتر) {
      alert('يرجى ملء جميع الحقول المطلوبة (العرض، التخانة، الطول، سعر المتر)');
      return;
    }

    const newDetail: InvoiceDetail = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      العرض: currentDetail.العرض || 0,
      التخانة: currentDetail.التخانة || 0,
      الطول: currentDetail.الطول || 0,
      عدد_الامتار_الاجمالي: currentDetail.عدد_الامتار_الاجمالي || 1,
      سعر_المتر: currentDetail.سعر_المتر || 0,
      المكعب: currentDetail.المكعب || 0,
      الاجمالي: currentDetail.الاجمالي || 0,
      فصال: currentDetail.فصال,
      سعر_المتر_بعد_الفصال: currentDetail.سعر_المتر_بعد_الفصال,
      مديونية: currentDetail.مديونية,
      الفرق: currentDetail.الفرق,
      عرض_السعر_المعدل: currentDetail.عرض_السعر_المعدل,
      نوع_السعر_المعدل: currentDetail.نوع_السعر_المعدل
    };

    setCurrentItem(prev => {
      const newDetails = [...(prev.التفاصيل || []), newDetail];
      const total = newDetails.reduce((sum, detail) => sum + detail.الاجمالي, 0);
      return {
        ...prev,
        التفاصيل: newDetails,
        إجمالي_الصنف: total
      };
    });

    // Reset current detail
    setCurrentDetail({
      العرض: 0,
      التخانة: 0,
      الطول: 0,
      عدد_الامتار_الاجمالي: 1,
      سعر_المتر: 0,
      المكعب: 0,
      الاجمالي: 0,
      عرض_السعر_المعدل: false,
      نوع_السعر_المعدل: 'فصال'
    });
  };

  const addItemToInvoice = () => {
    if (!currentItem.النوع || !currentItem.البيان || !currentItem.التفاصيل?.length) {
      alert('يرجى إضافة تفاصيل للصنف أولاً');
      return;
    }

    const newItem: InvoiceItem = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      النوع: currentItem.النوع || '',
      البيان: currentItem.البيان || '',
      العدد_الإجمالي: currentItem.التفاصيل?.length || 0,
      التفاصيل: currentItem.التفاصيل || [],
      إجمالي_الصنف: currentItem.إجمالي_الصنف || 0
    };

    setFormData(prev => ({
      ...prev,
      العناصر: [...(prev.العناصر || []), newItem]
    }));

    // Reset current item
    setCurrentItem({
      النوع: '',
      البيان: '',
      العدد_الإجمالي: 0,
      التفاصيل: [],
      إجمالي_الصنف: 0
    });
  };

  const removeDetail = (detailId: string) => {
    setCurrentItem(prev => {
      const newDetails = (prev.التفاصيل || []).filter(d => d.id !== detailId);
      const total = newDetails.reduce((sum, detail) => sum + detail.الاجمالي, 0);
      return {
        ...prev,
        التفاصيل: newDetails,
        إجمالي_الصنف: total
      };
    });
  };

  const removeItem = (itemId: string) => {
    setFormData(prev => ({
      ...prev,
      العناصر: (prev.العناصر || []).filter(item => item.id !== itemId)
    }));
  };

  const handleSave = () => {
    if (!formData.اسم_العميل || !formData.العناصر?.length) {
      alert('يرجى ملء البيانات المطلوبة وإضافة أصناف');
      return;
    }

    const invoices = loadInvoices();
    const newInvoice: Invoice = {
      id: editingInvoice?.id || Date.now().toString() + Math.random().toString(36).substr(2, 9),
      رقم_الفاتورة: formData.رقم_الفاتورة || '',
      التاريخ: formData.التاريخ || '',
      الوقت: formData.الوقت || '',
      اسم_العميل: formData.اسم_العميل || '',
      رقم_الهاتف: formData.رقم_الهاتف,
      نوع_الفاتورة: formData.نوع_الفاتورة || type,
      العناصر: formData.العناصر || [],
      مصاريف_النقل: formData.مصاريف_النقل,
      مصاريف_التنزيل: formData.مصاريف_التنزيل,
      إجمالي_المصاريف: formData.إجمالي_المصاريف || 0,
      الإجمالي_النهائي: formData.الإجمالي_النهائي || 0,
      حالة_الدفع: formData.حالة_الدفع || 'غير مدفوع',
      المبلغ_المدفوع: formData.المبلغ_المدفوع,
      المبلغ_المتبقي: formData.المبلغ_المتبقي,
      ملاحظات: formData.ملاحظات
    };

    if (editingInvoice) {
      const updatedInvoices = invoices.map(inv => inv.id === editingInvoice.id ? newInvoice : inv);
      saveInvoices(updatedInvoices);
    } else {
      saveInvoices([...invoices, newInvoice]);
    }

    onClose();
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={onClose}>
          <ArrowLeft className="ml-2 h-4 w-4" />
          العودة
        </Button>
        <h2 className="text-2xl font-bold text-right flex items-center gap-2">
          <Package className="h-6 w-6" />
          {editingInvoice ? 'تعديل' : 'إضافة'} فاتورة {type}
        </h2>
      </div>

      {/* Invoice Header Info */}
      <Card>
        <CardHeader>
          <CardTitle>بيانات الفاتورة</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label>رقم الفاتورة</Label>
            <Input
              value={formData.رقم_الفاتورة}
              onChange={(e) => setFormData(prev => ({ ...prev, رقم_الفاتورة: e.target.value }))}
              readOnly={!!editingInvoice}
            />
          </div>
          <div>
            <Label>التاريخ</Label>
            <Input
              type="date"
              value={formData.التاريخ}
              onChange={(e) => setFormData(prev => ({ ...prev, التاريخ: e.target.value }))}
            />
          </div>
          <div>
            <Label>اسم العميل</Label>
            <Input
              value={formData.اسم_العميل}
              onChange={(e) => setFormData(prev => ({ ...prev, اسم_العميل: e.target.value }))}
              placeholder="اسم العميل"
            />
          </div>
          <div>
            <Label>رقم الهاتف (اختياري)</Label>
            <Input
              value={formData.رقم_الهاتف}
              onChange={(e) => setFormData(prev => ({ ...prev, رقم_الهاتف: e.target.value }))}
              placeholder="رقم الهاتف"
            />
          </div>
        </CardContent>
      </Card>

      {/* Add Item Section */}
      <Card>
        <CardHeader>
          <CardTitle>إضافة صنف جديد</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Item Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>نوع الخشب</Label>
              {type === 'منصرف' ? (
                <Select value={currentItem.النوع} onValueChange={handleWoodTypeChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر نوع الخشب من المخزن" />
                  </SelectTrigger>
                  <SelectContent>
                    {woodTypes.map((wood) => (
                      <SelectItem key={wood.id} value={wood.النوع}>
                        {wood.النوع} - {wood.البيان}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  value={currentItem.النوع}
                  onChange={(e) => setCurrentItem(prev => ({ ...prev, النوع: e.target.value }))}
                  placeholder="نوع الخشب"
                />
              )}
            </div>
            <div>
              <Label>البيان</Label>
              <Input
                value={currentItem.البيان}
                onChange={(e) => setCurrentItem(prev => ({ ...prev, البيان: e.target.value }))}
                placeholder="تفاصيل الصنف"
              />
            </div>
          </div>

          {/* Detail Entry */}
          <div className="border rounded-lg p-4 bg-gray-50">
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              إضافة تفاصيل القياسات والحسابات
            </h4>
            
            {/* Calculation Formula Display */}
            <div className="mb-4 p-3 bg-blue-50 rounded border-l-4 border-blue-400">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <span className="font-semibold text-blue-800">معادلة الحساب الجديدة:</span>
              </div>
              <p className="text-sm text-blue-700 font-mono">
                الإجمالي = سعر المتر × الطول × العرض × التخانة × عدد الأمتار الإجمالي
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
              <div>
                <Label className="text-red-600">العرض (سم) *</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={currentDetail.العرض || ''}
                  onChange={(e) => setCurrentDetail(prev => ({ ...prev, العرض: parseFloat(e.target.value) || 0 }))}
                  placeholder="0"
                  className="border-red-200"
                />
              </div>
              <div>
                <Label className="text-red-600">التخانة (سم) *</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={currentDetail.التخانة || ''}
                  onChange={(e) => setCurrentDetail(prev => ({ ...prev, التخانة: parseFloat(e.target.value) || 0 }))}
                  placeholder="0"
                  className="border-red-200"
                />
              </div>
              <div>
                <Label className="text-red-600">الطول (م) *</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={currentDetail.الطول || ''}
                  onChange={(e) => setCurrentDetail(prev => ({ ...prev, الطول: parseFloat(e.target.value) || 0 }))}
                  placeholder="0"
                  className="border-red-200"
                />
              </div>
              <div>
                <Label>عدد الأمتار الإجمالي</Label>
                <Input
                  type="number"
                  value={currentDetail.عدد_الامتار_الاجمالي || ''}
                  onChange={(e) => setCurrentDetail(prev => ({ ...prev, عدد_الامتار_الاجمالي: parseInt(e.target.value) || 1 }))}
                  placeholder="1"
                />
              </div>
              <div>
                <Label className="text-red-600">سعر المتر (جنيه) *</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={currentDetail.سعر_المتر || ''}
                  onChange={(e) => setCurrentDetail(prev => ({ ...prev, سعر_المتر: parseFloat(e.target.value) || 0 }))}
                  placeholder="0"
                  className="border-red-200"
                />
              </div>
            </div>

            {/* Calculated Values */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-3 bg-green-50 rounded">
              <div>
                <Label>المكعب (م³)</Label>
                <Input 
                  value={currentDetail.المكعب?.toFixed(6) || '0'} 
                  readOnly 
                  className="bg-white font-bold text-green-700"
                />
              </div>
              <div>
                <Label className="text-green-700 font-bold">الإجمالي (جنيه)</Label>
                <Input 
                  value={formatCurrency(currentDetail.الاجمالي || 0)} 
                  readOnly 
                  className="bg-white font-bold text-green-700 text-lg"
                />
              </div>
            </div>

            {/* Adjusted Pricing */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <Checkbox
                  id="show-adjusted"
                  checked={currentDetail.عرض_السعر_المعدل}
                  onCheckedChange={(checked) => setCurrentDetail(prev => ({ ...prev, عرض_السعر_المعدل: !!checked }))}
                />
                <Label htmlFor="show-adjusted" className="font-semibold text-blue-700">
                  عرض السعر المعدل (فصال أو مديونية)
                </Label>
              </div>

              {currentDetail.عرض_السعر_المعدل && (
                <div className="space-y-4 p-4 bg-yellow-50 rounded border border-yellow-200">
                  <div>
                    <Label className="font-semibold">نوع السعر المعدل</Label>
                    <Select 
                      value={currentDetail.نوع_السعر_المعدل} 
                      onValueChange={(value: 'فصال' | 'مديونية') => setCurrentDetail(prev => ({ ...prev, نوع_السعر_المعدل: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="فصال">فصال (جنيه)</SelectItem>
                        <SelectItem value="مديونية">مديونية (جنيه)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {currentDetail.نوع_السعر_المعدل === 'فصال' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label className="text-orange-600 font-semibold">فصال (جنيه)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={currentDetail.فصال || ''}
                          onChange={(e) => setCurrentDetail(prev => ({ ...prev, فصال: parseFloat(e.target.value) || 0 }))}
                          placeholder="0"
                          className="border-orange-200"
                        />
                      </div>
                      <div>
                        <Label>سعر المتر بعد الفصال (جنيه)</Label>
                        <Input 
                          value={formatCurrency(currentDetail.سعر_المتر_بعد_الفصال || 0)} 
                          readOnly 
                          className="bg-white font-bold text-orange-700"
                        />
                        <p className="text-xs text-gray-600 mt-1">
                          = فصال ÷ (الطول × العرض × التخانة × عدد الأمتار)
                        </p>
                      </div>
                      <div>
                        <Label>الفرق (جنيه)</Label>
                        <Input 
                          value={formatCurrency(currentDetail.الفرق || 0)} 
                          readOnly 
                          className="bg-white font-bold text-purple-700"
                        />
                        <p className="text-xs text-gray-600 mt-1">
                          = الإجمالي - الفصال
                        </p>
                      </div>
                    </div>
                  )}

                  {currentDetail.نوع_السعر_المعدل === 'مديونية' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-red-600 font-semibold">مديونية (جنيه)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={currentDetail.مديونية || ''}
                          onChange={(e) => setCurrentDetail(prev => ({ ...prev, مديونية: parseFloat(e.target.value) || 0 }))}
                          placeholder="0"
                          className="border-red-200"
                        />
                      </div>
                      <div>
                        <Label>الفرق (جنيه)</Label>
                        <Input 
                          value={formatCurrency(currentDetail.الفرق || 0)} 
                          readOnly 
                          className="bg-white font-bold text-purple-700"
                        />
                        <p className="text-xs text-gray-600 mt-1">
                          = الإجمالي - المديونية
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <Button onClick={addDetailToItem} className="w-full mt-4" size="lg">
              <Plus className="ml-2 h-4 w-4" />
              إضافة التفاصيل للصنف
            </Button>
          </div>

          {/* Current Item Details */}
          {currentItem.التفاصيل && currentItem.التفاصيل.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-semibold">تفاصيل الصنف الحالي:</h4>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">العرض</TableHead>
                      <TableHead className="text-right">التخانة</TableHead>
                      <TableHead className="text-right">الطول</TableHead>
                      <TableHead className="text-right">العدد</TableHead>
                      <TableHead className="text-right">سعر المتر</TableHead>
                      <TableHead className="text-right">المكعب</TableHead>
                      <TableHead className="text-right">الإجمالي</TableHead>
                      <TableHead className="text-right">إجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentItem.التفاصيل.map((detail) => (
                      <TableRow key={detail.id}>
                        <TableCell>{detail.العرض}</TableCell>
                        <TableCell>{detail.التخانة}</TableCell>
                        <TableCell>{detail.الطول}</TableCell>
                        <TableCell>{detail.عدد_الامتار_الاجمالي}</TableCell>
                        <TableCell>{formatCurrency(detail.سعر_المتر)}</TableCell>
                        <TableCell>{detail.المكعب.toFixed(6)}</TableCell>
                        <TableCell className="font-bold text-green-700">{formatCurrency(detail.الاجمالي)}</TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeDetail(detail.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="text-left">
                <Badge variant="secondary" className="text-lg p-2 bg-green-100 text-green-800">
                  إجمالي الصنف: {formatCurrency(currentItem.إجمالي_الصنف || 0)}
                </Badge>
              </div>
              <Button onClick={addItemToInvoice} className="w-full" size="lg">
                <Plus className="ml-2 h-4 w-4" />
                إضافة الصنف للفاتورة
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Invoice Items */}
      {formData.العناصر && formData.العناصر.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>أصناف الفاتورة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {formData.العناصر.map((item, index) => (
                <div key={item.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-semibold">{item.النوع} - {item.البيان}</h4>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeItem(item.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-right">العرض</TableHead>
                          <TableHead className="text-right">التخانة</TableHead>
                          <TableHead className="text-right">الطول</TableHead>
                          <TableHead className="text-right">العدد</TableHead>
                          <TableHead className="text-right">سعر المتر</TableHead>
                          <TableHead className="text-right">المكعب</TableHead>
                          <TableHead className="text-right">الإجمالي</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {item.التفاصيل.map((detail) => (
                          <TableRow key={detail.id}>
                            <TableCell>{detail.العرض}</TableCell>
                            <TableCell>{detail.التخانة}</TableCell>
                            <TableCell>{detail.الطول}</TableCell>
                            <TableCell>{detail.عدد_الامتار_الاجمالي}</TableCell>
                            <TableCell>{formatCurrency(detail.سعر_المتر)}</TableCell>
                            <TableCell>{detail.المكعب.toFixed(6)}</TableCell>
                            <TableCell className="font-bold text-green-700">{formatCurrency(detail.الاجمالي)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  <div className="text-left mt-2">
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      إجمالي الصنف: {formatCurrency(item.إجمالي_الصنف)}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Expenses and Payment */}
      <Card>
        <CardHeader>
          <CardTitle>المصاريف والدفع</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>مصاريف النقل (جنيه)</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.مصاريف_النقل || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, مصاريف_النقل: parseFloat(e.target.value) || 0 }))}
                placeholder="0"
              />
            </div>
            <div>
              <Label>مصاريف التنزيل (جنيه)</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.مصاريف_التنزيل || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, مصاريف_التنزيل: parseFloat(e.target.value) || 0 }))}
                placeholder="0"
              />
            </div>
            <div>
              <Label>المبلغ المدفوع (جنيه)</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.المبلغ_المدفوع || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, المبلغ_المدفوع: parseFloat(e.target.value) || 0 }))}
                placeholder="0"
              />
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-blue-50 rounded">
              <p className="text-sm text-muted-foreground">إجمالي المصاريف</p>
              <p className="text-xl font-bold text-blue-600">{formatCurrency(formData.إجمالي_المصاريف || 0)}</p>
            </div>
            <div className="p-4 bg-green-50 rounded">
              <p className="text-sm text-muted-foreground">الإجمالي النهائي</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(formData.الإجمالي_النهائي || 0)}</p>
            </div>
            <div className="p-4 bg-red-50 rounded">
              <p className="text-sm text-muted-foreground">المبلغ المتبقي</p>
              <p className="text-xl font-bold text-red-600">{formatCurrency(formData.المبلغ_المتبقي || 0)}</p>
            </div>
          </div>

          <div>
            <Label>حالة الدفع</Label>
            <Badge className={
              formData.حالة_الدفع === 'مدفوع' ? 'bg-green-100 text-green-800' :
              formData.حالة_الدفع === 'مدفوع جزئياً' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }>
              {formData.حالة_الدفع}
            </Badge>
          </div>

          <div>
            <Label>ملاحظات</Label>
            <Textarea
              value={formData.ملاحظات}
              onChange={(e) => setFormData(prev => ({ ...prev, ملاحظات: e.target.value }))}
              placeholder="ملاحظات إضافية..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-center">
        <Button onClick={handleSave} size="lg" className="px-8">
          <Save className="ml-2 h-5 w-5" />
          {editingInvoice ? 'حفظ التعديلات' : 'حفظ الفاتورة'}
        </Button>
      </div>
    </div>
  );
}