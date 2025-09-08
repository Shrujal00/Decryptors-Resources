// Event Forms Management System
// Handles custom form creation, registration forms, and Firebase integration

class EventFormsManager {
    constructor() {
        this.currentFormData = {};
        this.autoSaveInterval = null;
        this.initializeEventForms();
    }

    initializeEventForms() {
        console.log('🎯 Initializing Event Forms Manager...');
        
        // Setup event listeners for form buttons
        this.setupEventListeners();
        
        // Setup Firebase real-time listeners
        this.setupFirebaseListeners();
        
        if (!window.isFirebaseEnabled) {
            console.warn('⚠️ Firebase not enabled - event forms will use demo mode');
        }
    }

    setupFirebaseListeners() {
        if (window.isFirebaseEnabled && window.db) {
            console.log('🔥 Setting up Firebase real-time listeners for event forms...');
            
            // Listen for changes in eventForms collection
            db.collection('eventForms').onSnapshot((snapshot) => {
                console.log('🔄 Firebase eventForms collection changed, refreshing UI...');
                
                snapshot.docChanges().forEach((change) => {
                    const eventId = change.doc.id;
                    if (change.type === 'added') {
                        console.log(`➕ Form added for event: ${eventId}`);
                    } else if (change.type === 'modified') {
                        console.log(`📝 Form modified for event: ${eventId}`);
                    } else if (change.type === 'removed') {
                        console.log(`❌ Form removed for event: ${eventId}`);
                    }
                });
                
                // Refresh the events display to update button states
                setTimeout(async () => {
                    await this.refreshEventsDisplay();
                }, 100);
            }, (error) => {
                console.error('Firebase listener error:', error);
            });

            // Listen for changes in eventRegistrations collection
            db.collection('eventRegistrations').onSnapshot((snapshot) => {
                console.log('🔄 Firebase eventRegistrations collection changed, refreshing UI...');
                
                snapshot.docChanges().forEach((change) => {
                    const registration = change.doc.data();
                    if (change.type === 'added') {
                        console.log(`✅ New registration for event: ${registration.eventId}`);
                    }
                });
                
                // Refresh the events display to update registration status
                setTimeout(async () => {
                    await this.refreshEventsDisplay();
                }, 100);
            }, (error) => {
                console.error('Firebase registrations listener error:', error);
            });
        }
    }

    setupEventListeners() {
        console.log('🔧 Setting up event listeners...');
        
        // Use event delegation to handle dynamically created buttons
        document.addEventListener('click', (e) => {
            // Create Form button
            if (e.target.matches('.create-form-btn') || e.target.matches('[data-action="create-form"]')) {
                e.preventDefault();
                console.log('🎯 Create form button clicked');
                const eventId = e.target.getAttribute('data-event-id') || e.target.closest('[data-event-id]')?.getAttribute('data-event-id');
                if (eventId) {
                    this.openFormBuilder(eventId);
                } else {
                    console.error('No event ID found for form creation');
                }
            }

            // View Responses button
            if (e.target.matches('.view-responses-btn') || e.target.matches('[data-action="view-responses"]')) {
                e.preventDefault();
                const eventId = e.target.getAttribute('data-event-id') || e.target.closest('[data-event-id]')?.getAttribute('data-event-id');
                if (eventId) {
                    this.viewResponses(eventId);
                }
            }

            // Register for Event button
            if (e.target.matches('.register-event-btn') || e.target.matches('[data-action="register"]')) {
                e.preventDefault();
                const eventId = e.target.getAttribute('data-event-id') || e.target.closest('[data-event-id]')?.getAttribute('data-event-id');
                if (eventId) {
                    this.openRegistrationForm(eventId);
                }
            }

            // Form builder specific buttons
            if (e.target.matches('#save-form-config')) {
                e.preventDefault();
                this.saveFormConfiguration();
            }

            if (e.target.matches('#close-form-builder')) {
                e.preventDefault();
                this.closeFormBuilder();
            }
        });
    }

    async openFormBuilder(eventId) {
        console.log('📝 Opening form builder for event:', eventId);
        this.currentEventId = eventId;
        
        try {
            // Get event details
            const eventResult = await this.getEventDetails(eventId);
            if (!eventResult.success) {
                throw new Error(eventResult.error || 'Event not found');
            }

            // Get existing form configuration
            const formConfig = await this.getFormConfiguration(eventId);

            // Show form builder modal
            this.showFormBuilderModal(eventResult.event, formConfig);

        } catch (error) {
            console.error('💥 Error opening form builder:', error);
            alert('Error opening form builder: ' + error.message);
        }
    }

    async getEventDetails(eventId) {
        try {
            if (!window.isFirebaseEnabled) {
                // Demo data
                return {
                    success: true,
                    event: {
                        id: eventId,
                        title: 'Demo Event',
                        description: 'This is a demo event'
                    }
                };
            }

            const eventDoc = await db.collection('events').doc(eventId).get();
            if (eventDoc.exists) {
                return { 
                    success: true, 
                    event: { id: eventDoc.id, ...eventDoc.data() }
                };
            } else {
                return { success: false, error: 'Event not found' };
            }
        } catch (error) {
            console.error('💥 Error getting event details:', error);
            return { success: false, error: error.message };
        }
    }

    async getFormConfiguration(eventId) {
        try {
            if (!window.isFirebaseEnabled) {
                // Check localStorage for demo
                const formConfig = localStorage.getItem(`eventForm_${eventId}`);
                return formConfig ? JSON.parse(formConfig) : null;
            }

            const formDoc = await db.collection('eventForms').doc(eventId).get();
            if (formDoc.exists) {
                return formDoc.data();
            } else {
                return null;
            }
        } catch (error) {
            console.error('💥 Error getting form configuration:', error);
            return null;
        }
    }

