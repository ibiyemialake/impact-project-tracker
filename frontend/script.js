class ImpactProjectTracker {
    constructor() {
        this.apiBaseUrl = 'http://127.0.0.1:8000';
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Form submission
        const form = document.getElementById('projectForm');
        form.addEventListener('submit', this.handleSubmitProject.bind(this));

        // Load projects button
        const loadBtn = document.getElementById('loadProjectsBtn');
        loadBtn.addEventListener('click', this.handleLoadProjects.bind(this));

        // Load projects on page load
        this.loadProjects();
    }

    async handleSubmitProject(event) {
        event.preventDefault();
        
        const submitBtn = document.getElementById('submitBtn');
        const originalText = submitBtn.textContent;
        
        try {
            // Disable button and show loading state
            submitBtn.disabled = true;
            submitBtn.textContent = 'Submitting...';

            // Get form data
            const formData = new FormData(event.target);
            const projectName = formData.get('projectName').trim();
            const status = formData.get('status');

            // Validate form data
            if (!projectName || !status) {
                throw new Error('Please fill in all required fields');
            }

            // Construct JSON-LD payload
            const jsonldPayload = this.constructJsonLD(projectName, status);

            // Submit to API
            const response = await fetch(`${this.apiBaseUrl}/projects`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(jsonldPayload)
            });

            const result = await response.json();

            if (response.ok) {
                this.showMessage('Project submitted successfully!', 'success');
                event.target.reset(); // Clear form
                this.loadProjects(); // Refresh project list
            } else {
                const errorMessage = result.errors ? result.errors.join(', ') : result.message;
                throw new Error(errorMessage);
            }

        } catch (error) {
            console.error('Error submitting project:', error);
            this.showMessage(`Error: ${error.message}`, 'error');
        } finally {
            // Restore button state
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    }

    async handleLoadProjects() {
        await this.loadProjects();
    }

    async loadProjects() {
        const loadingIndicator = document.getElementById('loadingIndicator');
        const projectsList = document.getElementById('projectsList');
        
        try {
            // Show loading state
            loadingIndicator.classList.remove('hidden');
            projectsList.innerHTML = '';

            const response = await fetch(`${this.apiBaseUrl}/projects`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const projects = await response.json();
            this.renderProjects(projects);

        } catch (error) {
            console.error('Error loading projects:', error);
            this.showMessage(`Error loading projects: ${error.message}`, 'error');
            projectsList.innerHTML = '<div class="empty-state">Failed to load projects</div>';
        } finally {
            loadingIndicator.classList.add('hidden');
        }
    }

    constructJsonLD(projectName, status) {
        return {
            "@context": {
                "ex": "http://example.org/impact/",
                "projectName": "ex:projectName",
                "status": "ex:status"
            },
            "@type": "ex:ImpactProject",
            "projectName": projectName,
            "status": status
        };
    }

    renderProjects(projects) {
        const projectsList = document.getElementById('projectsList');
        
        if (!projects || projects.length === 0) {
            projectsList.innerHTML = '<div class="empty-state">No projects found. Submit your first project above!</div>';
            return;
        }

        const projectsHTML = projects.map(project => this.createProjectHTML(project)).join('');
        projectsList.innerHTML = projectsHTML;
    }

    createProjectHTML(project) {
        const statusClass = `status-${project.status.toLowerCase()}`;
        
        return `
            <div class="project-item">
                <div class="project-name">${this.escapeHtml(project.projectName)}</div>
                <span class="project-status ${statusClass}">${this.escapeHtml(project.status)}</span>
            </div>
        `;
    }

    showMessage(message, type) {
        const messageArea = document.getElementById('messageArea');
        messageArea.textContent = message;
        messageArea.className = `message ${type}`;
        messageArea.classList.remove('hidden');

        // Auto-hide success messages after 3 seconds
        if (type === 'success') {
            setTimeout(() => {
                messageArea.classList.add('hidden');
            }, 3000);
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ImpactProjectTracker();
});