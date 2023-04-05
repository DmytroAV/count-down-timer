import flatpickr from "flatpickr";
import { gsap } from "gsap";
import "flatpickr/dist/flatpickr.min.css";
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const currentDate = new Date();

    if (selectedDates[0] - currentDate > 1000) {
      refs.btnStartDateTimer.disabled = false;
    } else {
      refs.btnStartDateTimer.disabled = true;
      Notify.failure('Please choose a date in the future', {
        timeout: 1500,
        width: '400px',
      });
    }
  },

};

const refs = {
  inputDateTimer: document.querySelector('#datetime-picker'),
  btnStartDateTimer: document.querySelector('button[data-start]'),
  countdown: document.querySelector('.countdown'),
  days: document.querySelectorAll('.bloc-time.days .figure'),
  hours: document.querySelectorAll('.bloc-time.hours .figure'),
  minutes: document.querySelectorAll('.bloc-time.min .figure'),
  seconds: document.querySelectorAll('.bloc-time.sec .figure'),
};

console.log('days :>> ', refs.days);
console.log('hours :>> ', refs.hours);

const day_1 = refs.days[0];
console.log('day_1 :>> ', day_1);
const day_2 = refs.days[1];
console.log('day_2 :>> ', day_2);
const hour_1 = refs.hours[0];
console.log('hour_1 :>> ', hour_1);
const hour_2 = refs.hours[1];
console.log('hour_2 :>> ', hour_2);
const min_1 = refs.minutes[0];
const min_2 = refs.minutes[1];
const sec_1 = refs.seconds[0];
const sec_2 = refs.seconds[1];

const fp = flatpickr(refs.inputDateTimer, options);
refs.btnStartDateTimer.addEventListener('click', handleStartDateTimer);
refs.btnStartDateTimer.disabled = true;

let convertTimer = {};
let totalSeconds = 0;

function handleStartDateTimer(e) {
  const selectedDates = fp.selectedDates[0].getTime();
  const currentTime = Date.now();
  totalSeconds = selectedDates - currentTime;
  convertTimer = convertMs(totalSeconds)
  refs.btnStartDateTimer.disabled = true;
  checkDateTimer(convertTimer.days, day_1, day_2);
  checkDateTimer(convertTimer.hours, hour_1, hour_2);
  checkDateTimer(convertTimer.minutes, min_1, min_2);
  checkDateTimer(convertTimer.seconds, sec_1, sec_2);
  countTimer();
};

function countTimer() {

  const timerId = setInterval(() => {

    if (totalSeconds > 1000) {

      convertTimer.seconds -= 1;

      if (convertTimer.minutes >= 0 && convertTimer.seconds < 0) {

        convertTimer.seconds = 59;
        convertTimer.minutes -= 1;

      }

      if (convertTimer.hours >= 0 && convertTimer.minutes < 0) {

        convertTimer.minutes = 59;
        convertTimer.hours -= 1;

      }

      if (convertTimer.days >= 0 && convertTimer.hours < 0) {

        convertTimer.hours = 23;
        convertTimer.days -= 1;

      }

      // Update DOM values
      //Days
      checkDateTimer(convertTimer.days, day_1, day_2);

      // Hours
      checkDateTimer(convertTimer.hours, hour_1, hour_2);

      // Minutes
      checkDateTimer(convertTimer.minutes, min_1, min_2);

      // Seconds
      checkDateTimer(convertTimer.seconds, sec_1, sec_2);

      totalSeconds -= 1000;

    }
    else if (totalSeconds <= 1000) {

      clearInterval(timerId);

      Notify.success('The countdown timer is complete', {
        timeout: 5000,
        width: '400px',
      });
    }
  }, 1000);
};

function animateFigure(el, value) {
  const top = el.querySelector('.top');
  const bottom = el.querySelector('.bottom');
  const back_top = el.querySelector('.top-back');
  const back_bottom = el.querySelector('.bottom-back');

  // Before we begin, change the back value
  back_top.querySelector('span').innerText = value;

  // Also change the back bottom value
  back_bottom.querySelector('span').innerText = value;

  // Then animate
  gsap.to(top, {
    rotationX: '-180deg',
    transformPerspective: 300,
    duration: 1,
    ease: "strong.inOut",
    onComplete: function () {

      top.innerText = value;

      bottom.innerText = value;

      gsap.set(top, { rotationX: 0 });
    }
  });

  gsap.to(back_top, {
    rotationX: 0,
    transformPerspective: 300,
    duration: 1,
    ease: "strong.inOut",
    clearProps: 'all'
  });
}

function checkDateTimer(value, el_1, el_2) {
  console.log('value :>> ', value);
  console.log('el_1 :>> ', el_1);
  console.log('el_2 :>> ', el_2);
  const val_1 = value.toString().charAt(0);
  const val_2 = value.toString().charAt(1);
  const fig_1_value = el_1.querySelector('.top').innerText;
  const fig_2_value = el_2.querySelector('.top').innerText;

  if (value >= 10) {

    // Animate only if the figure has changed
    if (fig_1_value !== val_1) animateFigure(el_1, val_1);
    if (fig_2_value !== val_2) animateFigure(el_2, val_2);
  }
  else {

    // If we are under 10, replace first figure with 0
    if (fig_1_value !== '0') animateFigure(el_1, 0);
    if (fig_2_value !== val_1) animateFigure(el_2, val_1);
  }
};


function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
};