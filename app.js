// Mantra Computer Institute Management System - JavaScript with Google Sheets Integration
class InstituteManagementSystem {
    constructor() {
        this.students = [];
        this.batches = [];
        this.transactions = [];
        this.courses = [
            "Basic Computer", "Advanced Excel", "Web Development", 
            "Graphic Design", "Tally", "Data Entry"
        ];
        this.paymentModes = ["Cash", "Cheque", "Bank Transfer", "UPI", "Card"];
        
        // Google Sheets Configuration
        this.googleConfig = {
    clientId: "494546394536-b3hq13dh2qpd6o2jrj0o2un9i3ffjdn3.apps.googleusercontent.com"
    apiKey: "AIzaSyADP_Ed1S5EM2YiKbpN8qXMfy4y5a0lh2U", 
 discoveryDocs: ["https://sheets.googleapis.com/$discovery/rest?version=v4"],
    scopes: "https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive.file"
};
        
        this.isGoogleSheetsConnected = false;
        this.currentUser = null;
        this.spreadsheetId = null;
        this.lastSyncTime = null;
        
        this.init();
    }

    init() {
        this.loadSampleData();
        this.loadData();
        this.setupEventListeners();
        this.updateDashboard();
        this.populateDropdowns();
        this.renderTables();
        this.initGoogleAPI();
        this.updateGoogleSheetsUI();
        
        // Show dashboard by default
        this.showSection('dashboard');
    }

    // Google Sheets API Initialization
    async initGoogleAPI() {
        try {
            // For demo purposes, we'll simulate the API initialization
            // In production, replace this with actual Google API initialization
            console.log('Google API initialized (Demo Mode)');
            
            // Uncomment for actual Google API integration:
            /*
            await new Promise((resolve, reject) => {
                gapi.load('auth2:client', resolve);
            });
            
            await gapi.client.init({
                apiKey: this.googleConfig.apiKey,
                clientId: this.googleConfig.clientId,
                discoveryDocs: this.googleConfig.discoveryDocs,
                scope: this.googleConfig.scopes
            });
            */
        } catch (error) {
            console.error('Error initializing Google API:', error);
            this.showAlert('Google Sheets API initialization failed. Running in offline mode.', 'warning');
        }
    }

    // Google Sheets Authentication
    async connectGoogleSheets() {
        try {
            this.showLoadingOverlay('Connecting to Google Sheets...');
            
            // Demo mode simulation
            setTimeout(() => {
                this.isGoogleSheetsConnected = true;
                this.currentUser = {
                    email: 'demo@example.com',
                    name: 'Demo User'
                };
                this.lastSyncTime = new Date().toISOString();
                this.updateGoogleSheetsUI();
                this.hideLoadingOverlay();
                this.showAlert('Successfully connected to Google Sheets! (Demo Mode)', 'success');
                
                // Create demo spreadsheet
                this.createMantraSpreadsheet();
            }, 2000);
            
            // Actual Google OAuth implementation:
            /*
            const authInstance = gapi.auth2.getAuthInstance();
            const user = await authInstance.signIn();
            
            this.isGoogleSheetsConnected = true;
            this.currentUser = user.getBasicProfile();
            this.lastSyncTime = new Date().toISOString();
            
            this.updateGoogleSheetsUI();
            this.hideLoadingOverlay();
            this.showAlert('Successfully connected to Google Sheets!', 'success');
            
            // Create or locate the management spreadsheet
            await this.createMantraSpreadsheet();
            */
        } catch (error) {
            console.error('Error connecting to Google Sheets:', error);
            this.hideLoadingOverlay();
            this.showAlert('Failed to connect to Google Sheets: ' + error.message, 'error');
        }
    }

    disconnectGoogleSheets() {
        try {
            // Demo mode
            this.isGoogleSheetsConnected = false;
            this.currentUser = null;
            this.spreadsheetId = null;
            this.lastSyncTime = null;
            this.updateGoogleSheetsUI();
            this.showAlert('Disconnected from Google Sheets', 'info');
            
            // Actual implementation:
            /*
            const authInstance = gapi.auth2.getAuthInstance();
            authInstance.signOut();
            
            this.isGoogleSheetsConnected = false;
            this.currentUser = null;
            this.spreadsheetId = null;
            this.lastSyncTime = null;
            this.updateGoogleSheetsUI();
            this.showAlert('Disconnected from Google Sheets', 'info');
            */
        } catch (error) {
            console.error('Error disconnecting from Google Sheets:', error);
            this.showAlert('Error disconnecting: ' + error.message, 'error');
        }
    }

    // Create Mantra Institute Spreadsheet
    async createMantraSpreadsheet() {
        try {
            // Demo mode - simulate spreadsheet creation
            this.spreadsheetId = 'demo_spreadsheet_id_12345';
            console.log('Created demo spreadsheet:', this.spreadsheetId);
            
            // Actual implementation:
            /*
            const response = await gapi.client.sheets.spreadsheets.create({
                properties: {
                    title: `Mantra Computer Institute - ${new Date().toLocaleDateString()}`
                },
                sheets: [
                    { properties: { title: 'Students' } },
                    { properties: { title: 'Batches' } },
                    { properties: { title: 'Transactions' } },
                    { properties: { title: 'Dashboard' } }
                ]
            });
            
            this.spreadsheetId = response.result.spreadsheetId;
            
            // Set up headers for each sheet
            await this.setupSheetHeaders();
            */
        } catch (error) {
            console.error('Error creating spreadsheet:', error);
            throw error;
        }
    }

    // Setup headers for Google Sheets
    async setupSheetHeaders() {
        const headers = {
            'Students': [
                'Admission Number', 'Name', 'Email', 'Phone', 'Address', 'DOB', 
                'Course', 'Batch', 'Status', 'Total Fees', 'Paid Amount', 'Outstanding'
            ],
            'Batches': [
                'Batch ID', 'Name', 'Course', 'Start Date', 'End Date', 
                'Total Fees', 'Max Students', 'Current Students', 'Status'
            ],
            'Transactions': [
                'Transaction ID', 'Student ID', 'Admission Number', 'Date', 
                'Description', 'Amount', 'Type', 'Payment Mode', 'Reference Number'
            ],
            'Dashboard': [
                'Metric', 'Value', 'Last Updated'
            ]
        };

        // Demo mode - just log the headers
        console.log('Demo: Setting up sheet headers', headers);
        
        // Actual implementation:
        /*
        for (const [sheetName, headerRow] of Object.entries(headers)) {
            await gapi.client.sheets.spreadsheets.values.update({
                spreadsheetId: this.spreadsheetId,
                range: `${sheetName}!A1`,
                valueInputOption: 'RAW',
                resource: { values: [headerRow] }
            });
        }
        */
    }

