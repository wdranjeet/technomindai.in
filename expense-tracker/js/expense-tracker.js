/**
 * Expense Tracker Application
 * A comprehensive expense management system with budget tracking and analytics
 */

class ExpenseTracker {
    constructor() {
        // Default categories with icons and colors
        this.defaultCategories = [
            { id: 'food', name: 'Food & Dining', icon: '🍔', color: 'bg-red-500' },
            { id: 'transport', name: 'Transport', icon: '🚗', color: 'bg-blue-500' },
            { id: 'shopping', name: 'Shopping', icon: '🛍️', color: 'bg-pink-500' },
            { id: 'entertainment', name: 'Entertainment', icon: '🎬', color: 'bg-purple-500' },
            { id: 'bills', name: 'Bills & Utilities', icon: '📱', color: 'bg-yellow-500' },
            { id: 'health', name: 'Health & Fitness', icon: '💊', color: 'bg-green-500' },
            { id: 'education', name: 'Education', icon: '📚', color: 'bg-indigo-500' },
            { id: 'other', name: 'Other', icon: '📦', color: 'bg-gray-500' }
        ];

        // Initialize data
        this.expenses = this.loadFromStorage('expenses') || [];
        this.categories = this.loadFromStorage('categories') || this.defaultCategories;
        this.budgets = this.loadFromStorage('budgets') || {};
        
        // State
        this.currentFilter = {
            search: '',
            category: '',
            dateFrom: '',
            dateTo: ''
        };
        this.currentSort = 'date-desc';
        this.editingExpenseId = null;

        // Chart instances
        this.categoryChart = null;
        this.trendChart = null;

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.populateCategoryDropdowns();
        this.setDefaultDate();
        this.renderAll();
    }

    setupEventListeners() {
        // Add expense button
        document.getElementById('add-expense-btn').addEventListener('click', () => {
            this.showExpenseModal();
        });

        // Expense form
        document.getElementById('expense-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveExpense();
        });

        // Close modal buttons
        document.getElementById('close-modal').addEventListener('click', () => {
            this.hideExpenseModal();
        });

        document.getElementById('cancel-btn').addEventListener('click', () => {
            this.hideExpenseModal();
        });

        // Budget management
        document.getElementById('manage-budget-btn').addEventListener('click', () => {
            this.showBudgetModal();
        });

        document.getElementById('close-budget-modal').addEventListener('click', () => {
            this.hideBudgetModal();
        });

        document.getElementById('cancel-budget-btn').addEventListener('click', () => {
            this.hideBudgetModal();
        });

