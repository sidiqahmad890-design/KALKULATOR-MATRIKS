// Matrix Calculator App
let currentOperation = 'add';
let lastResult = null;

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    initMatrices();
    initEventListeners();
    loadTheme();
});

// Initialize matrices
function initMatrices() {
    createMatrix('A', 3, 3);
    createMatrix('B', 3, 3);
}

// Create matrix grid
function createMatrix(name, rows, cols) {
    const grid = document.getElementById(`matrix${name}`);
    grid.innerHTML = '';
    grid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const input = document.createElement('input');
            input.type = 'number';
            input.className = 'matrix-cell';
            input.id = `${name}_${i}_${j}`;
            input.placeholder = '0';
            input.step = 'any';
            input.addEventListener('keydown', (e) => handleCellNavigation(e, name, i, j, rows, cols));
            grid.appendChild(input);
        }
    }
}

// Handle arrow key navigation
function handleCellNavigation(e, name, i, j, rows, cols) {
    let newI = i, newJ = j;
    switch (e.key) {
        case 'ArrowUp': newI = Math.max(0, i - 1); break;
        case 'ArrowDown': newI = Math.min(rows - 1, i + 1); break;
        case 'ArrowLeft': if (e.target.selectionStart === 0) newJ = Math.max(0, j - 1); else return; break;
        case 'ArrowRight': if (e.target.selectionStart === e.target.value.length) newJ = Math.min(cols - 1, j + 1); else return; break;
        case 'Enter': e.preventDefault(); newI = i < rows - 1 ? i + 1 : i; break;
        case 'Tab': return;
        default: return;
    }
    if (newI !== i || newJ !== j) {
        e.preventDefault();
        document.getElementById(`${name}_${newI}_${newJ}`)?.focus();
    }
}

// Initialize event listeners
function initEventListeners() {
    // Operation buttons
    document.querySelectorAll('.op-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.op-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentOperation = btn.dataset.op;
            updateUI();
        });
    });

    // Size controls
    document.querySelectorAll('.plus-btn, .minus-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const matrix = btn.dataset.matrix;
            const dim = btn.dataset.dim;
            const input = document.getElementById(dim === 'rows' ? `rows${matrix}` : `cols${matrix}`);
            const delta = btn.classList.contains('plus-btn') ? 1 : -1;
            const newVal = Math.max(1, Math.min(10, parseInt(input.value) + delta));
            input.value = newVal;
            updateMatrix(matrix);
        });
    });

    // Size inputs direct change
    ['rowsA', 'colsA', 'rowsB', 'colsB'].forEach(id => {
        document.getElementById(id)?.addEventListener('change', () => {
            const matrix = id.includes('A') ? 'A' : 'B';
            updateMatrix(matrix);
        });
    });

    // Theme toggle
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
}

// Update matrix when size changes
function updateMatrix(name) {
    const rows = parseInt(document.getElementById(`rows${name}`).value) || 3;
    const cols = parseInt(document.getElementById(`cols${name}`).value) || 3;
    const oldValues = getMatrixValues(name);
    createMatrix(name, rows, cols);
    // Restore old values where possible
    for (let i = 0; i < Math.min(rows, oldValues.length); i++) {
        for (let j = 0; j < Math.min(cols, oldValues[i].length); j++) {
            const cell = document.getElementById(`${name}_${i}_${j}`);
            if (cell && oldValues[i][j] !== 0) cell.value = oldValues[i][j];
        }
    }
}

// Update UI based on operation
function updateUI() {
    const matrixBCard = document.getElementById('matrixBCard');
    const scalarCard = document.getElementById('scalarCard');
    const powerCard = document.getElementById('powerCard');
    const opSymbol = document.getElementById('operationSymbol');

    matrixBCard.classList.remove('hidden');
    scalarCard.classList.add('hidden');
    powerCard.classList.add('hidden');
    opSymbol.classList.remove('hidden');

    const symbols = { add: '+', subtract: '−', multiply: '×', scalar: 'k×', transpose: 'Tᵀ', determinant: '|M|', inverse: 'M⁻¹', power: 'Mⁿ', minor: 'Mᵢⱼ', cofactor: 'Cᵢⱼ' };
    opSymbol.querySelector('span').textContent = symbols[currentOperation] || '+';

    if (['transpose', 'determinant', 'inverse', 'minor', 'cofactor'].includes(currentOperation)) {
        matrixBCard.classList.add('hidden');
        opSymbol.classList.add('hidden');
    } else if (currentOperation === 'scalar') {
        matrixBCard.classList.add('hidden');
        scalarCard.classList.remove('hidden');
    } else if (currentOperation === 'power') {
        matrixBCard.classList.add('hidden');
        powerCard.classList.remove('hidden');
    }
}

