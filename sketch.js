/* sketch.js — Bitcoin Sentiment Prediction (ml5 + p5 + PapaParse + CoinGecko)
   - Loads CSV dataset -> trains ml5 neural network classifier
   - Fetches live BTC price + 24h volume from CoinGecko
   - Predicts sentiment label + confidence from inputs
   - Training TTL: after training, Train button shows countdown (15..0), then resets
   - Visor: open during training; close after training only if it was closed before
   - UX: after fetch, scroll to Train button + strong blink to guide user
*/

let neuralModel = null;

let isTraining = false;
let isModelReady = false;
let isTrained = false;

let tf = null;
let visorWasOpenBeforeTraining = false;

// Training freshness countdown (interval id)
let retrainTimer = null;
let retrainCountdown = 0;

const RETRAIN_TTL = 15;       // seconds after training
const POST_PREDICT_TTL = 5;   // optional: reduce remaining TTL after prediction

/* -------------------- p5 entry -------------------- */
function setup() {
  noCanvas();

  init().catch((err) => {
    console.error("Fatal init error:", err);
    setTrainStatus(`Init failed: ${err?.message ?? err}`, "status-error");
  });
}

/* -------------------- init -------------------- */
async function init() {
  if (typeof ml5 === "undefined") throw new Error("ml5 not loaded (check <script> order).");
  if (typeof Papa === "undefined") throw new Error("PapaParse not loaded (missing CDN).");

  tf = ml5.tf;
  if (!tf) throw new Error("ml5.tf missing (ml5 not fully loaded?).");

  await initTensorFlowBackend();

  wireUI();
  setDefaultDate();

  setTrainStatus("Loading dataset…", "status-info");
  await loadCSVData();

  isModelReady = true;
  setTrainStatus("Dataset loaded. Ready to train.", "status-success");
}

async function initTensorFlowBackend() {
  try {
    await tf.setBackend("webgl");
    await tf.ready();
    console.log("✓ TF backend:", tf.getBackend());
  } catch (e) {
    console.warn("WebGL backend failed, switching to CPU:", e);
    await tf.setBackend("cpu");
    await tf.ready();
    console.log("✓ TF backend:", tf.getBackend());
  }
  await sleep(150);
}

/* -------------------- UI wiring -------------------- */
function wireUI() {
  document.getElementById("train")?.addEventListener("click", startTraining);
  document.getElementById("predict")?.addEventListener("click", makePrediction);
  document.getElementById("fetchData")?.addEventListener("click", fetchLiveData);
}

function setDefaultDate() {
  const today = new Date().toISOString().split("T")[0];
  select("#date")?.value(today);
}

function setTrainStatus(text, className = "status-info") {
  const el = select("#trainStatus");
  if (!el) return;

  el.removeClass("status-info");
  el.removeClass("status-success");
  el.removeClass("status-warning");
  el.removeClass("status-error");

  el.addClass(className);
  el.html(text);
}

function setResult(html) {
  select("#result")?.html(html);
}

/* -------------------- Scroll helpers -------------------- */
function scrollToCenter(selector) {
  const el = document.querySelector(selector);
  if (!el) return;
  requestAnimationFrame(() => el.scrollIntoView({ behavior: "smooth", block: "center" }));
}

function scrollTrainingIntoView() {
  // Prefer the button itself (most reliable), fallback to section
  const btn = document.getElementById("train");
  const section = document.querySelector(".model-section");
  const target = btn || section;
  if (!target) return;

  requestAnimationFrame(() => {
    target.scrollIntoView({ behavior: "smooth", block: "center" });
  });
}

/* -------------------- Train button effects -------------------- */
function pulseTrainButton() {
  const btn = document.querySelector("#train");
  if (!btn) return;
  btn.classList.remove("train-pulse");
  void btn.offsetWidth;
  btn.classList.add("train-pulse");
}

function emphasizeTrainButton(durationMs = 7000) {
  const btn = document.querySelector("#train");
  if (!btn) return;

  // ensure soft pulse doesn't fight the strong blink
  btn.classList.remove("train-pulse");
  btn.classList.remove("train-attention");
  void btn.offsetWidth;
  btn.classList.add("train-attention");

  window.setTimeout(() => {
    btn.classList.remove("train-attention");
  }, durationMs);
}

/* -------------------- TTL countdown -------------------- */
function clearRetrainTimer() {
  if (retrainTimer) {
    clearInterval(retrainTimer);
    retrainTimer = null;
  }
}

function startRetrainCountdown(seconds = RETRAIN_TTL) {
  clearRetrainTimer();
  retrainCountdown = seconds;

  const btn = select("#train");
  if (!btn) return;

  btn.html(`Trained (${retrainCountdown}s)`);

  retrainTimer = setInterval(() => {
    retrainCountdown--;

    if (retrainCountdown <= 0) {
      clearRetrainTimer();
      resetTrainingState("Model expired — retrain for fresh market conditions.");
      return;
    }

    btn.html(`Trained (${retrainCountdown}s)`);
  }, 1000);
}

