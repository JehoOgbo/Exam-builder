document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('jwt_token');
    if (!token) {
        window.location.href = 'index.html';
        return;
    }

    const logoutBtn = document.getElementById('logout-btn');
    const loading = document.getElementById('loading');
    const errorMsg = document.getElementById('error-msg');
    const examsGrid = document.getElementById('exams-grid');
    const emptyState = document.getElementById('empty-state');
    
    // UI Helpers
    const showLoading = (show) => {
        if (show) loading.classList.remove('hidden');
        else loading.classList.add('hidden');
    };
    const showError = (msg) => {
        errorMsg.textContent = msg;
        errorMsg.classList.remove('hidden');
    };

    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('jwt_token');
        window.location.href = 'index.html';
    });

    try {
        showLoading(true);
        // Step 1: Get user details (user ID) from '/dashboard' endpoint
        const userRes = await api.request('/dashboard');
        if (userRes.error || !userRes.data || !userRes.data.id) {
            localStorage.removeItem('jwt_token');
            window.location.href = 'index.html';
            return;
        }
        const userId = userRes.data.id;

        // Step 2: Fetch user's exams
        const examsRes = await api.request(`/users/${userId}/exams`);
        showLoading(false);

        if (examsRes.error) {
            // We ignore 404s mostly or treat as empty
            if (examsRes.status !== 404) {
                showError('Failed to load exams: ' + examsRes.error);
                return;
            }
        }

        const exams = examsRes.data || [];
        
        if (!Array.isArray(exams) || exams.length === 0) {
            emptyState.classList.remove('hidden');
        } else {
            renderExams(exams);
        }

    } catch (err) {
        showLoading(false);
        showError('An unexpected error occurred.');
    }

    function renderExams(exams) {
        examsGrid.innerHTML = '';
        exams.forEach(exam => {
            const card = document.createElement('div');
            card.className = 'exam-card glass-panel fade-in';
            card.innerHTML = `
                <div class="exam-card-header">
                    <h3>${exam.subject_name || 'Untitled Exam'}</h3>
                    <span class="badge">${exam.time_allocated || 'N/A'}</span>
                </div>
                <div class="exam-details">
                    <p><strong>Course:</strong> ${exam.course_code || 'N/A'}</p>
                    <p><strong>Level:</strong> ${exam.class_or_level || 'N/A'}</p>
                    <p><strong>Date:</strong> ${exam.date || 'TBD'}</p>
                </div>
                <div class="exam-actions">
                    <button class="btn btn-secondary btn-sm" onclick="editExam('${exam.id}')">Edit</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteExam('${exam.id}', this)">Delete</button>
                </div>
            `;
            examsGrid.appendChild(card);
        });
    }

    // Global hooks
    window.editExam = (id) => {
        localStorage.setItem('current_edit_exam_id', id);
        window.location.href = 'builder.html';
    };

    window.deleteExam = async (id, btnElem) => {
        if (!confirm('Are you sure you want to delete this exam?')) return;
        
        const originalText = btnElem.textContent;
        btnElem.textContent = '...';
        btnElem.disabled = true;

        const res = await api.request(`/exams/${id}`, 'DELETE');
        if (res.error && res.status !== 200) {
            alert('Failed to delete: ' + res.error);
            btnElem.textContent = originalText;
            btnElem.disabled = false;
        } else {
            // Remove card from UI securely
            btnElem.closest('.exam-card').style.display = 'none';
        }
    };
});
