'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const nav = document.querySelector('.nav');

const openModal = function (e) {
  //prevent the page from scolling to the top when the modal is opened
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

//smooth scrolling
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
btnScrollTo.addEventListener('click', function (e) {
  const s1coords = section1.getBoundingClientRect();
  console.log(s1coords);
  console.log(e.target.getBoundingClientRect());
  //y is from the current position to the top of the page
  console.log('curent scroll (X/Y)', window.pageXOffset, window.pageYOffset);

  console.log(
    'height/width of viewport',
    document.documentElement.clientHeight,
    document.documentElement.clientWidth
  );

  //SCROLLING
  //top is relative to the viewport
  //and not the top f the page
  //to fix it we put the number
  // window.scrollTo(
  //   s1coords.left + window.pageXOffset,
  //   s1coords.top + window.pageYOffset
  // );
  //or
  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });
  //or newest method
  section1.scrollIntoView({ behavior: 'smooth' });
});

//links of nav bar : page navigation
//using EVENT DELIGATION: we use the fact
//that events bubble up and we do that
//by putting the eventListener on a common parent
//of all the elemnt that we are interested in
//oyr example it is the container arroynd all
//these links

//rather than these code

// document.querySelectorAll('.nav__link').forEach(function(el){
//   el.addEventListener('click',function(e){
//     e.preventDefault();
//get attribute because i dont want t get the
//absolute url i want the section--1
//     const id = this.getAttribute('href');

//     document.querySelector(id).scrollIntoView({
//       behavior: 'smooth'
//     })
//   })
// })

//we use this
//event deligation need two steps
//1. we add an event listener to the common parent elemnt of the lement '
//we are interested in
//2.determine what element originated the event so we can work with that element
//where the event was actually created
document.querySelector('.nav__links').addEventListener('click', function (e) {
  //this is used to define exactly where the event happened
  // console.log(e.target);
  e.preventDefault();
  //matching strategy
  if (e.target.classList.contains('nav__link')) {
    //  get attribute because i dont want t get the
    // absolute url i want the section--1
    const id = e.target.getAttribute('href');

    document.querySelector(id).scrollIntoView({
      behavior: 'smooth',
    });
  }
});

//building a tabbed component:
//whe a tab is clicked then the content of this
//area below will change
//the operations sections
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
//use evemt delegtation because qe have 3 of ech one
tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');

  //this is called the guard clause:
  //it is an if statement which will return
  //early if some condition is matched
  //when nothing is clicked then immediatly
  //finish this function
  if (!clicked) return;

  //remove active class
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));

  //active tab
  clicked.classList.add('operations__tab--active');

  //activate  content area
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

//passing arguments to event handler:Menu fade animation (when we click on nav bar elemtn )
//mouseover bubble but mouseenter doesnot that why we dotn use it
const handlHover = function (e, opacity) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

//passing argument into handler
nav.addEventListener('mouseover', handlHover.bind(0.5));

nav.addEventListener('mouseout', handlHover.bind(1));

//sticky navigation
const initialCoords = section1.getBoundingClientRect();
//not recommended to use scroll
// window.addEventListener('scroll', function (e) {
//   console.log(window.scrollY);

//   if (this.window.scrollY > initialCoords.top) nav.classList.add('sticky');
//   else nav.classList.remove('sticky');
// });

//a better way is to use intersection observer API
//this API allows our code to observe changes to the way a certain
//target element intersects another element or the way it intersects the viewport

//this callback funtion here will get called each time
//that the observed element/target element is intersection
//the root element at the threshold that we defined
// const obsCallback = function (entries , observer) {
//   entries.forEach(entry=>{

//   })
// };
// const obsOptions = {
//root is the element that the target is intersecting
//root is the viewport because it was set to null
// root: null,
//threshold is the percentage of intersection at which the observer callback will be called
//0% means that our callabck  will triger each time the
//target element moves completely out of the viewport
//and as soon as it enteres the view
//the threshold os passed when entering and leavng the view
//[0,1,0.2]: if we specified 1 then the callback will be called when 100% of the target element is in the viewport
//   threshold: [0 ,0.2],

// };
// const observer = new IntersectionObserver(obsCallback, obsOptions);
// observer.observe(section1);

const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;
const stickyNav = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  //applied outside of the header
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

