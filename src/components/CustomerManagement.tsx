import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Search, 
  Users, 
  Phone,
  Calendar,
  TrendingUp,
  TrendingDown,
  DollarSign
} from 'lucide-react';
import { Customer } from '@/types';
import { loadCustomers, formatCurrency } from '@/lib/storage';

export default function CustomerManagement() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    const loadedCustomers = loadCustomers();
    setCustomers(loadedCustomers);
    setFilteredCustomers(loadedCustomers);
  }, []);

  useEffect(() => {
    const filtered = customers.filter(customer =>
      customer.الاسم.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (customer.رقم_الهاتف && customer.رقم_الهاتف.includes(searchTerm))
    );
    setFilteredCustomers(filtered);
  }, [searchTerm, customers]);

  const totalCustomers = filteredCustomers.length;
  const totalSales = filteredCustomers.reduce((sum, customer) => sum + customer.إجمالي_المبيعات, 0);
  const totalPurchases = filteredCustomers.reduce((sum, customer) => sum + customer.إجمالي_المشتريات, 0);
  const positiveBalance = filteredCustomers.filter(c => c.الرصيد > 0).length;
  const negativeBalance = filteredCustomers.filter(c => c.الرصيد < 0).length;

  const getBalanceColor = (balance: number) => {
    if (balance > 0) return 'text-green-600';
    if (balance < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getBalanceStatus = (balance: number) => {
    if (balance > 0) return { label: 'دائن', color: 'bg-green-100 text-green-800' };
    if (balance < 0) return { label: 'مدين', color: 'bg-red-100 text-red-800' };
    return { label: 'متوازن', color: 'bg-gray-100 text-gray-800' };
  };

  if (filteredCustomers.length === 0 && searchTerm === '') {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="text-center">
            <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium text-muted-foreground mb-2">
              لا يوجد عملاء مسجلين حتى الآن
            </p>
            <p className="text-sm text-muted-foreground">
              سيتم إضافة العملاء تلقائياً عند إنشاء فواتير جديدة
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">إجمالي العملاء</p>
                <p className="text-2xl font-bold text-blue-800">{totalCustomers}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">إجمالي المبيعات</p>
                <p className="text-xl font-bold text-green-800">{formatCurrency(totalSales)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">إجمالي المشتريات</p>
                <p className="text-xl font-bold text-purple-800">{formatCurrency(totalPurchases)}</p>
              </div>
              <TrendingDown className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">عملاء دائنين</p>
                <p className="text-2xl font-bold text-orange-800">{positiveBalance}</p>
                <p className="text-xs text-orange-600">مدينين: {negativeBalance}</p>
              </div>
              <DollarSign className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Customers Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              قائمة العملاء
            </CardTitle>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="البحث بالاسم أو رقم الهاتف..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">اسم العميل</TableHead>
                  <TableHead className="text-right">رقم الهاتف</TableHead>
                  <TableHead className="text-right">إجمالي المشتريات</TableHead>
                  <TableHead className="text-right">إجمالي المبيعات</TableHead>
                  <TableHead className="text-right">الرصيد</TableHead>
                  <TableHead className="text-right">آخر معاملة</TableHead>
                  <TableHead className="text-right">الحالة</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => {
                  const balanceStatus = getBalanceStatus(customer.الرصيد);
                  
                  return (
                    <TableRow key={customer.id}>
                      <TableCell className="font-medium">{customer.الاسم}</TableCell>
                      <TableCell>
                        {customer.رقم_الهاتف ? (
                          <div className="flex items-center gap-1">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            {customer.رقم_الهاتف}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">غير محدد</span>
                        )}
                      </TableCell>
                      <TableCell>{formatCurrency(customer.إجمالي_المشتريات)}</TableCell>
                      <TableCell>{formatCurrency(customer.إجمالي_المبيعات)}</TableCell>
                      <TableCell>
                        <span className={`font-bold ${getBalanceColor(customer.الرصيد)}`}>
                          {formatCurrency(Math.abs(customer.الرصيد))}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {customer.تاريخ_آخر_معاملة}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={balanceStatus.color}>
                          {balanceStatus.label}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          
          {filteredCustomers.length === 0 && searchTerm !== '' && (
            <div className="text-center py-8">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">لا توجد نتائج للبحث "{searchTerm}"</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}