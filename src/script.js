// Deduction rates
const RATES = {
    EPF: 0.11       // 11%
};

let EIS_RATES = eisRates;   // Load EIS rates from eis-rates.js
let SOCSO_RATES = socsoRates; // Load SOCSO rates from socso-rates.js
let TAX_BRACKETS = taxBrackets; // Load tax brackets from tax-brackets.js
let SKBBK_RATES = skbbkRates; // Load SKBBK rates from skbbk-rates.js

// Get DOM elements
const grossIncomeInput = document.getElementById('grossIncome');
const nonTaxableIncomeInput = document.getElementById('nonTaxableIncome');

// Deduction display elements
const epfAmount = document.getElementById('epfAmount');
const socsoAmount = document.getElementById('socsoAmount');
const eisAmount = document.getElementById('eisAmount');
const pcbAmount = document.getElementById('pcbAmount');
const skbbkAmount = document.getElementById('skbbkAmount');
const skbbkToggle = document.getElementById('skbbkToggle');

// Summary display elements
const grossIncomeDisplay = document.getElementById('grossIncomeDisplay');
const totalDeductionsDisplay = document.getElementById('totalDeductionsDisplay');
const netIncomeDisplay = document.getElementById('netIncomeDisplay');

// Breakdown display elements
const breakdownGross = document.getElementById('breakdownGross');
const breakdownEPF = document.getElementById('breakdownEPF');
const breakdownSOCSO = document.getElementById('breakdownSOCSO');
const breakdownEIS = document.getElementById('breakdownEIS');
const breakdownPCB = document.getElementById('breakdownPCB');
const breakdownSKBBK = document.getElementById('breakdownSKBBK');
const breakdownNet = document.getElementById('breakdownNet');

// Add event listeners
grossIncomeInput.addEventListener('input', calculateIncome);
nonTaxableIncomeInput.addEventListener('input', calculateIncome);
skbbkToggle.addEventListener('change', calculateIncome);

/**
 * Format number as Malaysian Ringgit currency
 */