    showFormBuilderModal(event, existingConfig = null) {
        console.log('🎨 Showing form builder modal for:', event.title);
        
        // Remove existing modal if any
        const existingModal = document.getElementById('form-builder-modal');
        if (existingModal) {
            existingModal.remove();
        }

        // Create modal HTML
        const modal = document.createElement('div');
        modal.id = 'form-builder-modal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content form-builder-content">
                <div class="modal-header">
                    <h2>Form Builder - ${event.title}</h2>
                    <span class="close" onclick="closeFormBuilder()">&times;</span>
                </div>
                <div class="modal-body">
                    <div class="form-builder-tabs">
                        <button class="tab-btn active" onclick="showFormTab('basic')">Basic Settings</button>
                        <button class="tab-btn" onclick="showFormTab('fields')">Custom Fields</button>
                        <button class="tab-btn" onclick="showFormTab('preview')">Preview</button>
                    </div>

                    <div id="basic-settings" class="tab-content active">
                        <div class="form-group">
                            <label>
                                <input type="checkbox" id="enable-registration" ${existingConfig?.registrationEnabled !== false ? 'checked' : ''}>
                                Enable Registration for this Event
                            </label>
                            <small class="help-text">Allow users to register for this event using the form</small>
                        </div>
                        
                        <div class="form-group">
                            <label>
                                <input type="checkbox" id="team-event-toggle" ${existingConfig?.isTeamEvent ? 'checked' : ''}>
                                Team Event (Multiple participants per registration)
                            </label>
                        </div>

                        <div id="team-settings" style="display: ${existingConfig?.isTeamEvent ? 'block' : 'none'};">
                            <div class="form-group">
                                <label for="team-size-input">Maximum Team Size:</label>
                                <input type="number" id="team-size-input" min="2" max="10" value="${existingConfig?.maxTeamSize || 3}">
                            </div>
                        </div>
                    </div>

                    <div id="custom-fields" class="tab-content">
                        <div class="form-group">
                            <button type="button" class="btn btn-primary add-custom-field-btn">Add Custom Field</button>
                        </div>
                        <div id="custom-fields-container">
                            <!-- Custom fields will be added here -->
                        </div>
                    </div>

                    <div id="preview-tab" class="tab-content">
                        <div id="form-preview">
                            <!-- Form preview will be generated here -->
                        </div>
                    </div>
                </div>
                
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="closeFormBuilder()">Cancel</button>
                    <button class="btn btn-primary" onclick="saveFormConfiguration()">Save Form</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        modal.style.display = 'block';
        document.body.classList.add('modal-open');

        // Load existing custom fields if any
        if (existingConfig?.customFields) {
            this.loadCustomFields(existingConfig.customFields);
        }

        // Setup event listeners for this modal
        this.setupModalEventListeners();
    }

    setupModalEventListeners() {
        // Team event toggle
        const teamToggle = document.getElementById('team-event-toggle');
        if (teamToggle) {
            teamToggle.addEventListener('change', (e) => {
                this.toggleTeamEvent(e.target.checked);
            });
        }

        // Add custom field button
        document.addEventListener('click', (e) => {
            if (e.target.matches('.add-custom-field-btn')) {
                e.preventDefault();
                this.addCustomField();
            }
            
            if (e.target.matches('.remove-field-btn')) {
                e.preventDefault();
                e.target.closest('.custom-field').remove();
            }
        });

        // Preview update
        document.addEventListener('change', (e) => {
            if (e.target.closest('#form-builder-modal')) {
                this.updatePreview();
            }
        });
    }

    toggleTeamEvent(isTeam) {
        const teamSettings = document.getElementById('team-settings');
        if (teamSettings) {
            teamSettings.style.display = isTeam ? 'block' : 'none';
        }
    }

    loadCustomFields(customFields) {
        const container = document.getElementById('custom-fields-container');
        if (!container) return;

        container.innerHTML = '';
        customFields.forEach(field => {
            this.addCustomField(field);
        });
    }

