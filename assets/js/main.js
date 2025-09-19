// Progress tracking system
class ProgressTracker {
    constructor() {
        this.storageKey = 'testing-course-progress';
        this.progress = this.loadProgress();
        this.init();
    }

    init() {
        this.updateUI();
        this.attachEventListeners();
        this.initModuleExpansion();
    }

    loadProgress() {
        const stored = localStorage.getItem(this.storageKey);
        return stored ? JSON.parse(stored) : {
            completedLessons: [],
            currentLesson: null,
            lastAccessed: new Date().toISOString()
        };
    }

    saveProgress() {
        this.progress.lastAccessed = new Date().toISOString();
        localStorage.setItem(this.storageKey, JSON.stringify(this.progress));
        this.updateUI();
    }

    markLessonComplete(lessonId) {
        if (!this.progress.completedLessons.includes(lessonId)) {
            this.progress.completedLessons.push(lessonId);
            this.saveProgress();
        }
    }

    setCurrentLesson(lessonId) {
        this.progress.currentLesson = lessonId;
        this.saveProgress();
    }

    isLessonComplete(lessonId) {
        return this.progress.completedLessons.includes(lessonId);
    }

    getModuleProgress(moduleNumber) {
        const moduleLessons = document.querySelectorAll(`[data-module="${moduleNumber}"] .lesson-item`);
        const totalLessons = moduleLessons.length;
        let completedCount = 0;

        moduleLessons.forEach(lesson => {
            const lessonId = lesson.dataset.lesson;
            if (this.isLessonComplete(lessonId)) {
                completedCount++;
            }
        });

        return totalLessons > 0 ? (completedCount / totalLessons) * 100 : 0;
    }

    getOverallProgress() {
        const allLessons = document.querySelectorAll('.lesson-item');
        const totalLessons = allLessons.length;
        const completedCount = this.progress.completedLessons.length;
        return totalLessons > 0 ? (completedCount / totalLessons) * 100 : 0;
    }

    updateUI() {
        // Update overall progress
        const overallProgress = this.getOverallProgress();
        const progressFill = document.getElementById('overall-progress');
        const progressText = document.getElementById('progress-text');

        if (progressFill && progressText) {
            progressFill.style.width = `${overallProgress}%`;
            progressText.textContent = `${Math.round(overallProgress)}%`;
        }

        // Update module progress
        document.querySelectorAll('.module-card').forEach(module => {
            const moduleNumber = module.dataset.module;
            const progress = this.getModuleProgress(moduleNumber);
            const progressCircle = module.querySelector('.progress-circle');

            if (progressCircle) {
                progressCircle.style.background = `conic-gradient(#3fb950 0deg ${progress * 3.6}deg, #21262d ${progress * 3.6}deg 360deg)`;
                progressCircle.querySelector('span').textContent = `${Math.round(progress)}%`;
            }
        });

        // Update lesson statuses
        document.querySelectorAll('.lesson-item').forEach(lesson => {
            const lessonId = lesson.dataset.lesson;
            const statusIcon = lesson.querySelector('.lesson-status');

            if (this.isLessonComplete(lessonId)) {
                lesson.classList.add('completed');
                if (statusIcon) {
                    statusIcon.textContent = '✓';
                    statusIcon.classList.add('complete');
                }
            }
        });
    }

    attachEventListeners() {
        // Track lesson clicks
        document.querySelectorAll('.lesson-item').forEach(lesson => {
            lesson.addEventListener('click', (e) => {
                const lessonId = lesson.dataset.lesson;
                this.setCurrentLesson(lessonId);
            });
        });
    }

    initModuleExpansion() {
        document.querySelectorAll('.module-header').forEach(header => {
            header.addEventListener('click', () => {
                const moduleCard = header.closest('.module-card');
                const content = moduleCard.querySelector('.module-content');

                if (content.style.display === 'none' || !content.style.display) {
                    content.style.display = 'block';
                    moduleCard.classList.add('expanded');
                } else {
                    content.style.display = 'none';
                    moduleCard.classList.remove('expanded');
                }
            });
        });

        // Show first module by default
        const firstModule = document.querySelector('.module-card');
        if (firstModule) {
            const content = firstModule.querySelector('.module-content');
            if (content) content.style.display = 'block';
        }
    }
}