function resetTrainingState(reason = "Retrain required.") {
  isTraining = false;
  isTrained = false;

  clearRetrainTimer();

  const trainBtn = select("#train");
  trainBtn?.html("Train Model");
  trainBtn?.style("background-color", null);

  select("#predict")?.style("display", "none");
  setTrainStatus(reason, "status-warning");
}

/* -------------------- CSV + model -------------------- */
function loadCSVData() {
  return new Promise((resolve, reject) => {
    Papa.parse("./dataset_btc_fear_greed_copy.csv", {
      download: true,
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        const rows = Array.isArray(results.data) ? results.data : [];

        neuralModel = ml5.neuralNetwork({
          task: "classification",
          debug: true,
          inputs: ["date", "volume", "rate"],
          outputs: ["label"],
        });

        let count = 0;

        for (const row of rows) {
          if (!row) continue;

          const dateStr = String(row.date ?? "").trim();
          const volume = Number(row.volume);
          const rate = Number(row.rate);
          const label = String(row.prediction ?? "").trim();

          if (!dateStr || !label) continue;
          if (!Number.isFinite(volume) || !Number.isFinite(rate)) continue;

          const dateNum = convertDate(dateStr);
          if (!Number.isFinite(dateNum)) continue;

          neuralModel.addData({ date: dateNum, volume, rate }, { label });
          count++;
        }

        console.log(`✓ CSV rows: ${rows.length}, training samples: ${count}`);

        try {
          neuralModel.normalizeData();
          console.log("✓ normalizeData()");
        } catch (e) {
          console.warn("normalizeData failed (continuing):", e);
        }

        resolve();
      },
      error: (err) => reject(err),
    });
  });
}

/* -------------------- Visor helpers -------------------- */
function getVisorRoot() {
  return document.querySelector(".visor");
}

function isVisorOpen() {
  const el = getVisorRoot();
  if (!el) return false;

  const style = window.getComputedStyle(el);
  if (style.display === "none" || style.visibility === "hidden" || style.opacity === "0") return false;

  return !!el.querySelector(".visor-controls");
}

function openVisor() {
  try {
    const v = neuralModel?.vis;
    if (!v?.visor) return;

    const visorObj = typeof v.visor === "function" ? v.visor() : v.visor;
    visorObj?.open?.();
  } catch (_) {}
}

function closeVisorReliable() {
  const maxTries = 20;
  let tries = 0;

  const tick = () => {
    if (!isVisorOpen()) return;

    const buttons = document.querySelectorAll(".visor-controls button");
    if (buttons?.length >= 2) buttons[1].click(); // Hide

    tries++;
    if (tries < maxTries) setTimeout(tick, 120);
    else {
      const el = getVisorRoot();
      if (el) el.style.display = "none";
    }
  };

  setTimeout(tick, 200);
}

/* -------------------- Training -------------------- */
function startTraining() {
  if (isTraining) return;

  if (!isModelReady || !neuralModel) {
    setTrainStatus("Model not ready yet — wait for dataset load.", "status-warning");
    return;
  }

  isTraining = true;
  isTrained = false;

  clearRetrainTimer();

  select("#train")?.html("Training…");
  setTrainStatus("Training started…", "status-info");

  visorWasOpenBeforeTraining = isVisorOpen();
  setTimeout(openVisor, 0);

  const opts = { epochs: 32, batchSize: 32 };

  try {
    neuralModel.train(opts, onTrainProgress, onTrainDone);
  } catch (err) {
    console.error("Train failed:", err);
    isTraining = false;
    setTrainStatus(`Training failed: ${err?.message ?? err}`, "status-error");
    select("#train")?.html("Train Model");
  }
}

function onTrainProgress(epoch, loss) {
  const val = loss && typeof loss.loss === "number" ? loss.loss.toFixed(4) : "…";
  console.log(`Epoch ${epoch} — loss ${val}`);
}

function onTrainDone() {
  console.log("✓ Training complete");

  isTraining = false;
  isTrained = true;

  select("#train")?.style("background-color", "#31fa03");
  select("#predict")?.style("display", "inline-block");

  setTrainStatus("Training complete. You can predict now.", "status-success");
  scrollToCenter("#predict");

  if (!visorWasOpenBeforeTraining) closeVisorReliable();

  startRetrainCountdown(RETRAIN_TTL);
}

/* -------------------- Prediction -------------------- */
function makePrediction() {
  if (!isModelReady || !neuralModel) {
    setTrainStatus("Model not ready.", "status-warning");
    return;
  }
  if (!isTrained) {
    setTrainStatus("Train the model first.", "status-warning");
    return;
  }

  const dateStr = String(select("#date")?.value() ?? "").trim();
  const rateVal = Number(select("#rate")?.value());
  const volVal = Number(select("#volume")?.value());
  const dateVal = convertDate(dateStr);

  if (!Number.isFinite(dateVal) || !Number.isFinite(rateVal) || !Number.isFinite(volVal)) {
    setTrainStatus("Invalid input values.", "status-warning");
    return;
  }

  const input = { date: dateVal, volume: volVal, rate: rateVal };

  try {
    const maybePromise = neuralModel.classify(input, handleResults);
    if (maybePromise && typeof maybePromise.then === "function") {
      maybePromise.then((res) => handleResults(null, res)).catch((err) => handleResults(err, null));
    }
  } catch (err) {
    handleResults(err, null);
  }
}