//REVEALING ELEMENTS ON SCROLL : the sections sliding in not the image
//we use the intersection observer API
const allSections = document.querySelectorAll('.section');
const revealSection = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});
allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

//lazy loading images
const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  //replace src with data-src
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

imgTargets.forEach(img => imgObserver.observe(img));

//SLIDER COMPONENT
const slider = function (){
const slides = document.querySelectorAll('.slide');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');

const dotContainer = document.querySelector('.dots');

let curSlide = 0;
const maxSlide = slides.length;

const createDots = function () {
  slides.forEach(function (_, i) {
    dotContainer.insertAdjacentHTML(
      'beforeend',
      `<button class="dots__dot" data-slide="${i}"></button>`
    );
  });
};

const activateDot = function (slide) {
  document
    .querySelectorAll('.dots__dot')
    .forEach(dot => dot.classList.remove('dots__dot--active'));

  document
    .querySelector(`.dots__dot[data-slide="${slide}"]`)
    .classList.add('dots__dot--active');
};


const goToSlide = function (slide) {
  slides.forEach(
    (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
  );
};

goToSlide(0);

//Next Slide
const nextSlide = function () {
  if (curSlide === maxSlide - 1) {
    curSlide = 0;
  } else {
    curSlide++;
  }

  goToSlide(curSlide);
  activateDot(curSlide);
};

const prevSlide = function () {
  if (curSlide === 0) {
    curSlide = maxSlide - 1;
  } else {
    curSlide--;
  }
  goToSlide(curSlide);
  activateDot(curSlide);
};

const init = function () {
  goToSlide(0);
  createDots();

  activateDot(0);
};
init();

btnRight.addEventListener('click', nextSlide);
btnLeft.addEventListener('click', prevSlide);

document.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowLeft') prevSlide();
  e.key === 'ArrowRight' && nextSlide();
});

dotContainer.addEventListener('click', function (e) {
  if (e.target.classList.contains('dots__dot')) {
    const { slide } = e.target.dataset;
    goToSlide(slide);
    activateDot(slide);
  }
});
}
slider();
//---------==================================================================
//LECTURES

//Selecting elements
//if we want to aplly  css to the whole page
//we need to select document element
console.log(document.documentElement);
console.log(document.head);
console.log(document.body);

//for others we use queryselector
document.querySelector('.header');
//select multiple elements
// const allSections = document.querySelectorAll('.section');
//print a nodelist with all the elemnts that are a section
console.log(allSections);

document.getElementById('section--1');
//all the elements with the name button
//this return an HTML collection and not a nodeList
//HTML collection is so called life collection
//and that means that if the DOM changes then this collection
//is also immediatlty updated automatically
//but this cannot happen with a nodeList
const allButtons = document.getElementsByTagName('button');
console.log(allButtons);

document.getElementsByClassName('btn');

//creating and inserting elements
//we can create HTML element using the
//adjacent  HTML function
// .insertAdjacentHtML

//creates a DOM element and then stores that element
//into the message but that element is nowhere in our DOM
//this is a DOM object that we can now use to do something on it
//but it is not yet in the DOM ITSELF
//cannnot found it  on the web page
//if we want it on the page then we need
//then we need to manually insert it into the page
//this became just like usinf the query selector
//we selected it and it became an object that can be manipulated
const message = document.createElement('div');
message.classList.add('cookie-message');
// message.textContent ='We use cookies for improved functionality and to ensure you get the best experience on our website.';
message.innerHTML =
  'We use cookies for improved functionality and to ensure you get the best \
experience on our website. <button class="btn btn--close-cookie">Got it!</button>';
//now we have our element
// we have to insert it into our dom
// we will display it in the header
// const header = document.querySelector('.header');
//prepandinf adds the element as the first child of this element
// the header in our case

// header.prepend(message);

//append will be added as the last child of this element

header.append(message);

//we notice that only the second one was desplayed
//that is because this element (message) is now
//an element living in the DOM there fr
//it cannot be at multiple places at the same time because
// a DOM eelement is unique

//prepend aand append can be used to create
//and move element

//insert multiple copies of the same elements
//we have first to copy it using the cloneNode method
//then we need to pass in true which means
//that all child elements will also be copied

// header.append(message.cloneNode(true));

//other methods :before after
// header.before(message);
// header.after(message);