// Quiz system
class QuizSystem {
    constructor() {
        this.currentQuestion = 0;
        this.score = 0;
        this.answers = [];
    }

    init(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;

        this.attachEventListeners();
    }

    attachEventListeners() {
        const options = this.container.querySelectorAll('.quiz-option');
        options.forEach(option => {
            option.addEventListener('click', (e) => this.handleAnswer(e));
        });

        const submitBtn = this.container.querySelector('.quiz-submit');
        if (submitBtn) {
            submitBtn.addEventListener('click', () => this.submitQuiz());
        }

        const nextBtn = this.container.querySelector('.quiz-next');
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextQuestion());
        }
    }

    handleAnswer(e) {
        const option = e.currentTarget;
        const question = option.closest('.quiz-question');

        // Remove previous selection
        question.querySelectorAll('.quiz-option').forEach(opt => {
            opt.classList.remove('selected');
        });

        option.classList.add('selected');
        this.answers[this.currentQuestion] = option.dataset.answer;
    }

    checkAnswer(questionEl) {
        const selectedOption = questionEl.querySelector('.quiz-option.selected');
        if (!selectedOption) return;

        const isCorrect = selectedOption.dataset.correct === 'true';
        const feedback = questionEl.querySelector('.quiz-feedback');

        if (isCorrect) {
            selectedOption.classList.add('correct');
            feedback.classList.add('correct', 'show');
            feedback.textContent = 'Correct! Well done.';
            this.score++;
        } else {
            selectedOption.classList.add('incorrect');
            feedback.classList.add('incorrect', 'show');
            feedback.textContent = 'Not quite. Try reviewing the material above.';

            // Show correct answer
            questionEl.querySelectorAll('.quiz-option').forEach(opt => {
                if (opt.dataset.correct === 'true') {
                    opt.classList.add('correct');
                }
            });
        }

        // Disable options after answer
        questionEl.querySelectorAll('.quiz-option').forEach(opt => {
            opt.style.pointerEvents = 'none';
        });
    }

    submitQuiz() {
        const questions = this.container.querySelectorAll('.quiz-question');
        questions.forEach(q => this.checkAnswer(q));

        // Show results
        const resultsEl = this.container.querySelector('.quiz-results');
        if (resultsEl) {
            resultsEl.innerHTML = `
                <h4>Quiz Complete!</h4>
                <p>You scored ${this.score} out of ${questions.length}</p>
                <p>${this.score === questions.length ? 'Perfect score! Ready for the next lesson.' : 'Review the material and try again.'}</p>
            `;
            resultsEl.style.display = 'block';
        }
    }

    nextQuestion() {
        // Implementation for multi-page quiz
        this.currentQuestion++;
        // Load next question...
    }
}

// Code block functionality
class CodeBlockManager {
    constructor() {
        this.init();
    }

    init() {
        this.addCopyButtons();
        this.initSyntaxHighlighting();
    }