    addCustomField(fieldData = null) {
        const container = document.getElementById('custom-fields-container');
        if (!container) return;

        const fieldId = Date.now() + Math.random();
        const fieldHtml = `
            <div class="custom-field" data-field-id="${fieldId}">
                <div class="field-config">
                    <div class="form-row">
                        <div class="form-group">
                            <label>Field Label:</label>
                            <input type="text" class="field-label" value="${fieldData?.label || ''}" placeholder="Enter field label">
                        </div>
                        <div class="form-group">
                            <label>Field Type:</label>
                            <select class="field-type">
                                <option value="text" ${fieldData?.type === 'text' ? 'selected' : ''}>Short Answer</option>
                                <option value="textarea" ${fieldData?.type === 'textarea' ? 'selected' : ''}>Long Answer</option>
                                <option value="select" ${fieldData?.type === 'select' ? 'selected' : ''}>Multiple Choice</option>
                                <option value="email" ${fieldData?.type === 'email' ? 'selected' : ''}>Email</option>
                                <option value="number" ${fieldData?.type === 'number' ? 'selected' : ''}>Number</option>
                                <option value="tel" ${fieldData?.type === 'tel' ? 'selected' : ''}>Phone</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>
                                <input type="checkbox" class="field-required" ${fieldData?.required ? 'checked' : ''}>
                                Required Field
                            </label>
                        </div>
                        <div class="form-group">
                            <button type="button" class="btn btn-danger btn-sm remove-field-btn">Remove Field</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        container.insertAdjacentHTML('beforeend', fieldHtml);
    }

    updatePreview() {
        const previewContainer = document.getElementById('form-preview');
        if (!previewContainer) return;

        const isTeamEvent = document.getElementById('team-event-toggle')?.checked || false;
        const maxTeamSize = document.getElementById('team-size-input')?.value || 3;
        const registrationEnabled = document.getElementById('enable-registration')?.checked;

        if (!registrationEnabled) {
            previewContainer.innerHTML = '<p class="preview-disabled">Registration is disabled for this event.</p>';
            return;
        }

        // Collect custom fields
        const customFields = this.collectCustomFields();

        let previewHtml = `
            <div class="form-preview-container">
                <h3>Registration Form Preview</h3>
                <form class="preview-form">
                    <div class="form-group">
                        <label>Full Name: *</label>
                        <input type="text" placeholder="Enter your full name" readonly>
                    </div>
                    <div class="form-group">
                        <label>Email: *</label>
                        <input type="email" placeholder="Enter your email" readonly>
                    </div>
                    <div class="form-group">
                        <label>Branch/Department: *</label>
                        <input type="text" placeholder="Enter your branch" readonly>
                    </div>
                    <div class="form-group">
                        <label>Phone:</label>
                        <input type="tel" placeholder="Enter your phone number" readonly>
                    </div>
        `;

        if (isTeamEvent) {
            previewHtml += `
                <div class="team-section">
                    <h4>Team Information</h4>
                    <div class="form-group">
                        <label>Team Name: *</label>
                        <input type="text" placeholder="Enter team name" readonly>
                    </div>
                    <div class="form-group">
                        <label>Number of Team Members (Max ${maxTeamSize}): *</label>
                        <input type="number" min="1" max="${maxTeamSize}" value="1" readonly>
                    </div>
                </div>
            `;
        }

        // Add custom fields
        customFields.forEach(field => {
            previewHtml += `
                <div class="form-group">
                    <label>${field.label}${field.required ? ' *' : ''}:</label>
                    ${this.generatePreviewFieldHTML(field)}
                </div>
            `;
        });

        previewHtml += `
                    <button type="button" class="btn btn-primary" disabled>Register for Event</button>
                </form>
            </div>
        `;

        previewContainer.innerHTML = previewHtml;
    }

    generatePreviewFieldHTML(field) {
        switch (field.type) {
            case 'textarea':
                return `<textarea placeholder="Enter your response" readonly></textarea>`;
            case 'select':
                return `<select readonly disabled><option>Select an option</option></select>`;
            case 'email':
                return `<input type="email" placeholder="Enter email address" readonly>`;
            case 'number':
                return `<input type="number" placeholder="Enter a number" readonly>`;
            case 'tel':
                return `<input type="tel" placeholder="Enter phone number" readonly>`;
            default:
                return `<input type="text" placeholder="Enter your response" readonly>`;
        }
    }

    collectCustomFields() {
        const customFields = [];
        document.querySelectorAll('.custom-field').forEach(field => {
            const label = field.querySelector('.field-label')?.value;
            const type = field.querySelector('.field-type')?.value;
            const required = field.querySelector('.field-required')?.checked;

            if (label && label.trim()) {
                customFields.push({ label: label.trim(), type, required });
            }
        });
        return customFields;
    }

    async viewResponses(eventId) {
        console.log('📊 Viewing responses for event:', eventId);
        
        try {
            // Get event details and registrations
            const [eventResult, registrations] = await Promise.all([
                this.getEventDetails(eventId),
                this.getEventRegistrations(eventId)
            ]);

            if (!eventResult.success) {
                throw new Error('Event not found');
            }

            this.showResponsesModal(eventResult.event, registrations);

        } catch (error) {
            console.error('💥 Error viewing responses:', error);
            alert('Error loading responses: ' + error.message);
        }
    }

    async getEventRegistrations(eventId) {
        try {
            if (window.isFirebaseEnabled) {
                // Use simple query to avoid index requirements
                const snapshot = await db.collection('eventRegistrations')
                    .where('eventId', '==', eventId)
                    .get();

                const registrations = [];
                snapshot.forEach(doc => {
                    registrations.push({ id: doc.id, ...doc.data() });
                });
                
                // Sort client-side instead of server-side to avoid index requirement
                registrations.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
                
                console.log(`📊 Found ${registrations.length} registrations for event ${eventId}`);
                return registrations;
            } else {
                // Get from localStorage for demo
                const allRegistrations = JSON.parse(localStorage.getItem('eventRegistrations') || '[]');
                return allRegistrations.filter(reg => reg.eventId === eventId);
            }
        } catch (error) {
            console.error('💥 Error getting registrations:', error);
            return [];
        }
    }

    showResponsesModal(event, registrations) {
        // Remove existing modal if any
        const existingModal = document.getElementById('responses-modal');
        if (existingModal) {
            existingModal.remove();
        }

        // Create modal HTML
        const modal = document.createElement('div');
        modal.id = 'responses-modal';
        modal.className = 'modal-overlay';
        modal.setAttribute('data-event-id', event.id); // Add event ID for refresh functionality
        modal.innerHTML = `
            <div class="modal-content responses-content">
                <div class="modal-header">
                    <h2><i class="fas fa-users"></i> Registrations for ${event.title}</h2>
                    <span class="close" onclick="closeResponsesModal()">&times;</span>
                </div>
                <div class="modal-body">
                    <div class="responses-summary">
                        <div class="stats-row">
                            <div class="stat-item">
                                <span class="stat-number">${registrations.length}</span>
                                <span class="stat-label">Total Registrations</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-number">${this.getTeamCount(registrations)}</span>
                                <span class="stat-label">Teams Registered</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-number">${this.getTotalParticipants(registrations)}</span>
                                <span class="stat-label">Total Participants</span>
                            </div>
                        </div>
                        <div class="actions-row">
                            <button class="btn btn-primary" onclick="exportRegistrations('${event.id}')">
                                <i class="fas fa-download"></i> Export CSV
                            </button>
                            <button class="btn btn-secondary" onclick="refreshRegistrations('${event.id}')">
                                <i class="fas fa-refresh"></i> Refresh
                            </button>
                        </div>
                    </div>
                    
                    <div class="registrations-list">
                        ${this.generateRegistrationsList(registrations)}
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        modal.style.display = 'block';
        document.body.classList.add('modal-open');
    }

    getTeamCount(registrations) {
        return registrations.filter(reg => reg.registrationData.teamName).length;
    }

    getTotalParticipants(registrations) {
        let total = 0;
        registrations.forEach(reg => {
            if (reg.registrationData.teamSize) {
                total += parseInt(reg.registrationData.teamSize);
            } else {
                total += 1; // Individual registration
            }
        });
        return total;
    }

    generateRegistrationsList(registrations) {
        if (registrations.length === 0) {
            return '<div class="no-registrations"><p>No registrations yet.</p></div>';
        }

        let html = '';
        registrations.forEach((registration, index) => {
            const data = registration.registrationData;
            const isTeam = data.teamName;
            const submittedDate = new Date(registration.submittedAt).toLocaleString();

            html += `
                <div class="registration-item ${isTeam ? 'team-registration' : 'individual-registration'}">
                    <div class="registration-header">
                        <h3>Registration #${index + 1} ${isTeam ? '(Team)' : '(Individual)'}</h3>
                        <span class="registration-date">${submittedDate}</span>
                    </div>
                    
                    <div class="registration-details">
                        <div class="basic-info">
                            <div class="info-item">
                                <strong>Name:</strong> ${data.fullname}
                            </div>
                            <div class="info-item">
                                <strong>Email:</strong> ${data.email}
                            </div>
                            <div class="info-item">
                                <strong>Branch:</strong> ${data.branch}
                            </div>
                            ${data.phone ? `<div class="info-item"><strong>Phone:</strong> ${data.phone}</div>` : ''}
                        </div>

                        ${isTeam ? this.generateTeamDetails(data) : ''}
                        ${this.generateCustomFieldsDisplay(data)}
                    </div>
                    
                    <div class="registration-actions">
                        <button class="btn btn-sm btn-danger" onclick="deleteRegistration('${registration.id}')">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </div>
            `;
        });

        return html;
    }

    generateTeamDetails(data) {
        let html = `
            <div class="team-info">
                <h4>Team Information</h4>
                <div class="info-item">
                    <strong>Team Name:</strong> ${data.teamName}
                </div>
                <div class="info-item">
                    <strong>Team Size:</strong> ${data.teamSize}
                </div>
                
                <div class="team-members">
                    <h5>Team Members:</h5>
        `;

        for (let i = 1; i <= parseInt(data.teamSize); i++) {
            const memberName = data[`member${i}_name`];
            const memberEmail = data[`member${i}_email`];
            if (memberName) {
                html += `
                    <div class="member-item">
                        <span class="member-name">${memberName}</span>
                        <span class="member-email">${memberEmail || ''}</span>
                        ${i === 1 ? '<span class="member-role">(Leader)</span>' : ''}
                    </div>
                `;
            }
        }

        html += '</div></div>';
        return html;
    }

