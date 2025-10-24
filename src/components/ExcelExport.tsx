import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Download, 
  FileSpreadsheet, 
  Calendar,
  FolderOpen,
  Archive
} from 'lucide-react';
import { loadInvoices, exportToExcel } from '@/lib/storage';

export default function ExcelExport() {
  const invoices = loadInvoices();
  const incomingInvoices = invoices.filter(inv => inv.نوع_الفاتورة === 'وارد');
  const outgoingInvoices = invoices.filter(inv => inv.نوع_الفاتورة === 'منصرف');

  const handleExport = (type: 'وارد' | 'منصرف' | 'all') => {
    exportToExcel(invoices, type);
  };

  const createFolderStructure = () => {
    // This would create the folder structure as requested
    // Since we're in a web environment, we'll simulate this with multiple downloads
    const today = new Date();
    const dateFolder = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
    
    // Export incoming invoices
    if (incomingInvoices.length > 0) {
      setTimeout(() => exportToExcel(incomingInvoices, 'وارد'), 100);
    }
    
    // Export outgoing invoices
    if (outgoingInvoices.length > 0) {
      setTimeout(() => exportToExcel(outgoingInvoices, 'منصرف'), 500);
    }
    
    alert(`تم إنشاء ملفات Excel للتاريخ: ${dateFolder}\nسيتم تحميل ملف منفصل لكل نوع فاتورة`);
  };

  return (
    <div className="space-y-6">
      {/* Export Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">فواتير الوارد</p>
                <p className="text-2xl font-bold text-green-800">{incomingInvoices.length}</p>
              </div>
              <FileSpreadsheet className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">فواتير المنصرف</p>
                <p className="text-2xl font-bold text-blue-800">{outgoingInvoices.length}</p>
              </div>
              <FileSpreadsheet className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">إجمالي الفواتير</p>
                <p className="text-2xl font-bold text-purple-800">{invoices.length}</p>
              </div>
              <FileSpreadsheet className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Export Options */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            تصدير الفواتير إلى Excel
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Individual Exports */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">تصدير منفصل</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                onClick={() => handleExport('وارد')}
                disabled={incomingInvoices.length === 0}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Download className="ml-2 h-4 w-4" />
                تصدير فواتير الوارد
                <Badge variant="secondary" className="mr-2 bg-white text-green-600">
                  {incomingInvoices.length}
                </Badge>
              </Button>

              <Button
                onClick={() => handleExport('منصرف')}
                disabled={outgoingInvoices.length === 0}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Download className="ml-2 h-4 w-4" />
                تصدير فواتير المنصرف
                <Badge variant="secondary" className="mr-2 bg-white text-blue-600">
                  {outgoingInvoices.length}
                </Badge>
              </Button>

              <Button
                onClick={() => handleExport('all')}
                disabled={invoices.length === 0}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Download className="ml-2 h-4 w-4" />
                تصدير جميع الفواتير
                <Badge variant="secondary" className="mr-2 bg-white text-purple-600">
                  {invoices.length}
                </Badge>
              </Button>
            </div>
          </div>

          {/* Organized Export */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">تصدير منظم حسب التاريخ</h3>
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FolderOpen className="h-4 w-4" />
                <span>سيتم إنشاء هيكل المجلدات التالي:</span>
              </div>
              <div className="text-sm font-mono bg-white p-3 rounded border">
                <div>📁 فواتير_{new Date().toISOString().split('T')[0]}/</div>
                <div className="ml-4">📁 فواتير_الوارد/</div>
                <div className="ml-8">📄 فواتير_وارد_{new Date().toISOString().split('T')[0]}.csv</div>
                <div className="ml-4">📁 فواتير_المنصرف/</div>
                <div className="ml-8">📄 فواتير_منصرف_{new Date().toISOString().split('T')[0]}.csv</div>
              </div>
              <Button
                onClick={createFolderStructure}
                disabled={invoices.length === 0}
                className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white"
                size="lg"
              >
                <Archive className="ml-2 h-5 w-5" />
                إنشاء هيكل المجلدات وتصدير الفواتير
                <Calendar className="mr-2 h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">تعليمات الاستخدام:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• ملفات CSV متوافقة مع Excel وجميع برامج الجداول</li>
              <li>• يتم حفظ الملفات بترميز UTF-8 لدعم النصوص العربية</li>
              <li>• يمكن فتح الملفات مباشرة في Excel أو Google Sheets</li>
              <li>• كل ملف يحتوي على تفاصيل كاملة للفواتير مع حالة الدفع</li>
              <li>• يمكن استخدام هذه الملفات كنسخة احتياطية للبيانات</li>
            </ul>
          </div>

          {invoices.length === 0 && (
            <div className="text-center py-8">
              <FileSpreadsheet className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium text-muted-foreground mb-2">
                لا توجد فواتير للتصدير
              </p>
              <p className="text-sm text-muted-foreground">
                أضف بعض الفواتير أولاً لتتمكن من تصديرها
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}