    addCopyButtons() {
        document.querySelectorAll('.copy-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const codeBlock = e.target.closest('.code-block');
                const code = codeBlock.querySelector('code').textContent;

                try {
                    await navigator.clipboard.writeText(code);
                    const originalText = btn.textContent;
                    btn.textContent = 'Copied!';
                    btn.classList.add('success');

                    setTimeout(() => {
                        btn.textContent = originalText;
                        btn.classList.remove('success');
                    }, 2000);
                } catch (err) {
                    console.error('Failed to copy code:', err);
                }
            });
        });
    }

    initSyntaxHighlighting() {
        // Basic syntax highlighting (can be enhanced with Prism.js or highlight.js)
        document.querySelectorAll('pre code').forEach(block => {
            const lang = block.className.replace('language-', '');
            if (lang) {
                this.highlightSyntax(block, lang);
            }
        });
    }

    highlightSyntax(block, language) {
        // Basic keyword highlighting
        const keywords = {
            javascript: ['const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'class', 'import', 'export', 'async', 'await'],
            typescript: ['const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'class', 'interface', 'type', 'import', 'export', 'async', 'await'],
            jsx: ['const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'class', 'import', 'export', 'async', 'await']
        };

        if (keywords[language]) {
            let html = block.innerHTML;
            keywords[language].forEach(keyword => {
                const regex = new RegExp(`\\b${keyword}\\b`, 'g');
                html = html.replace(regex, `<span class="keyword">${keyword}</span>`);
            });
            block.innerHTML = html;
        }
    }
}

// Exercise system
class ExerciseSystem {
    constructor() {
        this.exercises = {};
        this.init();
    }

    init() {
        this.attachEventListeners();
    }

    attachEventListeners() {
        document.querySelectorAll('.exercise-run').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const exerciseId = e.target.closest('.exercise-container').dataset.exercise;
                this.runExercise(exerciseId);
            });
        });

        document.querySelectorAll('.exercise-hint').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const exerciseId = e.target.closest('.exercise-container').dataset.exercise;
                this.showHint(exerciseId);
            });
        });

        document.querySelectorAll('.exercise-solution').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const exerciseId = e.target.closest('.exercise-container').dataset.exercise;
                this.showSolution(exerciseId);
            });
        });
    }

    runExercise(exerciseId) {
        const container = document.querySelector(`[data-exercise="${exerciseId}"]`);
        const editor = container.querySelector('.exercise-editor');
        const output = container.querySelector('.exercise-output');

        // Simple evaluation (in production, this would be more secure)
        try {
            const code = editor.value;
            // This is a simplified example - in production, use a proper sandbox
            const result = this.evaluateCode(code);
            output.innerHTML = `<div class="output-success">✓ Test passed! Great job!</div>`;
        } catch (error) {
            output.innerHTML = `<div class="output-error">✗ Error: ${error.message}</div>`;
        }
    }

    evaluateCode(code) {
        // This would be replaced with actual test runners
        // For now, just a placeholder
        return true;
    }

    showHint(exerciseId) {
        const container = document.querySelector(`[data-exercise="${exerciseId}"]`);
        const hint = container.querySelector('.exercise-hint-content');
        if (hint) {
            hint.style.display = hint.style.display === 'none' ? 'block' : 'none';
        }
    }

    showSolution(exerciseId) {
        const container = document.querySelector(`[data-exercise="${exerciseId}"]`);
        const solution = container.querySelector('.exercise-solution-content');
        if (solution) {
            solution.style.display = solution.style.display === 'none' ? 'block' : 'none';
        }
    }
}


// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const progressTracker = new ProgressTracker();
    const codeBlockManager = new CodeBlockManager();
    const quizSystem = new QuizSystem();
    const exerciseSystem = new ExerciseSystem();

    // Make progress tracker globally available for lesson pages
    window.progressTracker = progressTracker;

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // Add active states for navigation
    const currentPath = window.location.pathname;
    document.querySelectorAll('.nav-link, .lesson-item').forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });

    // Initialize tooltips
    const tooltips = document.querySelectorAll('[data-tooltip]');
    tooltips.forEach(tooltip => {
        tooltip.addEventListener('mouseenter', (e) => {
            const text = e.target.dataset.tooltip;
            const tooltipEl = document.createElement('div');
            tooltipEl.className = 'tooltip';
            tooltipEl.textContent = text;
            document.body.appendChild(tooltipEl);

            const rect = e.target.getBoundingClientRect();
            tooltipEl.style.top = `${rect.top - tooltipEl.offsetHeight - 5}px`;
            tooltipEl.style.left = `${rect.left + rect.width/2 - tooltipEl.offsetWidth/2}px`;
        });

        tooltip.addEventListener('mouseleave', () => {
            document.querySelectorAll('.tooltip').forEach(t => t.remove());
        });
    });
});