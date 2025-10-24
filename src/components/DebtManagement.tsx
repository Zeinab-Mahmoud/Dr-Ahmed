import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
  DollarSign, 
  Calendar,
  User,
  FileText,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { DebtRecord } from '@/types';
import { loadDebts, saveDebts, formatCurrency } from '@/lib/storage';

interface DebtManagementProps {
  type: 'دين' | 'مدان';
}

export default function DebtManagement({ type }: DebtManagementProps) {
  const [debts, setDebts] = useState<DebtRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredDebts, setFilteredDebts] = useState<DebtRecord[]>([]);

  useEffect(() => {
    const loadedDebts = loadDebts();
    const filtered = loadedDebts.filter(debt => debt.نوع_الدين === type);
    setDebts(filtered);
    setFilteredDebts(filtered);
  }, [type]);

  useEffect(() => {
    const filtered = debts.filter(debt =>
      debt.اسم_العميل.toLowerCase().includes(searchTerm.toLowerCase()) ||
      debt.رقم_الفاتورة.includes(searchTerm)
    );
    setFilteredDebts(filtered);
  }, [searchTerm, debts]);

  const handlePayment = (debtId: string, amount: number) => {
    const allDebts = loadDebts();
    const updatedDebts = allDebts.map(debt => {
      if (debt.id === debtId) {
        const newPaidAmount = debt.المبلغ_المسدد + amount;
        const newRemainingAmount = debt.المبلغ - newPaidAmount;
        
        return {
          ...debt,
          المبلغ_المسدد: newPaidAmount,
          المبلغ_المتبقي: newRemainingAmount,
          حالة_السداد: newRemainingAmount <= 0 ? 'مسدد' : 'مسدد جزئياً'
        };
      }
      return debt;
    });
    
    saveDebts(updatedDebts);
    
    // Refresh local state
    const filtered = updatedDebts.filter(debt => debt.نوع_الدين === type);
    setDebts(filtered);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'مسدد': return 'bg-green-100 text-green-800';
      case 'غير مسدد': return 'bg-red-100 text-red-800';
      case 'مسدد جزئياً': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalAmount = filteredDebts.reduce((sum, debt) => sum + debt.المبلغ, 0);
  const paidAmount = filteredDebts.reduce((sum, debt) => sum + debt.المبلغ_المسدد, 0);
  const remainingAmount = filteredDebts.reduce((sum, debt) => sum + debt.المبلغ_المتبقي, 0);

  if (filteredDebts.length === 0 && searchTerm === '') {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="text-center">
            <DollarSign className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium text-muted-foreground mb-2">
              لا توجد {type === 'دين' ? 'ديون' : 'مديونيات'} مسجلة حتى الآن
            </p>
            <p className="text-sm text-muted-foreground">
              سيتم عرض {type === 'دين' ? 'الديون' : 'المديونيات'} هنا عند وجود فواتير غير مدفوعة
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">إجمالي المبلغ</p>
                <p className="text-2xl font-bold text-blue-800">
                  {formatCurrency(totalAmount)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">المبلغ المسدد</p>
                <p className="text-2xl font-bold text-green-800">
                  {formatCurrency(paidAmount)}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600">المبلغ المتبقي</p>
                <p className="text-2xl font-bold text-red-800">
                  {formatCurrency(remainingAmount)}
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              {type === 'دين' ? 'الديون المستحقة' : 'المديونيات'}
            </CardTitle>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="البحث برقم الفاتورة أو اسم العميل..."
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
                  <TableHead className="text-right">العميل</TableHead>
                  <TableHead className="text-right">رقم الفاتورة</TableHead>
                  <TableHead className="text-right">تاريخ الاستحقاق</TableHead>
                  <TableHead className="text-right">المبلغ الإجمالي</TableHead>
                  <TableHead className="text-right">المبلغ المسدد</TableHead>
                  <TableHead className="text-right">المبلغ المتبقي</TableHead>
                  <TableHead className="text-right">الحالة</TableHead>
                  <TableHead className="text-right">إجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDebts.map((debt) => (
                  <TableRow key={debt.id}>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4 text-muted-foreground" />
                        {debt.اسم_العميل}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        {debt.رقم_الفاتورة}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {debt.تاريخ_الاستحقاق}
                      </div>
                    </TableCell>
                    <TableCell>{formatCurrency(debt.المبلغ)}</TableCell>
                    <TableCell className="text-green-600">
                      {formatCurrency(debt.المبلغ_المسدد)}
                    </TableCell>
                    <TableCell className="text-red-600">
                      {formatCurrency(debt.المبلغ_المتبقي)}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(debt.حالة_السداد)}>
                        {debt.حالة_السداد}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {debt.حالة_السداد !== 'مسدد' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const amount = prompt('أدخل المبلغ المسدد:');
                            if (amount && !isNaN(parseFloat(amount))) {
                              handlePayment(debt.id, parseFloat(amount));
                            }
                          }}
                          className="text-green-600 hover:text-green-700"
                        >
                          تسديد
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {filteredDebts.length === 0 && searchTerm !== '' && (
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