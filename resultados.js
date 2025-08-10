document.addEventListener('DOMContentLoaded', function() {
    const resultadosContainer = document.getElementById('resultadosContainer');
    const volverBtn = document.getElementById('volver');
    
    // Obtener resultados
    const resultados = JSON.parse(localStorage.getItem('resultadosIncapacidad'));
    
    if (!resultados) {
        resultadosContainer.innerHTML = '<p>No hay resultados disponibles. Vuelva al formulario.</p>';
        return;
    }
    
    // Construir tabla de resultados
    let html = `
        <h2>Formula de Balthazar: [(100 – M) x m / 100] + M</h2>
        <p class="cri">Capacidad Restante Inicial (CRI): ${resultados.cri.toFixed(2)}%</p>
        
        <table>
            <thead>
                <tr>
                    <th>Secuela</th>
                    <th>Cálculo</th>
                    <th>Porcentaje Aplicado</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    resultados.secuelas.forEach(secuela => {
        const calculo = secuela.nombre === 'Secuela A' 
            ? `${secuela.porcentaje.toFixed(2)}%`
            : `${secuela.porcentaje.toFixed(2)}% de ${secuela.capacidadRestanteAnterior.toFixed(2)}% CR = ${secuela.porcentajeAplicado.toFixed(2)}%`;
        
        html += `
            <tr>
                <td>${secuela.nombre}</td>
                <td>${calculo}</td>
                <td>${secuela.porcentajeAplicado.toFixed(2)}%</td>
            </tr>
        `;
    });
    
    html += `
            </tbody>
        </table>
        
        <div class="result-section">
            <p><strong>Subtotal:</strong> ${resultados.subtotal.toFixed(2)}%</p>
    `;
    
    // Mostrar factores si aplican
    if (resultados.factores.length > 0) {
        html += `<h3>Factores de Ponderación:</h3><ul>`;
        
        resultados.factores.forEach(factor => {
            html += `<li>${factor.nombre}: ${factor.valor}%</li>`;
        });
        
        const sumaFactores = resultados.factores.reduce((sum, factor) => sum + factor.valor, 0);
        
        html += `</ul>
            <p><strong>Subtotal Factores de Ponderación (${sumaFactores}% de ${resultados.subtotal.toFixed(2)}%):</strong> 
            ${resultados.subtotalFactores.toFixed(2)}%</p>`;
    } else {
        html += `<p><strong>Factores de Ponderación:</strong> No aplica</p>`;
    }
    
    // Mostrar total
    html += `
            <p class="result-total">Porcentaje Total (${(resultados.subtotal + resultados.subtotalFactores).toFixed(2)}% de ${resultados.cri.toFixed(2)}% CRI): 
            ${resultados.porcentajeTotal.toFixed(2)}%</p>
        </div>
    `;
    
    resultadosContainer.innerHTML = html;

    // Función para imprimir
document.getElementById('imprimir').addEventListener('click', function() {
    // Clonamos el contenedor de resultados
    const printContent = document.getElementById('resultadosContainer').cloneNode(true);
    
    // Creamos un div oculto para la impresión
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Resultados de Incapacidad Laboral</title>
            <style>
                body { font-family: Arial; padding: 20px; }
                table { width: 100%; border-collapse: collapse; margin: 15px 0; }
                th, td { padding: 8px; text-align: left; border: 1px solid #ddd; }
                th { background-color: #f2f2f2; }
                .result-total { font-weight: bold; font-size: 14pt; margin-top: 20px; }
                .result-section { margin-top: 25px; border-top: 1px solid #000; padding-top: 15px; }
                h1 { color: #000; text-align: center; }
                h2 { margin-top: 25px; }
            </style>
        </head>
        <body>
            <h1>Resultados de Incapacidad Laboral</h1>
    `);
    
    
    
    // Insertamos el contenido clonado
    printWindow.document.write(printContent.innerHTML);
    printWindow.document.write('</body></html>');
    
    // Cerramos el documento y activamos la impresión
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
        printWindow.print();
        printWindow.close();
    }, 500);
});
    
    // Botón volver
    volverBtn.addEventListener('click', function() {
        window.location.href = 'index.html';
    });
});