/**
 * Mutual Fund SIP Calculator
 * Calculates future value of Systematic Investment Plan (SIP) investments
 */
class SIPCalculator {
    constructor() {
        this.form = document.getElementById('sip-form');
        this.monthlyInvestmentInput = document.getElementById('monthlyInvestment');
        this.annualReturnInput = document.getElementById('annualReturn');
        this.investmentPeriodInput = document.getElementById('investmentPeriod');
        this.sipFrequencySelect = document.getElementById('sipFrequency');
        
        // Result elements
        this.totalInvestmentEl = document.getElementById('totalInvestment');
        this.estimatedReturnsEl = document.getElementById('estimatedReturns');
        this.totalValueEl = document.getElementById('totalValue');
        this.wealthGainedEl = document.getElementById('wealthGained');
        
        // Chart
        this.chart = null;
        this.chartCanvas = document.getElementById('investmentChart');
        
        // Export buttons
        this.exportPDFBtn = document.getElementById('exportPDF');
        this.exportImageBtn = document.getElementById('exportImage');
        
        this.init();
    }

    init() {
        // Add event listeners
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        this.monthlyInvestmentInput.addEventListener('input', () => this.validateAndCalculate());
        this.annualReturnInput.addEventListener('input', () => this.validateAndCalculate());
        this.investmentPeriodInput.addEventListener('input', () => this.validateAndCalculate());
        this.sipFrequencySelect.addEventListener('change', () => this.validateAndCalculate());
        
        this.exportPDFBtn.addEventListener('click', () => this.exportToPDF());
        this.exportImageBtn.addEventListener('click', () => this.exportToImage());
        
        // Initial calculation
        this.calculateAndDisplay();
    }

    handleSubmit(e) {
        e.preventDefault();
        this.calculateAndDisplay();
    }

    validateAndCalculate() {
        // Debounce the calculation to avoid excessive updates
        clearTimeout(this.calculateTimeout);
        this.calculateTimeout = setTimeout(() => {
            this.calculateAndDisplay();
        }, 300);
    }

    /**
     * Calculate SIP returns using the compound interest formula
     * FV = P × [((1 + r)^n - 1) / r] × (1 + r)
     */
    calculateSIP(monthlyInvestment, annualReturnRate, investmentPeriodYears, frequency = 'monthly') {
        try {
            // Validate inputs
            if (monthlyInvestment <= 0 || annualReturnRate <= 0 || investmentPeriodYears <= 0) {
                throw new Error('Invalid input values');
            }

            // Convert annual rate to decimal
            const annualRate = annualReturnRate / 100;
            
            let installmentAmount, periodicRate, totalInstallments;
            
            // Calculate based on frequency
            switch (frequency) {
                case 'monthly':
                    installmentAmount = monthlyInvestment;
                    periodicRate = annualRate / 12;
                    totalInstallments = investmentPeriodYears * 12;
                    break;
                case 'quarterly':
                    installmentAmount = monthlyInvestment * 3;
                    periodicRate = annualRate / 4;
                    totalInstallments = investmentPeriodYears * 4;
                    break;
                case 'yearly':
                    installmentAmount = monthlyInvestment * 12;
                    periodicRate = annualRate;
                    totalInstallments = investmentPeriodYears;
                    break;
                default:
                    throw new Error('Invalid frequency');
            }

            // Calculate future value using SIP formula
            const futureValue = installmentAmount * 
                (((Math.pow(1 + periodicRate, totalInstallments) - 1) / periodicRate) * 
                (1 + periodicRate));

            // Calculate total investment
            const totalInvestment = installmentAmount * totalInstallments;

            // Calculate returns
            const estimatedReturns = futureValue - totalInvestment;
            const wealthGainedPercentage = ((estimatedReturns / totalInvestment) * 100);

            return {
                futureValue: Math.round(futureValue),
                totalInvestment: Math.round(totalInvestment),
                estimatedReturns: Math.round(estimatedReturns),
                wealthGainedPercentage: Math.round(wealthGainedPercentage * 10) / 10,
                monthlyContribution: installmentAmount,
                periodicRate,
                totalInstallments
            };
        } catch (error) {
            console.error('Calculation error:', error);
            return null;
        }
    }

