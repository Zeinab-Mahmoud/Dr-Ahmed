import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import InvoiceForm from '@/components/InvoiceForm';
import InvoiceList from '@/components/InvoiceList';
import InvoiceViewer from '@/components/InvoiceViewer';
import Dashboard from '@/components/Dashboard';
import DebtManagement from '@/components/DebtManagement';
import InventoryManagement from '@/components/InventoryManagement';
import CustomerManagement from '@/components/CustomerManagement';
import ExcelExport from '@/components/ExcelExport';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Package,
  FileText,
  Users,
  BarChart3,
  Calendar,
  Download,
  Calculator,
  Star,
  Zap
} from 'lucide-react';
import { Invoice } from '@/types';

export default function Index() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  const [invoiceType, setInvoiceType] = useState<'وارد' | 'منصرف'>('وارد');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);

  const handleNewInvoice = (type: 'وارد' | 'منصرف') => {
    setInvoiceType(type);
    setEditingInvoice(null);
    setShowInvoiceForm(true);
  };

  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
  };

  const handleEditInvoice = (invoice: Invoice) => {
    setEditingInvoice(invoice);
    setInvoiceType(invoice.نوع_الفاتورة);
    setShowInvoiceForm(true);
  };

  const handleCloseInvoiceForm = () => {
    setShowInvoiceForm(false);
    setEditingInvoice(null);
  };

  const handleBackFromViewer = () => {
    setSelectedInvoice(null);
  };

  const renderContent = () => {
    if (showInvoiceForm) {
      return (
        <InvoiceForm 
          type={invoiceType} 
          editingInvoice={editingInvoice}
          onClose={handleCloseInvoiceForm} 
        />
      );
    }

    if (selectedInvoice) {
      return (
        <InvoiceViewer 
          invoice={selectedInvoice}
          onBack={handleBackFromViewer}
        />
      );
    }

    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="p-6 space-y-6">
            {/* Header Section */}
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold text-blue-800 mb-2">
                مرحباً بك في شركة العامر لتجارة الأخشاب
              </h1>
              <p className="text-lg text-muted-foreground">
                نظام إدارة شامل للمخزون والفواتير والعملاء مع معادلات حساب محدثة
              </p>
            </div>

            {/* New Features Highlight */}
            <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-700">
                  <Star className="h-6 w-6 text-yellow-500" />
                  الميزات الجديدة المحدثة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Calculator className="h-4 w-4 text-blue-600" />
                      <span className="font-semibold">معادلة حساب جديدة:</span>
                    </div>
                    <p className="text-sm bg-blue-100 p-2 rounded font-mono">
                      الإجمالي = سعر المتر × الطول × العرض × التخانة × عدد الأمتار
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-orange-600" />
                      <span className="font-semibold">حسابات الفصال والمديونية</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      مع حساب سعر المتر بعد الفصال والفرق تلقائياً
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Dashboard Component */}
            <Dashboard />

            {/* New Invoice Section - Enhanced */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-right flex items-center justify-end gap-2">
                <FileText className="h-6 w-6" />
                إضافة فاتورة جديدة مع النظام المحدث
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:border-green-300 relative" 
                      onClick={() => handleNewInvoice('وارد')}>
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-green-600 text-white">محدث</Badge>
                  </div>
                  <CardHeader className="text-center">
                    <div className="mx-auto w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4">
                      <TrendingDown className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-right text-green-700 text-xl">فاتورة وارد</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-right text-muted-foreground mb-4">
                      إضافة فاتورة شراء جديدة مع إدخال يدوي لأنواع الأخشاب
                    </p>
                    <div className="space-y-2">
                      <Badge variant="secondary" className="bg-green-100 text-green-700 block">
                        مشتريات
                      </Badge>
                      <div className="text-xs text-gray-600">
                        ✓ سعر المتر قابل للتعديل
                        <br />
                        ✓ معادلة حساب جديدة
                        <br />
                        ✓ خيارات الفصال والمديونية
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:border-blue-300 relative"
                      onClick={() => handleNewInvoice('منصرف')}>
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-blue-600 text-white">محدث</Badge>
                  </div>
                  <CardHeader className="text-center">
                    <div className="mx-auto w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mb-4">
                      <TrendingUp className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-right text-blue-700 text-xl">فاتورة منصرف</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-right text-muted-foreground mb-4">
                      إضافة فاتورة بيع جديدة مع قائمة منسدلة للأخشاب من المخزن
                    </p>
                    <div className="space-y-2">
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700 block">
                        مبيعات
                      </Badge>
                      <div className="text-xs text-gray-600">
                        ✓ اختيار من المخزن
                        <br />
                        ✓ حسابات متقدمة
                        <br />
                        ✓ تتبع المخزون تلقائياً
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Action Buttons */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <Button 
                  onClick={() => handleNewInvoice('وارد')}
                  className="bg-green-600 hover:bg-green-700 text-white h-12"
                  size="lg"
                >
                  <TrendingDown className="ml-2 h-5 w-5" />
                  فاتورة وارد سريعة
                </Button>
                <Button 
                  onClick={() => handleNewInvoice('منصرف')}
                  className="bg-blue-600 hover:bg-blue-700 text-white h-12"
                  size="lg"
                >
                  <TrendingUp className="ml-2 h-5 w-5" />
                  فاتورة منصرف سريعة
                </Button>
                <Button 
                  onClick={() => setActiveSection('export')}
                  variant="outline"
                  className="h-12"
                  size="lg"
                >
                  <Download className="ml-2 h-5 w-5" />
                  تصدير Excel
                </Button>
                <Button 
                  onClick={() => setActiveSection('inventory')}
                  variant="outline"
                  className="h-12"
                  size="lg"
                >
                  <Package className="ml-2 h-5 w-5" />
                  عرض المخزن
                </Button>
              </div>
            </div>

            {/* System Features Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  نظرة عامة على ميزات النظام
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">إدارة الفواتير</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>✓ معادلة حساب محدثة</li>
                      <li>✓ سعر المتر قابل للتعديل</li>
                      <li>✓ حسابات الفصال والمديونية</li>
                      <li>✓ طباعة احترافية</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">إدارة المخزون</h4>
                    <ul className="text-sm text-green-700 space-y-1">
                      <li>✓ تتبع الكميات تلقائياً</li>
                      <li>✓ قائمة أنواع الأخشاب</li>
                      <li>✓ تقييم المخزون</li>
                      <li>✓ تنبيهات المخزون المنخفض</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h4 className="font-semibold text-purple-800 mb-2">التقارير والتصدير</h4>
                    <ul className="text-sm text-purple-700 space-y-1">
                      <li>✓ تصدير Excel منظم</li>
                      <li>✓ إدارة الديون والمدان</li>
                      <li>✓ تقارير العملاء</li>
                      <li>✓ إحصائيات مالية</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      
      case 'incoming':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-right mb-6 flex items-center justify-end gap-2">
              <TrendingDown className="h-6 w-6 text-green-600" />
              فواتير الوارد
            </h2>
            <InvoiceList 
              type="وارد"
              onViewInvoice={handleViewInvoice}
              onEditInvoice={handleEditInvoice}
            />
          </div>
        );
      
      case 'outgoing':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-right mb-6 flex items-center justify-end gap-2">
              <TrendingUp className="h-6 w-6 text-blue-600" />
              فواتير المنصرف
            </h2>
            <InvoiceList 
              type="منصرف"
              onViewInvoice={handleViewInvoice}
              onEditInvoice={handleEditInvoice}
            />
          </div>
        );
      
      case 'debt':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-right mb-6 flex items-center justify-end gap-2">
              <DollarSign className="h-6 w-6 text-red-600" />
              الديون
            </h2>
            <DebtManagement type="دين" />
          </div>
        );
      
      case 'credit':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-right mb-6 flex items-center justify-end gap-2">
              <DollarSign className="h-6 w-6 text-orange-600" />
              المدان
            </h2>
            <DebtManagement type="مدان" />
          </div>
        );
      
      case 'inventory':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-right mb-6 flex items-center justify-end gap-2">
              <Package className="h-6 w-6 text-purple-600" />
              المخزن
            </h2>
            <InventoryManagement />
          </div>
        );
      
      case 'customers':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-right mb-6 flex items-center justify-end gap-2">
              <Users className="h-6 w-6 text-indigo-600" />
              العملاء
            </h2>
            <CustomerManagement />
          </div>
        );

      case 'export':
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-right mb-6 flex items-center justify-end gap-2">
              <Download className="h-6 w-6 text-green-600" />
              تصدير البيانات
            </h2>
            <ExcelExport />
          </div>
        );
      
      default:
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-right">مرحباً بك في شركة العامر لتجارة الأخشاب</h2>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-blue-50" dir="rtl">
      <div className="flex flex-1">
        <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
        <main className="flex-1 overflow-auto">
          {renderContent()}
        </main>
      </div>
      <Footer />
    </div>
  );
}