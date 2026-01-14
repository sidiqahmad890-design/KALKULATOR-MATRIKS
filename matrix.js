// Matrix Operations Library
class MatrixLib {
    // Add two matrices
    static add(A, B) {
        if (A.length !== B.length || A[0].length !== B[0].length) {
            throw new Error('Ukuran matriks harus sama untuk penjumlahan');
        }
        return A.map((row, i) => row.map((val, j) => val + B[i][j]));
    }

    // Subtract two matrices
    static subtract(A, B) {
        if (A.length !== B.length || A[0].length !== B[0].length) {
            throw new Error('Ukuran matriks harus sama untuk pengurangan');
        }
        return A.map((row, i) => row.map((val, j) => val - B[i][j]));
    }

    // Multiply two matrices
    static multiply(A, B) {
        if (A[0].length !== B.length) {
            throw new Error(`Kolom matriks A (${A[0].length}) harus sama dengan baris matriks B (${B.length})`);
        }
        const result = [];
        for (let i = 0; i < A.length; i++) {
            result[i] = [];
            for (let j = 0; j < B[0].length; j++) {
                let sum = 0;
                for (let k = 0; k < A[0].length; k++) {
                    sum += A[i][k] * B[k][j];
                }
                result[i][j] = sum;
            }
        }
        return result;
    }

    // Scalar multiplication
    static scalarMultiply(matrix, scalar) {
        return matrix.map(row => row.map(val => val * scalar));
    }

    // Transpose matrix
    static transpose(matrix) {
        return matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]));
    }

    // Calculate determinant (recursive)
    static determinant(matrix) {
        const n = matrix.length;
        if (n !== matrix[0].length) {
            throw new Error('Determinan hanya untuk matriks persegi');
        }
        if (n === 1) return matrix[0][0];
        if (n === 2) return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];

        let det = 0;
        for (let j = 0; j < n; j++) {
            det += Math.pow(-1, j) * matrix[0][j] * this.determinant(this.getMinor(matrix, 0, j));
        }
        return det;
    }

    // Get minor matrix
    static getMinor(matrix, row, col) {
        return matrix
            .filter((_, i) => i !== row)
            .map(r => r.filter((_, j) => j !== col));
    }

    // Calculate cofactor matrix
    static cofactor(matrix) {
        const n = matrix.length;
        return matrix.map((row, i) =>
            row.map((_, j) => Math.pow(-1, i + j) * this.determinant(this.getMinor(matrix, i, j)))
        );
    }

    // Calculate adjoint (adjugate) matrix
    static adjoint(matrix) {
        return this.transpose(this.cofactor(matrix));
    }

    // Calculate inverse matrix
    static inverse(matrix) {
        const n = matrix.length;
        if (n !== matrix[0].length) {
            throw new Error('Invers hanya untuk matriks persegi');
        }
        const det = this.determinant(matrix);
        if (det === 0) {
            throw new Error('Matriks singular (determinan = 0), tidak memiliki invers');
        }
        if (n === 1) return [[1 / matrix[0][0]]];
        if (n === 2) {
            return [
                [matrix[1][1] / det, -matrix[0][1] / det],
                [-matrix[1][0] / det, matrix[0][0] / det]
            ];
        }
        const adj = this.adjoint(matrix);
        return adj.map(row => row.map(val => val / det));
    }

    // Matrix power
    static power(matrix, n) {
        if (matrix.length !== matrix[0].length) {
            throw new Error('Pangkat hanya untuk matriks persegi');
        }
        if (n < 1) throw new Error('Pangkat harus >= 1');
        if (n === 1) return matrix;
        let result = matrix;
        for (let i = 1; i < n; i++) {
            result = this.multiply(result, matrix);
        }
        return result;
    }

    // Calculate minor matrix (matrix of determinants of minors)
    static minorMatrix(matrix) {
        const n = matrix.length;
        if (n !== matrix[0].length) {
            throw new Error('Minor hanya untuk matriks persegi');
        }
        if (n < 2) {
            throw new Error('Minor membutuhkan matriks minimal 2x2');
        }
        return matrix.map((row, i) =>
            row.map((_, j) => this.determinant(this.getMinor(matrix, i, j)))
        );
    }

    // Calculate cofactor matrix (with signs applied)
    static cofactorMatrix(matrix) {
        const n = matrix.length;
        if (n !== matrix[0].length) {
            throw new Error('Kofaktor hanya untuk matriks persegi');
        }
        if (n < 2) {
            throw new Error('Kofaktor membutuhkan matriks minimal 2x2');
        }
        return matrix.map((row, i) =>
            row.map((_, j) => Math.pow(-1, i + j) * this.determinant(this.getMinor(matrix, i, j)))
        );
    }

    // Format number for display
    static formatNumber(num) {
        if (Number.isInteger(num)) return num.toString();
        const rounded = Math.round(num * 10000) / 10000;
        if (Math.abs(rounded) < 0.0001) return '0';
        return rounded.toString();
    }
}

// Export for use in app.js
window.MatrixLib = MatrixLib;
