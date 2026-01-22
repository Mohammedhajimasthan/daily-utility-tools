// BMI Calculator
document.getElementById('calculateBMI').addEventListener('click', () => {
    const w = parseFloat(document.getElementById('weight').value);
    const h = parseFloat(document.getElementById('height').value);
    const bmi = (w / (h * h)).toFixed(2);
    document.getElementById('bmiResult').textContent = `BMI: ${bmi}`;
});

// Currency Converter (Simple rates; for real-time, use an API)
document.getElementById('convertCurrency').addEventListener('click', () => {
    const amt = parseFloat(document.getElementById('amount').value);
    const from = document.getElementById('fromCurrency').value;
    const to = document.getElementById('toCurrency').value;
    const rates = { USD: { EUR: 0.85, INR: 74 }, EUR: { USD: 1.18, INR: 87 }, INR: { USD: 0.013, EUR: 0.011 } };
    const result = (amt * rates[from][to]).toFixed(2);
    document.getElementById('currencyResult').textContent = `${amt} ${from} = ${result} ${to}`;
});

// Password Generator
document.getElementById('generatePass').addEventListener('click', () => {
    const len = document.getElementById('passLength').value;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let pass = '';
    for (let i = 0; i < len; i++) pass += chars.charAt(Math.floor(Math.random() * chars.length));
    document.getElementById('passOutput').textContent = pass;
});

// Unit Converter
document.getElementById('convertUnit').addEventListener('click', () => {
    const val = parseFloat(document.getElementById('unitValue').value);
    const from = document.getElementById('fromUnit').value;
    const to = document.getElementById('toUnit').value;
    let res;
    if (from === 'meters' && to === 'feet') res = val * 3.28084;
    else if (from === 'feet' && to === 'meters') res = val / 3.28084;
    document.getElementById('unitResult').textContent = `${val} ${from} = ${res.toFixed(2)} ${to}`;
});

// Weather Checker (Free API; get key from openweathermap.org)
document.getElementById('checkWeather').addEventListener('click', async () => {
    const city = document.getElementById('cityInput').value;
    const apiKey = '"main":{
     "temp":306.15, //current temperature
     "pressure":1013,
     "humidity":44,
     "temp_min":306.15, //min current temperature in the city
     "temp_max":306.15 //max current temperature in the city
   }
  '; // Replace with free API key
    try {
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
        const data = await res.json();
        document.getElementById('weatherOutput').innerHTML = data.main ? `<p>Temp: ${data.main.temp}°C, ${data.weather[0].description}</p>` : '<p>City not found.</p>';
    } catch { document.getElementById('weatherOutput').innerHTML = '<p>Error fetching data.</p>'; }
});