// Get matrix values
function getMatrixValues(name) {
    const rows = parseInt(document.getElementById(`rows${name}`).value) || 3;
    const cols = parseInt(document.getElementById(`cols${name}`).value) || 3;
    const matrix = [];
    for (let i = 0; i < rows; i++) {
        matrix[i] = [];
        for (let j = 0; j < cols; j++) {
            const val = parseFloat(document.getElementById(`${name}_${i}_${j}`)?.value) || 0;
            matrix[i][j] = val;
        }
    }
    return matrix;
}

// Clear matrix
function clearMatrix(name) {
    const rows = parseInt(document.getElementById(`rows${name}`).value) || 3;
    const cols = parseInt(document.getElementById(`cols${name}`).value) || 3;
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const cell = document.getElementById(`${name}_${i}_${j}`);
            if (cell) cell.value = '';
        }
    }
    showToast('Matriks berhasil dihapus');
}

// Fill with random values
function randomMatrix(name) {
    const rows = parseInt(document.getElementById(`rows${name}`).value) || 3;
    const cols = parseInt(document.getElementById(`cols${name}`).value) || 3;
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const cell = document.getElementById(`${name}_${i}_${j}`);
            if (cell) cell.value = Math.floor(Math.random() * 19) - 9;
        }
    }
    showToast('Nilai acak berhasil diisi');
}

// Create identity matrix
function identityMatrix(name) {
    const rows = parseInt(document.getElementById(`rows${name}`).value) || 3;
    const cols = parseInt(document.getElementById(`cols${name}`).value) || 3;
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const cell = document.getElementById(`${name}_${i}_${j}`);
            if (cell) cell.value = i === j ? 1 : 0;
        }
    }
    showToast('Matriks identitas berhasil dibuat');
}

// Calculate result
function calculate() {
    const btn = document.getElementById('calculateBtn');
    btn.classList.add('calculating');

    try {
        const A = getMatrixValues('A');
        const B = getMatrixValues('B');
        let result;
        let isScalar = false;

        switch (currentOperation) {
            case 'add': result = MatrixLib.add(A, B); break;
            case 'subtract': result = MatrixLib.subtract(A, B); break;
            case 'multiply': result = MatrixLib.multiply(A, B); break;
            case 'scalar':
                const scalar = parseFloat(document.getElementById('scalarValue').value) || 0;
                result = MatrixLib.scalarMultiply(A, scalar);
                break;
            case 'transpose': result = MatrixLib.transpose(A); break;
            case 'determinant':
                result = MatrixLib.determinant(A);
                isScalar = true;
                break;
            case 'inverse': result = MatrixLib.inverse(A); break;
            case 'power':
                const power = parseInt(document.getElementById('powerValue').value) || 2;
                result = MatrixLib.power(A, power);
                break;
            case 'minor': result = MatrixLib.minorMatrix(A); break;
            case 'cofactor': result = MatrixLib.cofactorMatrix(A); break;
        }

        lastResult = result;
        displayResult(result, isScalar);
        showToast('Perhitungan berhasil!');
    } catch (error) {
        displayError(error.message);
    }

    setTimeout(() => btn.classList.remove('calculating'), 300);
}

// Display matrix result
function displayResult(result, isScalar = false) {
    const content = document.getElementById('resultContent');

    if (isScalar) {
        content.innerHTML = `
            <div class="scalar-result">
                <div class="scalar-value">${MatrixLib.formatNumber(result)}</div>
                <div class="scalar-label">Determinan</div>
            </div>
        `;
    } else {
        const rows = result.length;
        const cols = result[0].length;
        let cells = '';
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                cells += `<div class="result-cell">${MatrixLib.formatNumber(result[i][j])}</div>`;
            }
        }
        content.innerHTML = `
            <div class="result-matrix-wrapper">
                <div class="bracket left-bracket">[</div>
                <div class="result-matrix" style="grid-template-columns: repeat(${cols}, 1fr)">
                    ${cells}
                </div>
                <div class="bracket right-bracket">]</div>
            </div>
        `;
    }
    document.getElementById('resultSteps').classList.remove('hidden');
}

