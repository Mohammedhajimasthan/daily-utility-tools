function calculateEMI() {
  let P = Number(document.getElementById("loan").value);
  let R = Number(document.getElementById("rate").value) / 12 / 100;
  let N = Number(document.getElementById("tenure").value) * 12;

  if (!P || !R || !N) return;

  let EMI = (P * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1);
  let total = EMI * N;
  let interest = total - P;

  document.getElementById("emiResult").innerHTML =
    `Monthly EMI: ₹${EMI.toFixed(2)}<br>
     Total Interest: ₹${interest.toFixed(2)}<br>
     Total Amount: ₹${total.toFixed(2)}`;
}

function calculateGST() {
  let amount = Number(document.getElementById("gstAmount").value);
  let rate = Number(document.getElementById("gstRate").value);

  if (!amount || !rate) return;

  let gst = (amount * rate) / 100;
  let total = amount + gst;

  document.getElementById("gstResult").innerHTML =
    `GST Amount: ₹${gst.toFixed(2)}<br>
     Final Price: ₹${total.toFixed(2)}`;
}

function calculateAge() {
  let dob = new Date(document.getElementById("dob").value);
  let today = new Date();

  if (!dob) return;

  let years = today.getFullYear() - dob.getFullYear();
  let months = today.getMonth() - dob.getMonth();
  let days = today.getDate() - dob.getDate();

  if (days < 0) {
    months--;
    days += 30;
  }
  if (months < 0) {
    years--;
    months += 12;
  }

  document.getElementById("ageResult").innerHTML =
    `Age: ${years} years, ${months} months, ${days} days`;
}
