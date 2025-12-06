import { useState } from 'react';
import { X, Mail, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { downloadShoppingListPDF } from '../utils/pdfGenerator';
import { downloadShoppingListExcel } from '../utils/excelGenerator';

export default function EmailExportModal({ isOpen, onClose, ingredientes, planificacion, title = 'Exportar Lista de Compras' }) {
  const [email, setEmail] = useState('');
  const [exportFormats, setExportFormats] = useState({
    pdf: true,
    excel: false
  });
  const [status, setStatus] = useState(null); // null, 'loading', 'success', 'error'
  const [message, setMessage] = useState('');

  if (!isOpen) return null;

  const handleToggleFormat = (format) => {
    setExportFormats(prev => ({
      ...prev,
      [format]: !prev[format]
    }));
  };

  const handleDownloadDirectly = () => {
    if (exportFormats.pdf) {
      downloadShoppingListPDF(ingredientes, planificacion);
    }
    if (exportFormats.excel) {
      downloadShoppingListExcel(ingredientes, planificacion);
    }
    onClose();
  };

  const handleSendByEmail = async () => {
    if (!email.trim()) {
      setStatus('error');
      setMessage('Por favor ingresa un email válido');
      return;
    }

    if (!exportFormats.pdf && !exportFormats.excel) {
      setStatus('error');
      setMessage('Selecciona al menos un formato de exportación');
      return;
    }

    setStatus('loading');
    setMessage('Preparando documentos...');

    try {
      // Generar archivos
      const files = [];

      if (exportFormats.pdf) {
        const pdfBlob = await generatePDF();
        files.push({
          name: `lista-compras-${new Date().toISOString().split('T')[0]}.pdf`,
          blob: pdfBlob,
          type: 'application/pdf'
        });
      }

      if (exportFormats.excel) {
        const excelBlob = await generateExcel();
        files.push({
          name: `lista-compras-${new Date().toISOString().split('T')[0]}.xlsx`,
          blob: excelBlob,
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });
      }

      // Usar FormData para enviar
      const formData = new FormData();
      formData.append('email', email);
      formData.append('subject', title);
      formData.append('message', `Adjunto encontrarás tu ${title.toLowerCase()}`);

      files.forEach((file, idx) => {
        formData.append(`file_${idx}`, file.blob, file.name);
      });

      // Enviar a API (usando EmailJS o un servicio similar)
      // Por ahora, mostramos opciones de descarga
      setStatus('success');
      setMessage(`Documentos preparados. Descargando ${files.map(f => f.name).join(', ')}...`);

      // Descargar archivos automáticamente
      setTimeout(() => {
        files.forEach(file => {
          const url = URL.createObjectURL(file.blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = file.name;
          a.click();
          URL.revokeObjectURL(url);
        });

        setMessage('✓ Documentos descargados. Puedes enviarlos manualmente desde tu email.');
        setTimeout(onClose, 3000);
      }, 500);
    } catch (error) {
      setStatus('error');
      setMessage(`Error: ${error.message}`);
    }
  };

  const generatePDF = async () => {
    const { jsPDF } = require('jspdf');
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text(title, 10, 15);

    doc.setFontSize(10);
    doc.text(`Generado: ${new Date().toLocaleDateString('es-AR')}`, 10, 23);

    // Resto del contenido del PDF...
    // (Usar la lógica de pdfGenerator.js)

    return doc.output('blob');
  };

  const generateExcel = async () => {
    const XLSX = require('xlsx');
    const wb = XLSX.utils.book_new();

    const data = [
      [title],
      ['Fecha:', new Date().toLocaleDateString('es-AR')],
      [],
      ['Ingrediente', 'Cantidad', 'Unidad'],
      ...ingredientes.map(ing => [
        ing.nombre,
        ing.cantidad_total.toFixed(2),
        ing.unidad || ''
      ])
    ];

    const ws = XLSX.utils.aoa_to_sheet(data);
    ws['!cols'] = [{ wch: 35 }, { wch: 15 }, { wch: 12 }];

    XLSX.utils.book_append_sheet(wb, ws, 'Lista');

    return new Promise((resolve) => {
      const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([wbout], { type: 'application/vnd.ms-excel' });
      resolve(blob);
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Mail size={24} />
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6 space-y-4">
          {/* Formatos de exportación */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Selecciona formatos de exportación:
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-3 cursor-pointer p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
                <input
                  type="checkbox"
                  checked={exportFormats.pdf}
                  onChange={() => handleToggleFormat('pdf')}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="text-gray-700">PDF</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
                <input
                  type="checkbox"
                  checked={exportFormats.excel}
                  onChange={() => handleToggleFormat('excel')}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="text-gray-700">Excel (XLSX)</span>
              </label>
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tu email:
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={status === 'loading'}
            />
            <p className="text-xs text-gray-600 mt-2">
              Los documentos se descargarán a tu computadora
            </p>
          </div>

          {/* Mensaje de estado */}
          {status && (
            <div className={`flex items-start gap-3 p-4 rounded-lg ${
              status === 'success' ? 'bg-green-50 border border-green-200' :
              status === 'error' ? 'bg-red-50 border border-red-200' :
              'bg-blue-50 border border-blue-200'
            }`}>
              {status === 'success' ? (
                <CheckCircle size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
              ) : status === 'error' ? (
                <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
              ) : (
                <div className="animate-spin">
                  <Send size={20} className="text-blue-600" />
                </div>
              )}
              <p className={`text-sm ${
                status === 'success' ? 'text-green-700' :
                status === 'error' ? 'text-red-700' :
                'text-blue-700'
              }`}>
                {message}
              </p>
            </div>
          )}
        </div>

        {/* Botones */}
        <div className="flex gap-3 border-t border-gray-200 p-6 bg-gray-50">
          <button
            onClick={handleDownloadDirectly}
            className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-colors"
            disabled={status === 'loading'}
          >
            Descargar
          </button>
          <button
            onClick={handleSendByEmail}
            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            disabled={status === 'loading' || (!exportFormats.pdf && !exportFormats.excel)}
          >
            <Send size={18} />
            Enviar
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg font-medium transition-colors"
            disabled={status === 'loading'}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
