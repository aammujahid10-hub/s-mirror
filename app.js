// ১. ভাষা এবং মেন্টরের বার্তার ডিকশনারি
const i18n = {
    bn: {
        welcome: "আসসালামু আলাইকুম! আমি আপনার S:MIRROR মেন্টর।",
        shikkharthi: "শিক্ষার্থী",
        saveErr: "দুঃখিত! আপনি শুধুমাত্র গত ৩ দিনের তথ্য পরিবর্তন করতে পারবেন।",
        success: "মাশাআল্লাহ! আপনার তথ্য সংরক্ষিত হয়েছে।",
        fields: {
            salah: "সালাত (জামাআত/কাজা)",
            quran: "কুরআন মাজীদ (আয়াত)",
            study: "পাঠ্যপুস্তক অধ্যয়ন (ঘণ্টা)",
            books: "ইসলামী সাহিত্য (পৃষ্ঠা)",
            critique: "আত্ম-সমালোচনা ও নোট"
        }
    },
    en: {
        welcome: "Assalamu Alaikum! I am your S:MIRROR Mentor.",
        shikkharthi: "Student",
        saveErr: "Sorry! You can only edit data for the last 3 days.",
        success: "Mashallah! Your data has been saved.",
        fields: {
            salah: "Salah (Jamat/Kaza)",
            quran: "Al-Quran (Verses)",
            study: "Academic Study (Hours)",
            books: "Islamic Books (Pages)",
            critique: "Self-Critique & Notes"
        }
    }
};

let currentLang = 'bn';

// ২. পেজ লোড হওয়ার সময় প্রোফাইল চেক করা
document.addEventListener('DOMContentLoaded', () => {
    const profile = JSON.parse(localStorage.getItem('smirror_profile'));
    if (!profile) {
        document.getElementById('setup-screen').classList.remove('hidden');
    } else {
        currentLang = profile.lang;
        updateMentorMessage(i18n[currentLang].welcome);
        document.getElementById('main-dashboard').classList.remove('hidden');
    }
});

// ৩. ৩ দিনের এডিট লিমিট চেক করার লজিক
function checkDateConstraint(selectedDate) {
    const today = new Date();
    const chosen = new Date(selectedDate);
    const diffTime = Math.abs(today - chosen);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 3) {
        document.getElementById('save-daily').disabled = true;
        updateMentorMessage(i18n[currentLang].saveErr);
    } else {
        document.getElementById('save-daily').disabled = false;
        updateMentorMessage(i18n[currentLang].welcome);
    }
}

// ৪. মেন্টরের মেসেজ আপডেট করা
function updateMentorMessage(msg) {
    document.getElementById('mentor-text').innerText = msg;
}

// ৫. বার্ষিক লক্ষ্য সেভ করা
function saveYearlyGoals() {
    const goals = {
        quran: document.getElementById('year-quran').value,
        academic: document.getElementById('year-academic').value
    };
    localStorage.setItem('smirror_yearly', JSON.stringify(goals));
    alert(currentLang === 'bn' ? "লক্ষ্য সংরক্ষিত হয়েছে!" : "Goals Saved!");
}
// নতুন সব বক্সের ডাটা সেভ করার ফাংশন
function saveDailyData() {
    const date = document.getElementById('date-picker').value;
    if(!date) {
        alert("দয়া করে তারিখ নির্বাচন করুন।");
        return;
    }

    const dailyData = {
        salah: document.getElementById('daily-salah').value,
        quran: document.getElementById('daily-quran').value,
        study: document.getElementById('daily-study').value,
        books: document.getElementById('daily-books').value,
        notes: document.getElementById('daily-notes').value,
        character: document.getElementById('daily-character').value
    };

    localStorage.setItem(`smirror_${date}`, JSON.stringify(dailyData));
    updateMentorMessage("মাশাআল্লাহ! আপনার আজকের রিফ্লেকশন সংরক্ষিত হয়েছে।");
    alert("সফলভাবে সেভ হয়েছে!");
}

// ট্যাব পরিবর্তনের ফাংশন
function switchTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.add('hidden'));
    document.getElementById(`tab-${tabName}`).classList.remove('hidden');
    
    document.querySelectorAll('.nav-tabs button').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`tab-btn-${tabName}`).classList.add('active');
}

// অ্যাপ শুরু করার ফাংশন
function startApp() {
    const name = document.getElementById('user-name').value;
    const lang = document.getElementById('lang-select').value;
    const gender = document.getElementById('user-gender').value;

    if(!name) {
        alert("দয়া করে আপনার নাম লিখুন।");
        return;
    }

    const profile = { name, lang, gender };
    localStorage.setItem('smirror_profile', JSON.stringify(profile));
    
    document.getElementById('setup-screen').classList.add('hidden');
    document.getElementById('main-dashboard').classList.remove('hidden');
    updateMentorMessage(`আসসালামু আলাইকুম ${name}! আপনার আজকের লক্ষ্য কী?`);
}
