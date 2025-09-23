//Example of DOM
/* function hello (){
    console.log("Hello world!");
    bye();
}

function bye (){
    console.log("Goodbye World.");
    init();
}

 function init(){
    console.log("Page loaded.");
 } 

//Waits for page to load before prompting init
 window.onload = hello; */
 //Parantheses () Indicates run NOW

const paragraph = document.getElementById("demo");
const button = document.getElementById("myBtn");
const resultDiv = document.getElementById("result");

 console.log("Paragraph 1", paragraph);
 console.log("button 1", button);

 
 button.addEventListener("click", function(){
    paragraph.innerText = "New Message";
    resultDiv.innerText = "Button was clicked.";
    resultDiv.style.color = "purple";
    resultDiv.style.fontWeight = "bold";
 });