function formatCurrency(value) {
    return new Intl.NumberFormat('en-MY', {
        style: 'currency',
        currency: 'MYR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value);
}

/**
 * Calculate SOCSO deduction based on gross income and rate table
 */
function calculateSOCSO(grossIncome) {
    // Find the applicable rate for the gross income
    for (let rate of SOCSO_RATES) {
        const meetsMinimum = grossIncome >= rate.min;
        const meetsMaximum = rate.max === null || grossIncome <= rate.max;
        
        if (meetsMinimum && meetsMaximum) {
            // Return SOCSO as an absolute amount (rate is in RM, not percentage)
            return rate.employee;
        }
    }
    
    // Fallback: return 0 if no rate found
    return 0;
}

/**
 * Calculate EIS deduction based on gross income and rate table
 */
function calculateEIS(grossIncome) {
    // Find the applicable rate for the gross income
    for (let rate of EIS_RATES) {
        const meetsMinimum = grossIncome >= rate.min;
        const meetsMaximum = rate.max === null || grossIncome <= rate.max;
        
        if (meetsMinimum && meetsMaximum) {
            // Return EIS as an absolute amount (rate is in RM, not percentage)
            return rate.employee;
        }
    }
    
    // Fallback: return 0 if no rate found
    return 0;
}

/**
 * Calculate monthly PCB (Personal Income Tax) based on annual gross income
 * Applies tax relief and progressive tax brackets from tax-brackets.json
 */
function calculatePCB(monthlyGrossIncome, monthlyNonTaxableIncome = 0) {
    const ANNUAL_RELIEF = 9000;      // Automatic individual tax relief
    const EPF_RELIEF_MAX = 4000;     // Maximum EPF relief
    const MONTHS = 12;
    
    // Calculate annual amounts
    const annualGrossIncome = monthlyGrossIncome * MONTHS;
    const annualNonTaxableIncome = monthlyNonTaxableIncome * MONTHS;
    const annualEPF = monthlyGrossIncome * RATES.EPF * MONTHS;
    const epfRelief = Math.min(annualEPF, EPF_RELIEF_MAX);
    
    // Calculate taxable income after reliefs
    const taxableIncome = Math.ceil(annualGrossIncome - annualNonTaxableIncome - ANNUAL_RELIEF - epfRelief);

    // If taxable income is 0 or less, no tax
    if (taxableIncome <= 0) {
        return 0;
    }
    
    // If tax brackets not loaded, return 0
    if (TAX_BRACKETS.length === 0) {
        return 0;
    }
    
    // Find applicable tax bracket and calculate tax
    for (let bracketIndex = 0; bracketIndex < TAX_BRACKETS.length; bracketIndex++) {
        const bracket = TAX_BRACKETS[bracketIndex];
        const meetsMinimum = taxableIncome >= bracket.min;
        const meetsMaximum = bracket.max === null || taxableIncome <= bracket.max;

        if (meetsMinimum && meetsMaximum) {
            const previousBracket = TAX_BRACKETS[bracketIndex - 1] || { max: 0 };
            const previousBracketUpperBound = previousBracket.max ?? 0;

            const incomeInBracket = taxableIncome - previousBracketUpperBound;
            const annualTax = bracket.baseTax + (incomeInBracket * bracket.rate);

            return annualTax / MONTHS;
        }
    }

    return 0;
}

/**
 * Calculate SKBBK contribution based on the salary band table.
 */
function calculateSKBBK(grossIncome) {
    for (const rate of SKBBK_RATES) {
        const meetsMinimum = grossIncome >= rate.min;
        const meetsMaximum = rate.max === null || grossIncome <= rate.max;

        if (meetsMinimum && meetsMaximum) {
            return rate.amount;
        }
    }

    return 0;
}

/**
 * Calculate all deductions and net income
 */
function calculateIncome() {
    // Get input values
    const grossIncome = parseFloat(grossIncomeInput.value) || 0;
    const nonTaxableIncome = parseFloat(nonTaxableIncomeInput.value) || 0;
    
    if (grossIncome <= 0) {
        epfAmount.textContent = formatCurrency(0);
        socsoAmount.textContent = formatCurrency(0);
        eisAmount.textContent = formatCurrency(0);
        pcbAmount.textContent = formatCurrency(0);
        skbbkAmount.textContent = formatCurrency(0);

        grossIncomeDisplay.textContent = formatCurrency(0);
        totalDeductionsDisplay.textContent = formatCurrency(0);
        netIncomeDisplay.textContent = formatCurrency(0);

        breakdownGross.textContent = formatCurrency(0);
        breakdownEPF.textContent = formatCurrency(0);
        breakdownSOCSO.textContent = formatCurrency(0);
        breakdownEIS.textContent = formatCurrency(0);
        breakdownPCB.textContent = formatCurrency(0);
        breakdownSKBBK.textContent = formatCurrency(0);
        breakdownNet.textContent = formatCurrency(0);
        netIncomeDisplay.style.color = '#1f2937';
        return;
    }

    // Calculate percentage-based deductions
    const roundedGrossIncome = Math.ceil(grossIncome / 100) * 100;
    const epfDeduction = roundedGrossIncome * RATES.EPF;
    
    // Calculate SOCSO and EIS based on rate tables
    const socsoDeduction = calculateSOCSO(grossIncome);
    const eisDeduction = calculateEIS(grossIncome);
    
    // Calculate PCB (Personal Income Tax) automatically
    const pcbDeduction = calculatePCB(grossIncome, nonTaxableIncome);

    // Calculate SKBBK contribution based on toggle state
    const skbbkDeduction = skbbkToggle.checked ? calculateSKBBK(grossIncome) : 0;

    // Calculate total deductions
    const totalDeductions = epfDeduction + socsoDeduction + eisDeduction + pcbDeduction + skbbkDeduction;

    // Calculate net income
    const netIncome = grossIncome - totalDeductions;

    // Update deduction displays
    epfAmount.textContent = formatCurrency(epfDeduction);
    socsoAmount.textContent = formatCurrency(socsoDeduction);
    eisAmount.textContent = formatCurrency(eisDeduction);
    pcbAmount.textContent = formatCurrency(pcbDeduction);
    skbbkAmount.textContent = formatCurrency(skbbkDeduction);

    // Update summary displays
    grossIncomeDisplay.textContent = formatCurrency(grossIncome);
    totalDeductionsDisplay.textContent = formatCurrency(totalDeductions);
    netIncomeDisplay.textContent = formatCurrency(netIncome);

    // Update breakdown table
    breakdownGross.textContent = formatCurrency(grossIncome);
    breakdownEPF.textContent = formatCurrency(epfDeduction);
    breakdownSOCSO.textContent = formatCurrency(socsoDeduction);
    breakdownEIS.textContent = formatCurrency(eisDeduction);
    breakdownPCB.textContent = formatCurrency(pcbDeduction);
    breakdownSKBBK.textContent = formatCurrency(skbbkDeduction);
    breakdownNet.textContent = formatCurrency(netIncome);

    // Update net income color based on value
    if (netIncome < 0) {
        netIncomeDisplay.style.color = '#dc2626'; // Red for negative
    } else {
        netIncomeDisplay.style.color = '#059669'; // Green for positive
    }
}

/**
 * Reset the calculator to initial state
 */
function resetCalculator() {
    grossIncomeInput.value = '';
    nonTaxableIncomeInput.value = '';

    skbbkToggle.checked = true;

    // Update deduction displays
    epfAmount.textContent = formatCurrency(0);
    socsoAmount.textContent = formatCurrency(0);
    eisAmount.textContent = formatCurrency(0);
    pcbAmount.textContent = formatCurrency(0);
    skbbkAmount.textContent = formatCurrency(0);
    netIncomeDisplay.style.color = '#1f2937';

    // Update summary displays
    grossIncomeDisplay.textContent = formatCurrency(0);
    totalDeductionsDisplay.textContent = formatCurrency(0);
    netIncomeDisplay.textContent = formatCurrency(0);

    // Update breakdown table
    breakdownGross.textContent = formatCurrency(0);
    breakdownEPF.textContent = formatCurrency(0);
    breakdownSOCSO.textContent = formatCurrency(0);
    breakdownEIS.textContent = formatCurrency(0);
    breakdownSKBBK.textContent = formatCurrency(0);
    breakdownNet.textContent = formatCurrency(0);
}

// Initialize calculator on page load
document.addEventListener('DOMContentLoaded', async () => {
    calculateIncome();
});