    // Export Students to Google Sheets
    async exportStudentsToSheets() {
        if (!this.isGoogleSheetsConnected) {
            this.showAlert('Please connect to Google Sheets first', 'warning');
            return;
        }

        try {
            this.showLoadingOverlay('Exporting students to Google Sheets...');
            
            const studentsData = this.students.map(student => {
                const batch = this.batches.find(b => b.id === student.batchId);
                return [
                    student.admissionNumber,
                    student.name,
                    student.email,
                    student.phone,
                    student.address,
                    student.dateOfBirth,
                    student.course,
                    batch ? batch.batchName : 'N/A',
                    student.status,
                    student.totalFees,
                    student.paidAmount,
                    student.outstandingAmount
                ];
            });

            // Demo mode simulation
            setTimeout(() => {
                this.hideLoadingOverlay();
                this.showAlert(`Successfully exported ${this.students.length} students to Google Sheets! (Demo Mode)`, 'success');
                this.updateLastSyncTime();
            }, 1500);
            
            // Actual implementation:
            /*
            await gapi.client.sheets.spreadsheets.values.clear({
                spreadsheetId: this.spreadsheetId,
                range: 'Students!A2:L'
            });

            if (studentsData.length > 0) {
                await gapi.client.sheets.spreadsheets.values.update({
                    spreadsheetId: this.spreadsheetId,
                    range: 'Students!A2',
                    valueInputOption: 'RAW',
                    resource: { values: studentsData }
                });
            }

            this.hideLoadingOverlay();
            this.showAlert(`Successfully exported ${this.students.length} students to Google Sheets!`, 'success');
            this.updateLastSyncTime();
            */
        } catch (error) {
            console.error('Error exporting students:', error);
            this.hideLoadingOverlay();
            this.showAlert('Error exporting students: ' + error.message, 'error');
        }
    }

    // Export Batches to Google Sheets
    async exportBatchesToSheets() {
        if (!this.isGoogleSheetsConnected) {
            this.showAlert('Please connect to Google Sheets first', 'warning');
            return;
        }

        try {
            this.showLoadingOverlay('Exporting batches to Google Sheets...');
            
            const batchesData = this.batches.map(batch => [
                batch.id,
                batch.batchName,
                batch.course,
                batch.startDate,
                batch.endDate,
                batch.totalFees,
                batch.maxStudents,
                batch.currentStudents || 0,
                batch.status
            ]);

            // Demo mode simulation
            setTimeout(() => {
                this.hideLoadingOverlay();
                this.showAlert(`Successfully exported ${this.batches.length} batches to Google Sheets! (Demo Mode)`, 'success');
                this.updateLastSyncTime();
            }, 1500);
            
        } catch (error) {
            console.error('Error exporting batches:', error);
            this.hideLoadingOverlay();
            this.showAlert('Error exporting batches: ' + error.message, 'error');
        }
    }

    // Export Transactions to Google Sheets
    async exportTransactionsToSheets() {
        if (!this.isGoogleSheetsConnected) {
            this.showAlert('Please connect to Google Sheets first', 'warning');
            return;
        }

        try {
            this.showLoadingOverlay('Exporting transactions to Google Sheets...');
            
            const transactionsData = this.transactions.map(txn => [
                txn.id,
                txn.studentId,
                txn.admissionNumber,
                txn.date,
                txn.description,
                txn.amount,
                txn.type,
                txn.paymentMode,
                txn.referenceNumber
            ]);

            // Demo mode simulation
            setTimeout(() => {
                this.hideLoadingOverlay();
                this.showAlert(`Successfully exported ${this.transactions.length} transactions to Google Sheets! (Demo Mode)`, 'success');
                this.updateLastSyncTime();
            }, 1500);
            
        } catch (error) {
            console.error('Error exporting transactions:', error);
            this.hideLoadingOverlay();
            this.showAlert('Error exporting transactions: ' + error.message, 'error');
        }
    }

    // Sync All Data to Google Sheets
    async syncAllData() {
        if (!this.isGoogleSheetsConnected) {
            this.showAlert('Please connect to Google Sheets first', 'warning');
            return;
        }

        try {
            this.showLoadingOverlay('Syncing all data to Google Sheets...');
            
            // Demo mode simulation
            setTimeout(async () => {
                // Simulate individual exports
                await this.exportStudentsToSheets();
                await new Promise(resolve => setTimeout(resolve, 500));
                await this.exportBatchesToSheets();
                await new Promise(resolve => setTimeout(resolve, 500));
                await this.exportTransactionsToSheets();
                
                this.hideLoadingOverlay();
                this.showAlert('All data synchronized successfully! (Demo Mode)', 'success');
            }, 1000);
            
        } catch (error) {
            console.error('Error syncing data:', error);
            this.hideLoadingOverlay();
            this.showAlert('Error syncing data: ' + error.message, 'error');
        }
    }

    // Import Data from Google Sheets
    async importFromSheets() {
        if (!this.isGoogleSheetsConnected) {
            this.showAlert('Please connect to Google Sheets first', 'warning');
            return;
        }

        try {
            this.showLoadingOverlay('Importing data from Google Sheets...');
            
            // Demo mode simulation
            setTimeout(() => {
                this.hideLoadingOverlay();
                this.showAlert('Data import completed successfully! (Demo Mode)', 'success');
                this.updateDashboard();
                this.renderTables();
            }, 2000);
            
            // Actual implementation would fetch data from sheets:
            /*
            const studentsResponse = await gapi.client.sheets.spreadsheets.values.get({
                spreadsheetId: this.spreadsheetId,
                range: 'Students!A2:L'
            });
            
            const batchesResponse = await gapi.client.sheets.spreadsheets.values.get({
                spreadsheetId: this.spreadsheetId,
                range: 'Batches!A2:I'
            });
            
            const transactionsResponse = await gapi.client.sheets.spreadsheets.values.get({
                spreadsheetId: this.spreadsheetId,
                range: 'Transactions!A2:I'
            });
            
            // Process and merge the imported data
            this.processImportedData(studentsResponse.result.values, batchesResponse.result.values, transactionsResponse.result.values);
            */
            
        } catch (error) {
            console.error('Error importing data:', error);
            this.hideLoadingOverlay();
            this.showAlert('Error importing data: ' + error.message, 'error');
        }
    }

