document.addEventListener('DOMContentLoaded', function() {
    // Configuración inicial
    const criInput = document.getElementById('cri');
    criInput.value = '100.00';
    
    // Manejo de factores de ponderación
    const fpActivo = document.getElementById('fpActivo');
    const factoresSection = document.getElementById('factoresPonderacion');
    
    fpActivo.addEventListener('change', function() {
        factoresSection.style.display = this.checked ? 'block' : 'none';
    });
    
    // Manejo de secuelas
    const secuelasContainer = document.getElementById('secuelasContainer');
    const agregarSecuelaBtn = document.getElementById('agregarSecuela');
    
    agregarSecuelaBtn.addEventListener('click', function() {
        if (document.querySelectorAll('.secuela-item').length >= 12) {
            alert('Máximo 12 secuelas permitidas');
            return;
        }
        
        const secuelaDiv = document.createElement('div');
        secuelaDiv.className = 'secuela-item';
        
        const input = document.createElement('input');
        input.type = 'number';
        input.placeholder = 'Porcentaje de secuela';
        input.step = '0.01';
        input.min = '0';
        input.max = '100';
        input.className = 'ìnpSecuela';
        input.required = true;
        
        const eliminarBtn = document.createElement('button');
        eliminarBtn.type = 'button';
        eliminarBtn.className = 'btn';
        eliminarBtn.textContent = 'Eliminar';
        eliminarBtn.addEventListener('click', function() {
            secuelasContainer.removeChild(secuelaDiv);
        });
        
        secuelaDiv.appendChild(input);
        secuelaDiv.appendChild(eliminarBtn);
        secuelasContainer.appendChild(secuelaDiv);
    });
    
    // Calcular resultados
    const calcularBtn = document.getElementById('calcular');
    calcularBtn.addEventListener('click', function() {
        // Validar CRI
        let cri = parseFloat(criInput.value) || 100;
        cri = Math.min(100, Math.max(0, cri));
        criInput.value = cri.toFixed(2);
        
        // Obtener secuelas
        const secuelas = Array.from(document.querySelectorAll('.secuela-item input'))
            .map(input => parseFloat(input.value) || 0)
            .filter(val => val > 0);
        
        if (secuelas.length === 0) {
            alert('Debe ingresar al menos una secuela');
            return;
        }
        
        // Ordenar de mayor a menor
        secuelas.sort((a, b) => b - a);
        
        // Obtener factores de ponderación
        let factores = [];
        if (fpActivo.checked) {
            const dificultad = parseInt(document.getElementById('dificultad').value);
            const edad = parseInt(document.getElementById('edad').value);
            
            if (dificultad) {
                factores.push({
                    nombre: 'Dificultad para tareas habituales',
                    valor: dificultad
                });
            }
            
            if (edad) {
                factores.push({
                    nombre: 'Edad',
                    valor: edad
                });
            }
        }
        
        // Calcular resultados
        const resultados = calcularResultados(cri, secuelas, factores);
        
        // Guardar y redirigir
        localStorage.setItem('resultadosIncapacidad', JSON.stringify(resultados));
        window.location.href = 'resultados.html';
    });
    
    // Agregar primera secuela por defecto
    agregarSecuelaBtn.click();
});

function calcularResultados(cri, secuelas, factores) {
    const resultados = {
        cri: cri,
        secuelas: [],
        subtotal: 0,
        factores: factores,
        subtotalFactores: 0,
        porcentajeTotal: 0
    };
    
    // Calcular cada secuela
    let capacidadRestante = 100;
    secuelas.forEach((secuela, index) => {
        let porcentajeAplicado;
        
        if (index === 0) {
            porcentajeAplicado = secuela;
        } else {
            porcentajeAplicado = (capacidadRestante * secuela) / 100;
        }
        
        capacidadRestante -= porcentajeAplicado;
        
        resultados.secuelas.push({
            nombre: `Secuela ${String.fromCharCode(65 + index)}`,
            porcentaje: secuela,
            capacidadRestanteAnterior: index === 0 ? 100 : capacidadRestante + porcentajeAplicado,
            porcentajeAplicado: porcentajeAplicado
        });
    });
    
    // Calcular subtotal
    resultados.subtotal = resultados.secuelas.reduce((sum, secuela) => sum + secuela.porcentajeAplicado, 0);
    
    // Calcular factores de ponderación
    if (factores.length > 0) {
        const sumaFactores = factores.reduce((sum, factor) => sum + factor.valor, 0);
        resultados.subtotalFactores = (resultados.subtotal * sumaFactores) / 100;
    }
    
    // Calcular total
    resultados.porcentajeTotal = (cri * (resultados.subtotal + resultados.subtotalFactores)) / 100;
    
    return resultados;
}