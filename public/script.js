// ===== 데이터 =====
const surnames = [
  "김","이","박","최","정","강","조","윤","장","임",
  "오","한","신","서","권","황","안","송","류","전",
  "홍","고","문","손","백","허","유","남","심","노"
];

const maleNames = [
  "민준","서준","도윤","하준","예준","시후","지호","주원","우진","현우",
  "준서","지후","연우","윤우","은우","시우","현준","승우","유준","건우",
  "서진","하율","재윤","수호","태윤","민수","진우","정우","범석","민찬"
];

const femaleNames = [
  "서연","지우","하윤","서윤","지윤","수아","하은","주아","채원","민서",
  "윤서","아린","예나","예린","유나","다은","지유","소율","가은","시은",
  "하린","다연","은서","수빈","서아","지민","다혜","예진","채윤","지아"
];

const compliments = [
  "멋진 이름이군요.",
  "발음도 예쁘네요!",
  "기억에 쏙 들어옵니다.",
  "세련된 느낌이에요.",
  "귀에 착 붙는 이름!",
  "행운을 부를 것 같아요.",
  "개성과 품격이 느껴져요."
];

// ===== 상태 =====
let selectedGender = null; // 'male' | 'female' | null
let includeSurname = true;
let lastNameShown = "";

// ===== 엘리먼트 =====
const maleBtn = document.getElementById("maleBtn");
const femaleBtn = document.getElementById("femaleBtn");
const includeSurnameInput = document.getElementById("includeSurname");
const generateBtn = document.getElementById("generateBtn");
const retryBtn = document.getElementById("retryBtn");
const copyBtn = document.getElementById("copyBtn");
const resultCard = document.getElementById("resultCard");
const nameText = document.getElementById("nameText");
const complimentText = document.getElementById("complimentText");

// ===== 유틸 =====
function pickRandom(arr, avoid) {
  if (!arr.length) return "";
  if (arr.length === 1) return arr[0];
  let pick = arr[Math.floor(Math.random() * arr.length)];
  // 바로 직전과 동일한 값은 한 번 더 뽑아줌
  if (avoid && pick === avoid) {
    pick = arr[Math.floor(Math.random() * arr.length)];
  }
  return pick;
}

function assertGender() {
  // 성별 미선택 시, 남/여 랜덤 기본값
  if (!selectedGender) {
    selectedGender = Math.random() < 0.5 ? "male" : "female";
    updateGenderUI();
  }
}

function updateGenderUI() {
  const setPressed = (btn, pressed) => btn.setAttribute("aria-pressed", String(pressed));
  setPressed(maleBtn, selectedGender === "male");
  setPressed(femaleBtn, selectedGender === "female");
}

function buildFullName() {
  assertGender();
  const givenPool = selectedGender === "male" ? maleNames : femaleNames;
  const given = pickRandom(givenPool, lastNameShown);
  const family = includeSurname ? pickRandom(surnames) : "";
  const full = includeSurname ? `${family}${given}` : given;
  lastNameShown = given;
  return full;
}

function randomCompliment() {
  return pickRandom(compliments);
}

function showResult(name) {
  nameText.textContent = name;
  complimentText.textContent = randomCompliment();
  resultCard.classList.remove("hidden");
}

// ===== 이벤트 =====
maleBtn.addEventListener("click", () => {
  selectedGender = "male";
  updateGenderUI();
});
femaleBtn.addEventListener("click", () => {
  selectedGender = "female";
  updateGenderUI();
});
includeSurnameInput.addEventListener("change", (e) => {
  includeSurname = e.target.checked;
});

generateBtn.addEventListener("click", () => {
  showResult(buildFullName());
});

retryBtn.addEventListener("click", () => {
  showResult(buildFullName());
});

copyBtn.addEventListener("click", async () => {
  const text = nameText.textContent.trim();
  try {
    await navigator.clipboard.writeText(text);
    copyBtn.textContent = "복사됨!";
    setTimeout(() => (copyBtn.textContent = "복사"), 1000);
  } catch {
    // HTTPS가 아니거나 권한 이슈일 때 fallback
    const textarea = document.createElement("textarea");
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
    copyBtn.textContent = "복사됨!";
    setTimeout(() => (copyBtn.textContent = "복사"), 1000);
  }
});

// Enter 키로 생성
window.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.isComposing) {
    generateBtn.click();
  }
});