// Display error
function displayError(message) {
    document.getElementById('resultContent').innerHTML = `
        <div class="error-message">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M15 9l-6 6M9 9l6 6"/>
            </svg>
            <h4>Terjadi Kesalahan</h4>
            <p>${message}</p>
        </div>
    `;
    document.getElementById('resultSteps').classList.add('hidden');
}

// Toggle calculation steps
function toggleSteps() {
    const toggle = document.querySelector('.steps-toggle');
    const content = document.getElementById('stepsContent');
    toggle.classList.toggle('active');
    content.classList.toggle('hidden');

    if (!content.classList.contains('hidden') && lastResult) {
        content.innerHTML = generateSteps();
    }
}

// Generate detailed calculation steps
function generateSteps() {
    const A = getMatrixValues('A');
    const B = getMatrixValues('B');
    let steps = '';

    const operationNames = {
        add: 'Penjumlahan Matriks (A + B)',
        subtract: 'Pengurangan Matriks (A - B)',
        multiply: 'Perkalian Matriks (A × B)',
        scalar: 'Perkalian Skalar (k × A)',
        transpose: 'Transpose Matriks (Aᵀ)',
        determinant: 'Determinan Matriks |A|',
        inverse: 'Invers Matriks (A⁻¹)',
        power: 'Pangkat Matriks (Aⁿ)',
        minor: 'Matriks Minor',
        cofactor: 'Matriks Kofaktor'
    };

    steps += `<div class="step-item"><span class="step-number">1</span> <strong>Operasi:</strong> ${operationNames[currentOperation]}</div>`;
    steps += `<div class="step-item"><span class="step-number">2</span> <strong>Matriks A (${A.length}×${A[0].length}):</strong><br><pre>${formatMatrixText(A)}</pre></div>`;

    switch (currentOperation) {
        case 'add':
        case 'subtract':
            const symbol = currentOperation === 'add' ? '+' : '-';
            steps += `<div class="step-item"><span class="step-number">3</span> <strong>Matriks B (${B.length}×${B[0].length}):</strong><br><pre>${formatMatrixText(B)}</pre></div>`;
            steps += `<div class="step-item"><span class="step-number">4</span> <strong>Rumus:</strong> C[i][j] = A[i][j] ${symbol} B[i][j]</div>`;
            steps += `<div class="step-item"><span class="step-number">5</span> <strong>Proses perhitungan:</strong><br>`;
            for (let i = 0; i < A.length; i++) {
                for (let j = 0; j < A[0].length; j++) {
                    const result = currentOperation === 'add' ? A[i][j] + B[i][j] : A[i][j] - B[i][j];
                    steps += `C[${i + 1}][${j + 1}] = ${A[i][j]} ${symbol} ${B[i][j]} = ${result}<br>`;
                }
            }
            steps += `</div>`;
            break;

        case 'multiply':
            steps += `<div class="step-item"><span class="step-number">3</span> <strong>Matriks B (${B.length}×${B[0].length}):</strong><br><pre>${formatMatrixText(B)}</pre></div>`;
            steps += `<div class="step-item"><span class="step-number">4</span> <strong>Rumus:</strong> C[i][j] = Σ(k=1 to ${A[0].length}) A[i][k] × B[k][j]</div>`;
            steps += `<div class="step-item"><span class="step-number">5</span> <strong>Proses perhitungan:</strong><br>`;
            for (let i = 0; i < A.length; i++) {
                for (let j = 0; j < B[0].length; j++) {
                    let terms = [];
                    let sum = 0;
                    for (let k = 0; k < A[0].length; k++) {
                        terms.push(`(${A[i][k]}×${B[k][j]})`);
                        sum += A[i][k] * B[k][j];
                    }
                    steps += `C[${i + 1}][${j + 1}] = ${terms.join(' + ')} = ${sum}<br>`;
                }
            }
            steps += `</div>`;
            break;

        case 'scalar':
            const k = parseFloat(document.getElementById('scalarValue').value) || 0;
            steps += `<div class="step-item"><span class="step-number">3</span> <strong>Nilai Skalar (k):</strong> ${k}</div>`;
            steps += `<div class="step-item"><span class="step-number">4</span> <strong>Rumus:</strong> C[i][j] = k × A[i][j]</div>`;
            steps += `<div class="step-item"><span class="step-number">5</span> <strong>Proses perhitungan:</strong><br>`;
            for (let i = 0; i < A.length; i++) {
                for (let j = 0; j < A[0].length; j++) {
                    steps += `C[${i + 1}][${j + 1}] = ${k} × ${A[i][j]} = ${k * A[i][j]}<br>`;
                }
            }
            steps += `</div>`;
            break;

        case 'transpose':
            steps += `<div class="step-item"><span class="step-number">3</span> <strong>Rumus:</strong> Aᵀ[i][j] = A[j][i] (tukar baris dan kolom)</div>`;
            steps += `<div class="step-item"><span class="step-number">4</span> <strong>Proses:</strong><br>`;
            steps += `Baris menjadi kolom, kolom menjadi baris<br>`;
            steps += `Ukuran berubah dari ${A.length}×${A[0].length} menjadi ${A[0].length}×${A.length}`;
            steps += `</div>`;
            break;

        case 'determinant':
            const det = MatrixLib.determinant(A);
            steps += `<div class="step-item"><span class="step-number">3</span> <strong>Rumus (${A.length}×${A.length}):</strong><br>`;
            if (A.length === 2) {
                steps += `|A| = a₁₁×a₂₂ - a₁₂×a₂₁<br>`;
                steps += `|A| = (${A[0][0]}×${A[1][1]}) - (${A[0][1]}×${A[1][0]})<br>`;
                steps += `|A| = ${A[0][0] * A[1][1]} - ${A[0][1] * A[1][0]}<br>`;
            } else if (A.length === 3) {
                steps += `Metode Ekspansi Kofaktor (baris pertama):<br>`;
                steps += `|A| = a₁₁×C₁₁ - a₁₂×C₁₂ + a₁₃×C₁₃<br><br>`;
                for (let j = 0; j < 3; j++) {
                    const minor = MatrixLib.getMinor(A, 0, j);
                    const minorDet = MatrixLib.determinant(minor);
                    const sign = j % 2 === 0 ? '+' : '-';
                    const cofactor = Math.pow(-1, j) * minorDet;
                    steps += `C₁${j + 1} = ${j % 2 === 0 ? '+' : '-'}|Minor₁${j + 1}| = ${cofactor}<br>`;
                }
                steps += `<br>|A| = ${A[0][0]}×${Math.pow(-1, 0) * MatrixLib.determinant(MatrixLib.getMinor(A, 0, 0))} + ${A[0][1]}×${Math.pow(-1, 1) * MatrixLib.determinant(MatrixLib.getMinor(A, 0, 1))} + ${A[0][2]}×${Math.pow(-1, 2) * MatrixLib.determinant(MatrixLib.getMinor(A, 0, 2))}<br>`;
            } else {
                steps += `Menggunakan ekspansi kofaktor rekursif<br>`;
            }
            steps += `</div>`;
            steps += `<div class="step-item"><span class="step-number">4</span> <strong>Hasil:</strong> |A| = ${det}</div>`;
            break;

        case 'inverse':
            const detInv = MatrixLib.determinant(A);
            steps += `<div class="step-item"><span class="step-number">3</span> <strong>Langkah 1 - Hitung Determinan:</strong><br>|A| = ${detInv}</div>`;
            steps += `<div class="step-item"><span class="step-number">4</span> <strong>Langkah 2 - Cek:</strong> ${detInv !== 0 ? 'Determinan ≠ 0, invers ada!' : 'Determinan = 0, TIDAK ADA invers!'}</div>`;
            if (detInv !== 0) {
                steps += `<div class="step-item"><span class="step-number">5</span> <strong>Langkah 3 - Rumus:</strong><br>A⁻¹ = (1/|A|) × Adj(A)<br>A⁻¹ = (1/${detInv}) × Adj(A)</div>`;
                steps += `<div class="step-item"><span class="step-number">6</span> <strong>Langkah 4:</strong><br>`;
                if (A.length === 2) {
                    steps += `Untuk 2×2: A⁻¹ = (1/|A|) × [d, -b; -c, a]<br>`;
                    steps += `A⁻¹ = (1/${detInv}) × [${A[1][1]}, ${-A[0][1]}; ${-A[1][0]}, ${A[0][0]}]`;
                } else {
                    steps += `Hitung Matriks Kofaktor → Transpose → Bagi dengan |A|`;
                }
                steps += `</div>`;
            }
            break;

        case 'power':
            const n = parseInt(document.getElementById('powerValue').value) || 2;
            steps += `<div class="step-item"><span class="step-number">3</span> <strong>Pangkat (n):</strong> ${n}</div>`;
            steps += `<div class="step-item"><span class="step-number">4</span> <strong>Rumus:</strong> A${superscript(n)} = A × A × ... × A (${n} kali)</div>`;
            steps += `<div class="step-item"><span class="step-number">5</span> <strong>Proses:</strong><br>`;
            for (let i = 1; i < n; i++) {
                steps += `Langkah ${i}: A${superscript(i)} × A = A${superscript(i + 1)}<br>`;
            }
            steps += `</div>`;
            break;

        case 'minor':
            steps += `<div class="step-item"><span class="step-number">3</span> <strong>Definisi:</strong><br>Minor Mᵢⱼ = Determinan submatriks setelah menghapus baris i dan kolom j</div>`;
            steps += `<div class="step-item"><span class="step-number">4</span> <strong>Proses perhitungan:</strong><br>`;
            for (let i = 0; i < A.length; i++) {
                for (let j = 0; j < A[0].length; j++) {
                    const minorMatrix = MatrixLib.getMinor(A, i, j);
                    const minorDet = MatrixLib.determinant(minorMatrix);
                    steps += `M[${i + 1}][${j + 1}] = |submatriks hapus baris ${i + 1}, kolom ${j + 1}| = ${minorDet}<br>`;
                }
            }
            steps += `</div>`;
            break;

        case 'cofactor':
            steps += `<div class="step-item"><span class="step-number">3</span> <strong>Definisi:</strong><br>Kofaktor Cᵢⱼ = (-1)^(i+j) × Mᵢⱼ</div>`;
            steps += `<div class="step-item"><span class="step-number">4</span> <strong>Pola tanda:</strong><br><pre>[+ - +]\n[- + -]\n[+ - +]</pre></div>`;
            steps += `<div class="step-item"><span class="step-number">5</span> <strong>Proses perhitungan:</strong><br>`;
            for (let i = 0; i < A.length; i++) {
                for (let j = 0; j < A[0].length; j++) {
                    const minorDet = MatrixLib.determinant(MatrixLib.getMinor(A, i, j));
                    const sign = Math.pow(-1, i + j);
                    const cofactor = sign * minorDet;
                    const signSymbol = sign === 1 ? '+' : '-';
                    steps += `C[${i + 1}][${j + 1}] = (${signSymbol}1) × ${minorDet} = ${cofactor}<br>`;
                }
            }
            steps += `</div>`;
            break;
    }

    steps += `<div class="step-item"><span class="step-number">✓</span> <strong>Hasil Akhir:</strong><br><pre>${typeof lastResult === 'number' ? lastResult : formatMatrixText(lastResult)}</pre></div>`;

    return steps;
}

