'use strict';

const elements = new Map();
let currentQuote = {};

/* temp */
let speech = new SpeechSynthesisUtterance();
/* temp */

document.querySelectorAll('[data-js]').forEach((v) => {
  elements.set(v.dataset.js, v);
});

async function getQuote() {
  speechSynthesis.cancel(speech);
  try {
    fetch('https://api.quotable.io/quotes/random')
      .then((res) => {
        console.log('result.ok : ' + res.ok);
        return res.json();
      })
      .then((result) => {
        currentQuote = result[0];
        elements.get('quote').innerText = currentQuote.content;
        elements.get('author').innerHTML = `&mdash; ${currentQuote.author}`;
        updateNewQuoteBtn(false);
        // console.log(currentQuote);
      })
      .catch((err) => {
        console.log('fetch error : ' + err);
      });
  } catch (err) {
    console.log('async error : ' + err);
  }
}

getQuote();

/* elements.get('new-quote').addEventListener('click', (e) => {
  getQuote();
});
 */

/* test */
window.addEventListener('click', (e) => {
  switch (e.target) {
    case elements.get('new-quote'):
      updateNewQuoteBtn(true);
      getQuote();
      break;

    case elements.get('speech'):
      console.log('speech');
      break;

    case elements.get('copy'):
      console.log('copied to clipboard : ' + currentQuote.content);
      alert('copied to clipboard : ' + currentQuote.content);
      navigator.clipboard.writeText(currentQuote.content);
      break;

    case elements.get('twitter'):
      console.log('twitting : ' + currentQuote.content);
      const tweetUrl = `https://twitter.com/intent/tweet?text=${currentQuote.content}`;
      window.open(tweetUrl, '_blank');
      break;

    default:
      console.log(e.target);
      break;
  }
});

function updateNewQuoteBtn(loading) {
  const btn = elements.get('new-quote');
  if (loading) {
    btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin-pulse"></i>`;
    btn.disabled = true;
  } else {
    btn.innerHTML = 'New Quote';
    btn.disabled = false;
  }
}

elements.get('speech').addEventListener('click', (e) => {
  speak();
  if (speechSynthesis.speaking) {
    speechSynthesis.cancel(speech);
  }
});

speech.onstart = () => {
  elements.get('speech').className = 'control speech fa-solid fa-stop';
};
speech.onend = () => {
  elements.get('speech').className = 'control speech fa-solid fa-volume-high';
};

function speak() {
  const { content, author } = currentQuote;
  speech.text = `${content} by ${author}`;
  speechSynthesis.speak(speech);
}
