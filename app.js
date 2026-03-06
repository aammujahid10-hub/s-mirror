/**
 * S:MIRROR ULTIMATE SYSTEM 
 * Developed with Advanced Mentorship Logic & Life Tracking
 * Features: Gender-Locked UI, Monthly Planning, Recap Analytics, Social Progress.
 */

// ১. মেন্টর ইন্টেলিজেন্স ডিকশনারি
const i18n = {
    bn: {
        welcome: "আসসালামু আলাইকুম! আমি আপনার S:MIRROR মেন্টর।",
        mentorQuotes: [
            "প্রতিটি মুহূর্ত একটি সুযোগ, একে অবহেলায় হারাবেন না।",
            "সাফল্য হলো প্রতিদিনের ছোট ছোট অভ্যাসের যোগফল।",
            "আপনার লক্ষ্য পরিষ্কার রাখুন, ইনশাআল্লাহ বিজয় আসবেই।"
        ],
        alerts: {
            save: "মাশাআল্লাহ! আপনার রিফ্লেকশন সংরক্ষিত হয়েছে।",
            lock: "দুঃখিত! আপনি ৩ দিনের বেশি আগের তথ্য এডিট করতে পারবেন না।",
            setup: "আপনার প্রোফাইল সফলভাবে তৈরি হয়েছে!",
            plan: "আপনার মাসিক পরিকল্পনা সফলভাবে লক করা হয়েছে।"
        },
        recap: "আপনার এই মাসের পারফরম্যান্স বিশ্লেষণ করছি..."
    },
    en: {
        welcome: "Assalamu Alaikum! I am your S:MIRROR Mentor.",
        mentorQuotes: [
            "Every moment is an opportunity, don't lose it in vain.",
            "Success is the sum of small daily habits.",
            "Keep your vision clear, and success will follow, InshaAllah."
        ],
        alerts: {
            save: "Mashallah! Your reflection has been saved.",
            lock: "Sorry! You cannot edit data older than 3 days.",
            setup: "Your profile was created successfully!",
            plan: "Monthly plan locked successfully."
        },
        recap: "Analyzing your performance for this month..."
    }
};

let user = JSON.parse(localStorage.getItem('sm_profile')) || null;
let currentLang = 'bn';

// ২. ইনিশিয়ালাইজেশন এবং জেন্ডার লজিক
document.addEventListener('DOMContentLoaded', () => {
    if (user) {
        currentLang = user.lang || 'bn';
        showDashboard();
    }
    // আজকের তারিখ ডিফল্ট করা
    const picker = document.getElementById('date-picker');
    if (picker) picker.valueAsDate = new Date();
});

// ৩. প্রোফাইল সেটআপ এবং মেন্টর এনগেজমেন্ট
function startApp() {
    const name = document.getElementById('user-name').value.trim();
    const lang = document.getElementById('user-lang').value;
    const gender = document.getElementById('user-gender').value;

    if (!name) {
        alert(lang === 'bn' ? "দয়া করে নাম লিখুন" : "Please enter your name");
        return;
    }

    user = { name, lang, gender, joined: new Date().toISOString() };
    localStorage.setItem('sm_profile', JSON.stringify(user));
    currentLang = lang;
    
    alert(i18n[currentLang].alerts.setup);
    showDashboard();
}

function showDashboard() {
    document.getElementById('setup-screen').classList.add('hidden');
    document.getElementById('main-dashboard').classList.remove('hidden');
    renderSalahInputs();
    updateMentorMessage(i18n[currentLang].welcome + " " + user.name);
}

// ৪. ডাইনামিক সালাত সেকশন (Gender-Based Jamat & Kaza)
function renderSalahInputs() {
    const container = document.getElementById('salah-container');
    const isFemale = user.gender === 'female';
    const waqts = currentLang === 'bn' ? 
        ['ফজর', 'যোহর', 'আসর', 'মাগরিব', 'এশা'] : 
        ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

    let html = '';
    waqts.forEach((waqt, index) => {
        html += `
        <div class="input-group" style="border-bottom: 1px solid #eee; padding: 5px 0;">
            <label style="display:inline-block; width:80px;">${waqt}:</label>
            ${!isFemale ? `<label style="display:inline-block; font-size:0.8rem;"><input type="checkbox" id="j-${index}"> জামাত</label>` : ''}
            <label style="display:inline-block; font-size:0.8rem; margin-left:10px;"><input type="checkbox" id="k-${index}"> কাজাঁ</label>
        </div>`;
    });
    container.innerHTML = html;
}

