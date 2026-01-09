# 🚀 Bitcoin Advisor - ML-Powered Price Prediction

![Bitcoin Prediction](https://img.shields.io/badge/ML-Neural_Network-brightgreen) ![p5.js](https://img.shields.io/badge/p5.js-1.6.0-ff69b4) ![ML5.js](https://img.shields.io/badge/ML5.js-latest-orange)

An educational machine learning project that predicts Bitcoin market sentiment using historical price and volume data.

## 🎯 Features

- **🧠 Neural Network**: Trained ML5.js model for sentiment classification
- **📊 Real-Time Data**: Fetches live Bitcoin prices from CoinGecko API
- **🎨 Retro Design**: Cyberpunk-inspired UI with neon aesthetics
- **📱 Responsive**: Works on desktop, tablet, and mobile
- **🔮 Predictions**: Classifies market as Extreme Fear, Fear, Neutral, Greed, or Extreme Greed

## 🛠️ Tech Stack

- **ML5.js** - Machine Learning library built on TensorFlow.js
- **p5.js** - Creative coding framework
- **CoinGecko API** - Real-time cryptocurrency data
- **Vanilla JavaScript** - No frameworks, pure JS
- **CSS3** - Custom animations and retro styling

## 🚀 Quick Start

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Local web server (for file access, due to CORS)

### Installation

1. **Clone or download this project**

2. **Ensure you have the dataset**
   - The project uses `dataset_btc_fear_greed_copy.csv`
   - Dataset includes: date, volume, rate, prediction

3. **Start a local server**

   **Option 1: Python**
   ```bash
   # Python 3
   python -m http.server 5503
   
   # Python 2
   python -m SimpleHTTPServer 5503
   ```

   **Option 2: Node.js**
   ```bash
   npx http-server -p 5503
   ```

   **Option 3: VS Code**
   - Install "Live Server" extension
   - Right-click `index.html` > "Open with Live Server"

4. **Open in browser**
   ```
   http://localhost:5503
   ```

## 📖 How to Use

1. **Fetch Live Data** 
   - Click "🔄 Fetch Live Data" to get current BTC price and volume
   - Data is pulled from CoinGecko API in real-time

2. **Train the Model**
   - Click "🧠 Train Model" to train the neural network
   - Training takes 30-60 seconds
   - Watch the loss decrease in the status messages

3. **Make Predictions**
   - After training, the "🔮 Predict" button appears
   - Adjust date/price/volume if desired
   - Click "Predict" to see market sentiment analysis

4. **Interpret Results**
   - **Extreme Fear** 🔥 - Strong buy signal
   - **Fear** 😰 - Good entry point
   - **Neutral** 😐 - Hold or wait
   - **Greed** 😎 - Consider profits
   - **Extreme Greed** 🤑 - Sell signal

## 🎓 How It Works

### Data Processing
1. Historical Bitcoin data (2018-2024) with:
   - Date (converted to numeric days)
   - Trading volume (USD)
   - Price (USD)
   - Sentiment label (Fear/Greed index)

### Neural Network Architecture
- **Input Layer**: 3 neurons (date, volume, rate)
- **Hidden Layers**: Automatically configured by ML5.js
- **Output Layer**: 5 neurons (sentiment classes)
- **Training**: 50 epochs with batch size of 32
- **Activation**: ReLU (hidden), Softmax (output)

### Classification
The model outputs confidence scores for each sentiment class and selects the highest probability prediction.

## 📊 Dataset

**Source**: Bitcoin Fear & Greed Index historical data

**Format**: CSV with columns:
- `Index` - Row number
- `date` - YYYY-MM-DD format
- `volume` - 24h trading volume in USD
- `rate` - Bitcoin price in USD
- `prediction` - Sentiment label

**Time Period**: 2018-2024 (1,885 data points)

## ⚠️ Important Disclaimer

**THIS IS AN EDUCATIONAL PROJECT**

- **NOT financial advice** - Do not use for real investments
- **No guarantees** - Past performance ≠ future results
- **High volatility** - Crypto markets are extremely unpredictable
- **DYOR** - Always Do Your Own Research
- **Consult professionals** - Speak to financial advisors before investing

## 🎨 Design Philosophy

The retro/cyberpunk aesthetic was chosen to:
- Stand out in portfolios
- Demonstrate CSS skills
- Create memorable user experience
- Pay homage to early internet/gaming culture

**Color Palette**:
- Neon Pink (#ff00ea)
- Lime Green (#31fa03)
- Electric Blue (#0808e4)
- Dark Purple (#0a025e)

## 🐛 Troubleshooting

### Model not training?
- Check browser console for errors
- Ensure dataset file is in the correct location
- Try refreshing the page

### API not working?
- CoinGecko API may be rate-limited
- Check your internet connection
- Use manual input as fallback

### Styling looks wrong?
- Clear browser cache
- Check if CSS file is loading
- Ensure web fonts are accessible

## 🔄 Future Improvements

- [ ] Multiple cryptocurrency support
- [ ] Historical chart visualization
- [ ] Model persistence (save/load trained models)
- [ ] Advanced technical indicators
- [ ] Confidence interval visualization
- [ ] Export predictions to CSV
- [ ] Dark/light mode toggle
- [ ] Multi-language support

## 📝 For Portfolio Use

### Talking Points

**Technical Skills Demonstrated**:
- Machine Learning (ML5.js, TensorFlow.js)
- API Integration (REST APIs, async/await)
- Data Preprocessing (normalization, encoding)
- Responsive Web Design
- CSS Animations
- Error Handling
- User Experience Design

**Project Highlights**:
- Working with real-world financial data
- Real-time API integration
- Custom neural network training
- Full-stack thinking (data → model → UI)
- Attention to design and UX

**Discussion Points**:
- "How did you choose the model architecture?"
- "What challenges did you face with the data?"
- "How would you improve accuracy?"
- "What about overfitting?"
- "How scalable is this approach?"

### Demo Tips

1. **Show the flow**: Fetch Data → Train → Predict
2. **Explain the data**: Show the CSV, talk about features
3. **Discuss limitations**: Be honest about model constraints
4. **Show code quality**: Clean, commented, organized
5. **Mention improvements**: Show you think beyond MVP

## 📚 Learning Resources

- [ML5.js Documentation](https://learn.ml5js.org/)
- [p5.js Reference](https://p5js.org/reference/)
- [CoinGecko API Docs](https://www.coingecko.com/en/api)
- [Neural Networks Explained](https://www.youtube.com/watch?v=aircAruvnKk)

## 👨‍💻 Author

**Your Name**
- Portfolio: (https://www.mathis-conceptdesign-portfolio.com/)
- GitHub: @rm-r3
- LinkedIn: www.linkedin.com/in/rene-mathis-conceptdesign

## 📄 License

MIT License - Feel free to use for learning and portfolio purposes

---

**Remember**: This project is for educational purposes only. Never use ML predictions for actual investment decisions! 🚀📚