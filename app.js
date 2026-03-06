/**
 * S:MIRROR Ultimate - Data Fix Edition
 * এই কোডটি আপনার দৈনিক, মাসিক এবং বাৎসরিক সকল তথ্য সেভ করা নিশ্চিত করবে।
 */

let user = JSON.parse(localStorage.getItem('sm_profile')) || null;
let currentLang = 'bn';

// ১. পেজ লোড হওয়ার সময় প্রাথমিক কাজ
document.addEventListener('DOMContentLoaded', () => {
    if (user) {
        currentLang = user.lang || 'bn';
        showDashboard();
    }
    
    // তারিখ নির্বাচন ডিফল্ট করা
    const picker = document.getElementById('date-picker');
    if (picker) {
        picker.valueAsDate = new Date();
        loadDailyReport(); // আজকের ডাটা থাকলে দেখাবে
    }
});

// ২. প্রোফাইল সেটআপ এবং মেন্টর এনগেজমেন্ট
function startApp() {
    const nameInput = document.getElementById('user-name');
    const langSelect = document.getElementById('user-lang');
    const genderSelect = document.getElementById('user-gender');

    if (!nameInput.value.trim()) {
        alert("দয়া করে আপনার নাম লিখুন!");
        return;
    }

    user = {
        name: nameInput.value.trim(),
        lang: langSelect.value,
        gender: genderSelect.value,
        joined: new Date().toISOString()
    };

    localStorage.setItem('sm_profile', JSON.stringify(user));
    currentLang = user.lang;
    alert("আপনার প্রোফাইল সফলভাবে তৈরি হয়েছে!");
    showDashboard();
}

function showDashboard() {
    document.getElementById('setup-screen').classList.add('hidden');
    document.getElementById('main-dashboard').classList.remove('hidden');
    renderSalahInputs();
    updateMentorMessage("আসসালামু আলাইকুম " + user.name + "! আজ আপনার দিনটি কেমন কাটল?");
}

// ৩. ডাইনামিক সালাত সেকশন (জেন্ডার অনুযায়ী)
function renderSalahInputs() {
    const container = document.getElementById('salah-container');
    if (!container) return;
    
    const isFemale = user.gender === 'female';
    const waqts = ['ফজর', 'যোহর', 'আসর', 'মাগরিব', 'এশা'];

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

// ৪. দৈনিক রিপোর্ট সেভ করা
function saveDailyReport() {
    const date = document.getElementById('date-picker').value;
    if (!date) {
        alert("তারিখ নির্বাচন করুন!");
        return;
    }

    const dailyData = {
        quran: document.getElementById('d-quran').value,
        hadith: document.getElementById('d-hadith').value,
        study: document.getElementById('d-study').value,
        exercise: document.getElementById('d-exercise').value,
        social: document.getElementById('d-social').value,
        news: document.getElementById('d-news').checked,
        relatives: document.getElementById('d-relatives').value,
        friends: document.getElementById('d-friends').value,
        newPeople: document.getElementById('d-new-people').value,
        houseTask: document.getElementById('d-house-task').checked,
        goodWork: document.getElementById('d-good-work').value,
        critique: document.getElementById('d-critique').value,
        salah: []
    };

    // সালাত ডাটা সংগ্রহ
    for (let i = 0; i < 5; i++) {
        const jamatInput = document.getElementById(`j-${i}`);
        dailyData.salah.push({
            jamat: jamatInput ? jamatInput.checked : false,
            kaza: document.getElementById(`k-${i}`).checked
        });
    }

    localStorage.setItem(`daily_${date}`, JSON.stringify(dailyData));
    alert("মাশাআল্লাহ! আজকের তথ্য সংরক্ষিত হয়েছে।");
}

// ৫. দৈনিক ডাটা লোড করা (তারিখ পরিবর্তন করলে আসবে)
function loadDailyReport() {
    const date = document.getElementById('date-picker').value;
    const savedData = localStorage.getItem(`daily_${date}`);

    if (savedData) {
        const data = JSON.parse(savedData);
        document.getElementById('d-quran').value = data.quran || "";
        document.getElementById('d-hadith').value = data.hadith || "";
        document.getElementById('d-study').value = data.study || "";
        document.getElementById('d-exercise').value = data.exercise || "";
        document.getElementById('d-social').value = data.social || "";
        document.getElementById('d-news').checked = data.news || false;
        document.getElementById('d-relatives').value = data.relatives || "";
        document.getElementById('d-friends').value = data.friends || "";
        document.getElementById('d-new-people').value = data.newPeople || "";
        document.getElementById('d-house-task').checked = data.houseTask || false;
        document.getElementById('d-good-work').value = data.goodWork || "";
        document.getElementById('d-critique').value = data.critique || "";

        data.salah.forEach((s, i) => {
            const jInput = document.getElementById(`j-${i}`);
            if (jInput) jInput.checked = s.jamat;
            document.getElementById(`k-${i}`).checked = s.kaza;
        });
    }
}

// ৬. মাসিক পরিকল্পনা সেভ করা
function saveMonthlyPlan() {
    const period = document.getElementById('m-period').value;
    if (!period) {
        alert("দয়া করে মাসের নাম ও সাল নির্বাচন করুন!");
        return;
    }

    const planData = {
        quranSurahs: document.getElementById('m-quran-surahs').value,
        quranAyat: document.getElementById('m-quran-ayat-target').value,
        hadithGoal: document.getElementById('m-hadith-goal').value,
        books: document.getElementById('m-books').value,
        friendTarget: document.getElementById('m-new-friend-target').value,
        vipTarget: document.getElementById('m-vip-comm').value
    };

    localStorage.setItem(`plan_${period}`, JSON.stringify(planData));
    alert("আপনার মাসিক পরিকল্পনা সংরক্ষিত হয়েছে!");
    
    // রিক্যাপ সেকশন আপডেট
    document.getElementById('monthly-recap').classList.remove('hidden');
    document.getElementById('recap-stats').innerHTML = `<p>এই মাসের লক্ষ্য: ${planData.quranSurahs}</p>`;
}

// ৭. বাৎসরিক পরিকল্পনা সেভ করা
function saveYearlyPlan() {
    const yearlyGoals = document.getElementById('y-goals').value;
    if (!yearlyGoals) {
        alert("আপনার বাৎসরিক লক্ষ্যসমূহ লিখুন!");
        return;
    }

    localStorage.setItem('yearly_mission', yearlyGoals);
    alert("আপনার বাৎসরিক মিশন সফলভাবে সংরক্ষিত হয়েছে!");
}

// ইউটিলিটি ফাংশন
function switchTab(tab) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.add('hidden'));
    document.querySelectorAll('.nav-tabs button').forEach(b => b.classList.remove('active'));
    document.getElementById('tab-' + tab).classList.remove('hidden');
    document.getElementById('btn-' + tab).classList.add('active');
}

function updateMentorMessage(msg) {
    const bar = document.getElementById('mentor-text');
    if (bar) bar.innerText = msg;
            }
