import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  AlertCircle
} from 'lucide-react';
import { loadInvoices, loadCustomers, loadDebts, formatCurrency } from '@/lib/storage';
import { Invoice, Customer, DebtRecord } from '@/types';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalPurchases: 0,
    netProfit: 0,
    totalCustomers: 0,
    totalInvoices: 0,
    unpaidInvoices: 0,
    totalDebts: 0,
    recentInvoices: [] as Invoice[]
  });

  useEffect(() => {
    const invoices = loadInvoices();
    const customers = loadCustomers();
    const debts = loadDebts();

    // Calculate sales and purchases
    const sales = invoices
      .filter(inv => inv.نوع_الفاتورة === 'منصرف')
      .reduce((sum, inv) => sum + inv.الإجمالي_النهائي, 0);

    const purchases = invoices
      .filter(inv => inv.نوع_الفاتورة === 'وارد')
      .reduce((sum, inv) => sum + inv.الإجمالي_النهائي, 0);

    // Calculate unpaid invoices
    const unpaid = invoices.filter(inv => inv.حالة_الدفع === 'غير مدفوع').length;

    // Calculate total debts
    const totalDebts = debts
      .filter(debt => debt.حالة_السداد === 'غير مسدد')
      .reduce((sum, debt) => sum + debt.المبلغ, 0);

    // Get recent invoices (last 5)
    const recent = invoices
      .sort((a, b) => new Date(b.التاريخ).getTime() - new Date(a.التاريخ).getTime())
      .slice(0, 5);

    setStats({
      totalSales: sales,
      totalPurchases: purchases,
      netProfit: sales - purchases,
      totalCustomers: customers.length,
      totalInvoices: invoices.length,
      unpaidInvoices: unpaid,
      totalDebts,
      recentInvoices: recent
    });
  }, []);

  return (
    <div className="space-y-6">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">إجمالي المبيعات</p>
                <p className="text-2xl font-bold text-green-800">
                  {formatCurrency(stats.totalSales)}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">إجمالي المشتريات</p>
                <p className="text-2xl font-bold text-blue-800">
                  {formatCurrency(stats.totalPurchases)}
                </p>
              </div>
              <TrendingDown className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">صافي الربح</p>
                <p className={`text-2xl font-bold ${stats.netProfit >= 0 ? 'text-purple-800' : 'text-red-600'}`}>
                  {formatCurrency(stats.netProfit)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">عدد العملاء</p>
                <p className="text-2xl font-bold text-orange-800">{stats.totalCustomers}</p>
              </div>
              <Users className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">إجمالي الفواتير</p>
                <p className="text-xl font-bold">{stats.totalInvoices}</p>
              </div>
              <FileText className="h-6 w-6 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">فواتير غير مدفوعة</p>
                <p className="text-xl font-bold text-red-600">{stats.unpaidInvoices}</p>
              </div>
              <AlertCircle className="h-6 w-6 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">إجمالي الديون</p>
                <p className="text-xl font-bold text-red-600">
                  {formatCurrency(stats.totalDebts)}
                </p>
              </div>
              <DollarSign className="h-6 w-6 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-right flex items-center justify-end gap-2">
            <BarChart3 className="h-5 w-5" />
            النشاط الأخير
          </CardTitle>
        </CardHeader>
        <CardContent>
          {stats.recentInvoices.length > 0 ? (
            <div className="space-y-3">
              {stats.recentInvoices.map((invoice) => (
                <div key={invoice.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      invoice.نوع_الفاتورة === 'وارد' ? 'bg-green-500' : 'bg-blue-500'
                    }`}></div>
                    <div>
                      <p className="font-medium">{invoice.اسم_العميل}</p>
                      <p className="text-sm text-muted-foreground">
                        فاتورة {invoice.نوع_الفاتورة} - {invoice.رقم_الفاتورة}
                      </p>
                    </div>
                  </div>
                  <div className="text-left">
                    <p className="font-bold">{formatCurrency(invoice.الإجمالي_النهائي)}</p>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {invoice.التاريخ}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">لا يوجد نشاط حتى الآن</p>
              <p className="text-sm text-muted-foreground mt-2">
                ابدأ بإضافة فاتورة جديدة لرؤية النشاط هنا
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}