    calculateAndDisplay() {
        const monthlyInvestment = parseFloat(this.monthlyInvestmentInput.value) || 0;
        const annualReturn = parseFloat(this.annualReturnInput.value) || 0;
        const investmentPeriod = parseFloat(this.investmentPeriodInput.value) || 0;
        const frequency = this.sipFrequencySelect.value;

        // Validate inputs
        if (!this.validateInputs(monthlyInvestment, annualReturn, investmentPeriod)) {
            return;
        }

        const result = this.calculateSIP(monthlyInvestment, annualReturn, investmentPeriod, frequency);
        
        if (result) {
            this.displayResults(result);
            this.updateChart(result);
        }
    }

    validateInputs(monthlyInvestment, annualReturn, investmentPeriod) {
        let isValid = true;

        // Remove existing error styling
        [this.monthlyInvestmentInput, this.annualReturnInput, this.investmentPeriodInput].forEach(input => {
            input.classList.remove('border-red-500');
        });

        // Validate monthly investment
        if (monthlyInvestment < 500 || monthlyInvestment > 1000000) {
            this.monthlyInvestmentInput.classList.add('border-red-500');
            isValid = false;
        }

        // Validate annual return
        if (annualReturn < 1 || annualReturn > 30) {
            this.annualReturnInput.classList.add('border-red-500');
            isValid = false;
        }

        // Validate investment period
        if (investmentPeriod < 1 || investmentPeriod > 50) {
            this.investmentPeriodInput.classList.add('border-red-500');
            isValid = false;
        }

        return isValid;
    }

    displayResults(result) {
        this.totalInvestmentEl.textContent = this.formatCurrency(result.totalInvestment);
        this.estimatedReturnsEl.textContent = this.formatCurrency(result.estimatedReturns);
        this.totalValueEl.textContent = this.formatCurrency(result.futureValue);
        this.wealthGainedEl.textContent = `${result.wealthGainedPercentage}%`;
    }