// ৫. ৩ দিনের প্রোটেকশন লজিক (The 3-Day Guard)
function checkDateLimit() {
    const selected = new Date(document.getElementById('date-picker').value);
    const today = new Date();
    today.setHours(0,0,0,0);
    
    const diffDays = (today - selected) / (1000 * 60 * 60 * 24);
    const saveBtn = document.getElementById('save-btn');

    if (diffDays > 3 || diffDays < 0) {
        saveBtn.disabled = true;
        updateMentorMessage(i18n[currentLang].alerts.lock);
    } else {
        saveBtn.disabled = false;
        loadDayData(document.getElementById('date-picker').value);
    }
}

// ৬. আল্টিমেট ডাটা সেভিং (Daily Reflection)
function saveDailyReport() {
    const date = document.getElementById('date-picker').value;
    if (!date) return;

    const entry = {
        salah: [],
        quran: document.getElementById('d-quran').value,
        hadith: document.getElementById('d-hadith').value,
        study: document.getElementById('d-study').value,
        exercise: document.getElementById('d-exercise').value,
        social: document.getElementById('d-social').value,
        relatives: document.getElementById('d-relatives').value,
        friends: document.getElementById('d-friends').value,
        newPeople: document.getElementById('d-new-people').value,
        houseTask: document.getElementById('d-house-task').checked,
        goodWork: document.getElementById('d-good-work').value,
        critique: document.getElementById('d-critique').value,
        timestamp: new Date().getTime()
    };

    // সালাত ডাটা সংগ্রহ
    for (let i = 0; i < 5; i++) {
        entry.salah.push({
            jamat: document.getElementById(`j-${i}`) ? document.getElementById(`j-${i}`).checked : false,
            kaza: document.getElementById(`k-${i}`).checked
        });
    }

    localStorage.setItem(`daily_${date}`, JSON.stringify(entry));
    alert(i18n[currentLang].alerts.save);
    celebrateProgress(entry);
}

// ৭. মাসিক পরিকল্পনা ও ইন্টেলিজেন্ট রিক্যাপ
function saveMonthlyPlan() {
    const period = document.getElementById('m-period').value;
    if (!period) return;

    const plan = {
        quranSurahs: document.getElementById('m-quran-surahs').value,
        quranAyat: document.getElementById('m-quran-ayat-target').value,
        hadithGoal: document.getElementById('m-hadith-goal').value,
        vipTarget: document.getElementById('m-vip-comm').value,
        newFriendTarget: document.getElementById('m-new-friend-target').value,
        books: document.getElementById('m-books').value
    };

    localStorage.setItem(`plan_${period}`, JSON.stringify(plan));
    alert(i18n[currentLang].alerts.plan);
    generateRecap(period);
}

// ৮. মেন্টর এনালাইসিস এবং ফিডব্যাক (The Mentor Brain)
function generateRecap(period) {
    const recapBox = document.getElementById('monthly-recap');
    const evalBox = document.getElementById('mentor-eval');
    recapBox.classList.remove('hidden');

    // কাল্পনিক ডাটা এনালাইসিস লজিক
    let studyHours = 0;
    let salahCount = 0;
    
    // লোকাল স্টোরেজ থেকে ওই মাসের সব ডাটা লুপ করা
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('daily_' + period)) {
            const data = JSON.parse(localStorage.getItem(key));
            studyHours += Number(data.study || 0);
            salahCount += data.salah.filter(s => s.jamat || !s.kaza).length;
        }
    }

    let feedback = currentLang === 'bn' ? 
        `শিক্ষার্থী ${user.name}, আপনার এই মাসের প্রচেষ্টাকে আমি সম্মান জানাই। ` : 
        `Student ${user.name}, I respect your efforts this month. `;

    if (studyHours > 100) feedback += (currentLang === 'bn' ? "আপনার পরিশ্রম অসাধারণ!" : "Your hard work is extraordinary!");
    else feedback += (currentLang === 'bn' ? "পড়াশোনায় আরও একটু মনোযোগ প্রয়োজন।" : "Need a bit more focus on studies.");

    evalBox.innerHTML = `<strong>মেন্টর মূল্যায়ন:</strong> <br> ${feedback}`;
}

// ৯. ইউটিলিটি ফাংশনস
function updateMentorMessage(msg) {
    document.getElementById('mentor-text').innerText = msg;
}

function switchTab(tab) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.add('hidden'));
    document.querySelectorAll('.nav-tabs button').forEach(b => b.classList.remove('active'));
    document.getElementById('tab-' + tab).classList.remove('hidden');
    document.getElementById('btn-' + tab).classList.add('active');
}

function celebrateProgress(entry) {
    if (entry.goodWork > 2) {
        updateMentorMessage(currentLang === 'bn' ? "মাশাআল্লাহ! আজ আপনি অনেক ভালো কাজ করেছেন।" : "Mashallah! You did a lot of good deeds today.");
    }
                                           }
