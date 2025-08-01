const BASE_URL = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies";

const dropdowns = document.querySelectorAll(".dropdown select");
const fromCurrency = document.querySelector(".from select");
const toCurrency = document.querySelector(".to select");
const msg = document.querySelector(".msg");
const btn = document.querySelector("form button");
const amountInput = document.querySelector(".amount input");

function loadFlag(element) {
  const currency = element.value;
  const country = countryList[currency];
  const img = element.parentElement.querySelector("img");
  img.src = `https://flagsapi.com/${country}/flat/64.png`;
}

dropdowns.forEach(select => {
  for (let code in countryList) {
    let option = document.createElement("option");
    option.value = code;
    option.textContent = code;

    if (select.name === "from" && code === "USD") option.selected = true;
    if (select.name === "to" && code === "INR") option.selected = true;

    select.appendChild(option);
  }

  select.addEventListener("change", () => loadFlag(select));
});

window.addEventListener("load", () => {
  dropdowns.forEach(select => loadFlag(select));
});

btn.addEventListener("click", async e => {
  e.preventDefault();

  let amount = parseFloat(amountInput.value);
  if (isNaN(amount) || amount <= 0) {
    msg.textContent = "Please enter a valid amount.";
    return;
  }

  let from = fromCurrency.value.toLowerCase();
  let to = toCurrency.value.toLowerCase();

  msg.textContent = "Fetching exchange rate...";

  try {
    let response = await fetch(`${BASE_URL}/${from}.json`);
    let data = await response.json();

    if (!data[from] || !data[from][to]) {
      msg.textContent = "Currency not supported or data unavailable.";
      return;
    }

    let rate = data[from][to];
    let result = (rate * amount).toFixed(2);
    msg.textContent = `${amount} ${fromCurrency.value} = ${result} ${toCurrency.value}`;
  } catch {
    msg.textContent = "Something went wrong. Try again later.";
  }
});