    // Update Google Sheets UI
    updateGoogleSheetsUI() {
        const connectionBadge = document.getElementById('connectionBadge');
        const googleSheetsStatus = document.getElementById('googleSheetsStatus');
        const connectedSection = document.getElementById('googleSheetsConnected');
        const disconnectedSection = document.getElementById('googleSheetsDisconnected');
        const userEmail = document.getElementById('userEmail');
        const lastSyncTime = document.getElementById('lastSyncTime');

        // Export buttons
        const exportButtons = [
            'exportStudentsBtn', 'exportStudentsBtn2', 'exportBatchesBtn', 'exportPaymentsBtn'
        ];

        if (this.isGoogleSheetsConnected) {
            // Update connection status
            if (connectionBadge) {
                connectionBadge.textContent = 'Connected';
                connectionBadge.className = 'badge bg-success ms-2';
            }
            
            if (googleSheetsStatus) {
                const badge = googleSheetsStatus.querySelector('.badge');
                if (badge) {
                    badge.innerHTML = '<i class="bi bi-cloud-check"></i> Connected';
                    badge.className = 'badge bg-success';
                }
            }

            // Show connected section
            if (connectedSection) connectedSection.style.display = 'block';
            if (disconnectedSection) disconnectedSection.style.display = 'none';

            // Update user info
            if (userEmail && this.currentUser) {
                userEmail.textContent = this.currentUser.email || 'demo@example.com';
            }

            if (lastSyncTime) {
                lastSyncTime.textContent = this.lastSyncTime ? 
                    this.formatDateTime(this.lastSyncTime) : 'Never';
            }

            // Show export buttons
            exportButtons.forEach(btnId => {
                const btn = document.getElementById(btnId);
                if (btn) btn.style.display = 'inline-block';
            });

        } else {
            // Update connection status
            if (connectionBadge) {
                connectionBadge.textContent = 'Disconnected';
                connectionBadge.className = 'badge bg-secondary ms-2';
            }

            if (googleSheetsStatus) {
                const badge = googleSheetsStatus.querySelector('.badge');
                if (badge) {
                    badge.innerHTML = '<i class="bi bi-cloud-slash"></i> Not Connected';
                    badge.className = 'badge bg-secondary';
                }
            }

            // Show disconnected section
            if (connectedSection) connectedSection.style.display = 'none';
            if (disconnectedSection) disconnectedSection.style.display = 'block';

            // Hide export buttons
            exportButtons.forEach(btnId => {
                const btn = document.getElementById(btnId);
                if (btn) btn.style.display = 'none';
            });
        }
    }

    updateLastSyncTime() {
        this.lastSyncTime = new Date().toISOString();
        const lastSyncTimeEl = document.getElementById('lastSyncTime');
        if (lastSyncTimeEl) {
            lastSyncTimeEl.textContent = this.formatDateTime(this.lastSyncTime);
        }
    }

    formatDateTime(isoString) {
        const date = new Date(isoString);
        return date.toLocaleString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    showLoadingOverlay(message = 'Loading...') {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            const messageEl = overlay.querySelector('p');
            if (messageEl) messageEl.textContent = message;
            overlay.style.display = 'flex';
        }
    }

