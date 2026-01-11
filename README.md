🟢 Bitcoin Fear & Greed

Neural Network Powered Sentiment Analysis

A browser-based research project exploring Bitcoin market sentiment using a neural network trained on historical Fear & Greed Index data.

This tool classifies market conditions into five sentiment categories based on historical patterns and optional live market data.

⸻

🚀 Live Demo

👉 GitHub Pages:
https://rm-r3.github.io/bitcoin-prediction/

⸻

🧠 How It Works

This project uses a feedforward neural network to classify Bitcoin market sentiment into one of the following categories:
	•	Extreme Fear
	•	Fear
	•	Neutral
	•	Greed
	•	Extreme Greed

The model learns relationships between:
	•	date (time progression)
	•	Bitcoin price
	•	trading volume
	•	historical Fear & Greed Index values

Predictions are performed entirely in the browser using JavaScript.

⸻

📊 Training Data

The neural network is trained on a historical dataset (2018–2021) combining:
	•	Bitcoin price and volume data
	•	Crypto Fear & Greed Index values

The dataset is based on publicly available data from:
	•	Alternative.me (Fear & Greed Index)
	•	Yahoo Finance (market data)

Published on Kaggle by Adil Bhatti.

The training data is static and not updated automatically.

⸻

🔄 Live Data

For experimentation purposes, the app can fetch current Bitcoin price and volume from:
	•	CoinGecko API

This live data is used only for inference, not for training.

⸻

🛠️ Technology Stack
	•	p5.js — UI and interaction layer
	•	ml5.js — Neural network abstraction (TensorFlow.js)
	•	TensorFlow.js — Machine learning backend
	•	PapaParse — CSV parsing
	•	CoinGecko API — Live Bitcoin market data

All computation runs client-side. No server required.

⸻

⚠️ Disclaimer

For research purposes only. Not financial advice.

This project is intended for experimentation and learning.
Cryptocurrency markets are highly volatile and unpredictable.

Do not use this tool for investment decisions.

⸻

📎 Attribution

Fear & Greed Index data provided by:
https://alternative.me/crypto/fear-and-greed-index/

⸻

📄 License

MIT License