    updateChart(result) {
        const frequency = this.sipFrequencySelect.value;
        const installmentsPerYear = frequency === 'monthly' ? 12 : (frequency === 'quarterly' ? 4 : 1);
        const yearsData = this.generateYearlyData(result, installmentsPerYear);
        
        if (this.chart) {
            this.chart.destroy();
        }

        const ctx = this.chartCanvas.getContext('2d');
        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: yearsData.map(d => `Year ${d.year}`),
                datasets: [
                    {
                        label: 'Total Investment',
                        data: yearsData.map(d => d.totalInvestment),
                        borderColor: '#3B82F6',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        fill: false,
                        tension: 0.4
                    },
                    {
                        label: 'Future Value',
                        data: yearsData.map(d => d.futureValue),
                        borderColor: '#10B981',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        fill: false,
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Investment Growth Over Time'
                    },
                    legend: {
                        display: true,
                        position: 'top'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '₹' + value.toLocaleString('en-IN');
                            }
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                hover: {
                    animationDuration: 300
                }
            }
        });
    }

    generateYearlyData(result, installmentsPerYear) {
        const years = parseFloat(this.investmentPeriodInput.value);
        const monthlyInvestment = parseFloat(this.monthlyInvestmentInput.value);
        const annualReturn = parseFloat(this.annualReturnInput.value) / 100;
        const periodicRate = annualReturn / installmentsPerYear;
        
        const data = [];
        
        for (let year = 1; year <= years; year++) {
            const installments = year * installmentsPerYear;
            const totalInvestment = result.monthlyContribution * installments;
            
            // Calculate future value at this point
            const futureValue = result.monthlyContribution * 
                (((Math.pow(1 + periodicRate, installments) - 1) / periodicRate) * 
                (1 + periodicRate));
            
            data.push({
                year,
                totalInvestment: Math.round(totalInvestment),
                futureValue: Math.round(futureValue)
            });
        }
        
        return data;
    }

    async exportToPDF() {
        try {
            const { jsPDF } = window.jspdf;
            
            // Create a new PDF document
            const pdf = new jsPDF();
            
            // Get the current results
            const monthlyInvestment = parseFloat(this.monthlyInvestmentInput.value);
            const annualReturn = parseFloat(this.annualReturnInput.value);
            const investmentPeriod = parseFloat(this.investmentPeriodInput.value);
            const frequency = this.sipFrequencySelect.value;
            
            const result = this.calculateSIP(monthlyInvestment, annualReturn, investmentPeriod, frequency);
            
            // Add content to PDF
            pdf.setFontSize(20);
            pdf.text('Mutual Fund SIP Calculator Report', 20, 20);
            
            pdf.setFontSize(12);
            pdf.text('Investment Details:', 20, 40);
            pdf.text(`Monthly Investment: ${this.formatCurrency(monthlyInvestment)}`, 30, 50);
            pdf.text(`Annual Return Rate: ${annualReturn}%`, 30, 60);
            pdf.text(`Investment Period: ${investmentPeriod} years`, 30, 70);
            pdf.text(`SIP Frequency: ${frequency.charAt(0).toUpperCase() + frequency.slice(1)}`, 30, 80);
            
            pdf.text('Investment Summary:', 20, 100);
            pdf.text(`Total Investment: ${this.formatCurrency(result.totalInvestment)}`, 30, 110);
            pdf.text(`Estimated Returns: ${this.formatCurrency(result.estimatedReturns)}`, 30, 120);
            pdf.text(`Total Future Value: ${this.formatCurrency(result.futureValue)}`, 30, 130);
            pdf.text(`Wealth Gained: ${result.wealthGainedPercentage}%`, 30, 140);
            
            pdf.text('Generated by TechnoMind AI SIP Calculator', 20, 160);
            pdf.text(`Date: ${new Date().toLocaleDateString()}`, 20, 170);
            
            // Save the PDF
            pdf.save('sip-calculation-report.pdf');
        } catch (error) {
            console.error('PDF export error:', error);
            alert('Error generating PDF. Please try again.');
        }
    }

    async exportToImage() {
        try {
            const resultsSection = document.getElementById('results').parentElement;
            
            const canvas = await html2canvas(resultsSection, {
                backgroundColor: '#ffffff',
                scale: 2,
                logging: false
            });
            
            // Create download link
            const link = document.createElement('a');
            link.download = 'sip-calculation-summary.png';
            link.href = canvas.toDataURL();
            link.click();
        } catch (error) {
            console.error('Image export error:', error);
            alert('Error generating image. Please try again.');
        }
    }

    formatCurrency(amount) {
        return '₹' + amount.toLocaleString('en-IN');
    }
}

// Unit Tests for SIP Calculator Logic
class SIPCalculatorTests {
    constructor() {
        this.testResults = [];
    }

    runAllTests() {
        console.log('Running SIP Calculator Tests...');
        
        this.testBasicCalculation();
        this.testDifferentFrequencies();
        this.testEdgeCases();
        this.testInputValidation();
        
        this.displayResults();
    }

