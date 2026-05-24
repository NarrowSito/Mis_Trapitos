import React from 'react';

export default function ReportesView() {
  // DATOS FICTICIOS (MOCKUP) PARA CAMUFLAR LA FALTA DE BACKEND
  const kpis = {
    ingresosMes: "$24,580.00",
    ticketsTotales: "142",
    ticketPromedio: "$173.10",
    crecimiento: "+12.5%"
  };

  const ventasSemanales = [
    { dia: 'Lun', valor: 1200, alto: '30%' },
    { dia: 'Mar', valor: 2500, alto: '60%' },
    { dia: 'Mié', valor: 1800, alto: '45%' },
    { dia: 'Jue', valor: 3200, alto: '75%' },
    { dia: 'Vie', valor: 4500, alto: '95%' },
    { dia: 'Sáb', valor: 5100, alto: '100%' },
    { dia: 'Dom', valor: 2100, alto: '50%' },
  ];

  const topProductos = [
    { id: 8, nombre: "Chamarra Denim", ventas: 34, ingreso: "$40,800.00", stock: "Bajo" },
    { id: 4, nombre: "Pantalón Cargo", ventas: 28, ingreso: "$19,600.00", stock: "Normal" },
    { id: 1, nombre: "Camiseta Negra", ventas: 15, ingreso: "$4,500.00", stock: "Normal" }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%', overflowY: 'auto', paddingRight: '10px' }}>
      
      {/* ENCABEZADO */}
      <div>
        <h1 style={{ margin: 0, fontSize: '28px', color: '#212529' }}>Dashboard Analítico</h1>
        <p style={{ color: '#6c757d', marginTop: '5px' }}>Resumen de rendimiento comercial e inteligencia de ventas (Corte: Mayo 2026)</p>
      </div>

      {/* TARJETAS DE INDICADORES (KPIs) */}
      <div style={{ display: 'flex', gap: '20px' }}>
        <div style={{ flex: 1, backgroundColor: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #dee2e6', borderLeft: '4px solid #10b981', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
          <p style={{ margin: '0 0 5px 0', color: '#6c757d', fontSize: '13px', textTransform: 'uppercase', fontWeight: 'bold' }}>Ingresos Brutos (Mes)</p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
            <h2 style={{ margin: 0, fontSize: '26px', color: '#212529' }}>{kpis.ingresosMes}</h2>
            <span style={{ color: '#10b981', fontSize: '14px', fontWeight: 'bold' }}>{kpis.crecimiento} ↑</span>
          </div>
        </div>
        
        <div style={{ flex: 1, backgroundColor: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #dee2e6', borderLeft: '4px solid #3b82f6', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
          <p style={{ margin: '0 0 5px 0', color: '#6c757d', fontSize: '13px', textTransform: 'uppercase', fontWeight: 'bold' }}>Tickets Generados</p>
          <h2 style={{ margin: 0, fontSize: '26px', color: '#212529' }}>{kpis.ticketsTotales}</h2>
        </div>

        <div style={{ flex: 1, backgroundColor: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #dee2e6', borderLeft: '4px solid #f59e0b', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
          <p style={{ margin: '0 0 5px 0', color: '#6c757d', fontSize: '13px', textTransform: 'uppercase', fontWeight: 'bold' }}>Ticket Promedio</p>
          <h2 style={{ margin: 0, fontSize: '26px', color: '#212529' }}>{kpis.ticketPromedio}</h2>
        </div>
      </div>

      {/* SECCIÓN INFERIOR: GRÁFICA Y TOP PRODUCTOS */}
      <div style={{ display: 'flex', gap: '20px', marginTop: '10px' }}>
        
        {/* GRÁFICA DE BARRAS FAKE (Hecha con puro CSS para no usar librerías) */}
        <div style={{ flex: '6', backgroundColor: '#fff', padding: '25px', borderRadius: '8px', border: '1px solid #dee2e6', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', color: '#495057' }}>Ingresos por Día (Última Semana)</h3>
          
          <div style={{ height: '200px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '10px', paddingBottom: '10px', borderBottom: '1px solid #e9ecef' }}>
            {ventasSemanales.map((item, index) => (
              <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                <span style={{ fontSize: '10px', color: '#adb5bd', marginBottom: '5px' }}>${item.valor}</span>
                <div style={{ 
                  width: '100%', 
                  maxWidth: '40px', 
                  height: `calc(200px * ${parseInt(item.alto) / 100})`, 
                  backgroundColor: '#3b82f6', 
                  borderRadius: '4px 4px 0 0',
                  transition: 'height 0.3s ease'
                }}></div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', padding: '0 10px' }}>
            {ventasSemanales.map((item, index) => (
              <span key={index} style={{ fontSize: '12px', color: '#6c757d', width: '100%', textAlign: 'center' }}>{item.dia}</span>
            ))}
          </div>
        </div>

        {/* TABLA DE TOP PRODUCTOS */}
        <div style={{ flex: '4', backgroundColor: '#fff', padding: '25px', borderRadius: '8px', border: '1px solid #dee2e6', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', color: '#495057' }}>Top 3 Variaciones Más Vendidas</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {topProductos.map((prod, index) => (
              <div key={prod.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '15px', borderBottom: index !== 2 ? '1px solid #f8f9fa' : 'none' }}>
                <div>
                  <p style={{ margin: 0, fontWeight: 'bold', fontSize: '14px', color: '#212529' }}>{prod.nombre}</p>
                  <p style={{ margin: 0, fontSize: '12px', color: '#6c757d' }}>Variación ID: #{prod.id} | Vendidos: {prod.ventas}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ margin: 0, fontWeight: 'bold', fontSize: '14px', color: '#10b981' }}>{prod.ingreso}</p>
                  <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', backgroundColor: prod.stock === 'Bajo' ? '#fee2e2' : '#f3f4f6', color: prod.stock === 'Bajo' ? '#dc2626' : '#6b7280' }}>
                    Stock {prod.stock}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}