        document.getElementById('budget-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveBudgets();
        });

        // Filters
        document.getElementById('search-input').addEventListener('input', (e) => {
            this.currentFilter.search = e.target.value.toLowerCase();
            this.renderExpenseList();
        });

        document.getElementById('category-filter').addEventListener('change', (e) => {
            this.currentFilter.category = e.target.value;
            this.renderExpenseList();
        });

        document.getElementById('date-from').addEventListener('change', (e) => {
            this.currentFilter.dateFrom = e.target.value;
            this.renderExpenseList();
        });

        document.getElementById('date-to').addEventListener('change', (e) => {
            this.currentFilter.dateTo = e.target.value;
            this.renderExpenseList();
        });

        // Sort
        document.getElementById('sort-select').addEventListener('change', (e) => {
            this.currentSort = e.target.value;
            this.renderExpenseList();
        });

        // Export buttons
        document.getElementById('export-csv-btn').addEventListener('click', () => {
            this.exportToCSV();
        });

        document.getElementById('export-pdf-btn').addEventListener('click', () => {
            this.exportToPDF();
        });

        // Clear data
        document.getElementById('clear-data-btn').addEventListener('click', () => {
            if (confirm('Are you sure you want to delete all expenses? This action cannot be undone.')) {
                this.clearAllData();
            }
        });

        // Close modals on outside click
        document.getElementById('expense-modal').addEventListener('click', (e) => {
            if (e.target.id === 'expense-modal') {
                this.hideExpenseModal();
            }
        });

        document.getElementById('budget-modal').addEventListener('click', (e) => {
            if (e.target.id === 'budget-modal') {
                this.hideBudgetModal();
            }
        });
    }

    // Data management
    loadFromStorage(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error(`Error loading ${key} from storage:`, error);
            return null;
        }
    }

    saveToStorage(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (error) {
            console.error(`Error saving ${key} to storage:`, error);
            alert('Error saving data. Your storage might be full.');
        }
    }

    // Expense operations
    addExpense(expense) {
        const newExpense = {
            id: this.generateId(),
            ...expense,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        this.expenses.push(newExpense);
        this.saveToStorage('expenses', this.expenses);
        this.renderAll();
    }

    updateExpense(id, updates) {
        const index = this.expenses.findIndex(e => e.id === id);
        if (index !== -1) {
            this.expenses[index] = {
                ...this.expenses[index],
                ...updates,
                updatedAt: new Date().toISOString()
            };
            this.saveToStorage('expenses', this.expenses);
            this.renderAll();
        }
    }

    deleteExpense(id) {
        if (confirm('Are you sure you want to delete this expense?')) {
            this.expenses = this.expenses.filter(e => e.id !== id);
            this.saveToStorage('expenses', this.expenses);
            this.renderAll();
        }
    }

    // Modal management
    showExpenseModal(expenseId = null) {
        this.editingExpenseId = expenseId;
        const modal = document.getElementById('expense-modal');
        const form = document.getElementById('expense-form');
        const title = document.getElementById('modal-title');

        form.reset();

        if (expenseId) {
            title.textContent = 'Edit Expense';
            const expense = this.expenses.find(e => e.id === expenseId);
            if (expense) {
                document.getElementById('expense-id').value = expense.id;
                document.getElementById('expense-amount').value = expense.amount;
                document.getElementById('expense-category').value = expense.category;
                document.getElementById('expense-description').value = expense.description;
                document.getElementById('expense-date').value = expense.date;
                document.getElementById('expense-notes').value = expense.notes || '';
            }
        } else {
            title.textContent = 'Add Expense';
            this.setDefaultDate();
        }

        modal.classList.remove('hidden');
    }

    hideExpenseModal() {
        document.getElementById('expense-modal').classList.add('hidden');
        document.getElementById('expense-form').reset();
        this.editingExpenseId = null;
    }

    saveExpense() {
        const amount = parseFloat(document.getElementById('expense-amount').value);
        const category = document.getElementById('expense-category').value;
        const description = document.getElementById('expense-description').value;
        const date = document.getElementById('expense-date').value;
        const notes = document.getElementById('expense-notes').value;

        const expenseData = {
            amount,
            category,
            description,
            date,
            notes
        };

        if (this.editingExpenseId) {
            this.updateExpense(this.editingExpenseId, expenseData);
        } else {
            this.addExpense(expenseData);
        }

        this.hideExpenseModal();
    }

    // Budget management
    showBudgetModal() {
        const modal = document.getElementById('budget-modal');
        const container = document.getElementById('budget-categories');
        
        container.innerHTML = '';
        
        this.categories.forEach(category => {
            const currentBudget = this.budgets[category.id] || 0;
            const div = document.createElement('div');
            div.className = 'flex items-center gap-4';
            div.innerHTML = `
                <div class="flex items-center gap-2 flex-1">
                    <span class="text-2xl">${category.icon}</span>
                    <label class="font-semibold text-gray-700">${category.name}</label>
                </div>
                <div class="relative flex-1">
                    <span class="absolute left-3 top-3 text-gray-500">₹</span>
                    <input type="number" 
                        id="budget-${category.id}" 
                        value="${currentBudget}" 
                        min="0" 
                        step="100"
                        class="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="0">
                </div>
            `;
            container.appendChild(div);
        });

        modal.classList.remove('hidden');
    }

    hideBudgetModal() {
        document.getElementById('budget-modal').classList.add('hidden');
    }

    saveBudgets() {
        this.categories.forEach(category => {
            const input = document.getElementById(`budget-${category.id}`);
            if (input) {
                const value = parseFloat(input.value) || 0;
                this.budgets[category.id] = value;
            }
        });

        this.saveToStorage('budgets', this.budgets);
        this.hideBudgetModal();
        this.renderAll();
    }

    // Rendering functions
    renderAll() {
        this.renderSummaryCards();
        this.renderExpenseList();
        this.renderCharts();
        this.renderBudgetOverview();
    }

    renderSummaryCards() {
        const filteredExpenses = this.getFilteredExpenses();
        const total = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
        
        const now = new Date();
        const monthExpenses = this.expenses.filter(e => {
            const expenseDate = new Date(e.date);
            return expenseDate.getMonth() === now.getMonth() && 
                   expenseDate.getFullYear() === now.getFullYear();
        });
        const monthTotal = monthExpenses.reduce((sum, e) => sum + e.amount, 0);

        document.getElementById('total-expenses').textContent = this.formatCurrency(total);
        document.getElementById('month-expenses').textContent = this.formatCurrency(monthTotal);
        document.getElementById('total-count').textContent = filteredExpenses.length;

        // Budget status
        const totalBudget = Object.values(this.budgets).reduce((sum, b) => sum + b, 0);
        if (totalBudget > 0) {
            const percentage = (monthTotal / totalBudget * 100).toFixed(0);
            document.getElementById('budget-status').textContent = `${percentage}%`;
        } else {
            document.getElementById('budget-status').textContent = '--';
        }
    }

    renderExpenseList() {
        const tbody = document.getElementById('expense-list');
        const filteredExpenses = this.getFilteredExpenses();
        const sortedExpenses = this.sortExpenses(filteredExpenses);

        if (sortedExpenses.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" class="px-4 py-8 text-center text-gray-500">
                        ${this.hasActiveFilters() ? 'No expenses found matching your filters.' : 'No expenses yet. Click "Add Expense" to get started!'}
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = sortedExpenses.map(expense => {
            const category = this.categories.find(c => c.id === expense.category);
            return `
                <tr class="hover:bg-gray-50">
                    <td class="px-4 py-3 text-sm text-gray-600">
                        ${this.formatDate(expense.date)}
                    </td>
                    <td class="px-4 py-3">
                        <div class="flex items-center gap-2">
                            <span class="text-xl">${category?.icon || '📦'}</span>
                            <span class="text-sm font-medium text-gray-700">${category?.name || 'Other'}</span>
                        </div>
                    </td>
                    <td class="px-4 py-3">
                        <div class="text-sm text-gray-800 font-medium">${expense.description}</div>
                        ${expense.notes ? `<div class="text-xs text-gray-500 mt-1">${expense.notes}</div>` : ''}
                    </td>
                    <td class="px-4 py-3 text-right">
                        <span class="text-sm font-bold text-gray-800">${this.formatCurrency(expense.amount)}</span>
                    </td>
                    <td class="px-4 py-3 text-center">
                        <button 
                            class="text-blue-600 hover:text-blue-800 mr-2 expense-edit-btn" title="Edit"
                            data-id="${expense.id}">
                            ✏️
                        </button>
                        <button 
                            class="text-red-600 hover:text-red-800 expense-delete-btn" title="Delete"
                            data-id="${expense.id}">
                            🗑️
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
        // Attach event listeners to edit and delete buttons
        // Edit buttons
        tbody.querySelectorAll('.expense-edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = btn.getAttribute('data-id');
                this.showExpenseModal(id);
            });
        });
        // Delete buttons
        tbody.querySelectorAll('.expense-delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = btn.getAttribute('data-id');
                this.deleteExpense(id);
            });
        });
    }

    renderCharts() {
        this.renderCategoryChart();
        this.renderTrendChart();
    }

    renderCategoryChart() {
        const canvas = document.getElementById('category-chart');
        const ctx = canvas.getContext('2d');

        const filteredExpenses = this.getFilteredExpenses();
        const categoryData = {};

        filteredExpenses.forEach(expense => {
            if (!categoryData[expense.category]) {
                categoryData[expense.category] = 0;
            }
            categoryData[expense.category] += expense.amount;
        });

        const labels = [];
        const data = [];
        const colors = [];

        Object.entries(categoryData).forEach(([categoryId, amount]) => {
            const category = this.categories.find(c => c.id === categoryId);
            if (category) {
                labels.push(`${category.icon} ${category.name}`);
                data.push(amount);
                colors.push(this.getCategoryColor(category.color));
            }
        });

        if (this.categoryChart) {
            this.categoryChart.destroy();
        }

        if (data.length === 0) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.font = '14px sans-serif';
            ctx.fillStyle = '#9CA3AF';
            ctx.textAlign = 'center';
            ctx.fillText('No data to display', canvas.width / 2, canvas.height / 2);
            return;
        }

        this.categoryChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: colors,
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 10,
                            font: {
                                size: 11
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                const label = context.label || '';
                                const value = this.formatCurrency(context.parsed);
                                const percentage = ((context.parsed / data.reduce((a, b) => a + b, 0)) * 100).toFixed(1);
                                return `${label}: ${value} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    }

    renderTrendChart() {
        const canvas = document.getElementById('trend-chart');
        const ctx = canvas.getContext('2d');

        const filteredExpenses = this.getFilteredExpenses();
        
        // Get last 6 months of data
        const monthsData = this.getMonthlyData(filteredExpenses, 6);

        if (this.trendChart) {
            this.trendChart.destroy();
        }

        if (monthsData.labels.length === 0) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.font = '14px sans-serif';
            ctx.fillStyle = '#9CA3AF';
            ctx.textAlign = 'center';
            ctx.fillText('No data to display', canvas.width / 2, canvas.height / 2);
            return;
        }

        this.trendChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: monthsData.labels,
                datasets: [{
                    label: 'Monthly Expenses',
                    data: monthsData.data,
                    borderColor: '#14B8A6',
                    backgroundColor: 'rgba(20, 184, 166, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                return `Expenses: ${this.formatCurrency(context.parsed.y)}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: (value) => {
                                return '₹' + (value / 1000).toFixed(0) + 'k';
                            }
                        }
                    }
                }
            }
        });
    }

    renderBudgetOverview() {
        const container = document.getElementById('budget-list');
        const hasBudgets = Object.keys(this.budgets).some(key => this.budgets[key] > 0);

        if (!hasBudgets) {
            container.innerHTML = '<p class="text-gray-500 text-center py-8">No budgets set. Click "Manage Budget" to set your spending limits.</p>';
            return;
        }

        const now = new Date();
        const monthExpenses = this.expenses.filter(e => {
            const expenseDate = new Date(e.date);
            return expenseDate.getMonth() === now.getMonth() && 
                   expenseDate.getFullYear() === now.getFullYear();
        });

        const html = this.categories
            .filter(category => this.budgets[category.id] > 0)
            .map(category => {
                const budget = this.budgets[category.id];
                const spent = monthExpenses
                    .filter(e => e.category === category.id)
                    .reduce((sum, e) => sum + e.amount, 0);
                
                const percentage = Math.min((spent / budget) * 100, 100);
                const remaining = budget - spent;
                
                let statusColor = 'bg-green-500';
                let statusText = 'On Track';
                
                if (percentage >= 100) {
                    statusColor = 'bg-red-500';
                    statusText = 'Over Budget';
                } else if (percentage >= 80) {
                    statusColor = 'bg-yellow-500';
                    statusText = 'Warning';
                }

                return `
                    <div class="border border-gray-200 rounded-lg p-4">
                        <div class="flex items-center justify-between mb-2">
                            <div class="flex items-center gap-2">
                                <span class="text-2xl">${category.icon}</span>
                                <span class="font-semibold text-gray-800">${category.name}</span>
                            </div>
                            <span class="text-xs font-medium px-2 py-1 rounded ${statusColor} text-white">
                                ${statusText}
                            </span>
                        </div>
                        <div class="mb-2">
                            <div class="flex justify-between text-sm text-gray-600 mb-1">
                                <span>Spent: ${this.formatCurrency(spent)}</span>
                                <span>Budget: ${this.formatCurrency(budget)}</span>
                            </div>
                            <div class="w-full bg-gray-200 rounded-full h-2">
                                <div class="${statusColor} h-2 rounded-full transition-all duration-300" 
                                    style="width: ${percentage}%"></div>
                            </div>
                        </div>
                        <div class="text-sm ${remaining >= 0 ? 'text-green-600' : 'text-red-600'} font-medium">
                            ${remaining >= 0 ? 'Remaining' : 'Over'}: ${this.formatCurrency(Math.abs(remaining))}
                        </div>
                    </div>
                `;
            }).join('');

        container.innerHTML = html;
    }

    // Helper functions
    getFilteredExpenses() {
        return this.expenses.filter(expense => {
            // Search filter
            if (this.currentFilter.search) {
                const searchLower = this.currentFilter.search.toLowerCase();
                const matchesSearch = 
                    expense.description.toLowerCase().includes(searchLower) ||
                    (expense.notes && expense.notes.toLowerCase().includes(searchLower));
                if (!matchesSearch) return false;
            }

            // Category filter
            if (this.currentFilter.category && expense.category !== this.currentFilter.category) {
                return false;
            }

            // Date range filter
            if (this.currentFilter.dateFrom) {
                if (expense.date < this.currentFilter.dateFrom) return false;
            }
            if (this.currentFilter.dateTo) {
                if (expense.date > this.currentFilter.dateTo) return false;
            }

            return true;
        });
    }

    sortExpenses(expenses) {
        const sorted = [...expenses];
        
        switch (this.currentSort) {
            case 'date-desc':
                sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
                break;
            case 'date-asc':
                sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
                break;
            case 'amount-desc':
                sorted.sort((a, b) => b.amount - a.amount);
                break;
            case 'amount-asc':
                sorted.sort((a, b) => a.amount - b.amount);
                break;
        }

        return sorted;
    }

    hasActiveFilters() {
        return this.currentFilter.search || 
               this.currentFilter.category || 
               this.currentFilter.dateFrom || 
               this.currentFilter.dateTo;
    }

    getMonthlyData(expenses, monthCount) {
        const months = [];
        const data = [];
        const now = new Date();

        for (let i = monthCount - 1; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthName = date.toLocaleString('default', { month: 'short' });
            months.push(monthName);

            const monthExpenses = expenses.filter(e => {
                const expenseDate = new Date(e.date);
                return expenseDate.getMonth() === date.getMonth() && 
                       expenseDate.getFullYear() === date.getFullYear();
            });

            const total = monthExpenses.reduce((sum, e) => sum + e.amount, 0);
            data.push(total);
        }

        return { labels: months, data };
    }

    populateCategoryDropdowns() {
        const expenseCategory = document.getElementById('expense-category');
        const categoryFilter = document.getElementById('category-filter');

        const categoryOptions = this.categories.map(cat => 
            `<option value="${cat.id}">${cat.icon} ${cat.name}</option>`
        ).join('');

        expenseCategory.innerHTML = categoryOptions;
        categoryFilter.innerHTML = '<option value="">All Categories</option>' + categoryOptions;
    }

    setDefaultDate() {
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('expense-date').value = today;
    }

    formatCurrency(amount) {
        return '₹' + amount.toLocaleString('en-IN', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        });
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    }

    getCategoryColor(colorClass) {
        const colorMap = {
            'bg-red-500': '#EF4444',
            'bg-blue-500': '#3B82F6',
            'bg-pink-500': '#EC4899',
            'bg-purple-500': '#A855F7',
            'bg-yellow-500': '#EAB308',
            'bg-green-500': '#10B981',
            'bg-indigo-500': '#6366F1',
            'bg-gray-500': '#6B7280'
        };
        return colorMap[colorClass] || '#6B7280';
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // Export functions
    exportToCSV() {
        const expenses = this.getFilteredExpenses();
        
        if (expenses.length === 0) {
            alert('No expenses to export!');
            return;
        }

        const headers = ['Date', 'Category', 'Description', 'Amount', 'Notes'];
        const rows = expenses.map(expense => {
            const category = this.categories.find(c => c.id === expense.category);
            return [
                expense.date,
                category?.name || 'Other',
                expense.description,
                expense.amount,
                expense.notes || ''
            ];
        });

        let csv = headers.join(',') + '\n';
        rows.forEach(row => {
            csv += row.map(cell => `"${cell}"`).join(',') + '\n';
        });

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `expenses_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    }

    async exportToPDF() {
        const expenses = this.getFilteredExpenses();
        
        if (expenses.length === 0) {
            alert('No expenses to export!');
            return;
        }

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Title
        doc.setFontSize(20);
        doc.text('Expense Report', 20, 20);

        // Date
        doc.setFontSize(10);
        doc.text(`Generated: ${new Date().toLocaleDateString('en-IN')}`, 20, 30);

        // Summary
        const total = expenses.reduce((sum, e) => sum + e.amount, 0);
        doc.setFontSize(12);
        doc.text(`Total Expenses: ${this.formatCurrency(total)}`, 20, 40);
        doc.text(`Number of Transactions: ${expenses.length}`, 20, 48);

        // Expenses table
        let y = 60;
        doc.setFontSize(10);
        doc.text('Date', 20, y);
        doc.text('Category', 50, y);
        doc.text('Description', 90, y);
        doc.text('Amount', 160, y);

        y += 8;
        doc.line(20, y, 190, y);
        y += 5;

        expenses.slice(0, 30).forEach(expense => {
            const category = this.categories.find(c => c.id === expense.category);
            
            if (y > 270) {
                doc.addPage();
                y = 20;
            }

            doc.text(this.formatDate(expense.date), 20, y);
            doc.text(category?.name || 'Other', 50, y);
            const desc = expense.description.substring(0, 25);
            doc.text(desc, 90, y);
            doc.text(this.formatCurrency(expense.amount), 160, y);
            
            y += 7;
        });

        if (expenses.length > 30) {
            doc.text(`... and ${expenses.length - 30} more transactions`, 20, y + 5);
        }

        doc.save(`expense_report_${new Date().toISOString().split('T')[0]}.pdf`);
    }

    clearAllData() {
        this.expenses = [];
        this.budgets = {};
        this.saveToStorage('expenses', this.expenses);
        this.saveToStorage('budgets', this.budgets);
        this.currentFilter = {
            search: '',
            category: '',
            dateFrom: '',
            dateTo: ''
        };
        document.getElementById('search-input').value = '';
        document.getElementById('category-filter').value = '';
        document.getElementById('date-from').value = '';
        document.getElementById('date-to').value = '';
        this.renderAll();
        alert('All data has been cleared successfully!');
    }
}

// Initialize the app
let expenseTracker;
document.addEventListener('DOMContentLoaded', () => {
    expenseTracker = new ExpenseTracker();
});
