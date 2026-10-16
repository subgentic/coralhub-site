/**
 * Coral Product Demos — Interactive Showcases
 * Strictly CSP-compliant (same-origin, deferred, no inline execution).
 */
(function() {
    'use strict';

    function initDemos() {
        // Progressive enhancement: reveal interactive controls if JavaScript is active
        var navs = document.querySelectorAll('.demos-nav[hidden], .demo-steps-bar[hidden]');
        navs.forEach(function(el) {
            el.removeAttribute('hidden');
        });

        initMasterTabs();
        initDemo1Board();
        initDemo2Connect();
        initDemo3Policy();
        initDemo4SelfHost();
    }

    // Helper to announce changes to screen readers
    function announceStatus(statusEl, text) {
        if (!statusEl) return;
        statusEl.textContent = '';
        // Small delay to ensure the screen reader registers the update
        setTimeout(function() {
            statusEl.textContent = text;
        }, 50);
    }

    // ── Master Tab Navigation ──────────────────────────────────────
    function initMasterTabs() {
        var tabBtns = document.querySelectorAll('.demo-tab-btn');
        var panels = document.querySelectorAll('.demo-panel');
        if (!tabBtns.length || !panels.length) return;

        tabBtns.forEach(function(btn) {
            btn.addEventListener('click', function() {
                var targetId = btn.getAttribute('data-demo-target');
                if (!targetId) return;

                tabBtns.forEach(function(b) {
                    b.classList.remove('active');
                    b.setAttribute('aria-selected', 'false');
                    b.setAttribute('tabindex', '-1');
                });
                panels.forEach(function(p) {
                    p.classList.remove('active');
                    p.classList.remove('is-animating');
                    p.setAttribute('hidden', '');
                });

                btn.classList.add('active');
                btn.setAttribute('aria-selected', 'true');
                btn.setAttribute('tabindex', '0');

                var activePanel = document.getElementById(targetId);
                if (activePanel) {
                    activePanel.classList.add('active');
                    activePanel.classList.add('is-animating');
                    activePanel.removeAttribute('hidden');
                }
            });

            btn.addEventListener('keydown', function(e) {
                var btnArr = Array.prototype.slice.call(tabBtns);
                var idx = btnArr.indexOf(btn);
                var targetBtn = null;

                if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                    e.preventDefault();
                    targetBtn = btnArr[(idx + 1) % btnArr.length];
                } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                    e.preventDefault();
                    targetBtn = btnArr[(idx - 1 + btnArr.length) % btnArr.length];
                } else if (e.key === 'Home') {
                    e.preventDefault();
                    targetBtn = btnArr[0];
                } else if (e.key === 'End') {
                    e.preventDefault();
                    targetBtn = btnArr[btnArr.length - 1];
                }

                if (targetBtn) {
                    targetBtn.focus();
                    targetBtn.click();
                }
            });
        });
    }

    // ── Demo 1: Multi-Agent Board ──────────────────────────────────
    function initDemo1Board() {
        var container = document.getElementById('demo-board');
        if (!container) return;

        var stepBtns = container.querySelectorAll('.demo-step-btn');
        var cards = container.querySelectorAll('.board-card');
        var statusAnnouncer = container.querySelector('.demo-sr-status');

        var stepAnnouncements = {
            1: 'Step 1 of 3: Task Delegated to Backend Dev',
            2: 'Step 2 of 3: Subagent Working in isolated git worktree',
            3: 'Step 3 of 3: Security Review Completed and Approved'
        };

        function setStep(stepNum) {
            stepBtns.forEach(function(btn) {
                var num = parseInt(btn.getAttribute('data-step'), 10);
                if (num === stepNum) {
                    btn.classList.add('active');
                    btn.setAttribute('aria-pressed', 'true');
                } else {
                    btn.classList.remove('active');
                    btn.setAttribute('aria-pressed', 'false');
                }
            });

            cards.forEach(function(card) {
                var cardStep = parseInt(card.getAttribute('data-step'), 10);
                if (cardStep <= stepNum) {
                    card.removeAttribute('hidden');
                } else {
                    card.setAttribute('hidden', '');
                }
            });

            if (stepAnnouncements[stepNum]) {
                announceStatus(statusAnnouncer, stepAnnouncements[stepNum]);
            }
        }

        stepBtns.forEach(function(btn) {
            btn.addEventListener('click', function() {
                var num = parseInt(btn.getAttribute('data-step'), 10);
                if (!isNaN(num)) setStep(num);
            });
        });

        // Initialize at full conversation view
        setStep(3);
    }

    // ── Demo 2: Connect via Device Code ───────────────────────────
    function initDemo2Connect() {
        var container = document.getElementById('demo-connect');
        if (!container) return;

        var stepBtns = container.querySelectorAll('.demo-step-btn');
        var appWaiting = container.querySelector('.app-state-waiting');
        var appConnected = container.querySelector('.app-state-connected');
        var browserWaiting = container.querySelector('.browser-state-waiting');
        var browserConnected = container.querySelector('.browser-state-connected');
        var pairBtn = container.querySelector('.browser-btn');
        var statusAnnouncer = container.querySelector('.demo-sr-status');

        var stepAnnouncements = {
            1: 'Step 1 of 3: Coral Settings opened, one-time pairing code displayed',
            2: 'Step 2 of 3: One-time pairing code entered in browser at app.coralhub.dev/enroll',
            3: 'Step 3 of 3: Machine authorized and linked to team workspace'
        };

        function setStep(stepNum) {
            stepBtns.forEach(function(btn) {
                var num = parseInt(btn.getAttribute('data-step'), 10);
                if (num === stepNum) {
                    btn.classList.add('active');
                    btn.setAttribute('aria-pressed', 'true');
                } else {
                    btn.classList.remove('active');
                    btn.setAttribute('aria-pressed', 'false');
                }
            });

            if (stepNum === 1 || stepNum === 2) {
                if (appWaiting) appWaiting.removeAttribute('hidden');
                if (appConnected) appConnected.setAttribute('hidden', '');
                if (browserWaiting) browserWaiting.removeAttribute('hidden');
                if (browserConnected) browserConnected.setAttribute('hidden', '');
            } else if (stepNum === 3) {
                if (appWaiting) appWaiting.setAttribute('hidden', '');
                if (appConnected) appConnected.removeAttribute('hidden');
                if (browserWaiting) browserWaiting.setAttribute('hidden', '');
                if (browserConnected) browserConnected.removeAttribute('hidden');
            }

            if (stepAnnouncements[stepNum]) {
                announceStatus(statusAnnouncer, stepAnnouncements[stepNum]);
            }
        }

        stepBtns.forEach(function(btn) {
            btn.addEventListener('click', function() {
                var num = parseInt(btn.getAttribute('data-step'), 10);
                if (!isNaN(num)) setStep(num);
            });
        });

        if (pairBtn) {
            pairBtn.addEventListener('click', function() {
                setStep(3);
            });
        }

        setStep(1);
    }

    // ── Demo 3: Auto-Accept with Safety Boundaries ─────────────────
    function initDemo3Policy() {
        var container = document.getElementById('demo-policy');
        if (!container) return;

        var toggleBtn = container.querySelector('.policy-toggle-btn');
        var statusText = container.querySelector('.policy-toggle-state');
        var autoBadges = container.querySelectorAll('.guard-status-badge.auto');
        var statusAnnouncer = container.querySelector('.demo-sr-status');

        if (!toggleBtn) return;

        function updateToggle(isOn) {
            toggleBtn.setAttribute('aria-checked', isOn ? 'true' : 'false');
            if (statusText) {
                statusText.textContent = isOn ? 'ON' : 'OFF';
            }
            if (isOn) {
                autoBadges.forEach(function(b) {
                    b.textContent = 'Auto-approved';
                    b.className = 'guard-status-badge auto';
                });
                announceStatus(statusAnnouncer, 'Auto-accept policy switch turned ON');
            } else {
                autoBadges.forEach(function(b) {
                    b.textContent = 'Left for you to approve';
                    b.className = 'guard-status-badge stop';
                });
                announceStatus(statusAnnouncer, 'Auto-accept policy switch turned OFF');
            }
        }

        toggleBtn.addEventListener('click', function() {
            var current = toggleBtn.getAttribute('aria-checked') === 'true';
            updateToggle(!current);
        });

        updateToggle(true);
    }

    // ── Demo 4: Run Your Own Hub ───────────────────────────────────
    function initDemo4SelfHost() {
        var container = document.getElementById('demo-selfhost');
        if (!container) return;

        var stepBtns = container.querySelectorAll('.demo-step-btn');
        var nodeRows = container.querySelectorAll('.node-row');
        var statusAnnouncer = container.querySelector('.demo-sr-status');

        var stepAnnouncements = {
            1: 'Step 1 of 3: Single command coral --hub started on loopback',
            2: 'Step 2 of 3: Local cluster machines connected',
            3: 'Step 3 of 3: Local dashboard view showing connected nodes'
        };

        function setStep(stepNum) {
            stepBtns.forEach(function(btn) {
                var num = parseInt(btn.getAttribute('data-step'), 10);
                if (num === stepNum) {
                    btn.classList.add('active');
                    btn.setAttribute('aria-pressed', 'true');
                } else {
                    btn.classList.remove('active');
                    btn.setAttribute('aria-pressed', 'false');
                }
            });

            nodeRows.forEach(function(row, idx) {
                if (stepNum === 1) {
                    if (idx === 0) row.removeAttribute('hidden');
                    else row.setAttribute('hidden', '');
                } else {
                    row.removeAttribute('hidden');
                }
            });

            if (stepAnnouncements[stepNum]) {
                announceStatus(statusAnnouncer, stepAnnouncements[stepNum]);
            }
        }

        stepBtns.forEach(function(btn) {
            btn.addEventListener('click', function() {
                var num = parseInt(btn.getAttribute('data-step'), 10);
                if (!isNaN(num)) setStep(num);
            });
        });

        setStep(2);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initDemos);
    } else {
        initDemos();
    }
})();