// Format matrix as text
function formatMatrixText(matrix) {
    if (typeof matrix === 'number') return matrix.toString();
    return matrix.map(row => '[ ' + row.map(v => MatrixLib.formatNumber(v).toString().padStart(6)).join('  ') + ' ]').join('\n');
}

// Create superscript number
function superscript(n) {
    const supers = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' };
    return n.toString().split('').map(d => supers[d] || d).join('');
}

// Copy result
function copyResult() {
    if (!lastResult) return showToast('Tidak ada hasil untuk disalin');

    let text = '';
    if (typeof lastResult === 'number') {
        text = lastResult.toString();
    } else {
        text = lastResult.map(row => row.map(v => MatrixLib.formatNumber(v)).join('\t')).join('\n');
    }

    navigator.clipboard.writeText(text).then(() => showToast('Hasil berhasil disalin!')).catch(() => showToast('Gagal menyalin'));
}

// Theme functions
function toggleTheme() {
    const theme = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('matrix-calc-theme', theme);
}

function loadTheme() {
    const theme = localStorage.getItem('matrix-calc-theme') || 'dark';
    document.documentElement.setAttribute('data-theme', theme);
}

// Toast notification
function showToast(message) {
    const toast = document.getElementById('toast');
    document.getElementById('toastMessage').textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}
