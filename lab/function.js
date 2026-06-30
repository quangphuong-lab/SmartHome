// ===== FIREBASE DATABASE =====
const db = firebase.database();

// ===== FIREBASE PATH KHÔNG DẤU, PHẢI KHỚP VỚI ESP32 =====
const PATH = {
  light: "ThietBi/Den",
  ac: "ThietBi/DieuHoa",
  lock: "ThietBi/KhoaCua",

  temp: "Sensor/NhietDo",
  humid: "Sensor/DoAm",
  power: "Sensor/DienNang"
};

// ================= ĐỒNG HỒ =================
function updateClock() {
  const now = new Date();
  const pad = n => String(n).padStart(2, "0");

  const h = now.getHours();
  const m = now.getMinutes();
  const s = now.getSeconds();

  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;

  const timeEl = document.getElementById("tb-time");
  const dateEl = document.getElementById("tb-date");

  if (timeEl) {
    timeEl.textContent = `${pad(h12)}:${pad(m)}:${pad(s)} ${ampm}`;
  }

  const days = [
    "Chủ Nhật",
    "Thứ Hai",
    "Thứ Ba",
    "Thứ Tư",
    "Thứ Năm",
    "Thứ Sáu",
    "Thứ Bảy"
  ];

  if (dateEl) {
    dateEl.textContent = `${days[now.getDay()]}, ${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`;
  }
}

updateClock();
setInterval(updateClock, 1000);

// ================= BIỂU ĐỒ =================
const chartDays = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

let chartElecVals = [55, 70, 45, 80, 60, 90, 75];
let chartHumidVals = [65, 70, 75, 60, 80, 72, 68];

function buildChart(wrapId, selId, dataVals, colorToday, colorPast) {
  const wrap = document.getElementById(wrapId);
  const sel = document.getElementById(selId);

  if (!wrap) return;

  const n = sel ? parseInt(sel.value, 10) : 7;
  const todayIdx = (new Date().getDay() + 6) % 7;

  wrap.innerHTML = "";

  for (let i = 0; i < n; i++) {
    const idx = (todayIdx - (n - 1 - i) + 7) % 7;
    const v = Number(dataVals[idx]) || 0;

    const h = Math.round((v / 100) * 90);
    const bgColor = idx === todayIdx ? colorToday : colorPast;

    wrap.innerHTML += `
      <div class="bw">
        <div class="bar" style="height:${h}px; background-color:${bgColor};"></div>
        <span class="bar-lbl">${chartDays[idx]}</span>
      </div>
    `;
  }
}

function updateCharts() {
  buildChart(
    "bar-chart-humid",
    "chart-range-humid",
    chartHumidVals,
    "var(--accent2)",
    "#cceef5"
  );

  buildChart(
    "bar-chart-elec",
    "chart-range-elec",
    chartElecVals,
    "var(--green)",
    "#c9cfe8"
  );
}

updateCharts();

// ================= BÓNG ĐÈN =================
let lightSuppress = false;

function updateSlider(el) {
  const v = parseInt(el.value, 10);

  const sliderVal = document.getElementById("slider-val");
  if (sliderVal) {
    sliderVal.textContent = v + "%";
  }

  el.style.background = `linear-gradient(90deg, var(--accent) ${v}%, var(--border) ${v}%)`;

  const ring = document.getElementById("icon-bongden");
  if (ring) {
    ring.style.setProperty("--p", v + "%");
  }

  if (!lightSuppress) {
    db.ref(PATH.light).set(v);
  }
}

// ================= ĐIỀU HÒA =================
function toggleAC(el) {
  const on = el.checked;

  const iconEl = document.getElementById("icon-dieuhoa");
  if (iconEl) {
    iconEl.classList.toggle("on", on);
  }

  db.ref(PATH.ac).set(on ? "ON" : "OFF");
}

// ================= KHÓA CỬA =================
function setLock(on) {
  const iconEl = document.getElementById("icon-cua");
  const btnOpen = document.getElementById("btn-open");
  const btnClose = document.getElementById("btn-close");

  if (iconEl) {
    iconEl.classList.toggle("on", on);
  }

  if (btnOpen && btnClose) {
    btnOpen.classList.toggle("active", on);
    btnClose.classList.toggle("active", !on);
  }

  db.ref(PATH.lock).set(on ? "ON" : "OFF");
}

// ================= NHẬN DỮ LIỆU CẢM BIẾN TỪ FIREBASE =================
function showSensor(path, elementId, unit, digits = 1) {
  db.ref(path).on("value", snap => {
    const v = snap.val();
    const el = document.getElementById(elementId);

    if (!el) return;

    if (v === null || v === undefined) {
      el.textContent = "--";
      return;
    }

    const num = Number(v);

    if (isNaN(num)) {
      el.textContent = v + unit;
    } else {
      el.textContent = num.toFixed(digits) + unit;
    }
  });
}

showSensor(PATH.temp, "nhietdo", "°C", 1);
showSensor(PATH.humid, "doam", "%", 1);
showSensor(PATH.power, "diennang", " kWh", 1);

// Cập nhật biểu đồ độ ẩm theo giá trị mới nhất
db.ref(PATH.humid).on("value", snap => {
  const v = Number(snap.val());
  if (!isNaN(v)) {
    const todayIdx = (new Date().getDay() + 6) % 7;
    chartHumidVals[todayIdx] = v;
    updateCharts();
  }
});

// Cập nhật biểu đồ điện năng theo giá trị mới nhất
db.ref(PATH.power).on("value", snap => {
  const v = Number(snap.val());
  if (!isNaN(v)) {
    const todayIdx = (new Date().getDay() + 6) % 7;
    chartElecVals[todayIdx] = v * 10;
    updateCharts();
  }
});

// ================= ĐỒNG BỘ TRẠNG THÁI THIẾT BỊ TỪ FIREBASE =================
db.ref(PATH.light).on("value", snap => {
  const v = snap.val();
  const slider = document.getElementById("light-slider");

  if (v !== null && slider) {
    lightSuppress = true;

    slider.value = v;
    updateSlider(slider);

    lightSuppress = false;
  }
});

db.ref(PATH.ac).on("value", snap => {
  const v = snap.val();
  const on = v === "ON";

  const sw = document.getElementById("ac-switch");
  const iconEl = document.getElementById("icon-dieuhoa");

  if (sw) {
    sw.checked = on;
  }

  if (iconEl) {
    iconEl.classList.toggle("on", on);
  }
});

db.ref(PATH.lock).on("value", snap => {
  const v = snap.val();
  const on = v === "ON";

  const iconEl = document.getElementById("icon-cua");
  const btnOpen = document.getElementById("btn-open");
  const btnClose = document.getElementById("btn-close");

  if (iconEl) {
    iconEl.classList.toggle("on", on);
  }

  if (btnOpen && btnClose) {
    btnOpen.classList.toggle("active", on);
    btnClose.classList.toggle("active", !on);
  }
});