    generateCustomFieldsDisplay(data) {
        let html = '';
        const customFields = Object.keys(data).filter(key => key.startsWith('custom_'));
        
        if (customFields.length > 0) {
            html += '<div class="custom-fields-display"><h4>Additional Information</h4>';
            customFields.forEach(key => {
                const label = key.replace('custom_', 'Custom Field ');
                html += `<div class="info-item"><strong>${label}:</strong> ${data[key]}</div>`;
            });
            html += '</div>';
        }

        return html;
    }

    async openRegistrationForm(eventId) {
        console.log('📋 Opening registration form for event:', eventId);
        console.log('👤 Current user:', window.currentUser);
        this.currentEventId = eventId;

        try {
            // Get event details and form configuration
            console.log('🔍 Fetching event details and form configuration...');
            const [eventResult, formConfig] = await Promise.all([
                this.getEventDetails(eventId),
                this.getFormConfiguration(eventId)
            ]);

            console.log('📊 Event result:', eventResult);
            console.log('📋 Form configuration retrieved:', formConfig);

            if (!eventResult.success) {
                throw new Error('Event not found');
            }

            console.log('📋 Form configuration check:', formConfig);
            console.log('   - Form exists:', !!formConfig);
            console.log('   - Registration enabled:', formConfig?.registrationEnabled);

            if (!formConfig) {
                this.showErrorModal('Registration Not Available', 'No registration form has been created for this event yet.');
                return;
            }

            if (formConfig.registrationEnabled !== true) {
                this.showErrorModal('Registration Disabled', 'Registration is currently disabled for this event.');
                return;
            }

            // Check if user is logged in
            if (!window.currentUser) {
                alert('Please login to register for events.');
                if (typeof showPage === 'function') {
                    showPage('auth');
                }
                return;
            }

            // Show registration form
            this.showRegistrationForm(eventResult.event, formConfig);

        } catch (error) {
            console.error('💥 Error opening registration form:', error);
            alert('Error opening registration form: ' + error.message);
        }
    }

    showRegistrationForm(event, formConfig) {
        // Remove existing modal if any
        const existingModal = document.getElementById('registration-modal');
        if (existingModal) {
            existingModal.remove();
        }

        // Create modal HTML
        const modal = document.createElement('div');
        modal.id = 'registration-modal';
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content registration-content">
                <div class="modal-header">
                    <h2>Register for ${event.title}</h2>
                    <span class="close" onclick="closeRegistrationForm()">&times;</span>
                </div>
                <div class="modal-body">
                    <form id="registration-form">
                        <div class="form-group">
                            <label for="reg-fullname">Full Name: *</label>
                            <input type="text" id="reg-fullname" name="fullname" 
                                   value="${window.currentUser?.fullName || window.currentUser?.username || ''}" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="reg-email">Email: *</label>
                            <input type="email" id="reg-email" name="email" 
                                   value="${window.currentUser?.email || ''}" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="reg-branch">Branch/Department: *</label>
                            <input type="text" id="reg-branch" name="branch" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="reg-phone">Phone:</label>
                            <input type="tel" id="reg-phone" name="phone">
                        </div>

                        ${formConfig.isTeamEvent ? this.generateTeamSection(formConfig.maxTeamSize) : ''}
                        ${this.generateCustomFieldsHTML(formConfig.customFields || [])}
                        
                        <div class="form-actions">
                            <button type="button" class="btn btn-secondary" onclick="closeRegistrationForm()">Cancel</button>
                            <button type="submit" class="btn btn-primary">Submit Registration</button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        document.body.classList.add('modal-open');

        // Setup form submission
        this.setupRegistrationForm(formConfig);
    }

