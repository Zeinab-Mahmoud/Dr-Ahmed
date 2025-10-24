import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  ArrowLeft, 
  FileText, 
  Calendar, 
  User, 
  Phone, 
  DollarSign,
  Package,
  Printer
} from 'lucide-react';
import { Invoice } from '@/types';
import { formatCurrency } from '@/lib/storage';

interface InvoiceViewerProps {
  invoice: Invoice;
  onBack: () => void;
}

export default function InvoiceViewer({ invoice, onBack }: InvoiceViewerProps) {
  const handlePrint = () => {
    window.print();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'مدفوع': return 'bg-green-100 text-green-800';
      case 'غير مدفوع': return 'bg-red-100 text-red-800';
      case 'مدفوع جزئياً': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    return type === 'وارد' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-blue-100 text-blue-800';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center print:hidden">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="ml-2 h-4 w-4" />
          العودة
        </Button>
        <Button onClick={handlePrint}>
          <Printer className="ml-2 h-4 w-4" />
          طباعة
        </Button>
      </div>

      {/* Invoice Details */}
      <Card>
        <CardHeader className="text-center bg-gradient-to-r from-blue-50 to-green-50">
          <div className="space-y-2">
            <CardTitle className="text-2xl text-blue-800">شركة العامر لتجارة الأخشاب</CardTitle>
            <p className="text-muted-foreground">📍 شارع التجارة الرئيسي، القاهرة، مصر</p>
            <p className="text-muted-foreground">📞 +20 123 456 7890 | 📧 info@alamer-wood.com</p>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {/* Invoice Header Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                <span className="font-semibold">رقم الفاتورة:</span>
                <span>{invoice.رقم_الفاتورة}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                <span className="font-semibold">التاريخ:</span>
                <span>{invoice.التاريخ}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">الوقت:</span>
                <span>{invoice.الوقت}</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-green-600" />
                <span className="font-semibold">العميل:</span>
                <span>{invoice.اسم_العميل}</span>
              </div>
              {invoice.رقم_الهاتف && (
                <div className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-green-600" />
                  <span className="font-semibold">الهاتف:</span>
                  <span>{invoice.رقم_الهاتف}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-green-600" />
                <span className="font-semibold">نوع الفاتورة:</span>
                <Badge className={getTypeColor(invoice.نوع_الفاتورة)}>
                  {invoice.نوع_الفاتورة}
                </Badge>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Items Table */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Package className="h-5 w-5" />
              تفاصيل الأصناف
            </h3>
            
            {invoice.العناصر.map((item, index) => (
              <Card key={item.id} className="border-l-4 border-l-blue-500">
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <span className="font-semibold text-blue-700">النوع:</span>
                      <p>{item.النوع}</p>
                    </div>
                    <div>
                      <span className="font-semibold text-blue-700">البيان:</span>
                      <p>{item.البيان}</p>
                    </div>
                    <div>
                      <span className="font-semibold text-blue-700">العدد الإجمالي:</span>
                      <p>{item.العدد_الإجمالي}</p>
                    </div>
                  </div>
                  
                  {item.التفاصيل.length > 0 && (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="text-right">العرض</TableHead>
                            <TableHead className="text-right">التخانة</TableHead>
                            <TableHead className="text-right">الطول</TableHead>
                            <TableHead className="text-right">السعر</TableHead>
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
                              <TableCell>{formatCurrency(detail.السعر)}</TableCell>
                              <TableCell>{detail.المكعب.toFixed(3)}</TableCell>
                              <TableCell>{formatCurrency(detail.الإجمالي)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                  
                  <div className="mt-4 text-left">
                    <span className="font-bold text-lg">
                      إجمالي الصنف: {formatCurrency(item.إجمالي_الصنف)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Separator className="my-6" />

          {/* Totals */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                {invoice.مصاريف_النقل && (
                  <div className="flex justify-between">
                    <span>مصاريف النقل:</span>
                    <span>{formatCurrency(invoice.مصاريف_النقل)}</span>
                  </div>
                )}
                {invoice.مصاريف_التنزيل && (
                  <div className="flex justify-between">
                    <span>مصاريف التنزيل:</span>
                    <span>{formatCurrency(invoice.مصاريف_التنزيل)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>إجمالي المصاريف:</span>
                  <span>{formatCurrency(invoice.إجمالي_المصاريف)}</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between text-lg font-bold">
                  <span>الإجمالي النهائي:</span>
                  <span className="text-green-600">{formatCurrency(invoice.الإجمالي_النهائي)}</span>
                </div>
                <div className="flex justify-between">
                  <span>حالة الدفع:</span>
                  <Badge className={getStatusColor(invoice.حالة_الدفع)}>
                    {invoice.حالة_الدفع}
                  </Badge>
                </div>
                {invoice.المبلغ_المدفوع && (
                  <div className="flex justify-between">
                    <span>المبلغ المدفوع:</span>
                    <span>{formatCurrency(invoice.المبلغ_المدفوع)}</span>
                  </div>
                )}
                {invoice.المبلغ_المتبقي && (
                  <div className="flex justify-between">
                    <span>المبلغ المتبقي:</span>
                    <span className="text-red-600">{formatCurrency(invoice.المبلغ_المتبقي)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {invoice.ملاحظات && (
            <>
              <Separator className="my-6" />
              <div>
                <h3 className="font-semibold mb-2">ملاحظات:</h3>
                <p className="text-muted-foreground bg-gray-50 p-3 rounded">{invoice.ملاحظات}</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}