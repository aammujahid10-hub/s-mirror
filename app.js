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