    hideLoadingOverlay() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.style.display = 'none';
        }
    }

    // Data Management (existing methods)
    loadData() {
        const storedStudents = localStorage.getItem('mantra_students');
        const storedBatches = localStorage.getItem('mantra_batches');
        const storedTransactions = localStorage.getItem('mantra_transactions');

        if (storedStudents) this.students = JSON.parse(storedStudents);
        if (storedBatches) this.batches = JSON.parse(storedBatches);
        if (storedTransactions) this.transactions = JSON.parse(storedTransactions);
    }

    saveData() {
        localStorage.setItem('mantra_students', JSON.stringify(this.students));
        localStorage.setItem('mantra_batches', JSON.stringify(this.batches));
        localStorage.setItem('mantra_transactions', JSON.stringify(this.transactions));
    }

    loadSampleData() {
        // Only load sample data if localStorage is empty
        if (!localStorage.getItem('mantra_students')) {
            this.students = [
                {
                    id: "STU001",
                    admissionNumber: "MC2025001",
                    name: "Rahul Sharma",
                    email: "rahul.sharma@email.com",
                    phone: "9876543210",
                    address: "123 Main Street, Delhi",
                    dateOfBirth: "1995-05-15",
                    course: "Web Development",
                    batchId: "BATCH001",
                    admissionDate: "2025-01-15",
                    status: "Active",
                    totalFees: 25000,
                    paidAmount: 15000,
                    outstandingAmount: 10000
                },
                {
                    id: "STU002",
                    admissionNumber: "MC2025002",
                    name: "Priya Patel",
                    email: "priya.patel@email.com",
                    phone: "9876543211",
                    address: "456 Park Road, Mumbai",
                    dateOfBirth: "1998-08-22",
                    course: "Graphic Design",
                    batchId: "BATCH002",
                    admissionDate: "2025-02-01",
                    status: "Active",
                    totalFees: 20000,
                    paidAmount: 20000,
                    outstandingAmount: 0
                },
                {
                    id: "STU003",
                    admissionNumber: "MC2025003",
                    name: "Amit Kumar",
                    email: "amit.kumar@email.com",
                    phone: "9876543212",
                    address: "789 Central Ave, Bangalore",
                    dateOfBirth: "1997-12-10",
                    course: "Advanced Excel",
                    batchId: "BATCH003",
                    admissionDate: "2025-02-15",
                    status: "Active",
                    totalFees: 15000,
                    paidAmount: 5000,
                    outstandingAmount: 10000
                }
            ];

            this.batches = [
                {
                    id: "BATCH001",
                    batchName: "WD-2025-JAN",
                    course: "Web Development",
                    startDate: "2025-01-20",
                    endDate: "2025-07-20",
                    totalFees: 25000,
                    maxStudents: 20,
                    currentStudents: 15,
                    status: "Active"
                },
                {
                    id: "BATCH002",
                    batchName: "GD-2025-FEB",
                    course: "Graphic Design",
                    startDate: "2025-02-01",
                    endDate: "2025-06-01",
                    totalFees: 20000,
                    maxStudents: 15,
                    currentStudents: 12,
                    status: "Active"
                },
                {
                    id: "BATCH003",
                    batchName: "EX-2025-FEB",
                    course: "Advanced Excel",
                    startDate: "2025-02-15",
                    endDate: "2025-04-15",
                    totalFees: 15000,
                    maxStudents: 25,
                    currentStudents: 8,
                    status: "Active"
                }
            ];

            this.transactions = [
                {
                    id: "TXN001",
                    studentId: "STU001",
                    admissionNumber: "MC2025001",
                    date: "2025-01-15",
                    description: "Admission Fee",
                    amount: 5000,
                    type: "Credit",
                    paymentMode: "Cash",
                    referenceNumber: "REC001"
                },
                {
                    id: "TXN002",
                    studentId: "STU001",
                    admissionNumber: "MC2025001",
                    date: "2025-02-15",
                    description: "Monthly Fee - February",
                    amount: 10000,
                    type: "Credit",
                    paymentMode: "UPI",
                    referenceNumber: "REC002"
                },
                {
                    id: "TXN003",
                    studentId: "STU002",
                    admissionNumber: "MC2025002",
                    date: "2025-02-01",
                    description: "Full Course Fee",
                    amount: 20000,
                    type: "Credit",
                    paymentMode: "Bank Transfer",
                    referenceNumber: "REC003"
                },
                {
                    id: "TXN004",
                    studentId: "STU003",
                    admissionNumber: "MC2025003",
                    date: "2025-02-15",
                    description: "Admission Fee",
                    amount: 5000,
                    type: "Credit",
                    paymentMode: "Cash",
                    referenceNumber: "REC004"
                }
            ];

            this.saveData();
        }
    }

    // Event Listeners
    setupEventListeners() {
        // Navigation - Use event delegation for better compatibility
        document.addEventListener('click', (e) => {
            // Handle navigation links
            if (e.target.matches('a[data-section]') || e.target.closest('a[data-section]')) {
                e.preventDefault();
                const target = e.target.matches('a[data-section]') ? e.target : e.target.closest('a[data-section]');
                const section = target.getAttribute('data-section');
                this.showSection(section);
                return;
            }

            // Handle quick action buttons
            if (e.target.matches('button[onclick*="showSection"]') || e.target.closest('button[onclick*="showSection"]')) {
                const target = e.target.matches('button') ? e.target : e.target.closest('button');
                const onclick = target.getAttribute('onclick');
                if (onclick) {
                    const match = onclick.match(/showSection\('([^']+)'\)/);
                    if (match) {
                        e.preventDefault();
                        this.showSection(match[1]);
                        return;
                    }
                }
            }

            // Handle Google Sheets buttons
            if (e.target.matches('button[onclick*="connectGoogleSheets"]') || e.target.closest('button[onclick*="connectGoogleSheets"]')) {
                e.preventDefault();
                this.connectGoogleSheets();
                return;
            }

            if (e.target.matches('button[onclick*="disconnectGoogleSheets"]') || e.target.closest('button[onclick*="disconnectGoogleSheets"]')) {
                e.preventDefault();
                this.disconnectGoogleSheets();
                return;
            }

            if (e.target.matches('button[onclick*="syncAllData"]') || e.target.closest('button[onclick*="syncAllData"]')) {
                e.preventDefault();
                this.syncAllData();
                return;
            }

            if (e.target.matches('button[onclick*="exportStudentsToSheets"]') || e.target.closest('button[onclick*="exportStudentsToSheets"]')) {
                e.preventDefault();
                this.exportStudentsToSheets();
                return;
            }

            if (e.target.matches('button[onclick*="exportBatchesToSheets"]') || e.target.closest('button[onclick*="exportBatchesToSheets"]')) {
                e.preventDefault();
                this.exportBatchesToSheets();
                return;
            }

            if (e.target.matches('button[onclick*="exportTransactionsToSheets"]') || e.target.closest('button[onclick*="exportTransactionsToSheets"]')) {
                e.preventDefault();
                this.exportTransactionsToSheets();
                return;
            }

            if (e.target.matches('button[onclick*="importFromSheets"]') || e.target.closest('button[onclick*="importFromSheets"]')) {
                e.preventDefault();
                this.importFromSheets();
                return;
            }

            // Handle other buttons
            if (e.target.matches('button[onclick*="showBatchModal"]') || e.target.closest('button[onclick*="showBatchModal"]')) {
                e.preventDefault();
                this.showBatchModal();
                return;
            }

            if (e.target.matches('button[onclick*="saveBatch"]') || e.target.closest('button[onclick*="saveBatch"]')) {
                e.preventDefault();
                this.saveBatch();
                return;
            }
        });

        // Forms
        const admissionForm = document.getElementById('admissionForm');
        if (admissionForm) {
            admissionForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleAdmission();
            });
        }

        const paymentForm = document.getElementById('paymentForm');
        if (paymentForm) {
            paymentForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handlePayment();
            });
        }

        // Course change for batch filtering
        const courseSelect = document.getElementById('studentCourse');
        if (courseSelect) {
            courseSelect.addEventListener('change', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.updateBatchOptions(e.target.value);
            });
        }

        // Search and filter
        const studentSearch = document.getElementById('studentSearch');
        if (studentSearch) {
            studentSearch.addEventListener('input', (e) => {
                this.renderStudentsTable();
            });
        }

        const batchFilter = document.getElementById('studentBatchFilter');
        if (batchFilter) {
            batchFilter.addEventListener('change', () => {
                this.renderStudentsTable();
            });
        }

        const statusFilter = document.getElementById('studentStatusFilter');
        if (statusFilter) {
            statusFilter.addEventListener('change', () => {
                this.renderStudentsTable();
            });
        }

        // Set current date for payment form
        const paymentDate = document.getElementById('paymentDate');
        if (paymentDate) {
            paymentDate.value = new Date().toISOString().split('T')[0];
        }
    }

    // Navigation
    showSection(sectionName) {
        // Hide all sections
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });

        // Remove active class from all nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });

        // Show selected section
        const targetSection = document.getElementById(`${sectionName}-section`);
        if (targetSection) {
            targetSection.classList.add('active');
        }

        // Add active class to selected nav link
        const targetNavLink = document.querySelector(`[data-section="${sectionName}"]`);
        if (targetNavLink) {
            targetNavLink.classList.add('active');
        }

        // Update content based on section
        if (sectionName === 'dashboard') {
            this.updateDashboard();
        } else if (sectionName === 'ledger') {
            this.updateLedgerDropdowns();
        } else if (sectionName === 'reports') {
            this.updateReportDropdowns();
        } else if (sectionName === 'admissions') {
            setTimeout(() => {
                const courseValue = document.getElementById('studentCourse').value;
                if (courseValue) {
                    this.updateBatchOptions(courseValue);
                }
            }, 100);
        }
    }

    // Dashboard
    updateDashboard() {
        const totalStudents = this.students.length;
        const activeBatches = this.batches.filter(batch => batch.status === 'Active').length;
        const totalCollection = this.transactions.reduce((sum, txn) => sum + txn.amount, 0);
        const outstandingDues = this.students.reduce((sum, student) => sum + student.outstandingAmount, 0);

        const totalStudentsEl = document.getElementById('totalStudents');
        const activeBatchesEl = document.getElementById('activeBatches');
        const totalCollectionEl = document.getElementById('totalCollection');
        const outstandingDuesEl = document.getElementById('outstandingDues');

        if (totalStudentsEl) totalStudentsEl.textContent = totalStudents;
        if (activeBatchesEl) activeBatchesEl.textContent = activeBatches;
        if (totalCollectionEl) totalCollectionEl.textContent = `₹${totalCollection.toLocaleString()}`;
        if (outstandingDuesEl) outstandingDuesEl.textContent = `₹${outstandingDues.toLocaleString()}`;
    }

    // Student Admission
    handleAdmission() {
        const studentName = document.getElementById('studentName').value;
        const studentEmail = document.getElementById('studentEmail').value;
        const studentPhone = document.getElementById('studentPhone').value;
        const studentAddress = document.getElementById('studentAddress').value;
        const studentDOB = document.getElementById('studentDOB').value;
        const studentCourse = document.getElementById('studentCourse').value;
        const studentBatch = document.getElementById('studentBatch').value;

        if (!studentName || !studentEmail || !studentPhone || !studentAddress || !studentDOB || !studentCourse || !studentBatch) {
            this.showAlert('Please fill all required fields', 'error');
            return;
        }

        const batch = this.batches.find(b => b.id === studentBatch);
        
        if (!batch) {
            this.showAlert('Please select a valid batch', 'error');
            return;
        }

        const student = {
            id: this.generateId('STU'),
            admissionNumber: this.generateAdmissionNumber(),
            name: studentName,
            email: studentEmail,
            phone: studentPhone,
            address: studentAddress,
            dateOfBirth: studentDOB,
            course: studentCourse,
            batchId: studentBatch,
            admissionDate: new Date().toISOString().split('T')[0],
            status: 'Active',
            totalFees: batch.totalFees,
            paidAmount: 0,
            outstandingAmount: batch.totalFees
        };

        this.students.push(student);
        
        // Update batch current students count
        batch.currentStudents = (batch.currentStudents || 0) + 1;
        
        this.saveData();
        this.updateDashboard();
        this.populateDropdowns();
        this.renderTables();
        this.clearAdmissionForm();
        this.showAlert('Student admitted successfully! Admission Number: ' + student.admissionNumber, 'success');

        // Auto-sync if connected to Google Sheets
        if (this.isGoogleSheetsConnected) {
            setTimeout(() => this.exportStudentsToSheets(), 1000);
        }
    }

    generateAdmissionNumber() {
        const year = new Date().getFullYear();
        const count = this.students.length + 1;
        return `MC${year}${count.toString().padStart(3, '0')}`;
    }

    generateId(prefix) {
        const count = (prefix === 'STU' ? this.students.length : 
                      prefix === 'BATCH' ? this.batches.length : 
                      this.transactions.length) + 1;
        return `${prefix}${count.toString().padStart(3, '0')}`;
    }

    clearAdmissionForm() {
        const form = document.getElementById('admissionForm');
        if (form) {
            form.reset();
        }
        const batchDropdown = document.getElementById('studentBatch');
        if (batchDropdown) {
            batchDropdown.innerHTML = '<option value="">Select Batch</option>';
        }
    }

    // Batch Management
    saveBatch() {
        const batchName = document.getElementById('batchName').value;
        const batchCourse = document.getElementById('batchCourse').value;
        const batchStartDate = document.getElementById('batchStartDate').value;
        const batchEndDate = document.getElementById('batchEndDate').value;
        const batchFees = document.getElementById('batchFees').value;
        const batchMaxStudents = document.getElementById('batchMaxStudents').value;

        if (!batchName || !batchCourse || !batchStartDate || !batchEndDate || !batchFees || !batchMaxStudents) {
            this.showAlert('Please fill all required fields', 'error');
            return;
        }

        const batch = {
            id: this.generateId('BATCH'),
            batchName: batchName,
            course: batchCourse,
            startDate: batchStartDate,
            endDate: batchEndDate,
            totalFees: parseInt(batchFees),
            maxStudents: parseInt(batchMaxStudents),
            currentStudents: 0,
            status: 'Active'
        };

        this.batches.push(batch);
        this.saveData();
        this.updateDashboard();
        this.populateDropdowns();
        this.renderBatchesTable();
        
        // Hide modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('batchModal'));
        if (modal) {
            modal.hide();
        }
        
        const form = document.getElementById('batchForm');
        if (form) {
            form.reset();
        }
        
        this.showAlert('Batch created successfully!', 'success');

        // Auto-sync if connected to Google Sheets
        if (this.isGoogleSheetsConnected) {
            setTimeout(() => this.exportBatchesToSheets(), 1000);
        }
    }

    showBatchModal() {
        const modal = new bootstrap.Modal(document.getElementById('batchModal'));
        modal.show();
    }

    // Payment Management
    handlePayment() {
        const paymentStudent = document.getElementById('paymentStudent').value;
        const paymentAmount = document.getElementById('paymentAmount').value;
        const paymentMode = document.getElementById('paymentMode').value;
        const paymentDate = document.getElementById('paymentDate').value;
        const paymentReference = document.getElementById('paymentReference').value;
        const paymentDescription = document.getElementById('paymentDescription').value;

        if (!paymentStudent || !paymentAmount || !paymentMode || !paymentDate || !paymentDescription) {
            this.showAlert('Please fill all required fields', 'error');
            return;
        }

        const student = this.students.find(s => s.id === paymentStudent);
        
        if (!student) {
            this.showAlert('Please select a valid student', 'error');
            return;
        }

        const amount = parseFloat(paymentAmount);
        
        const transaction = {
            id: this.generateId('TXN'),
            studentId: paymentStudent,
            admissionNumber: student.admissionNumber,
            date: paymentDate,
            description: paymentDescription,
            amount: amount,
            type: 'Credit',
            paymentMode: paymentMode,
            referenceNumber: paymentReference || this.generateReceiptNumber()
        };

        this.transactions.push(transaction);
        
        // Update student payment info
        student.paidAmount += amount;
        student.outstandingAmount = Math.max(0, student.totalFees - student.paidAmount);
        
        this.saveData();
        this.updateDashboard();
        this.renderTables();
        this.clearPaymentForm();
        this.showAlert(`Payment of ₹${amount.toLocaleString()} recorded successfully! Receipt: ${transaction.referenceNumber}`, 'success');

        // Auto-sync if connected to Google Sheets
        if (this.isGoogleSheetsConnected) {
            setTimeout(() => {
                this.exportTransactionsToSheets();
                this.exportStudentsToSheets(); // Update student payment status
            }, 1000);
        }
    }

    generateReceiptNumber() {
        const count = this.transactions.length + 1;
        return `REC${count.toString().padStart(3, '0')}`;
    }

    clearPaymentForm() {
        const form = document.getElementById('paymentForm');
        if (form) {
            form.reset();
        }
        const paymentDate = document.getElementById('paymentDate');
        if (paymentDate) {
            paymentDate.value = new Date().toISOString().split('T')[0];
        }
    }

    // Ledger Management
    generateLedger() {
        const studentId = document.getElementById('ledgerStudentFilter').value;
        const batchId = document.getElementById('ledgerBatchFilter').value;
        const content = document.getElementById('ledgerContent');

        if (studentId) {
            this.generateStudentLedger(studentId, content);
        } else if (batchId) {
            this.generateBatchLedger(batchId, content);
        } else {
            content.innerHTML = '<p class="text-muted text-center">Select a student or batch to view ledger</p>';
        }
    }

    generateStudentLedger(studentId, content) {
        const student = this.students.find(s => s.id === studentId);
        const batch = this.batches.find(b => b.id === student.batchId);
        const transactions = this.transactions.filter(t => t.studentId === studentId);

        let html = `
            <div class="ledger-header">
                <div class="ledger-student-info">
                    <h4>${student.name} (${student.admissionNumber})</h4>
                    <p><strong>Course:</strong> ${student.course}</p>
                    <p><strong>Batch:</strong> ${batch ? batch.batchName : 'N/A'}</p>
                    <p><strong>Phone:</strong> ${student.phone}</p>
                    <p><strong>Email:</strong> ${student.email}</p>
                </div>
                <div class="ledger-summary">
                    <div class="summary-item">
                        <div class="summary-amount">₹${student.totalFees.toLocaleString()}</div>
                        <div class="summary-label">Total Fees</div>
                    </div>
                    <div class="summary-item paid">
                        <div class="summary-amount">₹${student.paidAmount.toLocaleString()}</div>
                        <div class="summary-label">Paid Amount</div>
                    </div>
                    <div class="summary-item outstanding">
                        <div class="summary-amount">₹${student.outstandingAmount.toLocaleString()}</div>
                        <div class="summary-label">Outstanding</div>
                    </div>
                </div>
            </div>
            <div class="transaction-table">
                <h5>Transaction History</h5>
                <div class="table-responsive">
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Description</th>
                                <th>Amount</th>
                                <th>Payment Mode</th>
                                <th>Reference</th>
                            </tr>
                        </thead>
                        <tbody>`;

        transactions.forEach(txn => {
            html += `
                <tr>
                    <td>${this.formatDate(txn.date)}</td>
                    <td>${txn.description}</td>
                    <td class="transaction-credit">₹${txn.amount.toLocaleString()}</td>
                    <td>${txn.paymentMode}</td>
                    <td>${txn.referenceNumber}</td>
                </tr>`;
        });

        html += `
                        </tbody>
                    </table>
                </div>
            </div>`;

        content.innerHTML = html;
    }

    generateBatchLedger(batchId, content) {
        const batch = this.batches.find(b => b.id === batchId);
        const students = this.students.filter(s => s.batchId === batchId);
        
        const totalFees = students.reduce((sum, s) => sum + s.totalFees, 0);
        const totalPaid = students.reduce((sum, s) => sum + s.paidAmount, 0);
        const totalOutstanding = students.reduce((sum, s) => sum + s.outstandingAmount, 0);

        let html = `
            <div class="ledger-header">
                <div class="ledger-student-info">
                    <h4>Batch: ${batch.batchName}</h4>
                    <p><strong>Course:</strong> ${batch.course}</p>
                    <p><strong>Duration:</strong> ${this.formatDate(batch.startDate)} to ${this.formatDate(batch.endDate)}</p>
                    <p><strong>Students:</strong> ${students.length}/${batch.maxStudents}</p>
                </div>
                <div class="ledger-summary">
                    <div class="summary-item">
                        <div class="summary-amount">₹${totalFees.toLocaleString()}</div>
                        <div class="summary-label">Total Fees</div>
                    </div>
                    <div class="summary-item paid">
                        <div class="summary-amount">₹${totalPaid.toLocaleString()}</div>
                        <div class="summary-label">Total Collected</div>
                    </div>
                    <div class="summary-item outstanding">
                        <div class="summary-amount">₹${totalOutstanding.toLocaleString()}</div>
                        <div class="summary-label">Total Outstanding</div>
                    </div>
                </div>
            </div>
            <div class="transaction-table">
                <h5>Student Payment Summary</h5>
                <div class="table-responsive">
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th>Student Name</th>
                                <th>Admission No.</th>
                                <th>Total Fees</th>
                                <th>Paid Amount</th>
                                <th>Outstanding</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>`;

        students.forEach(student => {
            const statusClass = student.outstandingAmount === 0 ? 'status-active' : 'status-pending';
            const statusText = student.outstandingAmount === 0 ? 'Paid' : 'Pending';
            
            html += `
                <tr>
                    <td>${student.name}</td>
                    <td>${student.admissionNumber}</td>
                    <td>₹${student.totalFees.toLocaleString()}</td>
                    <td>₹${student.paidAmount.toLocaleString()}</td>
                    <td>₹${student.outstandingAmount.toLocaleString()}</td>
                    <td><span class="${statusClass}">${statusText}</span></td>
                </tr>`;
        });

        html += `
                        </tbody>
                    </table>
                </div>
            </div>`;

        content.innerHTML = html;
    }

    // Dropdown population
    populateDropdowns() {
        this.updateBatchDropdowns();
        this.updateStudentDropdowns();
    }

    updateBatchDropdowns() {
        const dropdowns = [
            'studentBatch', 'studentBatchFilter', 'ledgerBatchFilter', 'reportBatchFilter'
        ];

        dropdowns.forEach(dropdownId => {
            const dropdown = document.getElementById(dropdownId);
            if (dropdown) {
                const currentValue = dropdown.value;
                
                if (dropdownId.includes('Filter')) {
                    dropdown.innerHTML = '<option value="">All Batches</option>';
                } else {
                    dropdown.innerHTML = '<option value="">Select Batch</option>';
                }
                
                this.batches.forEach(batch => {
                    const option = document.createElement('option');
                    option.value = batch.id;
                    option.textContent = `${batch.batchName} - ${batch.course}`;
                    dropdown.appendChild(option);
                });
                
                if (currentValue && this.batches.find(b => b.id === currentValue)) {
                    dropdown.value = currentValue;
                }
            }
        });
    }

    updateBatchOptions(course) {
        const batchDropdown = document.getElementById('studentBatch');
        if (batchDropdown) {
            batchDropdown.innerHTML = '<option value="">Select Batch</option>';
            
            if (course) {
                const courseBatches = this.batches.filter(batch => batch.course === course && batch.status === 'Active');
                courseBatches.forEach(batch => {
                    const option = document.createElement('option');
                    option.value = batch.id;
                    option.textContent = batch.batchName;
                    batchDropdown.appendChild(option);
                });
            }
        }
    }

    updateStudentDropdowns() {
        const dropdowns = ['paymentStudent', 'ledgerStudentFilter'];
        
        dropdowns.forEach(dropdownId => {
            const dropdown = document.getElementById(dropdownId);
            if (dropdown) {
                const currentValue = dropdown.value;
                dropdown.innerHTML = '<option value="">Select Student</option>';
                
                this.students.forEach(student => {
                    const option = document.createElement('option');
                    option.value = student.id;
                    option.textContent = `${student.name} (${student.admissionNumber})`;
                    dropdown.appendChild(option);
                });
                
                if (currentValue && this.students.find(s => s.id === currentValue)) {
                    dropdown.value = currentValue;
                }
            }
        });
    }

    updateLedgerDropdowns() {
        this.updateStudentDropdowns();
        this.updateBatchDropdowns();
    }

    updateReportDropdowns() {
        this.updateBatchDropdowns();
    }

    // Table rendering
    renderTables() {
        this.renderStudentsTable();
        this.renderBatchesTable();
    }

    renderStudentsTable() {
        const tbody = document.querySelector('#studentsTable tbody');
        if (!tbody) return;

        const searchEl = document.getElementById('studentSearch');
        const batchFilterEl = document.getElementById('studentBatchFilter');
        const statusFilterEl = document.getElementById('studentStatusFilter');

        const search = searchEl ? searchEl.value.toLowerCase() : '';
        const batchFilter = batchFilterEl ? batchFilterEl.value : '';
        const statusFilter = statusFilterEl ? statusFilterEl.value : '';

        let filteredStudents = this.students.filter(student => {
            const matchesSearch = student.name.toLowerCase().includes(search) ||
                                student.admissionNumber.toLowerCase().includes(search) ||
                                student.phone.includes(search);
            const matchesBatch = !batchFilter || student.batchId === batchFilter;
            const matchesStatus = !statusFilter || student.status === statusFilter;
            
            return matchesSearch && matchesBatch && matchesStatus;
        });

        tbody.innerHTML = '';
        filteredStudents.forEach(student => {
            const batch = this.batches.find(b => b.id === student.batchId);
            const statusClass = student.status === 'Active' ? 'status-active' : 
                              student.status === 'Inactive' ? 'status-inactive' : 'status-completed';

            tbody.innerHTML += `
                <tr>
                    <td>${student.admissionNumber}</td>
                    <td>${student.name}</td>
                    <td>${student.course}</td>
                    <td>${batch ? batch.batchName : 'N/A'}</td>
                    <td>${student.phone}</td>
                    <td>₹${student.totalFees.toLocaleString()}</td>
                    <td>₹${student.paidAmount.toLocaleString()}</td>
                    <td>₹${student.outstandingAmount.toLocaleString()}</td>
                    <td><span class="${statusClass}">${student.status}</span></td>
                    <td>
                        <div class="action-buttons">
                            <button class="btn btn-sm btn-outline-primary" onclick="ims.viewStudentLedger('${student.id}')">
                                <i class="bi bi-eye"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-success" onclick="ims.makePayment('${student.id}')">
                                <i class="bi bi-cash"></i>
                            </button>
                        </div>
                    </td>
                </tr>`;
        });
    }

    renderBatchesTable() {
        const tbody = document.querySelector('#batchesTable tbody');
        if (!tbody) return;

        tbody.innerHTML = '';

        this.batches.forEach(batch => {
            const statusClass = batch.status === 'Active' ? 'status-active' : 
                              batch.status === 'Inactive' ? 'status-inactive' : 'status-completed';

            tbody.innerHTML += `
                <tr>
                    <td>${batch.batchName}</td>
                    <td>${batch.course}</td>
                    <td>${this.formatDate(batch.startDate)}</td>
                    <td>${this.formatDate(batch.endDate)}</td>
                    <td>₹${batch.totalFees.toLocaleString()}</td>
                    <td>${batch.currentStudents || 0}/${batch.maxStudents}</td>
                    <td><span class="${statusClass}">${batch.status}</span></td>
                    <td>
                        <div class="action-buttons">
                            <button class="btn btn-sm btn-outline-primary" onclick="ims.viewBatchLedger('${batch.id}')">
                                <i class="bi bi-eye"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-danger" onclick="ims.deleteBatch('${batch.id}')">
                                <i class="bi bi-trash"></i>
                            </button>
                        </div>
                    </td>
                </tr>`;
        });
    }

    // Quick actions
    viewStudentLedger(studentId) {
        const ledgerStudentFilter = document.getElementById('ledgerStudentFilter');
        if (ledgerStudentFilter) {
            ledgerStudentFilter.value = studentId;
        }
        this.showSection('ledger');
        this.generateLedger();
    }

    viewBatchLedger(batchId) {
        const ledgerBatchFilter = document.getElementById('ledgerBatchFilter');
        if (ledgerBatchFilter) {
            ledgerBatchFilter.value = batchId;
        }
        this.showSection('ledger');
        this.generateLedger();
    }

    makePayment(studentId) {
        const paymentStudent = document.getElementById('paymentStudent');
        if (paymentStudent) {
            paymentStudent.value = studentId;
        }
        this.showSection('payments');
    }

    deleteBatch(batchId) {
        if (confirm('Are you sure you want to delete this batch?')) {
            this.batches = this.batches.filter(batch => batch.id !== batchId);
            this.saveData();
            this.renderBatchesTable();
            this.populateDropdowns();
            this.showAlert('Batch deleted successfully!', 'success');
        }
    }

    // Reports
    generateBatchReport() {
        const batchId = document.getElementById('reportBatchFilter').value;
        if (!batchId) {
            this.showAlert('Please select a batch', 'error');
            return;
        }

        const content = document.getElementById('reportContent');
        this.generateBatchLedger(batchId, content);
    }

    generatePaymentReport() {
        const startDate = document.getElementById('reportStartDate').value;
        const endDate = document.getElementById('reportEndDate').value;
        const content = document.getElementById('reportContent');

        if (!startDate || !endDate) {
            this.showAlert('Please select date range', 'error');
            return;
        }

        const transactions = this.transactions.filter(txn => {
            return txn.date >= startDate && txn.date <= endDate;
        });

        const totalAmount = transactions.reduce((sum, txn) => sum + txn.amount, 0);

        let html = `
            <div class="report-section">
                <h4 class="report-title">Payment Report (${this.formatDate(startDate)} to ${this.formatDate(endDate)})</h4>
                <div class="ledger-summary">
                    <div class="summary-item">
                        <div class="summary-amount">${transactions.length}</div>
                        <div class="summary-label">Total Transactions</div>
                    </div>
                    <div class="summary-item paid">
                        <div class="summary-amount">₹${totalAmount.toLocaleString()}</div>
                        <div class="summary-label">Total Amount</div>
                    </div>
                </div>
                <div class="table-responsive">
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Student</th>
                                <th>Description</th>
                                <th>Amount</th>
                                <th>Payment Mode</th>
                                <th>Reference</th>
                            </tr>
                        </thead>
                        <tbody>`;

        transactions.forEach(txn => {
            const student = this.students.find(s => s.id === txn.studentId);
            html += `
                <tr>
                    <td>${this.formatDate(txn.date)}</td>
                    <td>${student ? student.name : 'N/A'}</td>
                    <td>${txn.description}</td>
                    <td class="transaction-credit">₹${txn.amount.toLocaleString()}</td>
                    <td>${txn.paymentMode}</td>
                    <td>${txn.referenceNumber}</td>
                </tr>`;
        });

        html += `
                        </tbody>
                    </table>
                </div>
            </div>`;

        content.innerHTML = html;
    }

    // Excel Export/Import
    exportAllData() {
        const data = {
            students: this.students,
            batches: this.batches,
            transactions: this.transactions,
            exportDate: new Date().toISOString()
        };

        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `mantra_computer_data_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        this.showAlert('Data exported successfully!', 'success');
    }

    showImportModal() {
        const modal = new bootstrap.Modal(document.getElementById('importModal'));
        modal.show();
    }

    downloadTemplate(type) {
        let csvContent = '';
        
        if (type === 'students') {
            csvContent = 'Name,Email,Phone,Address,DateOfBirth,Course,BatchId\n';
            csvContent += 'John Doe,john@email.com,9876543210,123 Street City,1995-01-01,Web Development,BATCH001\n';
        } else if (type === 'batches') {
            csvContent = 'BatchName,Course,StartDate,EndDate,TotalFees,MaxStudents\n';
            csvContent += 'WD-2025-MAR,Web Development,2025-03-01,2025-09-01,25000,20\n';
        }

        const dataBlob = new Blob([csvContent], {type: 'text/csv'});
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `${type}_template.csv`;
        link.click();
    }

    importData() {
        const fileInput = document.getElementById('importFile');
        const file = fileInput.files[0];
        
        if (!file) {
            this.showAlert('Please select a file', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                
                if (data.students) this.students = [...this.students, ...data.students];
                if (data.batches) this.batches = [...this.batches, ...data.batches];
                if (data.transactions) this.transactions = [...this.transactions, ...data.transactions];
                
                this.saveData();
                this.updateDashboard();
                this.populateDropdowns();
                this.renderTables();
                
                const modal = bootstrap.Modal.getInstance(document.getElementById('importModal'));
                if (modal) {
                    modal.hide();
                }
                
                this.showAlert('Data imported successfully!', 'success');
            } catch (error) {
                this.showAlert('Error importing data: ' + error.message, 'error');
            }
        };
        
        reader.readAsText(file);
    }

    // Utility functions
    formatDate(dateStr) {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-IN');
    }

    showAlert(message, type) {
        const alertClass = type === 'success' ? 'alert-success' : 
                          type === 'error' ? 'alert-danger' : 'alert-warning';
        
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert ${alertClass} fade-in`;
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close float-end" onclick="this.parentElement.remove()"></button>
        `;
        
        const container = document.querySelector('.container-fluid');
        if (container) {
            container.insertBefore(alertDiv, container.firstChild);
        }
        
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.remove();
            }
        }, 5000);
    }
}

// Global functions for HTML onclick events
let ims;

// Initialize the system when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    ims = new InstituteManagementSystem();
});

// Simplified global functions - the event delegation will handle most cases
window.showSection = function(section) {
    if (ims) ims.showSection(section);
};

window.showBatchModal = function() {
    if (ims) ims.showBatchModal();
};

window.saveBatch = function() {
    if (ims) ims.saveBatch();
};

window.clearAdmissionForm = function() {
    if (ims) ims.clearAdmissionForm();
};

window.clearPaymentForm = function() {
    if (ims) ims.clearPaymentForm();
};

window.generateLedger = function() {
    if (ims) ims.generateLedger();
};

window.generateBatchReport = function() {
    if (ims) ims.generateBatchReport();
};

window.generatePaymentReport = function() {
    if (ims) ims.generatePaymentReport();
};

window.exportAllData = function() {
    if (ims) ims.exportAllData();
};

window.showImportModal = function() {
    if (ims) ims.showImportModal();
};

window.downloadTemplate = function(type) {
    if (ims) ims.downloadTemplate(type);
};

window.importData = function() {
    if (ims) ims.importData();
};

// Google Sheets Functions
window.connectGoogleSheets = function() {
    if (ims) ims.connectGoogleSheets();
};

window.disconnectGoogleSheets = function() {
    if (ims) ims.disconnectGoogleSheets();
};

window.syncAllData = function() {
    if (ims) ims.syncAllData();
};

window.exportStudentsToSheets = function() {
    if (ims) ims.exportStudentsToSheets();
};

window.exportBatchesToSheets = function() {
    if (ims) ims.exportBatchesToSheets();
};

window.exportTransactionsToSheets = function() {
    if (ims) ims.exportTransactionsToSheets();
};

window.importFromSheets = function() {
    if (ims) ims.importFromSheets();
};