//delete elements
document
  .querySelector('.btn--close-cookie')
  .addEventListener('click', function () {
    message.remove();
    //old way
    // message.parentElement.removeChild(message);
  });

//styles
//set style on an element we get the
//element.style then . the property name
//these styles are set as inline styles:styles
//set directly in the DOM
message.style.backgroundColor = '#37383d';
message.style.width = '103.5%';

//no output because this only works fo r
//inline prperties like the background color
console.log(message.style.height);
console.log(message.style.backgroundColor);
console.log(message.style.color);

//but we can still get the styles
//by using the getComputedStyle function
//these are computed styles: these are the real styles
//the same as it looks on the web page
//even if not decalred in the css
//like the height even if we didnt type it
//but the brother needs it to display it
//so know we can view it
console.log(getComputedStyle(message).height);
//increase the height
message.style.height =
  Number.parseFloat(getComputedStyle(message).height, 10) + 30 + 'px';

//css costume properties (written in the style.css)
//set property is for all width bg color...
// document.documentElement.style.setProperty('--color-primary', '#ff0000');

//attributes accessing
const logo = document.querySelector('.nav__logo');
console.log(logo.alt);
//this prints the absolute version of the url
console.log(logo.src);
//this prints the relative version of the image url (the one in the html)
console.log(logo.getAttribute('src'));
console.log(logo.className);

//we can also set these properties
logo.alt = 'beautiful minimalist logo';

//alt and src are standard for an img but
//if we create something else
//it will not automaitcally xreate a property
//on the object
//this prints undefined and that is because this is
//not a standard prperty
console.log(logo.designer);

//but to read this kind of valye from the dom we use
console.log(logo.getAttribute('designer'));
//we can also set attrinute and it will be created
logo.setAttribute('company', 'Bankist');

//for links
const link = document.querySelector('.nav__link--btn');
//absolute URL
console.log(link.href);
//url as written in html
console.log(link.getAttribute('href'));

//data attributes: attributes that start with the word data
//always stored in the dataset object
//in html we have it as - : version-number
//in js we have camel case versionNumber
console.log(logo.dataset.versionNumber);

//classes
logo.classList.add('c', 'j');
logo.classList.remove('c');
logo.classList.toggle('c');
logo.classList.contains('c');
//set class
//DONT USE thi will ovveride all the existing classes
//only allows to put one class on any element
// logo.className = 'darine'

//EVENTs :an event is a signal(something happened)
// that is generated by a DOM node
//mouse mving , mouse click , key press
//we listen to them using the addEventListener method

//mouse enter event:like the hover effect in css
//when the mouse enters the element it works
//mouseleave event:when the mouse leaves the element
//the new way is to use addEventListener
// const h1 = document.querySelector('h1');

const alertH1 = function (e) {
  // alert('you entered the h1');
  //remove event listener that makes it that we can
  //only listen the one event once
  // h1.removeEventListener('mouseenter', alertH1);
};

// h1.addEventListener('mouseenter', alertH1);
//or we can remove an event after a certain period
// setTimeout(() => h1.removeEventListener('mouseenter', alertH1), 3000);

//old way :another way to attach an EventListener to an element
// h1.onmouseenter = function (e) {
//   alert('you entered the h1');
//   console.log('mouse enter');
// };