    generateTeamSection(maxTeamSize) {
        return `
            <div class="team-section">
                <h3>Team Information</h3>
                <div class="form-group">
                    <label for="team-name">Team Name: *</label>
                    <input type="text" id="team-name" name="teamName" required>
                </div>
                <div class="form-group">
                    <label for="team-size">Number of Team Members (Max ${maxTeamSize}): *</label>
                    <input type="number" id="team-size" name="teamSize" min="1" max="${maxTeamSize}" value="1" required>
                </div>
                <div id="team-members-container">
                    <div class="team-member">
                        <h4>Team Member 1 (Leader - You)</h4>
                        <div class="form-row">
                            <div class="form-group">
                                <label>Name:</label>
                                <input type="text" name="member1_name" value="${window.currentUser?.fullName || ''}" readonly>
                            </div>
                            <div class="form-group">
                                <label>Email:</label>
                                <input type="email" name="member1_email" value="${window.currentUser?.email || ''}" readonly>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    generateCustomFieldsHTML(customFields) {
        if (!customFields || customFields.length === 0) return '';

        let html = '<div class="custom-fields-section"><h3>Additional Information</h3>';
        
        customFields.forEach((field, index) => {
            const fieldName = `custom_${index}`;
            html += `
                <div class="form-group">
                    <label for="${fieldName}">${field.label}${field.required ? ' *' : ''}:</label>
                    ${this.generateFieldInput(field, fieldName)}
                </div>
            `;
        });

        html += '</div>';
        return html;
    }

    generateFieldInput(field, fieldName) {
        const required = field.required ? 'required' : '';
        
        switch (field.type) {
            case 'textarea':
                return `<textarea id="${fieldName}" name="${fieldName}" ${required}></textarea>`;
            case 'select':
                return `
                    <select id="${fieldName}" name="${fieldName}" ${required}>
                        <option value="">Select an option</option>
                        <option value="Option 1">Option 1</option>
                        <option value="Option 2">Option 2</option>
                        <option value="Option 3">Option 3</option>
                    </select>
                `;
            case 'email':
                return `<input type="email" id="${fieldName}" name="${fieldName}" ${required}>`;
            case 'number':
                return `<input type="number" id="${fieldName}" name="${fieldName}" ${required}>`;
            case 'tel':
                return `<input type="tel" id="${fieldName}" name="${fieldName}" ${required}>`;
            default:
                return `<input type="text" id="${fieldName}" name="${fieldName}" ${required}>`;
        }
    }

    setupRegistrationForm(formConfig) {
        const form = document.getElementById('registration-form');
        if (!form) return;

        // Team size change handler
        if (formConfig.isTeamEvent) {
            const teamSizeInput = document.getElementById('team-size');
            if (teamSizeInput) {
                teamSizeInput.addEventListener('change', (e) => {
                    this.updateTeamMembersInputs(parseInt(e.target.value), formConfig.maxTeamSize);
                });
            }
        }

        // Form submission
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.submitRegistration(formConfig);
        });
    }

    updateTeamMembersInputs(teamSize, maxTeamSize) {
        const container = document.getElementById('team-members-container');
        if (!container) return;

        // Keep the leader (first member)
        const existingMembers = container.children.length;
        
        if (teamSize > existingMembers) {
            // Add more members
            for (let i = existingMembers; i < teamSize; i++) {
                const memberNum = i + 1;
                const memberHtml = `
                    <div class="team-member">
                        <h4>Team Member ${memberNum}</h4>
                        <div class="form-row">
                            <div class="form-group">
                                <label>Name: *</label>
                                <input type="text" name="member${memberNum}_name" required>
                            </div>
                            <div class="form-group">
                                <label>Email: *</label>
                                <input type="email" name="member${memberNum}_email" required>
                            </div>
                        </div>
                    </div>
                `;
                container.insertAdjacentHTML('beforeend', memberHtml);
            }
        } else if (teamSize < existingMembers) {
            // Remove excess members (but keep leader)
            while (container.children.length > teamSize) {
                container.removeChild(container.lastChild);
            }
        }
    }

    async submitRegistration(formConfig) {
        try {
            const formData = new FormData(document.getElementById('registration-form'));
            const registrationData = {};
            
            // Convert FormData to object
            for (let [key, value] of formData.entries()) {
                registrationData[key] = value;
            }

            // Add metadata
            const registration = {
                eventId: this.currentEventId,
                userId: window.currentUser?.id,
                userEmail: window.currentUser?.email,
                registrationData,
                submittedAt: new Date().toISOString(),
                status: 'registered'
            };

            // Save registration
            if (window.isFirebaseEnabled) {
                await db.collection('eventRegistrations').add(registration);
            } else {
                // Store in localStorage for demo
                const existingRegistrations = JSON.parse(localStorage.getItem('eventRegistrations') || '[]');
                registration.id = Date.now().toString();
                existingRegistrations.push(registration);
                localStorage.setItem('eventRegistrations', JSON.stringify(existingRegistrations));
            }

            console.log('✅ Registration submitted:', registration);
            this.showSuccessMessage(registrationData);
            this.closeRegistrationForm();

            // Refresh events display to update registration status
            setTimeout(async () => {
                await this.refreshEventsDisplay();
            }, 100);

        } catch (error) {
            console.error('💥 Error submitting registration:', error);
            alert('Error submitting registration: ' + error.message);
        }
    }

    showSuccessMessage(formData) {
        const message = `Registration submitted successfully!

Your registration details:
• Name: ${formData.fullname}
• Email: ${formData.email}
• Branch: ${formData.branch}
${formData.teamName ? `• Team: ${formData.teamName}` : ''}

You will receive a confirmation email shortly.`;

        alert(message);
    }

    async saveFormConfiguration() {
        try {
            console.log('💾 Saving form configuration...');
            
            const isTeamEvent = document.getElementById('team-event-toggle')?.checked || false;
            const maxTeamSize = parseInt(document.getElementById('team-size-input')?.value) || 3;
            const registrationEnabled = document.getElementById('enable-registration')?.checked === true;
            const customFields = this.collectCustomFields();

            console.log('🔧 Form configuration details:');
            console.log('   - Team Event:', isTeamEvent);
            console.log('   - Max Team Size:', maxTeamSize);
            console.log('   - Registration Enabled:', registrationEnabled);
            console.log('   - Custom Fields:', customFields.length);

            const formConfig = {
                eventId: this.currentEventId,
                isTeamEvent,
                maxTeamSize,
                registrationEnabled,
                customFields,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                createdBy: window.currentUser?.id || 'admin'
            };

            if (window.isFirebaseEnabled) {
                await db.collection('eventForms').doc(this.currentEventId).set(formConfig);
                console.log('✅ Form saved to Firebase:', this.currentEventId);
            } else {
                // Store in localStorage for demo
                localStorage.setItem(`eventForm_${this.currentEventId}`, JSON.stringify(formConfig));
                console.log('✅ Form saved to localStorage:', this.currentEventId);
            }

            console.log('✅ Form configuration saved:', formConfig);
            this.closeFormBuilder();

            // Show success message
            this.showSuccessNotification('Form configuration saved successfully!');

            // Immediate refresh to update button states
            await this.refreshEventsDisplay();
            
            // Also do a delayed refresh as backup
            setTimeout(async () => {
                console.log('🔄 Backup refresh after form save');
                await this.refreshEventsDisplay();
            }, 100);

        } catch (error) {
            console.error('💥 Error saving form configuration:', error);
            alert('Error saving form configuration: ' + error.message);
        }
    }

    showErrorModal(title, message) {
        // Remove existing error modal if any
        const existingModal = document.getElementById('error-modal');
        if (existingModal) {
            existingModal.remove();
        }

        const modal = document.createElement('div');
        modal.id = 'error-modal';
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content error-modal">
                <div class="modal-header">
                    <h3><i class="fas fa-exclamation-triangle"></i> ${title}</h3>
                    <button class="close-btn" onclick="this.closest('.modal-overlay').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <p>${message}</p>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-primary" onclick="this.closest('.modal-overlay').remove()">
                        OK
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Auto close after 5 seconds
        setTimeout(() => {
            if (modal.parentNode) {
                modal.remove();
            }
        }, 5000);
    }

    showSuccessNotification(message) {
        // Create a success notification
        const notification = document.createElement('div');
        notification.className = 'success-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-check-circle"></i>
                <span>${message}</span>
            </div>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--success-color);
            color: white;
            padding: 16px 24px;
            border-radius: 8px;
            box-shadow: var(--shadow-lg);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;

        document.body.appendChild(notification);

        // Show notification
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Hide notification after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    closeFormBuilder() {
        console.log('❌ Closing form builder');
        const modal = document.getElementById('form-builder-modal');
        if (modal) {
            modal.remove();
            document.body.classList.remove('modal-open');
        }
    }

    async refreshEventsDisplay() {
        console.log('🔄 Refreshing events display...');
        
        // Try different methods to refresh the events
        if (typeof displayEvents === 'function') {
            console.log('✅ Calling displayEvents function');
            await displayEvents();
        } else if (window.displayEvents && typeof window.displayEvents === 'function') {
            console.log('✅ Calling window.displayEvents function');
            await window.displayEvents();
        } else {
            console.log('⚠️ displayEvents function not found, trying manual refresh');
            // Manual refresh by re-calling the events component
            const eventsContainer = document.getElementById('events-list');
            if (eventsContainer) {
                // Clear and reload events
                eventsContainer.innerHTML = '';
                if (window.eventsData) {
                    console.log('✅ Manually refreshing events from eventsData');
                    for (const event of window.eventsData) {
                        const eventCard = await createEventElement(event);
                        eventsContainer.appendChild(eventCard);
                    }
                } else {
                    console.log('❌ No eventsData found for manual refresh');
                }
            } else {
                console.log('❌ Events container not found');
            }
        }
        
        console.log('✅ Events display refresh completed');
    }

    // Admin Form Builder Functions
    async createEventForm(eventId, formConfig) {
        try {
            console.log('📝 Creating event form for:', eventId);
            
            const formData = {
                eventId,
                formConfig,
                createdAt: new Date().toISOString(),
                createdBy: window.currentUser?.id || 'system',
                isActive: true,
                responses: []
            };

            await db.collection('eventForms').doc(eventId).set(formData);
            console.log('✅ Event form created successfully');
            return { success: true };

        } catch (error) {
            console.error('💥 Error creating event form:', error);
            return { success: false, error: error.message };
        }
    }

    async getEventForm(eventId) {
        try {
            const formDoc = await db.collection('eventForms').doc(eventId).get();
            if (formDoc.exists) {
                return { success: true, form: formDoc.data() };
            } else {
                return { success: false, error: 'Form not found' };
            }
        } catch (error) {
            console.error('💥 Error getting event form:', error);
            return { success: false, error: error.message };
        }
    }

    // Form Builder UI
    showFormBuilder(eventId, eventTitle) {
        const modal = document.getElementById('form-builder-modal');
        if (!modal) {
            this.createFormBuilderModal();
        }

        document.getElementById('form-builder-event-title').textContent = eventTitle;
        document.getElementById('form-builder-event-id').value = eventId;
        
        // Load existing form if available
        this.loadExistingForm(eventId);
        
        document.getElementById('form-builder-modal').style.display = 'block';
        document.body.classList.add('modal-open');
    }

    async loadExistingForm(eventId) {
        const result = await this.getEventForm(eventId);
        if (result.success) {
            this.populateFormBuilder(result.form.formConfig);
        } else {
            // Create default form structure
            this.createDefaultFormStructure();
        }
    }

    createDefaultFormStructure() {
        const container = document.getElementById('form-fields-container');
        container.innerHTML = `
            <div class="form-field-item" data-type="text">
                <div class="field-header">
                    <h4>Full Name</h4>
                    <div class="field-controls">
                        <label class="field-control">
                            <input type="checkbox" checked disabled> Required
                        </label>
                        <label class="field-control">
                            <input type="checkbox" checked disabled> Auto-fetch from profile
                        </label>
                    </div>
                </div>
                <input type="text" placeholder="Automatically filled from user profile" disabled>
            </div>
            
            <div class="form-field-item" data-type="text">
                <div class="field-header">
                    <h4>Branch/Department</h4>
                    <div class="field-controls">
                        <label class="field-control">
                            <input type="checkbox" checked> Required
                        </label>
                        <button class="btn-remove-field" onclick="eventFormsManager.removeFormField(this)">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <input type="text" placeholder="e.g., Computer Science, Mechanical Engineering">
            </div>
        `;
    }

    // Registration Form Functions
    async showRegistrationFormOLD(eventId, eventTitle) {
        const formConfig = await this.getFormConfiguration(eventId);
        if (!formConfig || !formConfig.registrationEnabled) {
            this.showErrorModal('Registration Not Available', 'Registration form not available for this event.');
            return;
        }

        // Create registration modal
        this.createRegistrationModal(eventId, eventTitle, formConfig);
        
        // Load saved progress if exists
        await this.loadSavedProgress(eventId);
        
        // Start auto-save
        this.startAutoSave(eventId);
    }

    createRegistrationModal(eventId, eventTitle, formConfig) {
        // Check if modal already exists
        let modal = document.getElementById('event-registration-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'event-registration-modal';
            modal.className = 'modal';
            document.body.appendChild(modal);
        }

        const isTeamEvent = formConfig.isTeamEvent || false;
        
        modal.innerHTML = `
            <div class="modal-content registration-modal">
                <div class="modal-header">
                    <h2><i class="fas fa-calendar-plus"></i> Register for ${eventTitle}</h2>
                    <div class="modal-actions">
                        <button class="btn btn-secondary" onclick="eventFormsManager.saveAndClose('${eventId}')">
                            <i class="fas fa-save"></i> Save Progress
                        </button>
                        <button class="close" onclick="eventFormsManager.closeRegistrationModal()">&times;</button>
                    </div>
                </div>
                
                <div class="modal-body">
                    <form id="event-registration-form" data-event-id="${eventId}">
                        <div id="registration-fields-container">
                            ${this.generateRegistrationFields(formConfig.customFields || [])}
                        </div>
                        
                        ${isTeamEvent ? this.generateTeamSection() : ''}
                        
                        <div class="form-actions">
                            <button type="button" class="btn btn-secondary" onclick="eventFormsManager.saveAndClose('${eventId}')">
                                <i class="fas fa-save"></i> Save & Continue Later
                            </button>
                            <button type="submit" class="btn btn-primary">
                                <i class="fas fa-paper-plane"></i> Submit Registration
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        // Show modal
        modal.style.display = 'block';
        document.body.classList.add('modal-open');

        // Bind form submission
        document.getElementById('event-registration-form').addEventListener('submit', (e) => {
            this.handleRegistrationSubmit(e, eventId);
        });
    }

