![Status](https://img.shields.io/badge/status-complete-brightgreen)
![Version](https://img.shields.io/badge/version-v2.1.1-blue)

# Bitcoin Fear & Greed

**Version:** v2.1.1  
Client-side neural network sentiment analysis for Bitcoin.

## Tech Stack
- ml5.js / TensorFlow.js
- p5.js
- PapaParse
- CoinGecko API

---

## 🧠 Bitcoin Fear & Greed  
**Neural Network Powered Sentiment Analysis**

### How it works
This project runs a small neural network directly in the browser to classify Bitcoin market sentiment.

The model learns patterns from historical market data and Fear & Greed Index values and predicts one of five sentiment classes:

- Extreme Fear  
- Fear  
- Neutral  
- Greed  
- Extreme Greed  

The goal is **educational and exploratory** — demonstrating how client-side machine learning can be applied to market sentiment analysis.

---

### Training data
The model is trained on a **static historical dataset (2018–2023)** compiled from public sources:

- Fear & Greed Index — Alternative.me  
- Bitcoin price & volume — Yahoo Finance  

The dataset was published on Kaggle by **Adil Bhatti** and combines sentiment indicators with market data for supervised learning.

Training happens locally in the browser using this static dataset.

---

### Live data (optional)
You can fetch current Bitcoin price and 24h volume from CoinGecko to generate a prediction for “right now”.

- Live data is used **only for inference**
- It is **not added** to the training dataset
- No data is stored or sent anywhere

---

### Model & technology
- **p5.js** — UI & interaction
- **ml5.js / TensorFlow.js** — Feedforward neural network (classification)
- **PapaParse** — CSV parsing

Everything runs **100% client-side**:

- No server
- No accounts
- No tracking

---

## Model limitations
This project is intentionally simple and has several important limitations:

- **Static training data**  
  The model is trained on historical data (2018–2023). It does not continuously learn or adapt to new market conditions.

- **Limited feature set**  
  Only date, price, volume, and Fear & Greed labels are used. Many influential factors such as macroeconomics, on-chain metrics, news events, or order book data are not included.

- **Sentiment ≠ price prediction**  
  The model predicts *market sentiment categories*, not future price movements. High confidence does not imply market direction.

- **Correlation, not causation**  
  The neural network learns correlations in past data. It does not understand causal relationships or external events.

- **No performance guarantees**  
  Like all machine learning models, results can be noisy, biased, or misleading — especially during unusual market regimes.

This project is designed for **learning, experimentation, and interface exploration**, not for real-world trading or financial decision-making.

---

## Disclaimer
For research purposes only.  
This project is **not financial advice**. Cryptocurrency markets are volatile and unpredictable — do not use this tool for investment decisions.

---

## Author
**Rene Mathis — AI Product & Experience Design**

- 🌐 Portfolio: https://www.mathis-conceptdesign-portfolio.com  
- 🔗 LinkedIn: https://www.linkedin.com/in/rene-mathis-conceptdesign  