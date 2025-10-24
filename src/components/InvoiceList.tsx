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
  Eye, 
  Edit, 
  Trash2, 
  FileText,
  Calendar,
  DollarSign
} from 'lucide-react';
import { Invoice } from '@/types';
import { loadInvoices, saveInvoices, formatCurrency } from '@/lib/storage';

interface InvoiceListProps {
  type?: 'وارد' | 'منصرف' | 'all';
  onViewInvoice?: (invoice: Invoice) => void;
  onEditInvoice?: (invoice: Invoice) => void;
}

export default function InvoiceList({ type = 'all', onViewInvoice, onEditInvoice }: InvoiceListProps) {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
    const loadedInvoices = loadInvoices();
    let filtered = loadedInvoices;
    
    if (type !== 'all') {
      filtered = loadedInvoices.filter(invoice => invoice.نوع_الفاتورة === type);
    }
    
    setInvoices(filtered);
    setFilteredInvoices(filtered);
  }, [type]);

  useEffect(() => {
    const filtered = invoices.filter(invoice =>
      invoice.اسم_العميل.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.رقم_الفاتورة.includes(searchTerm)
    );
    setFilteredInvoices(filtered);
  }, [searchTerm, invoices]);

  const handleDeleteInvoice = (invoiceId: string) => {
    const allInvoices = loadInvoices();
    const updatedInvoices = allInvoices.filter(inv => inv.id !== invoiceId);
    saveInvoices(updatedInvoices);
    
    const filtered = updatedInvoices.filter(invoice => 
      type === 'all' || invoice.نوع_الفاتورة === type
    );
    setInvoices(filtered);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'مدفوع': return 'bg-green-100 text-green-800';
      case 'غير مدفوع': return 'bg-red-100 text-red-800';
      case 'مدفوع جزئياً': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (invoiceType: string) => {
    return invoiceType === 'وارد' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-blue-100 text-blue-800';
  };

  if (filteredInvoices.length === 0 && searchTerm === '') {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="text-center">
            <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium text-muted-foreground mb-2">
              لا توجد فواتير {type !== 'all' ? type : ''} حتى الآن
            </p>
            <p className="text-sm text-muted-foreground">
              ابدأ بإضافة فاتورة جديدة لرؤيتها هنا
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            فواتير {type !== 'all' ? type : 'جميع الفواتير'}
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
                <TableHead className="text-right">رقم الفاتورة</TableHead>
                <TableHead className="text-right">التاريخ</TableHead>
                <TableHead className="text-right">العميل</TableHead>
                <TableHead className="text-right">النوع</TableHead>
                <TableHead className="text-right">الإجمالي</TableHead>
                <TableHead className="text-right">حالة الدفع</TableHead>
                <TableHead className="text-right">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">
                    {invoice.رقم_الفاتورة}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {invoice.التاريخ}
                    </div>
                  </TableCell>
                  <TableCell>{invoice.اسم_العميل}</TableCell>
                  <TableCell>
                    <Badge className={getTypeColor(invoice.نوع_الفاتورة)}>
                      {invoice.نوع_الفاتورة}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      {formatCurrency(invoice.الإجمالي_النهائي)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(invoice.حالة_الدفع)}>
                      {invoice.حالة_الدفع}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onViewInvoice?.(invoice)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEditInvoice?.(invoice)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteInvoice(invoice.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {filteredInvoices.length === 0 && searchTerm !== '' && (
          <div className="text-center py-8">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">لا توجد نتائج للبحث "{searchTerm}"</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}