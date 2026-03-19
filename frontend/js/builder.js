document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('jwt_token');
    if (!token) {
        window.location.href = 'index.html';
        return;
    }

    let questionCounter = 0;
    
    // UI Elements
    const sectionsContainer = document.getElementById('sections-container');
    const addSectionBtn = document.getElementById('add-section-btn');
    const saveBtn = document.getElementById('save-exam-btn');
    const printBtn = document.getElementById('print-btn');
    const statusMsg = document.getElementById('save-status');

    // Templates
    const tplSection = document.getElementById('tpl-section');
    const tplQuestion = document.getElementById('tpl-question');
    const tplOption = document.getElementById('tpl-option');

    // Helper to update question numbers conceptually 
    function updateQuestionNumbers() {
        // This makes sure dynamically added questions show numbers on print
        let qNum = 1;
        document.querySelectorAll('.question-block').forEach((qBlock) => {
            const numSpan = qBlock.querySelector('.q-number');
            if(numSpan) numSpan.textContent = qNum + '.';
            qNum++;
            
            // Also update option labels A, B, C, D
            let optNum = 0;
            const letters = ['A.', 'B.', 'C.', 'D.', 'E.', 'F.'];
            qBlock.querySelectorAll('.option-block').forEach((optBlock) => {
                const lblSpan = optBlock.querySelector('.opt-label');
                if(lblSpan && optNum < letters.length) {
                    lblSpan.textContent = letters[optNum];
                }
                optNum++;
            });
        });
    }

    // Dynamic Builders
    function addSection() {
        const clone = tplSection.content.cloneNode(true);
        const secBlock = clone.querySelector('.dynamic-section');
        
        secBlock.querySelector('.remove-sec-btn').addEventListener('click', () => {
            secBlock.remove();
            updateQuestionNumbers();
        });
        
        secBlock.querySelector('.add-question-btn').addEventListener('click', () => {
            addQuestion(secBlock.querySelector('.questions-container'));
        });

        // Auto add first question
        addQuestion(secBlock.querySelector('.questions-container'));
        
        sectionsContainer.appendChild(clone);
        updateQuestionNumbers();
    }

    function addQuestion(container) {
        questionCounter++;
        const clone = tplQuestion.content.cloneNode(true);
        const qBlock = clone.querySelector('.question-block');
        
        qBlock.querySelector('.remove-q-btn').addEventListener('click', () => {
            qBlock.remove();
            updateQuestionNumbers();
        });
        
        const qContainerId = 'q-' + questionCounter;
        
        qBlock.querySelector('.add-option-btn').addEventListener('click', () => {
            addOption(qBlock.querySelector('.options-container'), qContainerId);
            updateQuestionNumbers();
        });

        // Add 4 default options
        const optsContainer = qBlock.querySelector('.options-container');
        for(let i=0; i<4; i++) {
            addOption(optsContainer, qContainerId);
        }
        
        container.appendChild(clone);
        updateQuestionNumbers();
    }

    function addOption(container, qName) {
        const clone = tplOption.content.cloneNode(true);
        const optBlock = clone.querySelector('.option-block');
        
        const radio = optBlock.querySelector('.opt-correct');
        radio.name = qName; // Bind radios to the same question group
        
        optBlock.querySelector('.remove-opt-btn').addEventListener('click', () => {
            optBlock.remove();
            updateQuestionNumbers();
        });

        container.appendChild(clone);
    }

    // Init with 1 Section
    addSection();
    
    addSectionBtn.addEventListener('click', addSection);

    // Save Logic
    function showStatus(msg, isError=false) {
        statusMsg.textContent = msg;
        statusMsg.className = isError ? 'error-message' : 'success-message';
        statusMsg.style.display = 'block';
        setTimeout(() => statusMsg.style.display = 'none', 4000);
    }

    saveBtn.addEventListener('click', async () => {
        saveBtn.textContent = 'Saving...';
        saveBtn.disabled = true;

        try {
            // 1. Save Exam
            const examMetaFields = ['school_name', 'subject_name', 'course_code', 'department_name', 
                                    'class_or_level', 'location', 'session', 'semester', 'time_allocated', 'date'];
            
            const examData = {};
            let hasData = false;
            examMetaFields.forEach(f => {
                const val = document.getElementById('meta-' + f).value;
                if(val) {
                    examData[f] = val;
                    hasData = true;
                }
            });

            if(!examData['school_name']) {
                showStatus('School Name is required to create an exam.', true);
                saveBtn.textContent = '💾 Save Exam';
                saveBtn.disabled = false;
                return;
            }

            // Fetch the user ID to associate the exam properly
            const userRes = await api.request('/dashboard');
            if (userRes.error || !userRes.data || !userRes.data.id) {
                throw new Error('Could not verify user identity. Please log in again.');
            }
            examData['user_id'] = userRes.data.id;

            const examRes = await api.request('/exams', 'POST', examData);
            if (examRes.error) {
                showStatus('Exam Error: ' + examRes.error, true);
                throw new Error(examRes.error);
            }
            const examId = examRes.data.id;

            // 2. Save Sections
            const sectBlocks = document.querySelectorAll('.dynamic-section');
            for (const sect of sectBlocks) {
                const sName = sect.querySelector('.section-name').value || 'Untitled Section';
                const sInstr = sect.querySelector('.section-instructions').value || '';
                
                const sRes = await api.request('/sections', 'POST', {
                    exam_id: examId,
                    name: sName,
                    instructions: sInstr
                });
                if(sRes.error) continue;
                const sectId = sRes.data.id;

                // 3. Save Questions
                const qBlocks = sect.querySelectorAll('.question-block');
                for (const q of qBlocks) {
                    const qTitle = q.querySelector('.q-title').value || 'Untitled Question';
                    
                    const qRes = await api.request('/questions', 'POST', {
                        section_id: sectId,
                        title: qTitle
                    });
                    if(qRes.error) continue;
                    const qId = qRes.data.id;

                    // 4. Save Options
                    const optBlocks = q.querySelectorAll('.option-block');
                    for (const o of optBlocks) {
                        const oText = o.querySelector('.opt-text').value || 'Option';
                        const isCorrect = o.querySelector('.opt-correct').checked;
                        
                        await api.request('/options', 'POST', {
                            question_id: qId,
                            text: oText,
                            is_correct: isCorrect
                        });
                    }
                }
            }

            // Provide visual feedback for print prep
            document.getElementById('print-school').textContent = examData.school_name || '';
            document.getElementById('print-dept').textContent = examData.department_name || '';
            document.getElementById('print-subject').textContent = examData.subject_name || '';

            showStatus('Exam Saved Successfully!');
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);

        } catch(err) {
            console.error(err);
        }

        saveBtn.textContent = '💾 Save Exam';
        saveBtn.disabled = false;
    });

    // Print Logic
    printBtn.addEventListener('click', () => {
        // Provide top data to custom print headers
        document.getElementById('print-school').textContent = document.getElementById('meta-school_name').value || '';
        document.getElementById('print-dept').textContent = document.getElementById('meta-department_name').value || '';
        document.getElementById('print-subject').textContent = document.getElementById('meta-subject_name').value || '';
        
        window.print();
    });

    // Load Exam Logic for Edit could go here if checking localStorage
    const editId = localStorage.getItem('current_edit_exam_id');
    if (editId) {
        // Implement complex fetch to populate builder if needed.
        // For a simple app, we clear it so next time it's fresh
        localStorage.removeItem('current_edit_exam_id');
    }
});