//Evenet propagation: bubbling and capturing
//the event happens in the document root
//and from there it traverses the dom down to the target element
//and then from their it bubbles up
//bubling up: means that aslo the event had happenedin all
//of the parents of the target element
const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);
const randomColor = () =>
  `rgb (${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;
console.log(randomColor(0, 255));

//in all the 3 elements the target element is always the same
//which is the melement where the click first happened

document.querySelector('.nav__link').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  //the target is where the event originated where the event happened
  //not the event on which the handler is attached
  //current target: the element on which the event is attached
  //  console.log('you clicked the link link',e.target , e.currentTarget);
  //consoleo output : true
  //these two are always the same in any evenet handler
  //  console.log(e.currentTarget === this);

  //stopping the event propagation but not a good idea to stop it
  //  e.stopPropagation();
});

// document.querySelector('.nav__links').addEventListener('click', function(e){
//   this.style.backgroundColor = randomColor();
//   console.log('you clicked the container link',e.target, e.currentTarget);
// })

// document.querySelector('.nav').addEventListener('click', function(e){
//   this.style.backgroundColor = randomColor();
//   console.log('you clicked the nav link',e.target, e.currentTarget);
// })

//the capture phase: events are captured when
//they come down from the dcument root all the way
//to the target but our event handlers are not picking
//up these event during the capture pahase
//event listener only listen for event in the bubling phase
//but not in the capture phase
//this is the default behavior
//and the reason for that is that the capturing
//phase is irrelevant for us(not useful)
//on the other hand the bubling phase is very useful
//for something called event delegation

//BUT IF WE STILL WANT TO CATCH EVENTS DURING THE
//CAPTURING PHASE WE CAN DEFINE A THIRD PARAMETER
//IN THE addEventListener METHOD
//the capturing phase is now set to true
//now the event handler will no longer listen to bubling
//events instead to capturing events
//in practice nothing change but in the ocnsole iit will log
//the nav as the first one because first it travels down then up so capture happends
//then the bubble happen
//capturing is by default is fALSE

// document.querySelector('.nav').addEventListener('click', function(e){
//   this.style.backgroundColor = randomColor();
//   console.log('you clicked the nav link',e.target, e.currentTarget);
// },true)

//----------------------------------------===================================================================
//DOM TRAVERSING:is walking through the DOM
//which means that we can select an element based
//on another element for example
//a direct child or a direct parent Element
//or sometimes we dont know the structure of the DOM
//at runtime in all these cases we need Dom traversing
const h1 = document.querySelector('h1');
//Going downwards: child
//to do so we can use query selector because it also
//works on the element not only document

//selects all the elements with the hilight class
//that are children of the h1 element
console.log(h1.querySelectorAll('.highlight'));
//for direct children : not used anymre
console.log(h1.childNodes);
//if we want the text we can use .textCntent or .innerHTML
//.children gives us an HTML collection which is a live collection
//so it is updated
//for direct children we can also use :.children
console.log(h1.children);

//first element child only the first child "banking"
//gets now this color set to white (the first element of all the children)
// h1.firstElementChild.style.color = 'white';
// h1.lastElementChild.style.color = 'purple';

//GOING UPWARDS:parent
//for direct parents
console.log(h1.parentNode);
console.log(h1.parentElement);

//for not direct parents
//use the closest method
//important for event delegation
// h1.closest('.header').style.background = 'var(--gradient-secondary';
//closest is the opposite of querySelector
//bth receive query strings as an input but
//query selector finds children no matter how deep
//in the DOOM tree while the closest method
//finds parents no matter how far up in the
//DOM tree
// h1.closest('h1').style.background = 'var(--gradient-primary';

//GOING SIDWAYS:siblings
//we can only acces direct children:only the previous
//and the next one

//previous is null because there is nthing there
//it is the first child of the parent elemet so no siblings
console.log(h1.previousElementSibling);
//nextt is h4 elemtn which come after it
console.log(h1.nextElementSibling);

//for nodes
console.log(h1.previousSibling);
console.log(h1.nextSibling);

//for all siblings we move up to the parent
//and read them from there
// console.log(h1.parentElement.children);
// [...h1.parentElement.children].forEach(function (el) {
//   if (el !== h1) {
//     el.style.transform = 'scale(0.5)';
//   }
// });

//------------------------------------------=============================================================
//lifecycle DOM events 
//1.DOM content loaded:this event is fired by the dcument
//as ssooon as the HTML is completly parsed which means the HTML
//has been downloaded and been converted to the DOM tree
//also all scripts must be downloaded and exectued
//before the DOM content loaded event can happen
document.addEventListener('DOMContentLoaded', function(e){
console.log('DOM content loaded',e);
})
//we want all our code to be executed after the DOM is ready
//that is why in the HTML file we have the script at the end

//2.LOAD event:this event is fired by the window as sson as not only 
//the HTML is parsed but also all the images and external 
//resources like the CSS files are a;so loaded
//when the whole page is loaded is when this event gets fired 
window.addEventListener('load', function(e){
  console.log('page loaded',e);
})

//3.before unload event: this event is fired on the window
//fired befre the user is about to leave the page
//after clicking the close button in the browser tab
//used to ask user if they are 100% sure that they want to leave the page
//to make this work we nedd t call
//prevent default  
// window.addEventListener('beforeunload', function(e){
//   e.preventDefault();
//   console.log(e);
//   e.returnValue = '';
// })

//DEFER AND ASYNC 