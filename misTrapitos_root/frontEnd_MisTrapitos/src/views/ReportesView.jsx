import React from 'react';

export default function ReportesView() {
  return (
    <div>
      <h1 style={{ margin: 0, fontSize: '28px', color: '#212529', marginBottom: '10px' }}>Consultas y Analiticas</h1>
      <p style={{ color: '#6c757d', marginBottom: '20px' }}>Balance de ingresos, metodos de pago y rendimiento del negocio.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #dee2e6', height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: '#adb5bd' }}>Grafico de ventas por fechas diferidas</span>
        </div>
        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #dee2e6', height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: '#adb5bd' }}>Distribucion analitica de metodos de pago</span>
        </div>
      </div>
    </div>
  );
}