    testBasicCalculation() {
        const calculator = new SIPCalculator();
        
        // Test case: ₹5000/month for 10 years at 12% annual return
        const result = calculator.calculateSIP(5000, 12, 10, 'monthly');
        
        const expectedTotalInvestment = 5000 * 12 * 10; // ₹6,00,000
        const tolerance = 1000; // Allow small variations due to rounding
        
        this.assert(
            Math.abs(result.totalInvestment - expectedTotalInvestment) <= tolerance,
            'Basic calculation - Total Investment',
            `Expected: ₹${expectedTotalInvestment}, Got: ₹${result.totalInvestment}`
        );

        this.assert(
            result.futureValue > result.totalInvestment,
            'Basic calculation - Future Value should be greater than Total Investment',
            `Future Value: ₹${result.futureValue}, Total Investment: ₹${result.totalInvestment}`
        );
    }

    testDifferentFrequencies() {
        const calculator = new SIPCalculator();
        
        // Test monthly vs quarterly vs yearly
        const monthlyResult = calculator.calculateSIP(5000, 12, 10, 'monthly');
        const quarterlyResult = calculator.calculateSIP(5000, 12, 10, 'quarterly');
        const yearlyResult = calculator.calculateSIP(5000, 12, 10, 'yearly');
        
        // All should have same total investment amount (adjusted for frequency)
        this.assert(
            monthlyResult.totalInvestment === quarterlyResult.totalInvestment,
            'Different frequencies - Same total investment',
            `Monthly: ₹${monthlyResult.totalInvestment}, Quarterly: ₹${quarterlyResult.totalInvestment}`
        );
        
        this.assert(
            quarterlyResult.totalInvestment === yearlyResult.totalInvestment,
            'Different frequencies - Same total investment (quarterly vs yearly)',
            `Quarterly: ₹${quarterlyResult.totalInvestment}, Yearly: ₹${yearlyResult.totalInvestment}`
        );
    }

    testEdgeCases() {
        const calculator = new SIPCalculator();
        
        // Test minimum values
        const minResult = calculator.calculateSIP(500, 1, 1, 'monthly');
        this.assert(
            minResult !== null,
            'Edge case - Minimum values should work',
            'Should handle minimum input values'
        );
        
        // Test maximum reasonable values
        const maxResult = calculator.calculateSIP(100000, 25, 30, 'monthly');
        this.assert(
            maxResult !== null && maxResult.futureValue > 0,
            'Edge case - Maximum values should work',
            'Should handle large input values'
        );
    }

    testInputValidation() {
        const calculator = new SIPCalculator();
        
        // Test invalid inputs
        const invalidResult1 = calculator.calculateSIP(-1000, 12, 10, 'monthly');
        const invalidResult2 = calculator.calculateSIP(5000, -12, 10, 'monthly');
        const invalidResult3 = calculator.calculateSIP(5000, 12, -10, 'monthly');
        
        this.assert(
            invalidResult1 === null,
            'Input validation - Negative monthly investment',
            'Should return null for negative investment'
        );
        
        this.assert(
            invalidResult2 === null,
            'Input validation - Negative annual return',
            'Should return null for negative return rate'
        );
        
        this.assert(
            invalidResult3 === null,
            'Input validation - Negative investment period',
            'Should return null for negative period'
        );
    }

    assert(condition, testName, message) {
        const result = {
            name: testName,
            passed: condition,
            message: message
        };
        
        this.testResults.push(result);
        
        if (condition) {
            console.log(`✅ ${testName}: ${message}`);
        } else {
            console.error(`❌ ${testName}: ${message}`);
        }
    }

    displayResults() {
        const totalTests = this.testResults.length;
        const passedTests = this.testResults.filter(r => r.passed).length;
        
        console.log(`\nTest Results: ${passedTests}/${totalTests} tests passed`);
        
        if (passedTests === totalTests) {
            console.log('🎉 All tests passed!');
        } else {
            console.log('❌ Some tests failed. Check the details above.');
        }
    }
}

// Initialize the SIP Calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SIPCalculator();
    
    // Run tests if in development mode (check for localhost or specific parameter)
    if (window.location.hostname === 'localhost' || window.location.search.includes('test=true')) {
        const tests = new SIPCalculatorTests();
        tests.runAllTests();
    }
});