    generateRegistrationFields(formConfig) {
        return formConfig.map(field => {
            switch (field.type) {
                case 'fullname':
                    return `
                        <div class="form-group">
                            <label for="fullname">Full Name *</label>
                            <input type="text" id="fullname" name="fullname" 
                                   value="${window.currentUser?.fullName || ''}" 
                                   readonly class="readonly-field">
                            <small class="field-note">Automatically filled from your profile</small>
                        </div>
                    `;
                
                case 'branch':
                    return `
                        <div class="form-group">
                            <label for="branch">Branch/Department *</label>
                            <input type="text" id="branch" name="branch" 
                                   placeholder="e.g., Computer Science, Mechanical Engineering" required>
                        </div>
                    `;
                
                case 'email':
                    return `
                        <div class="form-group">
                            <label for="email">Email Address *</label>
                            <input type="email" id="email" name="email" 
                                   value="${window.currentUser?.email || ''}" 
                                   readonly class="readonly-field">
                        </div>
                    `;
                
                case 'phone':
                    return `
                        <div class="form-group">
                            <label for="phone">Phone Number ${field.required ? '*' : ''}</label>
                            <input type="tel" id="phone" name="phone" 
                                   placeholder="Enter your phone number" ${field.required ? 'required' : ''}>
                        </div>
                    `;
                
                case 'text':
                    return `
                        <div class="form-group">
                            <label for="${field.id}">${field.label} ${field.required ? '*' : ''}</label>
                            <input type="text" id="${field.id}" name="${field.id}" 
                                   placeholder="${field.placeholder || ''}" ${field.required ? 'required' : ''}>
                        </div>
                    `;
                
                case 'textarea':
                    return `
                        <div class="form-group">
                            <label for="${field.id}">${field.label} ${field.required ? '*' : ''}</label>
                            <textarea id="${field.id}" name="${field.id}" rows="3"
                                      placeholder="${field.placeholder || ''}" ${field.required ? 'required' : ''}></textarea>
                        </div>
                    `;
                
                default:
                    return '';
            }
        }).join('');
    }

