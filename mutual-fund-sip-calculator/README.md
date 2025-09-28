# Mutual Fund SIP Calculator

A comprehensive web application for calculating the future value of Systematic Investment Plan (SIP) investments in mutual funds.

## Features

### 🔢 SIP Calculation Engine
- Accurate SIP calculations using the standard compound interest formula
- Support for multiple investment frequencies (Monthly, Quarterly, Yearly)
- Real-time calculation updates as you adjust parameters
- Input validation and error handling

### 📊 Interactive Visualization
- Dynamic chart showing investment growth over time
- Comparison between total investment and future value
- Responsive chart that updates automatically with input changes

### 💾 Export Capabilities
- **PDF Export**: Generate detailed investment reports
- **Image Export**: Save calculation summaries as PNG images
- Professional formatting with complete investment details

### 📱 Responsive Design
- Mobile-friendly interface
- Desktop and tablet optimized layouts
- Touch-friendly controls and interactions

### 🎯 Investment Analysis
- Total investment amount calculation
- Estimated returns breakdown
- Wealth gained percentage
- Future value projections

## How to Use

### Basic Steps
1. **Enter Investment Details**:
   - Monthly investment amount (₹500 - ₹10,00,000)
   - Expected annual return rate (1% - 30%)
   - Investment period in years (1 - 50 years)
   - Choose SIP frequency (Monthly/Quarterly/Yearly)

2. **View Results**: 
   - Total investment amount
   - Estimated returns
   - Total future value
   - Wealth gained percentage

3. **Analyze Growth**: 
   - Interactive chart shows year-by-year growth
   - Compare investment vs returns over time

4. **Export Results**: 
   - Download PDF report for record keeping
   - Save chart as image for sharing

### Input Guidelines
- **Monthly Investment**: Minimum ₹500, Maximum ₹10,00,000
- **Annual Return Rate**: Typical range 8% - 15% for equity funds
- **Investment Period**: 1 to 50 years
- **SIP Frequency**: Monthly is most common, but quarterly and yearly options available

## SIP Calculation Formula

The calculator uses the standard SIP formula:

```
FV = P × [((1 + r)^n - 1) / r] × (1 + r)
```

Where:
- **FV** = Future Value
- **P** = Periodic investment amount
- **r** = Periodic interest rate (annual rate / frequency)
- **n** = Total number of installments

### Example Calculation
For ₹5,000 monthly investment at 12% annual return for 10 years:
- P = ₹5,000
- r = 12% / 12 = 1% per month
- n = 10 × 12 = 120 months
- FV = ₹11,61,695 (approx)

## Technical Implementation

### Frontend Technologies
- **HTML5**: Semantic markup and accessibility
- **CSS3**: Custom styles with Tailwind CSS framework
- **Vanilla JavaScript**: No external dependencies for core logic
- **Chart.js**: Interactive charts and data visualization

### External Libraries
- **Chart.js 4.x**: For investment growth charts
- **html2canvas**: For image export functionality
- **jsPDF**: For PDF generation and export
- **Tailwind CSS**: For responsive design and styling

### Architecture
- **Modular Design**: Class-based JavaScript architecture
- **Event-Driven**: Real-time updates using event listeners
- **Input Validation**: Client-side validation with error handling
- **Responsive Layout**: CSS Grid and Flexbox for layouts

### Testing
- Built-in unit tests for calculation logic
- Edge case testing for input validation
- Cross-browser compatibility testing

## File Structure

```
mutual-fund-sip-calculator/
├── index.html              # Main HTML file
├── js/
│   └── sip-calculator.js    # Core JavaScript logic
└── README.md               # This documentation
```

## Browser Support

- **Chrome** 60+ (Recommended)
- **Firefox** 55+
- **Safari** 12+
- **Edge** 79+

## Features in Detail

### Input Validation
- Real-time validation with visual feedback
- Range checking for all numeric inputs
- Error highlighting for invalid values
- Helpful tooltips and guidance text

### Chart Features
- **Interactive**: Hover to see exact values
- **Responsive**: Adapts to different screen sizes
- **Smooth Animations**: Professional chart transitions
- **Multi-dataset**: Shows both investment and growth lines

### Export Features
- **PDF Report**: Complete investment analysis with calculations
- **Image Export**: High-quality PNG with chart data
- **Professional Formatting**: Clean, shareable formats
- **Date Stamped**: Includes generation date for record keeping

## Investment Education

### What is SIP?
Systematic Investment Plan (SIP) is a method of investing in mutual funds where you invest a fixed amount at regular intervals. This approach offers several benefits:

- **Rupee Cost Averaging**: Buy more units when prices are low, fewer when high
- **Power of Compounding**: Earnings generate their own earnings over time
- **Disciplined Investing**: Automated, regular investment habit
- **Risk Mitigation**: Reduces impact of market volatility

### Benefits of Using This Calculator
- **Planning Tool**: Helps set realistic financial goals
- **Scenario Analysis**: Test different investment amounts and periods
- **Visual Learning**: Charts make complex calculations easy to understand
- **Documentation**: Export features help maintain investment records

## Disclaimer

This calculator provides estimates based on the inputs provided and assumed rate of returns. Actual returns from mutual fund investments can vary based on market conditions, fund performance, and other factors. This tool is for educational and planning purposes only and should not be considered as financial advice. Please consult with financial advisors for investment decisions.

## Development

### Running Tests
Add `?test=true` to the URL to run built-in unit tests:
```
http://localhost/mutual-fund-sip-calculator/?test=true
```

### Contributing
1. Follow existing code style and patterns
2. Add tests for new calculation logic
3. Ensure responsive design compatibility
4. Test across different browsers and devices

## License

This project is part of the TechnoMind AI tool collection and is available for educational and personal use.

---

**Built with ❤️ by TechnoMind AI**  
For more tools and resources, visit [technomindai.in](https://technomindai.in)