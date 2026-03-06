/**
 * S:MIRROR Ultimate JavaScript Logic
 * Features: Multi-language, Profile Lock, 3-Day Edit Limit, Monthly Stats calculation
 */

const i18n = {
    bn: {
        welcome: "আসসালামু আলাইকুম! আমি আপনার S:MIRROR মেন্টর।",
        setupSuccess: "আপনার প্রোফাইল সফলভাবে তৈরি হয়েছে!",
        saveSuccess: "মাশাআল্লাহ! তথ্য সংরক্ষিত হয়েছে।",
        editError: "দুঃখিত! আপনি শুধুমাত্র গত ৩ দিনের তথ্য পরিবর্তন করতে পারবেন।",
        notSelected: "দয়া করে তারিখ নির্বাচন করুন!",
        mentorDefault: "আজ আপনার লক্ষ্য কী? প্রতিটি মুহূর্তকে কাজে লাগান।"
    },
    en: {
        welcome: "Assalamu Alaikum! I am your S:MIRROR Mentor.",
        setupSuccess: "Profile created successfully!",
        saveSuccess: "Mashallah! Data saved successfully.",
        editError: "Sorry! You can only edit data for the last 3 days.",
        notSelected: "Please select a date!",
        mentorDefault: "What is your goal today? Make every second count."
    }
};

let currentProfile = null;
let currentLang = 'bn';

// ১. পেজ লোড হওয়ার সময় প্রোফাইল এবং ডাটা চেক
document.addEventListener('DOMContentLoaded', () => {
    const savedProfile = localStorage.getItem('smirror_profile');
    if (savedProfile) {
        currentProfile = JSON.parse(savedProfile);
        currentLang = currentProfile.lang;
        showDashboard();
    }
    
    // আজকের তারিখ ডিফল্ট হিসেবে সেট করা
    const dateInput = document.getElementById('date-picker');
    if(dateInput) {
        dateInput.valueAsDate = new Date();
    }
});

// ২. প্রোফাইল সেটআপ ফাংশন
function startApp() {
    const name = document.getElementById('user-name').value.trim();
    const lang = document.getElementById('lang-select').value;
    const gender = document.getElementById('user-gender').value;

    if (!name) {
        alert(lang === 'bn' ? "আপনার নাম লিখুন!" : "Please enter your name!");
        return;
    }

    currentProfile = { name, lang, gender };
    localStorage.setItem('smirror_profile', JSON.stringify(currentProfile));
    currentLang = lang;

    alert(i18n[currentLang].setupSuccess);
    showDashboard();
}

// ৩. ড্যাশবোর্ড ইন্টারফেস দেখানো
function showDashboard() {
    document.getElementById('setup-screen').classList.add('hidden');
    document.getElementById('main-dashboard').classList.remove('hidden');
    
    const welcomeMsg = i18n[currentLang].welcome;
    document.getElementById('mentor-text').innerText = `${welcomeMsg} ${currentProfile.name}. ${i18n[currentLang].mentorDefault}`;
    
    calculateMonthlyStats();
}

// ৪. ট্যাব পরিবর্তন লজিক
function switchTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.add('hidden'));
    document.getElementById(`tab-${tabName}`).classList.remove('hidden');
    
    document.querySelectorAll('.nav-tabs button').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`tab-btn-${tabName}`).classList.add('active');
    
    if(tabName === 'monthly') calculateMonthlyStats();
}

// ৫. ৩ দিনের এডিট লিমিট চেক
function checkDateLimit() {
    const selectedDate = new Date(document.getElementById('date-picker').value);
    const today = new Date();
    today.setHours(0,0,0,0);
    
    const diffTime = today - selectedDate;
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    const saveBtn = document.getElementById('save-btn');
    if (diffDays > 3 || diffDays < 0) {
        saveBtn.disabled = true;
        updateMentor(i18n[currentLang].editError);
    } else {
        saveBtn.disabled = false;
        updateMentor(i18n[currentLang].mentorDefault);
    }
    loadDailyData(document.getElementById('date-picker').value);
}

// ৬. দৈনিক ডাটা সেভ করা
function saveDailyData() {
    const date = document.getElementById('date-picker').value;
    if (!date) {
        alert(i18n[currentLang].notSelected);
        return;
    }

    const dailyEntry = {
        salah: document.getElementById('daily-salah').value,
        quran: document.getElementById('daily-quran').value,
        dua: document.getElementById('daily-dua').value,
        study: document.getElementById('daily-study').value,
        books: document.getElementById('daily-books').value,
        news: document.getElementById('daily-news').value,
        parents: document.getElementById('daily-parents').value,
        character: document.getElementById('daily-character').value,
        notes: document.getElementById('daily-notes').value
    };

    localStorage.setItem(`sm_${date}`, JSON.stringify(dailyEntry));
    alert(i18n[currentLang].saveSuccess);
    calculateMonthlyStats();
}

// ৭. পূর্বের ডাটা লোড করা
function loadDailyData(date) {
    const data = localStorage.getItem(`sm_${date}`);
    if (data) {
        const entry = JSON.parse(data);
        document.getElementById('daily-salah').value = entry.salah;
        document.getElementById('daily-quran').value = entry.quran;
        document.getElementById('daily-dua').value = entry.dua;
        document.getElementById('daily-study').value = entry.study;
        document.getElementById('daily-books').value = entry.books;
        document.getElementById('daily-news').value = entry.news;
        document.getElementById('daily-parents').value = entry.parents;
        document.getElementById('daily-character').value = entry.character;
        document.getElementById('daily-notes').value = entry.notes;
    } else {
        // ফর্ম রিসেট করা
        document.querySelectorAll('#tab-daily input, #tab-daily select, #tab-daily textarea').forEach(el => {
            if(el.id !== 'date-picker') el.value = el.tagName === 'SELECT' ? "0" : "";
        });
    }
}

// ৮. বাৎসরিক লক্ষ্য সেভ
function saveYearlyGoals() {
    const yearly = {
        target: document.getElementById('year-target').value,
        quranGoal: document.getElementById('year-quran-goal').value
    };
    localStorage.setItem('smirror_yearly', JSON.stringify(yearly));
    alert(currentLang === 'bn' ? "মিশন সংরক্ষিত হয়েছে!" : "Mission Saved!");
}

// ৯. মাসিক প্রোগ্রেস ক্যালকুলেশন
function calculateMonthlyStats() {
    let totalSalah = 0;
    let totalStudy = 0;
    let count = 0;

    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('sm_')) {
            const entry = JSON.parse(localStorage.getItem(key));
            totalSalah += parseInt(entry.salah || 0);
            totalStudy += parseInt(entry.study || 0);
            count++;
        }
    }

    if(count > 0) {
        document.getElementById('stat-salah').innerText = (totalSalah / count).toFixed(1);
        document.getElementById('stat-study').innerText = totalStudy;
    }
}

function updateMentor(msg) {
    document.getElementById('mentor-text').innerText = msg;
}