    generateTeamSection() {
        return `
            <div class="team-section">
                <div class="section-header">
                    <h3><i class="fas fa-users"></i> Team Information</h3>
                </div>
                
                <div class="form-group">
                    <label for="team-name">Team Name *</label>
                    <input type="text" id="team-name" name="teamName" 
                           placeholder="Enter your team name" required>
                </div>
                
                <div class="form-group">
                    <label for="team-size">Number of Team Members *</label>
                    <select id="team-size" name="teamSize" required onchange="eventFormsManager.updateTeamMemberFields(this.value)">
                        <option value="">Select team size</option>
                        <option value="2">2 Members</option>
                        <option value="3">3 Members</option>
                        <option value="4">4 Members</option>
                        <option value="5">5 Members</option>
                    </select>
                </div>
                
                <div id="team-members-container"></div>
            </div>
        `;
    }

    updateTeamMemberFields(teamSize) {
        const container = document.getElementById('team-members-container');
        if (!container || !teamSize) {
            if (container) container.innerHTML = '';
            return;
        }

        let membersHTML = '<div class="team-members-list"><h4>Team Member Details</h4>';
        
        for (let i = 1; i <= parseInt(teamSize); i++) {
            membersHTML += `
                <div class="team-member-item">
                    <h5>Member ${i} ${i === 1 ? '(Team Leader - You)' : ''}</h5>
                    <div class="member-fields">
                        <div class="form-group">
                            <label for="member-${i}-name">Full Name *</label>
                            <input type="text" id="member-${i}-name" name="members[${i}][name]" 
                                   ${i === 1 ? `value="${window.currentUser?.fullName || ''}" readonly class="readonly-field"` : 'required'}>
                        </div>
                        <div class="form-group">
                            <label for="member-${i}-email">Email *</label>
                            <input type="email" id="member-${i}-email" name="members[${i}][email]" 
                                   ${i === 1 ? `value="${window.currentUser?.email || ''}" readonly class="readonly-field"` : 'required'}>
                        </div>
                        <div class="form-group">
                            <label for="member-${i}-branch">Branch *</label>
                            <input type="text" id="member-${i}-branch" name="members[${i}][branch]" required>
                        </div>
                    </div>
                </div>
            `;
        }
        
        membersHTML += '</div>';
        container.innerHTML = membersHTML;
    }

    // Auto-save functionality
    startAutoSave(eventId) {
        this.stopAutoSave(); // Clear any existing interval
        
        this.autoSaveInterval = setInterval(() => {
            this.saveProgress(eventId, false); // Silent save
        }, 30000); // Auto-save every 30 seconds
    }

    stopAutoSave() {
        if (this.autoSaveInterval) {
            clearInterval(this.autoSaveInterval);
            this.autoSaveInterval = null;
        }
    }

    async saveProgress(eventId, showNotification = true) {
        const form = document.getElementById('event-registration-form');
        if (!form) return;

        const formData = new FormData(form);
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            if (key.includes('[') && key.includes(']')) {
                // Handle array fields (team members)
                const match = key.match(/(\w+)\[(\d+)\]\[(\w+)\]/);
                if (match) {
                    const [, arrayName, index, fieldName] = match;
                    if (!data[arrayName]) data[arrayName] = {};
                    if (!data[arrayName][index]) data[arrayName][index] = {};
                    data[arrayName][index][fieldName] = value;
                }
            } else {
                data[key] = value;
            }
        }

