// =====================================================
// common.js - shared helpers for all pages
// PROG2002 A2 - City Hope Foundation
// =====================================================

const API_BASE = 'http://localhost:3000/api';

// Format a date string (YYYY-MM-DD) as "Sat, 8 Nov 2026"
function formatDate(dateStr) {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-AU', {
        weekday: 'short', day: 'numeric', month: 'short', year: 'numeric'
    });
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

function categoryIcon(name) {
    return CATEGORY_ICONS[name] || '\u2764\uFE0F';
}

// Build the HTML for one event card (used by Home and Search pages)
function createEventCard(event) {
    const card = document.createElement('div');
    card.className = 'event-card';

    const pct = event.goal_amount > 0
        ? Math.min(100, Math.round(event.raised_amount / event.goal_amount * 100))
        : 0;

    card.innerHTML = `
        <div class="card-banner">${categoryIcon(event.category_name)}</div>
        <div class="card-body">
            <span class="badge">${event.category_name}</span>
            <h3>${event.event_name}</h3>
            <div class="meta">\uD83D\uDCC5 ${formatDate(event.event_date)}</div>
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