function handleResults(error, results) {
  // Some ml5 builds pass results as first arg
  if (Array.isArray(error) && results == null) {
    results = error;
    error = null;
  }

  if (error) {
    console.error("Prediction error:", error);
    setTrainStatus("Prediction failed (see console).", "status-error");
    setResult(`<div class="prediction-result"><div class="prediction-label">Prediction failed</div></div>`);
    scrollToCenter("#result");
    return;
  }

  if (!Array.isArray(results) || results.length === 0) {
    setTrainStatus("No prediction results.", "status-warning");
    setResult(`<div class="prediction-result"><div class="prediction-label">No results</div></div>`);
    scrollToCenter("#result");
    return;
  }

  // pick top confidence
  let top = results[0];
  for (const r of results) {
    if (typeof r?.confidence === "number" && r.confidence > (top?.confidence ?? -1)) top = r;
  }

  const label = String(top?.label ?? "Unknown");
  const conf = typeof top?.confidence === "number" ? (top.confidence * 100).toFixed(1) : "0.0";

  const { advice, emoji, cssClass } = labelToAdvice(label);

  setTrainStatus(`Prediction: ${label} (${conf}%)`, "status-success");

  setResult(`
    <div class="prediction-result ${cssClass}">
      <div class="prediction-header">
        <div class="prediction-emoji">${emoji}</div>
        <div class="prediction-label">${label}</div>
      </div>
      <div class="confidence">Confidence: ${conf}%</div>
      <div class="advice">${advice}</div>
      <div class="disclaimer">Educational only — not financial advice.</div>
    </div>
  `);

  scrollToCenter("#result");

  // Optional: after prediction, shorten remaining TTL to encourage quick retrain
  if (typeof retrainCountdown === "number" && retrainCountdown > POST_PREDICT_TTL) {
    retrainCountdown = POST_PREDICT_TTL;
    select("#train")?.html(`Trained (${retrainCountdown}s)`);
  }
}

/* -------------------- CoinGecko live fetch -------------------- */
async function fetchLiveData() {
  const btn = select("#fetchData");
  const lastUpdate = select("#lastUpdate");

  btn?.attribute("disabled", "");
  btn?.html("Fetching…");
  lastUpdate?.html("Fetching CoinGecko…");

  try {
    const url =
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_vol=true";

    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`CoinGecko HTTP ${res.status}`);

    const data = await res.json();
    const price = data?.bitcoin?.usd;
    const vol = data?.bitcoin?.usd_24h_vol;

    if (typeof price !== "number" || typeof vol !== "number") {
      throw new Error("Unexpected CoinGecko response format");
    }

    select("#rate")?.value(Math.round(price));
    select("#volume")?.value(Math.round(vol));

    lastUpdate?.html(`Last update (CoinGecko): ${new Date().toLocaleString()}`);
  } catch (err) {
    console.error("Fetch Live Data failed:", err);
    lastUpdate?.html(`Fetch failed: ${err?.message ?? err}`);
  } finally {
    btn?.removeAttribute("disabled");
    btn?.html("Fetch Live Data");

    // guide user to train again with fresh data
    scrollTrainingIntoView();
    emphasizeTrainButton(7000);
  }
}

/* -------------------- helpers -------------------- */
function convertDate(dateStr) {
  const parts = String(dateStr).split("-");
  if (parts.length !== 3) return NaN;

  const y = Number(parts[0]);
  const m = Number(parts[1]);
  const d = Number(parts[2]);
  if (!Number.isFinite(y) || !Number.isFinite(m) || !Number.isFinite(d)) return NaN;

  const inputDate = new Date(y, m - 1, d);
  if (Number.isNaN(inputDate.getTime())) return NaN;

  const refDate = new Date(2018, 0, 1);
  return Math.floor((inputDate - refDate) / 86400000);
}

function labelToAdvice(label) {
  switch (label) {
    case "Extreme Fear":
      return { advice: "Buy the dip → STRONG BUY", emoji: "🔥", cssClass: "extreme-fear" };
    case "Fear":
      return { advice: "Good entry point → BUY", emoji: "😰", cssClass: "fear" };
    case "Neutral":
      return { advice: "Market stable → HOLD", emoji: "😐", cssClass: "neutral" };
    case "Greed":
      return { advice: "Consider taking profits", emoji: "😎", cssClass: "greed" };
    case "Extreme Greed":
      return { advice: "Sell high → SELL", emoji: "🤑", cssClass: "extreme-greed" };
    default:
      return { advice: "Unknown sentiment", emoji: "❓", cssClass: "" };
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/* -------------------- about auto-scroll -------------------- */
document.addEventListener("DOMContentLoaded", () => {
  const aboutDetails = document.querySelector(".about-section details");
  if (!aboutDetails) return;

  aboutDetails.addEventListener("toggle", () => {
    if (aboutDetails.open) {
      requestAnimationFrame(() => {
        aboutDetails.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  });
});