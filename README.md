# Monthly Net Income Calculator

A simple, static website for calculating monthly net income after mandatory deductions. Built with HTML, CSS, and vanilla JavaScript.

## Features

- **Real-time Calculations**: Updates instantly as you enter your gross income
- **Mandatory Deductions**:
  - EPF (Employees Provident Fund): 11% of gross income
  - SOCSO (Social Security Organisation): Based on wage bracket (RM0.10 to RM29.75 per month)
  - EIS (Employment Insurance System): Based on wage bracket (RM0.05 to RM11.90 per month)
  - PCB (Personal Income Tax): Automatically calculated based on progressive tax brackets
- **Detailed Breakdown**: See all deductions and net income in a clear table format
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **No External Dependencies**: Pure HTML, CSS, and JavaScript

## How to Use

1. **Open the Calculator**: 
   - Simply open `index.html` in your web browser
   - No server or installation required

2. **Enter Your Gross Income**:
   - Type your monthly gross income in the input field
   - All deductions are calculated automatically, including PCB

3. **View Results**:
   - See all deductions calculated automatically
   - View your net income in the summary section
   - Check the detailed breakdown table below

4. **Reset**: 
   - Click the "Reset" button to clear inputs and start over

## File Structure

```
NetIncomeCalculator/
├── index.html         # Main HTML file with calculator layout
├── styles.css         # Styling for the calculator
├── script.js          # JavaScript calculations and interactions
├── socso-rates.js   # SOCSO wage bracket rates
├── eis-rates.js     # EIS wage bracket rates
├── tax-brackets.js  # Malaysian income tax brackets
└── README.md          # This file
```

## Calculation Formula

```
Gross Income
- EPF (11% of gross income)
- SOCSO (Based on wage bracket)
- EIS (Based on wage bracket)
- PCB (Based on progressive tax brackets with reliefs)
= Net Income
```

## Technical Details

- **Currency**: Malaysian Ringgit (RM)
- **Format**: All amounts are formatted as currency with 2 decimal places
- **Precision**: Calculations are accurate to 2 decimal places
- **SOCSO Calculation**: Uses official wage bracket table defined in `socso-rates.js`
  - Employee contributions range from RM0.10 to RM29.75 per month
  - Amount determined by gross income bracket
- **EIS Calculation**: Uses official wage bracket table defined in `eis-rates.js`
  - Employee contributions range from RM0.05 to RM11.90 per month
  - Amount determined by gross income bracket
- **PCB (Personal Income Tax) Calculation**: Automatically calculated based on tax brackets defined in `tax-brackets.js`:
  - Annual gross income multiplied by 12
  - Tax relief: RM9,000 automatic individual relief
  - Tax relief: EPF contribution relief (max RM4,000 per year)
  - Progressive tax brackets applied to taxable income:
    - RM0 – RM5,000: 0%
    - RM5,001 – RM20,000: 1%
    - RM20,001 – RM35,000: 3%
    - RM35,001 – RM50,000: 6%
    - RM50,001 – RM70,000: 11%
    - RM70,001 – RM100,000: 19%
    - RM100,001 – RM400,000: 25%
    - RM400,001 – RM600,000: 26%
    - RM600,001 – RM2,000,000: 28%
    - Exceeding RM2,000,000: 30%
  - Monthly PCB = Annual tax ÷ 12
- **Browser Support**: Works on all modern browsers (Chrome, Firefox, Safari, Edge)

## Example

**Input:**
- Monthly Gross Income: RM 5,000

**Calculations:**
- Annual Gross Income: RM 5,000 × 12 = RM 60,000
- Annual EPF (11%): RM 60,000 × 11% = RM 6,600
- EPF Relief (max RM4,000): RM 4,000
- Taxable Income: RM 60,000 - RM 9,000 - RM 4,000 = RM 47,000
- Annual PCB Tax:
  - RM5,000 @ 0% = RM 0
  - Next RM15,000 @ 1% = RM 150
  - Next RM15,000 @ 3% = RM 450
  - Remaining RM12,000 @ 6% = RM 720
  - **Total Annual PCB = RM 1,320**
- Monthly PCB: RM 1,320 ÷ 12 = **RM 110.00**

**Monthly Deductions:**
- EPF: RM 5,000 × 11% = RM 550
- SOCSO: RM 25.25 (from wage bracket)
- EIS: RM 10.10 (from wage bracket)
- PCB: RM 110.00 (auto-calculated)

**Output:**
- Total Deductions: RM 695.35
- Net Income: RM 5,000 - RM 695.35 = **RM 4,304.65**

## Notes

- The calculator works completely offline with no internet connection required
- All calculations are done locally in your browser
- No data is stored or transmitted anywhere

## Future Enhancements

- Add more deduction types
- Generate downloadable payslips
- Monthly savings goals
- Budget planning features
