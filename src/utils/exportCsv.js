export function exportToCsv(filename, rows) {
  if (!rows || !rows.length) return;
  const separator = ';'; // Point-virgule pour compatibilité Excel FR
  const keys = Object.keys(rows[0]);
  const csvContent =
    '\uFEFF' + // BOM UTF-8 pour Excel
    keys.join(separator) + '\n' +
    rows.map(row => keys.map(k => {
      const value = (row[k] ?? '').toString();
      // On ne met des guillemets QUE si le champ contient le séparateur, un guillemet ou un retour à la ligne
      if (value.includes(separator) || value.includes('"') || value.includes('\n')) {
        return '"' + value.replace(/"/g, '""') + '"';
      }
      return value;
    }).join(separator)).join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
} 