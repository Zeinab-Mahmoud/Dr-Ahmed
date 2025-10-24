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
  Package, 
  TrendingUp,
  TrendingDown,
  Calendar,
  AlertTriangle
} from 'lucide-react';
import { InventoryItem } from '@/types';
import { loadInventory, formatCurrency } from '@/lib/storage';

export default function InventoryManagement() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredInventory, setFilteredInventory] = useState<InventoryItem[]>([]);

  useEffect(() => {
    const loadedInventory = loadInventory();
    setInventory(loadedInventory);
    setFilteredInventory(loadedInventory);
  }, []);

  useEffect(() => {
    const filtered = inventory.filter(item =>
      item.النوع.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.البيان.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredInventory(filtered);
  }, [searchTerm, inventory]);

  const totalItems = filteredInventory.length;
  const totalQuantity = filteredInventory.reduce((sum, item) => sum + item.الكمية_المتاحة, 0);
  const lowStockItems = filteredInventory.filter(item => item.الكمية_المتاحة < 1).length;
  const totalValue = filteredInventory.reduce((sum, item) => 
    sum + (item.الكمية_المتاحة * item.متوسط_سعر_الشراء), 0
  );

  const getStockStatus = (quantity: number) => {
    if (quantity <= 0) return { label: 'نفد المخزون', color: 'bg-red-100 text-red-800' };
    if (quantity < 1) return { label: 'مخزون منخفض', color: 'bg-yellow-100 text-yellow-800' };
    if (quantity < 5) return { label: 'مخزون متوسط', color: 'bg-blue-100 text-blue-800' };
    return { label: 'مخزون جيد', color: 'bg-green-100 text-green-800' };
  };

  if (filteredInventory.length === 0 && searchTerm === '') {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="text-center">
            <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium text-muted-foreground mb-2">
              المخزن فارغ حالياً
            </p>
            <p className="text-sm text-muted-foreground">
              سيتم تحديث المخزن تلقائياً عند إضافة فواتير الوارد والمنصرف
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
                <p className="text-sm font-medium text-blue-600">إجمالي الأصناف</p>
                <p className="text-2xl font-bold text-blue-800">{totalItems}</p>
              </div>
              <Package className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">إجمالي الكمية</p>
                <p className="text-2xl font-bold text-green-800">{totalQuantity.toFixed(2)} م³</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600">مخزون منخفض</p>
                <p className="text-2xl font-bold text-red-800">{lowStockItems}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">قيمة المخزون</p>
                <p className="text-xl font-bold text-purple-800">{formatCurrency(totalValue)}</p>
              </div>
              <TrendingDown className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              جرد المخزن
            </CardTitle>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="البحث في المخزن..."
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
                  <TableHead className="text-right">نوع الخشب</TableHead>
                  <TableHead className="text-right">البيان</TableHead>
                  <TableHead className="text-right">الكمية المتاحة (م³)</TableHead>
                  <TableHead className="text-right">متوسط سعر الشراء</TableHead>
                  <TableHead className="text-right">متوسط سعر البيع</TableHead>
                  <TableHead className="text-right">قيمة المخزون</TableHead>
                  <TableHead className="text-right">آخر تحديث</TableHead>
                  <TableHead className="text-right">حالة المخزون</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInventory.map((item) => {
                  const stockStatus = getStockStatus(item.الكمية_المتاحة);
                  const stockValue = item.الكمية_المتاحة * item.متوسط_سعر_الشراء;
                  
                  return (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.النوع}</TableCell>
                      <TableCell>{item.البيان}</TableCell>
                      <TableCell>
                        <span className={item.الكمية_المتاحة <= 0 ? 'text-red-600 font-bold' : ''}>
                          {item.الكمية_المتاحة.toFixed(3)}
                        </span>
                      </TableCell>
                      <TableCell>{formatCurrency(item.متوسط_سعر_الشراء)}</TableCell>
                      <TableCell>{formatCurrency(item.متوسط_سعر_البيع)}</TableCell>
                      <TableCell>{formatCurrency(stockValue)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {item.آخر_تحديث}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={stockStatus.color}>
                          {stockStatus.label}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          
          {filteredInventory.length === 0 && searchTerm !== '' && (
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