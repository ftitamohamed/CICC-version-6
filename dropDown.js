let dropDown = document.querySelector(".dropDown");
let dropBtn = document.querySelector(".dropBtn");
console.log('this is your drop down',dropDown);
let spanList= document.querySelectorAll(".dropBtn span");
dropBtn.addEventListener("click",()=>{
    dropDown.style.display='flex';
    dropDown.classList.toggle("hide");
    dropBtn.classList.toggle('btnInv');
     spanList.forEach((span)=>{
        span.classList.toggle('spanInv');
    }); 

    console.log(spanList);
  });

window.addEventListener('resize', function() {
    // Define the laptop viewport width threshold (1024px)
    const laptopViewportWidth = 1024;

    // Get the current window width
    const windowWidth = window.innerWidth;

    // Get the element you want to add the .hide class to
   /*  const element = document.querySelector('.your-element'); */

    // Add or remove the .hide class based on the window width
    if (windowWidth > laptopViewportWidth) {
        dropDown.classList.add('hide');
    } 
});