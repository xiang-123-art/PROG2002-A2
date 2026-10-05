// =====================================================
// common.js - shared helpers for all pages (v2)
// PROG2002 A2 - City Hope Foundation
// =====================================================

const API_BASE = 'http://localhost:3000/api';

// Format a date string (YYYY-MM-DD) as "Sat, 8 Nov 2026"
function formatDate(dateStr) {
    const raw = String(dateStr || '');
    const dateOnly = raw.match(/^\d{4}-\d{2}-\d{2}/);
    const d = dateOnly ? new Date(dateOnly[0] + 'T00:00:00') : new Date(raw);
    if (Number.isNaN(d.getTime())) return 'Date to be confirmed';
    return d.toLocaleDateString('en-AU', {
        weekday: 'short', day: 'numeric', month: 'short', year: 'numeric'
    });
}

// Format a MySQL TIME value (HH:MM:SS) as a readable 12-hour time.
function formatTime(timeStr) {
    if (!timeStr) return 'Time to be confirmed';
    const match = String(timeStr).match(/^(\d{1,2}):(\d{2})/);
    if (!match) return String(timeStr);
    const hours = Number(match[1]);
    const minutes = match[2];
    const period = hours >= 12 ? 'pm' : 'am';
    const displayHour = hours % 12 || 12;
    return `${displayHour}:${minutes} ${period}`;
}

function getScheduleStatus(event) {
    if (event.schedule_status === 'past' || event.schedule_status === 'upcoming') {
        return event.schedule_status;
    }
    const raw = String(event.event_date || '');
    const dateOnly = raw.match(/^\d{4}-\d{2}-\d{2}/);
    const eventDate = dateOnly ? new Date(dateOnly[0] + 'T23:59:59') : new Date(raw);
    if (Number.isNaN(eventDate.getTime())) return 'upcoming';
    return eventDate < new Date() ? 'past' : 'upcoming';
}

// Format money
function formatMoney(amount) {
    return '$' + Number(amount).toLocaleString('en-AU');
}

// Format ticket price ("Free" when 0)
function formatTicket(price) {
    return Number(price) === 0 ? 'Free' : formatMoney(price);
}

// Emoji icon per category (used as a lightweight card banner)
const CATEGORY_ICONS = {
    'Fun Run': '\uD83C\uDFC3',
    'Gala Dinner': '\uD83E\uDD58',
    'Silent Auction': '\uD83D\uDCB0',
    'Concert': '\uD83C\uDFB5',
    'Volunteer Day': '\uD83C\uDF31'
};

// CSS banner class per category (colour-coded gradients)
const CATEGORY_BANNERS = {
    'Fun Run': 'ban-run',
    'Gala Dinner': 'ban-gala',
    'Silent Auction': 'ban-auction',
    'Concert': 'ban-concert',
    'Volunteer Day': 'ban-volunteer'
};

function categoryIcon(name) {
    return CATEGORY_ICONS[name] || '\u2764\uFE0F';
}
function categoryBanner(name) {
    return CATEGORY_BANNERS[name] || 'ban-default';
}

// Build the HTML for one event card (used by Home and Search pages)
function createEventCard(event, index) {
    const card = document.createElement('div');
    card.className = 'event-card';
    // staggered entrance animation
    card.style.animationDelay = (index * 0.09) + 's';

    const pct = event.goal_amount > 0
        ? Math.min(100, Math.round(event.raised_amount / event.goal_amount * 100))
        : 0;
    const scheduleStatus = getScheduleStatus(event);
    const scheduleLabel = scheduleStatus === 'past' ? 'Past' : 'Upcoming';

    card.innerHTML = `
        <div class="card-banner ${categoryBanner(event.category_name)}">
            <span class="schedule-tag ${scheduleStatus}">${scheduleLabel}</span>
            <span class="cat-tag">${event.category_name}</span>
            <span class="banner-emoji">${categoryIcon(event.category_name)}</span>
        </div>
        <div class="card-body">
            <h3>${event.event_name}</h3>
            <div class="meta">\uD83D\uDCC5 ${formatDate(event.event_date)} at ${formatTime(event.event_time)}</div>
            <div class="meta">\uD83D\uDCCD ${event.location}</div>
            <div class="meta">\uD83C\uDFAB ${formatTicket(event.ticket_price)}</div>
            <div class="progress-wrap">
                <div class="progress-bar"><div class="fill" style="width:${pct}%"></div></div>
                <div class="progress-label">${formatMoney(event.raised_amount)} raised of ${formatMoney(event.goal_amount)} (${pct}%)</div>
            </div>
            <a class="btn-link" href="event.html?id=${event.event_id}">View Details \u2192</a>
        </div>`;
    return card;
}

// Animated number counter (e.g. for the stats strip on the Home page).
// format: optional function that turns the current number into display text,
// e.g. n => '$' + n.toLocaleString('en-AU')
function animateCounter(element, target, duration, format) {
    const fmt = format || (n => n.toLocaleString('en-AU'));
    const start = performance.now();
    function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        // ease-out cubic for a natural slowdown
        const eased = 1 - Math.pow(1 - progress, 3);
        element.textContent = fmt(Math.round(target * eased));
        if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
}

// Show / hide the back-to-top button (used on every page)
function initBackToTop() {
    const btn = document.createElement('button');
    btn.className = 'to-top';
    btn.innerHTML = '\u2191';
    btn.title = 'Back to top';
    btn.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
    document.body.appendChild(btn);
    window.addEventListener('scroll', () => {
        btn.classList.toggle('show', window.scrollY > 400);
    });
}
document.addEventListener('DOMContentLoaded', initBackToTop);
