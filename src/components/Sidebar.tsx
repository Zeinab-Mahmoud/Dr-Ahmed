import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  FileText, 
  Package, 
  TrendingDown, 
  TrendingUp,
  CreditCard, 
  Users, 
  Warehouse,
  Plus,
  Home,
  BarChart3,
  Download,
  Calculator,
  Star
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { loadInvoices, loadCustomers, formatCurrency } from '@/lib/storage';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export default function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalPurchases: 0,
    netProfit: 0,
    totalCustomers: 0
  });

  useEffect(() => {
    const invoices = loadInvoices();
    const customers = loadCustomers();

    const sales = invoices
      .filter(inv => inv.نوع_الفاتورة === 'منصرف')
      .reduce((sum, inv) => sum + inv.الإجمالي_النهائي, 0);

    const purchases = invoices
      .filter(inv => inv.نوع_الفاتورة === 'وارد')
      .reduce((sum, inv) => sum + inv.الإجمالي_النهائي, 0);

    setStats({
      totalSales: sales,
      totalPurchases: purchases,
      netProfit: sales - purchases,
      totalCustomers: customers.length
    });
  }, [activeSection]); // Refresh when section changes

  const menuItems = [
    { id: 'dashboard', label: 'الرئيسية', icon: Home, color: 'text-blue-600', isNew: false },
    { id: 'incoming', label: 'فواتير الوارد', icon: TrendingDown, color: 'text-green-600', isNew: true },
    { id: 'outgoing', label: 'فواتير المنصرف', icon: TrendingUp, color: 'text-blue-600', isNew: true },
    { id: 'debt', label: 'الديون', icon: CreditCard, color: 'text-red-600', isNew: false },
    { id: 'credit', label: 'المدان', icon: CreditCard, color: 'text-orange-600', isNew: false },
    { id: 'inventory', label: 'المخزن', icon: Warehouse, color: 'text-purple-600', isNew: false },
    { id: 'customers', label: 'العملاء', icon: Users, color: 'text-indigo-600', isNew: false },
    { id: 'export', label: 'تصدير البيانات', icon: Download, color: 'text-green-600', isNew: false },
  ];

  return (
    <Card className="w-72 h-full rounded-none border-l-0 border-t-0 border-b-0 bg-gradient-to-b from-white to-gray-50 shadow-lg">
      <div className="p-6">
        {/* Company Header */}
        <div className="text-center mb-8 p-4 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg text-white shadow-md">
          <h1 className="text-2xl font-bold mb-1">
            شركة العامر
          </h1>
          <p className="text-sm opacity-90">
            لتجارة الأخشاب
          </p>
          <div className="mt-2 text-xs opacity-75 flex items-center justify-center gap-1">
            <Calculator className="h-3 w-3" />
            نظام محدث بمعادلات جديدة
          </div>
        </div>

        {/* Update Notice */}
        <div className="mb-6 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Star className="h-4 w-4 text-yellow-600" />
            <span className="text-sm font-semibold text-yellow-800">تحديث جديد</span>
          </div>
          <p className="text-xs text-yellow-700">
            معادلة حساب محدثة + خيارات الفصال والمديونية
          </p>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-2 mb-8">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <div key={item.id} className="relative">
                <Button
                  variant={isActive ? 'default' : 'ghost'}
                  className={`w-full justify-start text-right h-12 transition-all duration-200 ${
                    isActive 
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md' 
                      : 'hover:bg-gray-100 hover:shadow-sm'
                  }`}
                  onClick={() => onSectionChange(item.id)}
                >
                  <Icon className={`ml-3 h-5 w-5 ${isActive ? 'text-white' : item.color}`} />
                  <span className="font-medium">{item.label}</span>
                </Button>
                {item.isNew && (
                  <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 py-0">
                    محدث
                  </Badge>
                )}
              </div>
            );
          })}
        </nav>

        <Separator className="my-6" />

        {/* Quick Stats */}
        <div className="p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border">
          <h3 className="font-bold text-sm mb-4 text-center text-gray-700 flex items-center justify-center gap-2">
            <BarChart3 className="h-4 w-4" />
            الإحصائيات السريعة
          </h3>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">إجمالي المشتريات:</span>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                {stats.totalPurchases > 0 ? `${Math.round(stats.totalPurchases)} جنيه` : '0 جنيه'}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">إجمالي المبيعات:</span>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                {stats.totalSales > 0 ? `${Math.round(stats.totalSales)} جنيه` : '0 جنيه'}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">صافي الربح:</span>
              <Badge variant="outline" className={`${stats.netProfit >= 0 ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                {stats.netProfit !== 0 ? `${Math.round(stats.netProfit)} جنيه` : '0 جنيه'}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">عدد العملاء:</span>
              <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                {stats.totalCustomers}
              </Badge>
            </div>
          </div>
        </div>

        {/* Quick Action */}
        <div className="mt-6 space-y-2">
          <Button 
            onClick={() => onSectionChange('dashboard')}
            className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white shadow-lg"
            size="lg"
          >
            <Plus className="ml-2 h-5 w-5" />
            إضافة فاتورة جديدة
          </Button>
          <p className="text-xs text-center text-gray-600">
            مع المعادلة المحدثة وخيارات الفصال
          </p>
        </div>
      </div>
    </Card>
  );
}