        try {
            await db.collection('eventRegistrationProgress').doc(`${window.currentUser.id}_${eventId}`).set({
                userId: window.currentUser.id,
                eventId,
                formData: data,
                lastSaved: new Date().toISOString()
            });

            if (showNotification) {
                this.showNotification('Progress saved successfully!', 'success');
            }
        } catch (error) {
            console.error('Error saving progress:', error);
            if (showNotification) {
                this.showNotification('Failed to save progress', 'error');
            }
        }
    }

    async loadSavedProgress(eventId) {
        try {
            const progressDoc = await db.collection('eventRegistrationProgress')
                .doc(`${window.currentUser.id}_${eventId}`).get();
            
            if (progressDoc.exists) {
                const savedData = progressDoc.data().formData;
                this.populateForm(savedData);
                this.showNotification('Previous progress loaded', 'info');
            }
        } catch (error) {
            console.error('Error loading saved progress:', error);
        }
    }

    populateForm(data) {
        Object.keys(data).forEach(key => {
            if (key === 'members') {
                // Handle team members
                const teamSize = Object.keys(data.members).length;
                const teamSizeSelect = document.getElementById('team-size');
                if (teamSizeSelect) {
                    teamSizeSelect.value = teamSize;
                    this.updateTeamMemberFields(teamSize);
                    
                    // Populate member data
                    setTimeout(() => {
                        Object.keys(data.members).forEach(index => {
                            Object.keys(data.members[index]).forEach(field => {
                                const input = document.getElementById(`member-${index}-${field}`);
                                if (input) input.value = data.members[index][field];
                            });
                        });
                    }, 100);
                }
            } else {
                const input = document.getElementById(key);
                if (input) input.value = data[key];
            }
        });
    }

    async handleRegistrationSubmit(e, eventId) {
        e.preventDefault();
        
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
        submitBtn.disabled = true;

        try {
            const formData = new FormData(e.target);
            const data = {
                userId: window.currentUser.id,
                eventId,
                submittedAt: new Date().toISOString(),
                formData: {}
            };

            // Process form data
            for (let [key, value] of formData.entries()) {
                if (key.includes('[') && key.includes(']')) {
                    const match = key.match(/(\w+)\[(\d+)\]\[(\w+)\]/);
                    if (match) {
                        const [, arrayName, index, fieldName] = match;
                        if (!data.formData[arrayName]) data.formData[arrayName] = {};
                        if (!data.formData[arrayName][index]) data.formData[arrayName][index] = {};
                        data.formData[arrayName][index][fieldName] = value;
                    }
                } else {
                    data.formData[key] = value;
                }
            }

            // Submit to Firebase
            await db.collection('eventRegistrations').add(data);
            
            // Clean up progress
            await db.collection('eventRegistrationProgress')
                .doc(`${window.currentUser.id}_${eventId}`).delete();

            this.showSuccessModal(eventId, data.formData);
            this.closeRegistrationModal();

        } catch (error) {
            console.error('Error submitting registration:', error);
            this.showNotification('Failed to submit registration. Please try again.', 'error');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    showSuccessModal(eventId, formData) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content success-modal">
                <div class="success-header">
                    <i class="fas fa-check-circle"></i>
                    <h2>Registration Successful!</h2>
                </div>
                <div class="success-body">
                    <p>Thank you for registering! Your details have been submitted successfully.</p>
                    <div class="registration-summary">
                        <h4>Registration Summary:</h4>
                        <div class="summary-item"><strong>Name:</strong> ${formData.fullname}</div>
                        <div class="summary-item"><strong>Branch:</strong> ${formData.branch}</div>
                        ${formData.teamName ? `<div class="summary-item"><strong>Team:</strong> ${formData.teamName}</div>` : ''}
                    </div>
                </div>
                <div class="success-actions">
                    <button class="btn btn-primary" onclick="this.closest('.modal').remove()">
                        <i class="fas fa-home"></i> Back to Community
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        modal.style.display = 'block';
    }

    // Utility functions
    saveAndClose(eventId) {
        this.saveProgress(eventId, true);
        setTimeout(() => this.closeRegistrationModal(), 1000);
    }

    closeRegistrationModal() {
        this.stopAutoSave();
        const modal = document.getElementById('event-registration-modal');
        if (modal) {
            modal.style.display = 'none';
            document.body.classList.remove('modal-open');
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'exclamation-triangle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        document.body.appendChild(notification);

        setTimeout(() => notification.classList.add('show'), 100);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    closeFormBuilder() {
        console.log('❌ Closing form builder');
        const modal = document.getElementById('form-builder-modal');
        if (modal) {
            modal.remove();
            document.body.classList.remove('modal-open');
        }
    }

    closeRegistrationForm() {
        console.log('❌ Closing registration form');
        const modal = document.getElementById('registration-modal');
        if (modal) {
            modal.remove();
            document.body.classList.remove('modal-open');
        }
    }

    closeResponsesModal() {
        console.log('❌ Closing responses modal');
        const modal = document.getElementById('responses-modal');
        if (modal) {
            modal.remove();
            document.body.classList.remove('modal-open');
        }
    }

    async exportRegistrations(eventId) {
        try {
            const registrations = await this.getEventRegistrations(eventId);
            if (registrations.length === 0) {
                alert('No registrations to export.');
                return;
            }

            // Create CSV content
            const headers = ['Name', 'Email', 'Branch', 'Phone', 'Team Name', 'Registration Date'];
            const csvContent = [
                headers.join(','),
                ...registrations.map(reg => {
                    const data = reg.registrationData;
                    return [
                        data.fullname || '',
                        data.email || '',
                        data.branch || '',
                        data.phone || '',
                        data.teamName || '',
                        new Date(reg.submittedAt).toLocaleDateString()
                    ].map(field => `"${field}"`).join(',');
                })
            ].join('\n');

            // Download CSV
            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `event-${eventId}-registrations.csv`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);

            console.log('✅ Registrations exported successfully');
        } catch (error) {
            console.error('💥 Error exporting registrations:', error);
            alert('Error exporting registrations: ' + error.message);
        }
    }
}

// Initialize the event forms manager
const eventFormsManager = new EventFormsManager();
window.eventFormsManager = eventFormsManager;

// Global functions for modal interactions
function exportRegistrations(eventId) {
    window.eventFormsManager.exportRegistrations(eventId);
}

function refreshRegistrations(eventId) {
    window.eventFormsManager.viewResponses(eventId);
}

function closeFormBuilder() {
    window.eventFormsManager.closeFormBuilder();
}

function closeRegistrationForm() {
    window.eventFormsManager.closeRegistrationForm();
}

function closeResponsesModal() {
    window.eventFormsManager.closeResponsesModal();
}

function saveFormConfiguration() {
    window.eventFormsManager.saveFormConfiguration();
}

function showFormTab(tabName) {
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active class from all tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab
    const targetTab = document.getElementById(tabName === 'basic' ? 'basic-settings' : 
                                           tabName === 'fields' ? 'custom-fields' : 'preview-tab');
    if (targetTab) {
        targetTab.classList.add('active');
    }
    
    // Add active class to clicked button
    event.target.classList.add('active');
    
    // Update preview if preview tab is selected
    if (tabName === 'preview') {
        window.eventFormsManager.updatePreview();
    }
}

function exportRegistrations(eventId) {
    console.log('📊 Exporting registrations for event:', eventId);
    alert('Export functionality will download a CSV file with all registration data.');
}

function refreshRegistrations(eventId) {
    console.log('🔄 Refreshing registrations for event:', eventId);
    window.eventFormsManager.viewResponses(eventId);
}

async function deleteRegistration(registrationId) {
    if (!confirm('Are you sure you want to delete this registration?')) {
        return;
    }

    try {
        console.log('🗑️ Deleting registration:', registrationId);
        
        if (window.isFirebaseEnabled && window.db) {
            // Delete from Firebase
            await db.collection('eventRegistrations').doc(registrationId).delete();
            console.log('✅ Registration deleted from Firebase');
            
            // Show success message
            alert('Registration deleted successfully.');
            
            // Find the current event ID from the modal to refresh responses
            const modal = document.getElementById('responses-modal');
            if (modal) {
                const eventId = modal.getAttribute('data-event-id');
                if (eventId) {
                    // Refresh the responses view
                    setTimeout(() => {
                        window.eventFormsManager.viewResponses(eventId);
                    }, 100);
                } else {
                    // Close modal if we can't refresh
                    modal.remove();
                }
            }
        } else {
            // Delete from localStorage (demo mode)
            const registrations = JSON.parse(localStorage.getItem('eventRegistrations') || '[]');
            const updatedRegistrations = registrations.filter(reg => reg.id !== registrationId);
            localStorage.setItem('eventRegistrations', JSON.stringify(updatedRegistrations));
            
            console.log('✅ Registration deleted from localStorage');
            alert('Registration deleted successfully.');
            
            // Find the current event ID from the modal to refresh responses
            const modal = document.getElementById('responses-modal');
            if (modal) {
                const eventId = modal.getAttribute('data-event-id');
                if (eventId) {
                    // Refresh the responses view
                    setTimeout(() => {
                        window.eventFormsManager.viewResponses(eventId);
                    }, 100);
                } else {
                    modal.remove();
                }
            }
        }
    } catch (error) {
        console.error('❌ Error deleting registration:', error);
        alert('Error deleting registration. Please try again.');
    }
}
